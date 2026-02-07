import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userQuests } from '../db/schema';
import { ensureUserExists as ensureDbUserExists } from '../db/user-utils';
import { resolveUserId } from '../lib/user-id';

type QuestStatus = 'active' | 'completed' | 'failed';

export interface UserQuestRow {
    userId: string;
    questId: string;
    status: string;
    stage: string;
    completedObjectiveIds: unknown;
    completedAt: Date | null;
}

export interface QuestSnapshotState {
    questId: string;
    status: QuestStatus;
    stage: string;
    completedObjectiveIds: string[];
    completedAt?: number;
}

export interface UpsertUserQuestInput {
    userId: string;
    questId: string;
    status: QuestStatus;
    stage: string;
    completedObjectiveIds: string[];
    completedAt: Date | null;
}

export interface QuestRepository {
    ensureUserExists: (userId: string) => Promise<void>;
    listUserQuests: (userId: string) => Promise<UserQuestRow[]>;
    replaceUserQuests: (userId: string, entries: UpsertUserQuestInput[]) => Promise<void>;
}

const normalizeStatus = (value: string | null | undefined): QuestStatus => {
    if (value === 'completed' || value === 'failed') {
        return value;
    }
    return 'active';
};

const normalizeStage = (value: string | null | undefined): string => {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }
    return 'not_started';
};

const normalizeObjectiveIds = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    const unique = new Set<string>();
    value.forEach((entry) => {
        if (typeof entry !== 'string') {
            return;
        }
        const trimmed = entry.trim();
        if (trimmed.length === 0) {
            return;
        }
        unique.add(trimmed);
    });

    return Array.from(unique);
};

const toSnapshotState = (row: UserQuestRow): QuestSnapshotState => {
    const completedAt = row.completedAt ? row.completedAt.getTime() : undefined;
    return {
        questId: row.questId,
        status: normalizeStatus(row.status),
        stage: normalizeStage(row.stage),
        completedObjectiveIds: normalizeObjectiveIds(row.completedObjectiveIds),
        completedAt
    };
};

const sanitizeInputQuestState = (
    questId: string,
    value: Partial<QuestSnapshotState> | null | undefined
): QuestSnapshotState => {
    const normalizedQuestId = questId.trim();
    return {
        questId: normalizedQuestId,
        status: normalizeStatus(value?.status),
        stage: normalizeStage(value?.stage),
        completedObjectiveIds: normalizeObjectiveIds(value?.completedObjectiveIds),
        completedAt: typeof value?.completedAt === 'number' && Number.isFinite(value.completedAt)
            ? Math.max(0, Math.floor(value.completedAt))
            : undefined
    };
};

const toSnapshotMap = (rows: UserQuestRow[]): Record<string, QuestSnapshotState> => {
    const userQuestsMap: Record<string, QuestSnapshotState> = {};
    rows.forEach((row) => {
        const next = toSnapshotState(row);
        userQuestsMap[next.questId] = next;
    });
    return userQuestsMap;
};

export const createDrizzleQuestRepository = (): QuestRepository => ({
    ensureUserExists: async (userId) => {
        await ensureDbUserExists(userId);
    },
    listUserQuests: async (userId) =>
        await db.select().from(userQuests).where(eq(userQuests.userId, userId)),
    replaceUserQuests: async (userId, entries) => {
        await db.transaction(async (tx) => {
            await tx.delete(userQuests).where(eq(userQuests.userId, userId));
            if (entries.length === 0) {
                return;
            }

            await tx.insert(userQuests).values(entries.map((entry) => ({
                userId: entry.userId,
                questId: entry.questId,
                status: entry.status,
                stage: entry.stage,
                completedObjectiveIds: entry.completedObjectiveIds,
                completedAt: entry.completedAt,
                rewardsClaimed: entry.status === 'completed'
            })));
        });
    }
});

export const createQuestsModule = (
    repository: QuestRepository = createDrizzleQuestRepository()
) =>
    new Elysia({ prefix: '/quests' })
        .get('/snapshot', async (context) => {
            const userId = resolveUserId({
                request: context.request,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            });
            await repository.ensureUserExists(userId);
            const rows = await repository.listUserQuests(userId);
            return {
                success: true,
                userQuests: toSnapshotMap(rows)
            };
        })
        .post('/snapshot', async (context) => {
            const userId = resolveUserId({
                request: context.request,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            });
            const body = context.body as { userQuests: Record<string, Partial<QuestSnapshotState>> };

            await repository.ensureUserExists(userId);

            const sanitizedEntries = Object.entries(body.userQuests ?? {})
                .map(([questId, value]) => sanitizeInputQuestState(questId, value))
                .filter((entry) => entry.questId.length > 0);

            const upsertPayload: UpsertUserQuestInput[] = sanitizedEntries.map((entry) => ({
                userId,
                questId: entry.questId,
                status: entry.status,
                stage: entry.stage,
                completedObjectiveIds: entry.completedObjectiveIds,
                completedAt: entry.completedAt !== undefined ? new Date(entry.completedAt) : null
            }));

            await repository.replaceUserQuests(userId, upsertPayload);

            const resultMap: Record<string, QuestSnapshotState> = {};
            sanitizedEntries.forEach((entry) => {
                resultMap[entry.questId] = entry;
            });

            return {
                success: true,
                userQuests: resultMap
            };
        }, {
            body: t.Object({
                userQuests: t.Record(t.String(), t.Object({
                    questId: t.Optional(t.String()),
                    status: t.Optional(t.Union([
                        t.Literal('active'),
                        t.Literal('completed'),
                        t.Literal('failed')
                    ])),
                    stage: t.Optional(t.String()),
                    completedObjectiveIds: t.Optional(t.Array(t.String())),
                    completedAt: t.Optional(t.Number())
                }))
            }),
            response: t.Object({
                success: t.Boolean(),
                userQuests: t.Optional(t.Record(t.String(), t.Object({
                    questId: t.String(),
                    status: t.Union([t.Literal('active'), t.Literal('completed'), t.Literal('failed')]),
                    stage: t.String(),
                    completedObjectiveIds: t.Array(t.String()),
                    completedAt: t.Optional(t.Number())
                }))),
                error: t.Optional(t.String())
            })
        });

export const questsModule = createQuestsModule();
