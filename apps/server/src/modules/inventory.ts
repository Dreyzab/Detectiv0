import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userInventorySnapshots } from '../db/schema';
import { ensureUserExists as ensureDbUserExists } from '../db/user-utils';
import { resolveUserId } from '../lib/user-id';
import { ITEM_REGISTRY, STARTER_ITEM_STACKS, STARTER_MONEY, type ItemStackDefinition } from '@repo/shared';

export interface InventorySnapshotRow {
    userId: string;
    money: number;
    items: unknown;
    updatedAt: Date;
}

export interface InventorySnapshot {
    money: number;
    items: ItemStackDefinition[];
    updatedAt: string | null;
}

export interface UpsertInventorySnapshotInput {
    userId: string;
    money: number;
    items: ItemStackDefinition[];
    updatedAt: Date;
}

export interface InventoryRepository {
    ensureUserExists: (userId: string) => Promise<void>;
    getSnapshot: (userId: string) => Promise<InventorySnapshotRow | null>;
    upsertSnapshot: (input: UpsertInventorySnapshotInput) => Promise<void>;
}

const normalizeMoney = (value: unknown): number => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return STARTER_MONEY;
    }
    return Math.max(0, Math.floor(value));
};

const sanitizeItemStacks = (value: unknown): ItemStackDefinition[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    const totals = new Map<string, number>();
    value.forEach((entry) => {
        if (!entry || typeof entry !== 'object') {
            return;
        }

        const itemId = (entry as { itemId?: unknown }).itemId;
        const quantity = (entry as { quantity?: unknown }).quantity;
        if (typeof itemId !== 'string' || !ITEM_REGISTRY[itemId]) {
            return;
        }

        if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0) {
            return;
        }

        const normalizedQuantity = Math.floor(quantity);
        totals.set(itemId, (totals.get(itemId) ?? 0) + normalizedQuantity);
    });

    return Array.from(totals.entries()).map(([itemId, quantity]) => ({ itemId, quantity }));
};

const toSnapshot = (row: InventorySnapshotRow | null): InventorySnapshot => {
    if (!row) {
        return {
            money: STARTER_MONEY,
            items: STARTER_ITEM_STACKS,
            updatedAt: null
        };
    }

    return {
        money: normalizeMoney(row.money),
        items: sanitizeItemStacks(row.items),
        updatedAt: row.updatedAt.toISOString()
    };
};

export const createDrizzleInventoryRepository = (): InventoryRepository => ({
    ensureUserExists: async (userId) => {
        await ensureDbUserExists(userId);
    },

    getSnapshot: async (userId) =>
        (await db.query.userInventorySnapshots.findFirst({
            where: eq(userInventorySnapshots.userId, userId)
        })) ?? null,

    upsertSnapshot: async (input) => {
        await db.insert(userInventorySnapshots).values({
            userId: input.userId,
            money: input.money,
            items: input.items,
            updatedAt: input.updatedAt
        }).onConflictDoUpdate({
            target: [userInventorySnapshots.userId],
            set: {
                money: input.money,
                items: input.items,
                updatedAt: input.updatedAt
            }
        });
    }
});

export const createInventoryModule = (
    repository: InventoryRepository = createDrizzleInventoryRepository()
) =>
    new Elysia({ prefix: '/inventory' })
        .get('/snapshot', async (context) => {
            const userId = resolveUserId({
                request: context.request,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            });

            await repository.ensureUserExists(userId);
            const existing = await repository.getSnapshot(userId);
            if (existing) {
                return {
                    success: true,
                    snapshot: toSnapshot(existing)
                };
            }

            const createdAt = new Date();
            const fallbackSnapshot: UpsertInventorySnapshotInput = {
                userId,
                money: STARTER_MONEY,
                items: STARTER_ITEM_STACKS,
                updatedAt: createdAt
            };

            await repository.upsertSnapshot(fallbackSnapshot);

            return {
                success: true,
                snapshot: {
                    money: fallbackSnapshot.money,
                    items: fallbackSnapshot.items,
                    updatedAt: createdAt.toISOString()
                }
            };
        })
        .post('/snapshot', async (context) => {
            const userId = resolveUserId({
                request: context.request,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            });
            const body = context.body as { money: number; items: ItemStackDefinition[] };

            await repository.ensureUserExists(userId);

            const normalized = {
                money: normalizeMoney(body.money),
                items: sanitizeItemStacks(body.items)
            };
            const updatedAt = new Date();

            await repository.upsertSnapshot({
                userId,
                money: normalized.money,
                items: normalized.items,
                updatedAt
            });

            return {
                success: true,
                snapshot: {
                    ...normalized,
                    updatedAt: updatedAt.toISOString()
                }
            };
        }, {
            body: t.Object({
                money: t.Number(),
                items: t.Array(t.Object({
                    itemId: t.String(),
                    quantity: t.Number()
                }))
            }),
            response: t.Object({
                success: t.Boolean(),
                snapshot: t.Optional(t.Object({
                    money: t.Number(),
                    items: t.Array(t.Object({
                        itemId: t.String(),
                        quantity: t.Number()
                    })),
                    updatedAt: t.Union([t.String(), t.Null()])
                })),
                error: t.Optional(t.String())
            })
        });

export const inventoryModule = createInventoryModule();
