import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userDossierSnapshots } from '../db/schema';
import { ensureUserExists as ensureDbUserExists } from '../db/user-utils';
import { resolveUserId } from '../lib/user-id';
import { VOICE_ORDER, type PointStateEnum, type VoiceId } from '@repo/shared';

type DossierEntryType = 'note' | 'clue' | 'fact' | 'profile' | 'document' | 'intel';
type DossierCheckState = 'passed' | 'failed' | 'locked';

interface DossierEntrySnapshot {
    id: string;
    type: DossierEntryType;
    title: string;
    content: string;
    isLocked: boolean;
    packId: string;
    timestamp: number;
    refId?: string;
}

interface DossierEvidenceSnapshot {
    id: string;
    name: string;
    description: string;
    icon?: string;
    packId: string;
}

export interface DossierSnapshot {
    entries: DossierEntrySnapshot[];
    evidence: DossierEvidenceSnapshot[];
    unlockedDeductions: string[];
    pointStates: Record<string, PointStateEnum>;
    flags: Record<string, boolean>;
    activeCaseId: string | null;
    checkStates: Record<string, DossierCheckState>;
    xp: number;
    level: number;
    devPoints: number;
    traits: string[];
    voiceStats: Record<string, number>;
    voiceXp: Record<string, number>;
}

export interface DossierSnapshotRow {
    userId: string;
    data: unknown;
    updatedAt: Date;
}

interface UpsertDossierSnapshotInput {
    userId: string;
    snapshot: DossierSnapshot;
    updatedAt: Date;
}

export interface DossierRepository {
    ensureUserExists: (userId: string) => Promise<void>;
    getSnapshot: (userId: string) => Promise<DossierSnapshotRow | null>;
    upsertSnapshot: (input: UpsertDossierSnapshotInput) => Promise<void>;
}

const DOSSIER_ENTRY_TYPES = new Set<DossierEntryType>(['note', 'clue', 'fact', 'profile', 'document', 'intel']);
const CHECK_STATES = new Set<DossierCheckState>(['passed', 'failed', 'locked']);
const POINT_STATES = new Set<PointStateEnum>(['locked', 'discovered', 'visited', 'completed']);

const INITIAL_VOICE_STATS: Record<VoiceId, number> = VOICE_ORDER.reduce((acc, voiceId) => {
    acc[voiceId] = 1;
    return acc;
}, {} as Record<VoiceId, number>);

const INITIAL_VOICE_XP: Record<VoiceId, number> = VOICE_ORDER.reduce((acc, voiceId) => {
    acc[voiceId] = 0;
    return acc;
}, {} as Record<VoiceId, number>);

const DEFAULT_DOSSIER_SNAPSHOT: DossierSnapshot = {
    entries: [],
    evidence: [],
    unlockedDeductions: [],
    pointStates: {},
    flags: {},
    activeCaseId: null,
    checkStates: {},
    xp: 0,
    level: 1,
    devPoints: 0,
    traits: [],
    voiceStats: INITIAL_VOICE_STATS,
    voiceXp: INITIAL_VOICE_XP
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const sanitizeStringArray = (value: unknown): string[] => {
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

const sanitizeRecordBoolean = (value: unknown): Record<string, boolean> => {
    if (!isRecord(value)) {
        return {};
    }

    const result: Record<string, boolean> = {};
    Object.entries(value).forEach(([key, entry]) => {
        if (typeof entry === 'boolean') {
            result[key] = entry;
        }
    });
    return result;
};

const sanitizePointStates = (value: unknown): Record<string, PointStateEnum> => {
    if (!isRecord(value)) {
        return {};
    }

    const result: Record<string, PointStateEnum> = {};
    Object.entries(value).forEach(([pointId, pointState]) => {
        if (typeof pointState !== 'string') {
            return;
        }
        if (!POINT_STATES.has(pointState as PointStateEnum)) {
            return;
        }
        result[pointId] = pointState as PointStateEnum;
    });
    return result;
};

const sanitizeCheckStates = (value: unknown): Record<string, DossierCheckState> => {
    if (!isRecord(value)) {
        return {};
    }

    const result: Record<string, DossierCheckState> = {};
    Object.entries(value).forEach(([checkId, state]) => {
        if (typeof state !== 'string') {
            return;
        }
        if (!CHECK_STATES.has(state as DossierCheckState)) {
            return;
        }
        result[checkId] = state as DossierCheckState;
    });
    return result;
};

const sanitizeVoiceRecord = (value: unknown, fallbackValue: number): Record<string, number> => {
    const source = isRecord(value) ? value : {};
    const result: Record<string, number> = {};

    VOICE_ORDER.forEach((voiceId) => {
        const entry = source[voiceId];
        if (typeof entry === 'number' && Number.isFinite(entry)) {
            result[voiceId] = Math.max(0, Math.floor(entry));
            return;
        }
        result[voiceId] = fallbackValue;
    });

    return result;
};

const sanitizeEntries = (value: unknown): DossierEntrySnapshot[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): DossierEntrySnapshot | null => {
            if (!isRecord(entry)) {
                return null;
            }

            if (typeof entry.id !== 'string' || typeof entry.title !== 'string' || typeof entry.content !== 'string') {
                return null;
            }

            const type = typeof entry.type === 'string' && DOSSIER_ENTRY_TYPES.has(entry.type as DossierEntryType)
                ? entry.type as DossierEntryType
                : 'note';

            const refId = typeof entry.refId === 'string' && entry.refId.trim().length > 0
                ? entry.refId
                : undefined;

            const timestamp = typeof entry.timestamp === 'number' && Number.isFinite(entry.timestamp)
                ? Math.max(0, Math.floor(entry.timestamp))
                : Date.now();

            return {
                id: entry.id,
                type,
                title: entry.title,
                content: entry.content,
                isLocked: Boolean(entry.isLocked),
                packId: typeof entry.packId === 'string' ? entry.packId : '',
                timestamp,
                refId
            };
        })
        .filter((entry): entry is DossierEntrySnapshot => entry !== null);
};

const sanitizeEvidence = (value: unknown): DossierEvidenceSnapshot[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): DossierEvidenceSnapshot | null => {
            if (!isRecord(entry)) {
                return null;
            }
            if (typeof entry.id !== 'string' || typeof entry.name !== 'string' || typeof entry.description !== 'string') {
                return null;
            }

            const icon = typeof entry.icon === 'string' && entry.icon.trim().length > 0
                ? entry.icon
                : undefined;

            return {
                id: entry.id,
                name: entry.name,
                description: entry.description,
                icon,
                packId: typeof entry.packId === 'string' ? entry.packId : ''
            };
        })
        .filter((entry): entry is DossierEvidenceSnapshot => entry !== null);
};

const sanitizeSnapshot = (value: unknown): DossierSnapshot => {
    const source = isRecord(value) ? value : {};
    const activeCaseId = typeof source.activeCaseId === 'string' && source.activeCaseId.trim().length > 0
        ? source.activeCaseId
        : null;

    const level = typeof source.level === 'number' && Number.isFinite(source.level)
        ? Math.max(1, Math.floor(source.level))
        : DEFAULT_DOSSIER_SNAPSHOT.level;

    const xp = typeof source.xp === 'number' && Number.isFinite(source.xp)
        ? Math.max(0, Math.floor(source.xp))
        : DEFAULT_DOSSIER_SNAPSHOT.xp;

    const devPoints = typeof source.devPoints === 'number' && Number.isFinite(source.devPoints)
        ? Math.max(0, Math.floor(source.devPoints))
        : DEFAULT_DOSSIER_SNAPSHOT.devPoints;

    return {
        entries: sanitizeEntries(source.entries),
        evidence: sanitizeEvidence(source.evidence),
        unlockedDeductions: sanitizeStringArray(source.unlockedDeductions),
        pointStates: sanitizePointStates(source.pointStates),
        flags: sanitizeRecordBoolean(source.flags),
        activeCaseId,
        checkStates: sanitizeCheckStates(source.checkStates),
        xp,
        level,
        devPoints,
        traits: sanitizeStringArray(source.traits),
        voiceStats: sanitizeVoiceRecord(source.voiceStats, 1),
        voiceXp: sanitizeVoiceRecord(source.voiceXp, 0)
    };
};

export const createDrizzleDossierRepository = (): DossierRepository => ({
    ensureUserExists: async (userId) => {
        await ensureDbUserExists(userId);
    },
    getSnapshot: async (userId) =>
        (await db.query.userDossierSnapshots.findFirst({
            where: eq(userDossierSnapshots.userId, userId)
        })) ?? null,
    upsertSnapshot: async (input) => {
        await db.insert(userDossierSnapshots).values({
            userId: input.userId,
            data: input.snapshot,
            updatedAt: input.updatedAt
        }).onConflictDoUpdate({
            target: [userDossierSnapshots.userId],
            set: {
                data: input.snapshot,
                updatedAt: input.updatedAt
            }
        });
    }
});

export const createDossierModule = (
    repository: DossierRepository = createDrizzleDossierRepository()
) =>
    new Elysia({ prefix: '/dossier' })
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
                    snapshot: sanitizeSnapshot(existing.data)
                };
            }

            const updatedAt = new Date();
            await repository.upsertSnapshot({
                userId,
                snapshot: DEFAULT_DOSSIER_SNAPSHOT,
                updatedAt
            });

            return {
                success: true,
                snapshot: DEFAULT_DOSSIER_SNAPSHOT
            };
        })
        .post('/snapshot', async (context) => {
            const userId = resolveUserId({
                request: context.request,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            });
            const body = context.body as { snapshot: unknown };
            await repository.ensureUserExists(userId);

            const snapshot = sanitizeSnapshot(body.snapshot);
            const updatedAt = new Date();
            await repository.upsertSnapshot({
                userId,
                snapshot,
                updatedAt
            });

            return {
                success: true,
                snapshot
            };
        }, {
            body: t.Object({
                snapshot: t.Any()
            }),
            response: t.Object({
                success: t.Boolean(),
                snapshot: t.Optional(t.Any()),
                error: t.Optional(t.String())
            })
        });

export const dossierModule = createDossierModule();
