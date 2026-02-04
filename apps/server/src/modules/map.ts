
import { Elysia, t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { mapPoints, userMapPointStates } from '../db/schema';
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

    .post('/activate-qr', async ({ body, set }) => {
        const { code } = body as { code: string };
        const userId = "demo_user"; // TODO: Auth

        // 1. Find point by QR code
        const point = await db.query.mapPoints.findFirst({
            where: eq(mapPoints.qrCode, code)
        });

        if (!point) {
            set.status = 404;
            return "Invalid Core Code";
        }

        // 2. Check current state (Idempotency)
        const currentState = await db.query.userMapPointStates.findFirst({
            where: and(
                eq(userMapPointStates.userId, userId),
                eq(userMapPointStates.pointId, point.id)
            )
        });

        if (currentState && ['discovered', 'visited', 'completed'].includes(currentState.state)) {
            return {
                success: true,
                alreadyUnlocked: true,
                message: "Location already discovered",
                actions: []
            };
        }

        // 3. Resolve Bindings for 'qr_scan'
        // We parse bindings JSON
        let bindings: MapPointBinding[] = [];
        try {
            if (typeof point.bindings === 'string') {
                bindings = JSON.parse(point.bindings);
            } else {
                bindings = point.bindings as MapPointBinding[];
            }
            // Optional: validate with Zod if needed, but we trust DB for speed or warn
        } catch (e) {
            console.error("Failed to parse bindings for point", point.id);
        }

        const qrBinding = bindings.find(b => b.trigger === 'qr_scan');

        // 4. Update State (Server Authority)
        // Ensure we unlock the point at minimum
        await db.insert(userMapPointStates).values({
            userId,
            pointId: point.id,
            state: 'discovered',
            data: JSON.stringify({ unlockedAt: Date.now() })
        }).onConflictDoUpdate({
            target: [userMapPointStates.userId, userMapPointStates.pointId],
            set: { state: 'discovered' } // Upgrade to discovered if it was locked
        });

        // 5. Return Actions
        // If there are specific actions (like "Start VN"), return them.
        // If no binding explicitly for QR, we imply "unlock_point" (which we just did state-wise).
        return {
            success: true,
            actions: qrBinding ? qrBinding.actions : [{ type: 'unlock_point', pointId: point.id }],
            pointId: point.id
        };
    });
