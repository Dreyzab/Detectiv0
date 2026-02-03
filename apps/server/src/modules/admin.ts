
import { Elysia, t } from 'elysia';
import { db } from '../db';
import { mapPoints, userMapPointStates } from '../db/schema';
import { eq } from 'drizzle-orm';
// Legacy data import removed as /seed endpoint is not implemented here.
// Actually re-seeding from API is hard because seed script is a CLI script.
// Better to just allow modifying existing points and wiping progress.
// We will skip /seed endpoint for now as it duplicates CLI logic and is unsafe.

export const adminModule = new Elysia({ prefix: '/admin' })
    .get('/points', async () => {
        return await db.select().from(mapPoints).all();
    })

    .put('/point/:id', async ({ params: { id }, body, set }) => {
        const { title, description, category, image, bindings, data } = body as any;

        // Basic validation
        if (!title || !category) {
            set.status = 400;
            return "Title and Category are required";
        }

        try {
            // Validate bindings JSON if provided
            if (bindings) {
                const parsed = typeof bindings === 'string' ? JSON.parse(bindings) : bindings;
                if (!Array.isArray(parsed)) throw new Error("Bindings must be an array");
                // TODO: Deep Zod validation here if strictness is needed
            }

            // Update
            await db.update(mapPoints)
                .set({
                    title,
                    description,
                    category,
                    image,
                    bindings: typeof bindings === 'object' ? JSON.stringify(bindings) : bindings,
                    data: typeof data === 'object' ? JSON.stringify(data) : data
                })
                .where(eq(mapPoints.id, id))
                .run();

            return { success: true };
        } catch (e: any) {
            set.status = 500;
            return { success: false, error: e.message };
        }
    })

    .delete('/progress', async ({ body }) => {
        // Wipes ALL user progress. Dev tool only.
        await db.delete(userMapPointStates).run();
        return { success: true, message: "All user progress cleared" };
    });
