import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import {
    createQuestsModule,
    type QuestRepository,
    type QuestSnapshotState,
    type UpsertUserQuestInput,
    type UserQuestRow
} from '../../src/modules/quests';

const BASE_URL = 'http://localhost:3000';
const DEMO_USER_ID = 'demo_user';

interface QuestRepositoryContext {
    repo: QuestRepository;
    rows: UserQuestRow[];
    ensuredUsers: string[];
    replacements: Array<{ userId: string; entries: UpsertUserQuestInput[] }>;
}

const createMockRepository = (): QuestRepositoryContext => {
    const rows: UserQuestRow[] = [];
    const ensuredUsers: string[] = [];
    const replacements: Array<{ userId: string; entries: UpsertUserQuestInput[] }> = [];

    const repo: QuestRepository = {
        ensureUserExists: async (userId) => {
            ensuredUsers.push(userId);
        },
        listUserQuests: async (userId) => rows.filter((row) => row.userId === userId),
        replaceUserQuests: async (userId, entries) => {
            replacements.push({ userId, entries });
            for (let index = rows.length - 1; index >= 0; index -= 1) {
                if (rows[index]?.userId === userId) {
                    rows.splice(index, 1);
                }
            }

            entries.forEach((entry) => {
                rows.push({
                    userId: entry.userId,
                    questId: entry.questId,
                    status: entry.status,
                    stage: entry.stage,
                    completedObjectiveIds: entry.completedObjectiveIds,
                    completedAt: entry.completedAt
                });
            });
        }
    };

    return { repo, rows, ensuredUsers, replacements };
};

describe('Quests Module', () => {
    let context: QuestRepositoryContext;
    let app: { handle: (request: Request) => Promise<Response> };

    beforeEach(() => {
        context = createMockRepository();
        app = new Elysia().use(createQuestsModule(context.repo));
    });

    it('GET /quests/snapshot returns user quest map', async () => {
        context.rows.push({
            userId: DEMO_USER_ID,
            questId: 'case01',
            status: 'active',
            stage: 'bank_investigation',
            completedObjectiveIds: ['obj_a', 'obj_b'],
            completedAt: null
        });

        const response = await app.handle(new Request(`${BASE_URL}/quests/snapshot`));
        expect(response.status).toBe(200);

        const payload = await response.json() as {
            success: boolean;
            userQuests: Record<string, QuestSnapshotState>;
        };

        expect(payload.success).toBe(true);
        expect(payload.userQuests.case01?.stage).toBe('bank_investigation');
        expect(payload.userQuests.case01?.completedObjectiveIds).toEqual(['obj_a', 'obj_b']);
        expect(context.ensuredUsers).toEqual([DEMO_USER_ID]);
    });

    it('POST /quests/snapshot replaces quest snapshot and uses route key as quest id', async () => {
        context.rows.push({
            userId: 'alt_user',
            questId: 'legacy',
            status: 'active',
            stage: 'not_started',
            completedObjectiveIds: [],
            completedAt: null
        });

        const response = await app.handle(new Request(`${BASE_URL}/quests/snapshot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': 'alt_user'
            },
            body: JSON.stringify({
                userQuests: {
                    case01: {
                        questId: 'wrong_id',
                        status: 'completed',
                        stage: 'leads_open',
                        completedObjectiveIds: ['obj_a', 'obj_a', ' ', 'obj_b'],
                        completedAt: -50
                    }
                }
            })
        }));

        expect(response.status).toBe(200);
        const payload = await response.json() as {
            success: boolean;
            userQuests: Record<string, QuestSnapshotState>;
        };

        expect(payload.success).toBe(true);
        expect(payload.userQuests.case01?.questId).toBe('case01');
        expect(payload.userQuests.case01?.completedObjectiveIds).toEqual(['obj_a', 'obj_b']);
        expect(payload.userQuests.case01?.completedAt).toBe(0);

        expect(context.replacements.length).toBe(1);
        expect(context.replacements[0]?.userId).toBe('alt_user');
        expect(context.replacements[0]?.entries[0]?.questId).toBe('case01');
        expect(context.replacements[0]?.entries[0]?.completedAt?.getTime()).toBe(0);
        expect(context.rows.filter((row) => row.userId === 'alt_user').length).toBe(1);
        expect(context.rows.find((row) => row.userId === 'alt_user')?.questId).toBe('case01');
    });
});
