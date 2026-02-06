import { Elysia, t } from 'elysia';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { eventCodes, mapPoints, userMapPointStates } from '../db/schema';
import type { MapAction, MapPointBinding, PointStateEnum } from '@repo/shared/lib/detective_map_types';
import { MapPointBindingSchema, PointStateSchema } from '@repo/shared/lib/map-validators';

const DEMO_USER_ID = 'demo_user';

type PointScope = 'global' | 'case' | 'progression';
type PointRetentionPolicy = 'temporary' | 'persistent_on_unlock' | 'permanent';

export interface MapPointRow {
    id: string;
    packId: string;
    qrCode?: string | null;
    bindings: unknown;
    scope?: string | null;
    caseId?: string | null;
    retentionPolicy?: string | null;
    active?: boolean | null;
    [key: string]: unknown;
}

export interface UserPointStateRow {
    userId?: string;
    pointId: string;
    state: string;
    persistentUnlock?: boolean | null;
    unlockedByCaseId?: string | null;
    data?: unknown;
    meta?: unknown;
}

export interface EventCodeRow {
    code: string;
    actions: unknown;
    active?: boolean | null;
    description?: string | null;
}

export interface UpsertUserPointStateInput {
    userId: string;
    pointId: string;
    state: PointStateEnum;
    persistentUnlock: boolean;
    unlockedByCaseId: string | null;
    data: Record<string, unknown>;
    meta: Record<string, unknown>;
}

export interface MapRepository {
    getPoints: (packId?: string) => Promise<MapPointRow[]>;
    getUserStates: (userId: string) => Promise<UserPointStateRow[]>;
    findActiveEventCode: (code: string) => Promise<EventCodeRow | null>;
    findPointByQrCode: (code: string) => Promise<MapPointRow | null>;
    upsertUserPointState: (input: UpsertUserPointStateInput) => Promise<void>;
}

const normalizeScope = (scope: string | null | undefined): PointScope => {
    if (scope === 'global' || scope === 'case' || scope === 'progression') {
        return scope;
    }
    return 'case';
};

const normalizeRetentionPolicy = (policy: string | null | undefined): PointRetentionPolicy => {
    if (policy === 'temporary' || policy === 'persistent_on_unlock' || policy === 'permanent') {
        return policy;
    }
    return 'temporary';
};

const parsePointBindings = (point: MapPointRow): MapPointBinding[] => {
    try {
        const rawBindings = typeof point.bindings === 'string'
            ? JSON.parse(point.bindings)
            : point.bindings;

        if (!Array.isArray(rawBindings)) {
            return [];
        }

        return rawBindings
            .map((rawBinding, index) => {
                const parsed = MapPointBindingSchema.safeParse(rawBinding);
                if (!parsed.success) {
                    console.warn(`Invalid binding at index ${index} for point '${point.id}', skipping`);
                    return null;
                }
                return parsed.data;
            })
            .filter((binding): binding is MapPointBinding => binding !== null);
    } catch (error) {
        console.error('Binding parse error', error);
        return [];
    }
};

const toStateMap = (states: UserPointStateRow[]): Record<string, PointStateEnum> => {
    const map: Record<string, PointStateEnum> = {};
    states.forEach((stateRow) => {
        const parsed = PointStateSchema.safeParse(stateRow.state);
        if (parsed.success) {
            map[stateRow.pointId] = parsed.data;
        } else {
            console.warn(`Invalid state '${stateRow.state}' for point '${stateRow.pointId}', skipping`);
        }
    });
    return map;
};

const filterVisiblePoints = (
    points: MapPointRow[],
    states: UserPointStateRow[],
    activeCaseId?: string
): MapPointRow[] => {
    const persistentUnlockedPointIds = new Set(
        states
            .filter((state) => state.persistentUnlock)
            .map((state) => state.pointId)
    );

    return points.filter((point) => {
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
};

export const createDrizzleMapRepository = (): MapRepository => ({
    getPoints: async (packId) =>
        db.select().from(mapPoints).where(packId ? eq(mapPoints.packId, packId) : undefined),

    getUserStates: async (userId) =>
        db.select().from(userMapPointStates).where(eq(userMapPointStates.userId, userId)),

    findActiveEventCode: async (code) =>
        (await db.query.eventCodes.findFirst({
            where: and(eq(eventCodes.code, code), eq(eventCodes.active, true))
        })) ?? null,

    findPointByQrCode: async (code) =>
        (await db.query.mapPoints.findFirst({
            where: eq(mapPoints.qrCode, code)
        })) ?? null,

    upsertUserPointState: async (input) => {
        await db.insert(userMapPointStates).values({
            userId: input.userId,
            pointId: input.pointId,
            state: input.state,
            persistentUnlock: input.persistentUnlock,
            unlockedByCaseId: input.unlockedByCaseId,
            data: input.data,
            meta: input.meta
        }).onConflictDoUpdate({
            target: [userMapPointStates.userId, userMapPointStates.pointId],
            set: {
                state: input.state,
                persistentUnlock: input.persistentUnlock,
                unlockedByCaseId: input.unlockedByCaseId,
                data: input.data,
                meta: input.meta
            }
        });
    }
});

export const createMapModule = (repository: MapRepository = createDrizzleMapRepository()) =>
    new Elysia({ prefix: '/map' })
        .get('/points', async ({ query, set }) => {
            try {
                const packId = typeof query.packId === 'string' ? query.packId : undefined;
                const activeCaseId = typeof query.caseId === 'string' ? query.caseId : undefined;
                const userId = DEMO_USER_ID; // TODO: replace with auth context

                const points = await repository.getPoints(packId);
                const states = await repository.getUserStates(userId);

                const visiblePoints = filterVisiblePoints(points, states, activeCaseId);
                const stateMap = toStateMap(states);

                return { points: visiblePoints, userStates: stateMap };
            } catch (error) {
                console.error('CRITICAL: Failed to fetch map points from repository', error);
                set.status = 500;
                return {
                    error: 'Database connection failed',
                    details: (error as Error).message,
                    stack: (error as Error).stack,
                    points: [],
                    userStates: {}
                };
            }
        })
        .get('/resolve-code/:code', async ({ params, set }) => {
            const { code } = params;
            const userId = DEMO_USER_ID; // TODO: replace with auth context

            const eventCode = await repository.findActiveEventCode(code);
            if (eventCode) {
                return {
                    success: true,
                    type: 'event' as const,
                    actions: eventCode.actions as MapAction[]
                };
            }

            const point = await repository.findPointByQrCode(code);
            if (!point) {
                set.status = 404;
                return { error: 'Invalid Code', success: false };
            }

            const retentionPolicy = normalizeRetentionPolicy(point.retentionPolicy);
            const shouldPersistUnlock =
                retentionPolicy === 'persistent_on_unlock' || retentionPolicy === 'permanent';
            const unlockMeta = { unlockedAt: Date.now(), source: 'resolve_code' };

            await repository.upsertUserPointState({
                userId,
                pointId: point.id,
                state: 'discovered',
                persistentUnlock: shouldPersistUnlock,
                unlockedByCaseId: shouldPersistUnlock ? (point.caseId ?? null) : null,
                data: unlockMeta,
                meta: unlockMeta
            });

            const bindings = parsePointBindings(point);
            const qrBinding = bindings.find((binding) => binding.trigger === 'qr_scan');

            return {
                success: true,
                type: 'map_point' as const,
                pointId: point.id,
                actions: (qrBinding
                    ? qrBinding.actions
                    : [{ type: 'unlock_point', pointId: point.id }]) as MapAction[]
            };
        }, {
            response: t.Object({
                success: t.Boolean(),
                type: t.Optional(t.Union([t.Literal('event'), t.Literal('map_point')])),
                pointId: t.Optional(t.String()),
                error: t.Optional(t.String()),
                actions: t.Optional(t.Array(t.Any()))
            })
        });

export const mapModule = createMapModule();
