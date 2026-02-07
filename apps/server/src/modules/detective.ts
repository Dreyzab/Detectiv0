import { Elysia, t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { detectiveSaves } from '../db/schema';
import { resolveUserId } from '../lib/user-id';
import { ensureUserExists } from '../db/user-utils';

export const detectiveModule = new Elysia({ prefix: '/detective' })
    // List all saves for user
    .get('/saves', async (context) => {
        const userId = resolveUserId({
            request: context.request,
            auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
        });
        await ensureUserExists(userId);

        const saves = await db.select()
            .from(detectiveSaves)
            .where(eq(detectiveSaves.userId, userId));

        return {
            success: true,
            data: saves.map(s => ({
                slotId: s.slotId,
                timestamp: s.timestamp,
                data: s.data // Return raw JSON data (drizzle parses jsonb automatically)
            }))
        };
    })

    // Get specific slot
    .get('/saves/:slot', async (context) => {
        const { slot } = context.params;
        const userId = resolveUserId({
            request: context.request,
            auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
        });
        await ensureUserExists(userId);

        const slotId = parseInt(slot);
        if (isNaN(slotId)) return { error: "Invalid slot ID" };

        const save = await db.query.detectiveSaves.findFirst({
            where: and(
                eq(detectiveSaves.userId, userId),
                eq(detectiveSaves.slotId, slotId)
            )
        });

        if (!save) {
            return { success: false, error: "Empty Slot" };
        }

        return {
            success: true,
            data: save.data,
            timestamp: save.timestamp
        };
    })

    // Save to slot
    .post('/saves/:slot', async (context) => {
        const { slot } = context.params;
        const body = context.body;
        const userId = resolveUserId({
            request: context.request,
            auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
        });
        await ensureUserExists(userId);

        const slotId = parseInt(slot);
        if (isNaN(slotId)) return { error: "Invalid slot ID" };

        const content = body as { data: any };
        // const dataStr = JSON.stringify(content.data); // Not needed for jsonb
        const timestamp = new Date();

        await db.insert(detectiveSaves).values({
            id: crypto.randomUUID(),
            userId,
            slotId: slotId,
            data: content.data,
            timestamp: timestamp
        }).onConflictDoUpdate({
            target: [detectiveSaves.userId, detectiveSaves.slotId],
            set: {
                data: content.data,
                timestamp: timestamp
            }
        });

        return { success: true, slotId, timestamp };
    }, {
        body: t.Object({
            data: t.Any()
        })
    });
