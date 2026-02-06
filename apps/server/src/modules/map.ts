import { Elysia, t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { mapPoints, userMapPointStates, eventCodes } from '../db/schema';
import type { MapPointBinding, MapAction, PointStateEnum } from '@repo/shared/lib/detective_map_types';
import { MapPointBindingSchema, PointStateSchema } from '@repo/shared/lib/map-validators';

// Helper to resolve actions (server-side version of resolver)
// In a real app, successful QR scan usually treats "conditions" as met or ignores them (forcing unlock),
// or we check conditions. For now, we assume QR scan triggers the binding if conditions are met.
// But we don't have user flags here yet (unless we fetch them). 
// For this endpoints, we'll return the binding ACTIONS if the QR matches.
// The client or a "GameService" plays them.
// But the plan says "Server validates... Client CANNOT arbitrarily set state".
// So the server must execute STATE changes (unlock point) here.

type PointScope = 'global' | 'case' | 'progression';
type PointRetentionPolicy = 'temporary' | 'persistent_on_unlock' | 'permanent';

const normalizeScope = (scope: string | null): PointScope => {
    if (scope === 'global' || scope === 'case' || scope === 'progression') {
        return scope;
    }
    return 'case';
};

const normalizeRetentionPolicy = (policy: string | null): PointRetentionPolicy => {
    if (policy === 'temporary' || policy === 'persistent_on_unlock' || policy === 'permanent') {
        return policy;
    }
    return 'temporary';
};

export const mapModule = new Elysia({ prefix: '/map' })
    .get('/points', async ({ query, set }) => {
        try {
            const packId = typeof query.packId === 'string' ? query.packId : undefined;
            const activeCaseId = typeof query.caseId === 'string' ? query.caseId : undefined;

            // Fetch points
            const points = await db.select().from(mapPoints)
                .where(packId ? eq(mapPoints.packId, packId) : undefined);

            // Fetch user state (mocking userId for now, or use auth)
            // TODO: Get real userId from context
            const userId = "demo_user";
            const states = await db.select().from(userMapPointStates)
                .where(eq(userMapPointStates.userId, userId));

            // Transform user states to Record
            const stateMap: Record<string, PointStateEnum> = {};
            states.forEach(s => {
                const parsedState = PointStateSchema.safeParse(s.state);
                if (parsedState.success) {
                    stateMap[s.pointId] = parsedState.data;
                } else {
                    console.warn(`Invalid state '${s.state}' for point '${s.pointId}', skipping`);
                }
            });

            const persistentUnlockedPointIds = new Set(
                states
                    .filter((state) => state.persistentUnlock)
                    .map((state) => state.pointId)
            );

            const visiblePoints = points.filter((point) => {
                if (point.active === false) {
                    return false;
                }

                const scope = normalizeScope(point.scope);
                const retentionPolicy = normalizeRetentionPolicy(point.retentionPolicy);

                if (scope === 'global') {
                    return true;
                }

                if (scope === 'case') {
                    // Preserve legacy behavior: if case is not specified, include case points.
                    return !activeCaseId || point.caseId === activeCaseId;
                }

                // scope === 'progression'
                if (retentionPolicy === 'permanent') {
                    return true;
                }

                if (persistentUnlockedPointIds.has(point.id)) {
                    return true;
                }

                // If not yet unlocked permanently, point can still appear in active case context.
                return Boolean(activeCaseId && point.caseId === activeCaseId);
            });

            return { points: visiblePoints, userStates: stateMap };
        } catch (error) {
            console.error("CRITICAL: Failed to fetch map points from DB", error);
            set.status = 500;
            return {
                error: "Database connection failed",
                details: (error as Error).message,
                stack: (error as Error).stack,
                points: [],
                userStates: {}
            };
        }
    })

    // .post('/activate-qr', async ({ body, set }) => { ... }) // Legacy endpoint REMOVED
    .get('/resolve-code/:code', async ({ params, set }) => {
        const { code } = params;
        const userId = "demo_user"; // TODO: Auth

        // 1. Check Event Codes
        const eventCode = await db.query.eventCodes.findFirst({
            where: and(eq(eventCodes.code, code), eq(eventCodes.active, true))
        });

        if (eventCode) {
            return {
                success: true,
                type: 'event' as const,
                actions: eventCode.actions as MapAction[] // Cast JSONB to typed Action array
            };
        }

        // 2. Check Map Points
        const point = await db.query.mapPoints.findFirst({
            where: eq(mapPoints.qrCode, code)
        });

        if (!point) {
            set.status = 404;
            return { error: "Invalid Code", success: false };
        }

        const retentionPolicy = normalizeRetentionPolicy(point.retentionPolicy);
        const shouldPersistUnlock = retentionPolicy === 'persistent_on_unlock' || retentionPolicy === 'permanent';
        const unlockMeta = { unlockedAt: Date.now(), source: 'resolve_code' };

        const onConflictSet: {
            state: PointStateEnum;
            data: Record<string, unknown>;
            meta: Record<string, unknown>;
            persistentUnlock?: boolean;
            unlockedByCaseId?: string | null;
        } = {
            state: 'discovered',
            data: unlockMeta,
            meta: unlockMeta
        };

        if (shouldPersistUnlock) {
            onConflictSet.persistentUnlock = true;
            onConflictSet.unlockedByCaseId = point.caseId ?? null;
        }

        // 3. Resolve Map Point Binding
        await db.insert(userMapPointStates).values({
            userId,
            pointId: point.id,
            state: 'discovered',
            persistentUnlock: shouldPersistUnlock,
            unlockedByCaseId: shouldPersistUnlock ? (point.caseId ?? null) : null,
            data: unlockMeta,
            meta: unlockMeta
        }).onConflictDoUpdate({
            target: [userMapPointStates.userId, userMapPointStates.pointId],
            set: onConflictSet
        });

        // Parse bindings
        let bindings: MapPointBinding[] = [];
        try {
            const rawBindings = typeof point.bindings === 'string'
                ? JSON.parse(point.bindings)
                : point.bindings;

            if (Array.isArray(rawBindings)) {
                bindings = rawBindings
                    .map((rawBinding, index) => {
                        const parsed = MapPointBindingSchema.safeParse(rawBinding);
                        if (!parsed.success) {
                            console.warn(`Invalid binding at index ${index} for point '${point.id}', skipping`);
                            return null;
                        }
                        return parsed.data;
                    })
                    .filter((binding): binding is MapPointBinding => binding !== null);
            }
        } catch (error) {
            console.error("Binding parse error", error);
        }

        const qrBinding = bindings.find(b => b.trigger === 'qr_scan');

        return {
            success: true,
            type: 'map_point' as const,
            pointId: point.id,
            actions: (qrBinding ? qrBinding.actions : [{ type: 'unlock_point', pointId: point.id }]) as MapAction[]
        };
    }, {
        response: t.Object({
            success: t.Boolean(),
            type: t.Optional(t.Union([t.Literal('event'), t.Literal('map_point')])),
            pointId: t.Optional(t.String()),
            error: t.Optional(t.String()),
            actions: t.Optional(t.Array(t.Object({ type: t.String() })))
        })
    });
