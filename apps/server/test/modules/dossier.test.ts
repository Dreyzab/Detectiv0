import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import {
    createDossierModule,
    type DossierRepository,
    type DossierSnapshot,
    type DossierSnapshotRow
} from '../../src/modules/dossier';

const BASE_URL = 'http://localhost:3000';
const DEMO_USER_ID = 'demo_user';

interface DossierRepositoryContext {
    repo: DossierRepository;
    rows: DossierSnapshotRow[];
    ensuredUsers: string[];
    upserts: Array<{ userId: string; snapshot: DossierSnapshot }>;
}

const createMockRepository = (): DossierRepositoryContext => {
    const rows: DossierSnapshotRow[] = [];
    const ensuredUsers: string[] = [];
    const upserts: Array<{ userId: string; snapshot: DossierSnapshot }> = [];

    const repo: DossierRepository = {
        ensureUserExists: async (userId) => {
            ensuredUsers.push(userId);
        },
        getSnapshot: async (userId) => rows.find((row) => row.userId === userId) ?? null,
        upsertSnapshot: async (input) => {
            upserts.push({ userId: input.userId, snapshot: input.snapshot });
            const index = rows.findIndex((row) => row.userId === input.userId);
            const next: DossierSnapshotRow = {
                userId: input.userId,
                data: input.snapshot,
                updatedAt: input.updatedAt
            };
            if (index >= 0) {
                rows[index] = next;
            } else {
                rows.push(next);
            }
        }
    };

    return { repo, rows, ensuredUsers, upserts };
};

describe('Dossier Module', () => {
    let context: DossierRepositoryContext;
    let app: { handle: (request: Request) => Promise<Response> };

    beforeEach(() => {
        context = createMockRepository();
        app = new Elysia().use(createDossierModule(context.repo));
    });

    it('GET /dossier/snapshot creates default snapshot when missing', async () => {
        const response = await app.handle(new Request(`${BASE_URL}/dossier/snapshot`));
        expect(response.status).toBe(200);

        const payload = await response.json() as {
            success: boolean;
            snapshot: DossierSnapshot;
        };

        expect(payload.success).toBe(true);
        expect(payload.snapshot.level).toBe(1);
        expect(payload.snapshot.entries).toEqual([]);
        expect(payload.snapshot.flags).toEqual({});
        expect(context.upserts.length).toBe(1);
        expect(context.ensuredUsers).toEqual([DEMO_USER_ID]);
    });

    it('POST /dossier/snapshot sanitizes malformed payload', async () => {
        const response = await app.handle(new Request(`${BASE_URL}/dossier/snapshot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': 'alt_user'
            },
            body: JSON.stringify({
                snapshot: {
                    entries: [
                        { id: 'entry_ok', type: 'clue', title: 't', content: 'c', isLocked: false, packId: 'fbg1905', timestamp: 10 },
                        { id: 5, type: 'broken' }
                    ],
                    evidence: [
                        { id: 'ev_1', name: 'Coin', description: 'found', packId: 'fbg1905' },
                        { id: 'ev_bad', name: 7, description: true }
                    ],
                    unlockedDeductions: ['ded_1', '', 'ded_1'],
                    pointStates: { loc_a: 'visited', loc_b: 'xxx' },
                    flags: { a: true, b: 'nope' },
                    activeCaseId: '',
                    checkStates: { chk1: 'passed', chk2: 'unknown' },
                    xp: -50,
                    level: 0,
                    devPoints: 3.7,
                    traits: ['trait_a', '', 'trait_a'],
                    voiceStats: { logic: 7, fake: 99 },
                    voiceXp: { logic: 20, fake: 100 }
                }
            })
        }));

        expect(response.status).toBe(200);
        const payload = await response.json() as {
            success: boolean;
            snapshot: DossierSnapshot;
        };

        expect(payload.success).toBe(true);
        expect(payload.snapshot.entries.length).toBe(1);
        expect(payload.snapshot.evidence.length).toBe(1);
        expect(payload.snapshot.unlockedDeductions).toEqual(['ded_1']);
        expect(payload.snapshot.pointStates).toEqual({ loc_a: 'visited' });
        expect(payload.snapshot.flags).toEqual({ a: true });
        expect(payload.snapshot.activeCaseId).toBeNull();
        expect(payload.snapshot.checkStates).toEqual({ chk1: 'passed' });
        expect(payload.snapshot.xp).toBe(0);
        expect(payload.snapshot.level).toBe(1);
        expect(payload.snapshot.devPoints).toBe(3);
        expect(payload.snapshot.voiceStats.logic).toBe(7);
        expect(payload.snapshot.voiceStats.perception).toBe(1);
        expect(payload.snapshot.voiceXp.logic).toBe(20);
        expect(payload.snapshot.voiceXp.perception).toBe(0);
        expect(context.rows.find((row) => row.userId === 'alt_user')).toBeTruthy();
    });
});
