import { Elysia } from 'elysia';
import { db } from '../db';
import { mapPoints, userMapPointStates } from '../db/schema';
import { eq } from 'drizzle-orm';
// Legacy data import removed as /seed endpoint is not implemented here.
// Actually re-seeding from API is hard because seed script is a CLI script.
// Better to just allow modifying existing points and wiping progress.
// We will skip /seed endpoint for now as it duplicates CLI logic and is unsafe.

interface UpdatePointBody {
    title?: string;
    description?: string | null;
    category?: string;
    image?: string | null;
    bindings?: unknown;
    data?: unknown;
}

const parseJsonLike = (value: unknown): unknown => {
    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

export const adminModule = new Elysia({ prefix: '/admin' })
    .get('/points', async () => {
        return await db.select().from(mapPoints);
    })

    .put('/point/:id', async ({ params: { id }, body, set }) => {
        const { title, description, category, image, bindings, data } = body as UpdatePointBody;

        // Basic validation
        if (typeof title !== 'string' || typeof category !== 'string') {
            set.status = 400;
            return "Title and Category are required";
        }

        try {
            const parsedBindings = bindings === undefined ? undefined : parseJsonLike(bindings);
            const parsedData = data === undefined ? undefined : parseJsonLike(data);

            // Validate bindings JSON if provided
            if (parsedBindings !== undefined && !Array.isArray(parsedBindings)) {
                throw new Error("Bindings must be an array");
            }

            const updatePayload: {
                title: string;
                category: string;
                description?: string | null;
                image?: string | null;
                bindings?: unknown;
                data?: unknown;
            } = {
                title,
                category,
            };

            if (description !== undefined) {
                updatePayload.description = description;
            }
            if (image !== undefined) {
                updatePayload.image = image;
            }
            if (parsedBindings !== undefined) {
                updatePayload.bindings = parsedBindings;
            }
            if (parsedData !== undefined) {
                updatePayload.data = parsedData;
            }

            if (parsedBindings !== undefined) {
                // TODO: Deep Zod validation here if strictness is needed
            }

            // Update
            await db.update(mapPoints)
                .set(updatePayload)
                .where(eq(mapPoints.id, id));

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            set.status = 500;
            return { success: false, error: message };
        }
    })

    .delete('/progress', async () => {
        // Wipes ALL user progress. Dev tool only.
        await db.delete(userMapPointStates);
        return { success: true, message: "All user progress cleared" };
    });
