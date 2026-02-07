import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { STARTER_ITEM_STACKS, STARTER_MONEY, type ItemStackDefinition } from '@repo/shared';
import {
    createInventoryModule,
    type InventoryRepository,
    type InventorySnapshotRow,
    type UpsertInventorySnapshotInput
} from '../../src/modules/inventory';

const BASE_URL = 'http://localhost:3000';
const DEMO_USER_ID = 'demo_user';

interface InventoryRepositoryContext {
    repo: InventoryRepository;
    rows: InventorySnapshotRow[];
    upserts: UpsertInventorySnapshotInput[];
    ensuredUsers: string[];
}

const createMockRepository = (): InventoryRepositoryContext => {
    const rows: InventorySnapshotRow[] = [];
    const upserts: UpsertInventorySnapshotInput[] = [];
    const ensuredUsers: string[] = [];

    const repo: InventoryRepository = {
        ensureUserExists: async (userId) => {
            ensuredUsers.push(userId);
        },
        getSnapshot: async (userId) => rows.find((row) => row.userId === userId) ?? null,
        upsertSnapshot: async (input) => {
            upserts.push(input);
            const index = rows.findIndex((row) => row.userId === input.userId);
            const next: InventorySnapshotRow = {
                userId: input.userId,
                money: input.money,
                items: input.items,
                updatedAt: input.updatedAt
            };
            if (index >= 0) {
                rows[index] = next;
            } else {
                rows.push(next);
            }
        }
    };

    return { repo, rows, upserts, ensuredUsers };
};

describe('Inventory Module', () => {
    let context: InventoryRepositoryContext;
    let app: { handle: (request: Request) => Promise<Response> };

    beforeEach(() => {
        context = createMockRepository();
        app = new Elysia().use(createInventoryModule(context.repo));
    });

    it('GET /inventory/snapshot creates starter snapshot when user has no row', async () => {
        const response = await app.handle(new Request(`${BASE_URL}/inventory/snapshot`));
        expect(response.status).toBe(200);

        const payload = await response.json() as {
            success: boolean;
            snapshot: { money: number; items: ItemStackDefinition[]; updatedAt: string | null };
        };

        expect(payload.success).toBe(true);
        expect(payload.snapshot.money).toBe(STARTER_MONEY);
        expect(payload.snapshot.items).toEqual(STARTER_ITEM_STACKS);
        expect(payload.snapshot.updatedAt).not.toBeNull();
        expect(context.upserts.length).toBe(1);
        expect(context.ensuredUsers).toEqual([DEMO_USER_ID]);
    });

    it('GET /inventory/snapshot returns existing snapshot for requested user', async () => {
        context.rows.push({
            userId: 'user_alt',
            money: 77,
            items: [{ itemId: 'bread', quantity: 2 }],
            updatedAt: new Date('2026-02-07T00:00:00.000Z')
        });

        const response = await app.handle(new Request(`${BASE_URL}/inventory/snapshot`, {
            headers: {
                'x-user-id': 'user_alt'
            }
        }));
        expect(response.status).toBe(200);

        const payload = await response.json() as {
            success: boolean;
            snapshot: { money: number; items: ItemStackDefinition[] };
        };
        expect(payload.success).toBe(true);
        expect(payload.snapshot.money).toBe(77);
        expect(payload.snapshot.items).toEqual([{ itemId: 'bread', quantity: 2 }]);
        expect(context.upserts.length).toBe(0);
        expect(context.ensuredUsers).toEqual(['user_alt']);
    });

    it('POST /inventory/snapshot sanitizes invalid item entries before persistence', async () => {
        const response = await app.handle(new Request(`${BASE_URL}/inventory/snapshot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                money: -15.8,
                items: [
                    { itemId: 'bread', quantity: 1.9 },
                    { itemId: 'bread', quantity: 2 },
                    { itemId: 'unknown', quantity: 999 },
                    { itemId: 'coin', quantity: 0 }
                ]
            })
        }));

        expect(response.status).toBe(200);
        const payload = await response.json() as {
            success: boolean;
            snapshot: { money: number; items: ItemStackDefinition[] };
        };

        expect(payload.success).toBe(true);
        expect(payload.snapshot.money).toBe(0);
        expect(payload.snapshot.items).toEqual([
            { itemId: 'bread', quantity: 3 }
        ]);
        expect(context.upserts[0]?.money).toBe(0);
        expect(context.upserts[0]?.items).toEqual([{ itemId: 'bread', quantity: 3 }]);
    });
});
