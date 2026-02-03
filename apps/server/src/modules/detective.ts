import { Elysia, t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { detectiveSaves } from '../db/schema';

// Mock User ID until auth is fully integrated
const DEMO_USER_ID = "demo_user";

export const detectiveModule = new Elysia({ prefix: '/detective' })
    // List all saves for user
    .get('/saves', async () => {
        const saves = await db.select()
            .from(detectiveSaves)
            .where(eq(detectiveSaves.userId, DEMO_USER_ID));

        return {
            success: true,
            data: saves.map(s => ({
                slotId: s.slotId,
                timestamp: s.timestamp,
                data: JSON.parse(s.data) // Return parsed JSON for client convenience
            }))
        };
    })

    // Get specific slot
    .get('/saves/:slot', async ({ params: { slot } }) => {
        const slotId = parseInt(slot);
        if (isNaN(slotId)) return { error: "Invalid slot ID" };

        const save = await db.query.detectiveSaves.findFirst({
            where: and(
                eq(detectiveSaves.userId, DEMO_USER_ID),
                eq(detectiveSaves.slotId, slotId)
            )
        });

        if (!save) {
            return { success: false, error: "Empty Slot" };
        }

        return {
            success: true,
            data: JSON.parse(save.data),
            timestamp: save.timestamp
        };
    })

    // Save to slot
    .post('/saves/:slot', async ({ params: { slot }, body }) => {
        const slotId = parseInt(slot);
        if (isNaN(slotId)) return { error: "Invalid slot ID" };

        const content = body as { data: any };
        const dataStr = JSON.stringify(content.data);
        const timestamp = Date.now();

        await db.insert(detectiveSaves).values({
            id: crypto.randomUUID(),
            userId: DEMO_USER_ID,
            slotId: slotId,
            data: dataStr,
            timestamp: timestamp
        }).onConflictDoUpdate({
            target: [detectiveSaves.userId, detectiveSaves.slotId],
            set: {
                data: dataStr,
                timestamp: timestamp
            }
        });

        return { success: true, slotId, timestamp };
    }, {
        body: t.Object({
            data: t.Any()
        })
    });
