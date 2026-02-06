
import { Elysia, t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { mapPoints, userMapPointStates, eventCodes } from '../db/schema';
import { MapPointBinding, MapAction, PointStateEnum } from '@repo/shared/lib/detective_map_types';
import { MapPointBindingSchema } from '@repo/shared/lib/map-validators';

// Helper to resolve actions (server-side version of resolver)
// In a real app, successful QR scan usually treats "conditions" as met or ignores them (forcing unlock),
// or we check conditions. For now, we assume QR scan triggers the binding if conditions are met.
// But we don't have user flags here yet (unless we fetch them). 
// For this endpoints, we'll return the binding ACTIONS if the QR matches.
// The client or a "GameService" plays them.
// But the plan says "Server validates... Client CANNOT arbitrarily set state".
// So the server must execute STATE changes (unlock point) here.

export const mapModule = new Elysia({ prefix: '/map' })
    .get('/points', async ({ query, set }) => {
        try {
            const packId = query.packId as string | undefined;
            // Fetch points
            const points = await db.select().from(mapPoints)
                .where(packId ? eq(mapPoints.packId, packId) : undefined);

            // Fetch user state (mocking userId for now, or use auth)
            // TODO: Get real userId from context
            const userId = "demo_user";
            const states = await db.select().from(userMapPointStates)
                .where(eq(userMapPointStates.userId, userId));

            // Transform user states to Record
            const stateMap: Record<string, string> = {};
            states.forEach(s => {
                stateMap[s.pointId] = s.state;
            });

            return { points, userStates: stateMap };
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

        // 3. Resolve Map Point Binding
        await db.insert(userMapPointStates).values({
            userId,
            pointId: point.id,
            state: 'discovered',
            data: JSON.stringify({ unlockedAt: Date.now() })
        }).onConflictDoUpdate({
            target: [userMapPointStates.userId, userMapPointStates.pointId],
            set: { state: 'discovered' }
        });

        // Parse bindings
        let bindings: MapPointBinding[] = [];
        try {
            if (typeof point.bindings === 'string') {
                bindings = JSON.parse(point.bindings);
            } else {
                bindings = point.bindings as MapPointBinding[];
            }
        } catch (e) { console.error("Binding parse error", e); }

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
