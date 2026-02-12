import { Elysia, t } from 'elysia';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import {
    caseObjectives,
    cityRoutes,
    domainEventLog,
    evidenceCatalog,
    playerProgression,
    travelSessions,
    userCaseProgress,
    userCharacterRelations,
    userEvidence,
    userFactionReputation,
    voiceProgression,
    worldClocks
} from '../db/schema';
import {
    TIME_PHASES,
    type ApplyProgressionRequest,
    type ApplyProgressionResponse,
    type CaseAdvanceRequest,
    type CaseAdvanceResponse,
    type CaseObjectiveState,
    type CaseProgressState,
    type CharacterRelationState,
    type DiscoverEvidenceRequest,
    type DiscoverEvidenceResponse,
    type DomainEventType,
    type EvidenceConflict,
    type FactionReputationState,
    type LocationAvailability,
    type PlayerProgressionState,
    type TimePhase,
    type TimeTickRequest,
    type TimeTickResponse,
    type TravelBeat,
    type TravelCompleteResponse,
    type TravelMode,
    type TravelSessionState,
    type TravelStartRequest,
    type TravelStartResponse,
    type VoiceProgressionState,
    type WorldClockState,
    type WorldSnapshotResponse
} from '@repo/shared';
import { resolveUserId } from '../lib/user-id';
import { ensureUserExists as ensureDbUserExists } from '../db/user-utils';
const TICKS_PER_PHASE = 3;
const DEFAULT_LOCATION_ID = 'loc_hbf';
const DEFAULT_LOCATION_BY_CASE: Record<string, string> = {
    case_01_bank: 'loc_hbf',
    sandbox_karlsruhe: 'loc_ka_agency'
};
const NIGHT_ACCESS_APPROACHES = new Set(['lockpick', 'bribe', 'warrant']);
const BANK_LOCATION_IDS = new Set(['loc_freiburg_bank']);
type DistrictId = 'rail_hub' | 'altstadt' | 'schneckenvorstadt' | 'wiehre' | 'stuhlinger';

interface DistrictAccessRule {
    blockedPhases: TimePhase[];
    reason: string;
    alternatives: string[];
}

const LOCATION_DISTRICTS: Record<string, DistrictId> = {
    loc_hbf: 'rail_hub',
    loc_freiburg_bank: 'altstadt',
    loc_freiburg_archive: 'altstadt',
    loc_munster: 'altstadt',
    loc_tailor: 'altstadt',
    loc_apothecary: 'altstadt',
    loc_pub: 'schneckenvorstadt',
    loc_pub_deutsche: 'schneckenvorstadt',
    loc_red_light: 'schneckenvorstadt',
    loc_martinstor: 'schneckenvorstadt',
    loc_schwabentor: 'wiehre',
    loc_uni_chem: 'wiehre',
    loc_uni_med: 'wiehre',
    loc_student_house: 'wiehre',
    loc_freiburg_warehouse: 'stuhlinger',
    loc_workers_pub: 'stuhlinger',
    loc_street_event: 'altstadt',
    loc_telephone: 'altstadt'
};

const DISTRICT_ACCESS_RULES: Partial<Record<DistrictId, DistrictAccessRule>> = {
    stuhlinger: {
        blockedPhases: ['night'],
        reason: 'Stuhlinger industrial district is restricted at night without district pass',
        alternatives: ['district_pass', 'wait_until_day']
    }
};

type TravelSessionStatus = 'in_progress' | 'completed' | 'cancelled';

export interface WorldClockRow {
    userId: string;
    tick: number;
    phase: string;
}

export interface CityRouteRow {
    id: string;
    fromLocationId: string;
    toLocationId: string;
    mode: string;
    etaTicks: number;
    riskLevel: number;
    active: boolean;
}

export interface TravelSessionRow {
    id: string;
    userId: string;
    fromLocationId: string;
    toLocationId: string;
    routeId: string | null;
    mode: string;
    status: string;
    startedTick: number;
    etaTicks: number;
    arrivalTick: number | null;
    beatType: string | null;
    beatPayload: unknown;
}

export interface CaseProgressRow {
    userId: string;
    caseId: string;
    currentObjectiveId: string;
    status: string;
    updatedAt: Date;
    lastAdvancedTick: number;
}

export interface CaseObjectiveRow {
    id: string;
    caseId: string;
    title: string;
    description: string | null;
    sortOrder: number;
    locationId: string | null;
    data: unknown;
}

export interface FactionReputationRow {
    userId: string;
    factionId: string;
    reputation: number;
    updatedAt: Date;
}

export interface CharacterRelationRow {
    userId: string;
    characterId: string;
    trust: number;
    lastInteractionTick: number | null;
    updatedAt: Date;
}

export interface PlayerProgressionRow {
    userId: string;
    xp: number;
    level: number;
    traitPoints: number;
    updatedAt: Date;
}

export interface VoiceProgressionRow {
    userId: string;
    voiceId: string;
    xp: number;
    level: number;
    updatedAt: Date;
}

export interface EvidenceCatalogRow {
    id: string;
    title: string;
    description: string | null;
    contradictsId: string | null;
}

export interface UserEvidenceRow {
    userId: string;
    evidenceId: string;
    sourceSceneId: string | null;
    sourceEventId: string | null;
    discoveredTick: number;
}

export interface UpsertWorldClockInput {
    userId: string;
    tick: number;
    phase: TimePhase;
}

export interface CreateTravelSessionInput {
    id: string;
    userId: string;
    fromLocationId: string;
    toLocationId: string;
    routeId: string | null;
    mode: TravelMode;
    status: TravelSessionStatus;
    startedTick: number;
    etaTicks: number;
    arrivalTick: number | null;
    beat: TravelBeat;
}

export interface CompleteTravelSessionInput {
    sessionId: string;
    userId: string;
    arrivalTick: number;
    status: TravelSessionStatus;
}

export interface UpsertCaseProgressInput {
    userId: string;
    caseId: string;
    currentObjectiveId: string;
    status: 'active' | 'completed' | 'failed';
    lastAdvancedTick: number;
}

export interface UpsertFactionReputationInput {
    userId: string;
    factionId: string;
    reputation: number;
}

export interface UpsertCharacterRelationInput {
    userId: string;
    characterId: string;
    trust: number;
    lastInteractionTick: number | null;
}

export interface UpsertPlayerProgressInput {
    userId: string;
    xp: number;
    level: number;
    traitPoints: number;
}

export interface UpsertVoiceProgressInput {
    userId: string;
    voiceId: string;
    xp: number;
    level: number;
}

export interface AppendDomainEventInput {
    id: string;
    userId: string;
    tick: number;
    type: DomainEventType;
    payload: Record<string, unknown>;
}

export interface UpsertUserEvidenceInput {
    userId: string;
    evidenceId: string;
    sourceSceneId: string | null;
    sourceEventId: string | null;
    discoveredTick: number;
}

export interface EngineRepository {
    ensureUserExists: (userId: string) => Promise<void>;
    getWorldClock: (userId: string) => Promise<WorldClockRow | null>;
    upsertWorldClock: (input: UpsertWorldClockInput) => Promise<void>;
    findRoute: (fromLocationId: string, toLocationId: string, mode: TravelMode) => Promise<CityRouteRow | null>;
    createTravelSession: (input: CreateTravelSessionInput) => Promise<void>;
    getTravelSession: (sessionId: string, userId: string) => Promise<TravelSessionRow | null>;
    getLatestCompletedTravelSession: (userId: string) => Promise<TravelSessionRow | null>;
    completeTravelSession: (input: CompleteTravelSessionInput) => Promise<void>;
    getCaseProgress: (userId: string, caseId: string) => Promise<CaseProgressRow | null>;
    listCaseObjectives: (caseId: string) => Promise<CaseObjectiveRow[]>;
    upsertCaseProgress: (input: UpsertCaseProgressInput) => Promise<void>;
    listFactionReputation: (userId: string) => Promise<FactionReputationRow[]>;
    upsertFactionReputation: (input: UpsertFactionReputationInput) => Promise<void>;
    listCharacterRelations: (userId: string) => Promise<CharacterRelationRow[]>;
    upsertCharacterRelation: (input: UpsertCharacterRelationInput) => Promise<void>;
    getPlayerProgress: (userId: string) => Promise<PlayerProgressionRow | null>;
    upsertPlayerProgress: (input: UpsertPlayerProgressInput) => Promise<void>;
    getVoiceProgress: (userId: string, voiceId: string) => Promise<VoiceProgressionRow | null>;
    upsertVoiceProgress: (input: UpsertVoiceProgressInput) => Promise<void>;
    listVoiceProgress: (userId: string) => Promise<VoiceProgressionRow[]>;
    appendDomainEvent: (input: AppendDomainEventInput) => Promise<void>;
    getEvidenceById: (evidenceId: string) => Promise<EvidenceCatalogRow | null>;
    upsertUserEvidence: (input: UpsertUserEvidenceInput) => Promise<void>;
    hasUserEvidence: (userId: string, evidenceId: string) => Promise<boolean>;
    listUserEvidence: (userId: string) => Promise<UserEvidenceRow[]>;
}

const normalizePhase = (phase: string | null | undefined): TimePhase => {
    if (phase === 'morning' || phase === 'day' || phase === 'evening' || phase === 'night') return phase;
    return 'morning';
};

const phaseAtTick = (tick: number): TimePhase => {
    const phaseIndex = Math.floor(Math.max(0, tick) / TICKS_PER_PHASE) % TIME_PHASES.length;
    return TIME_PHASES[phaseIndex] ?? 'morning';
};

const defaultClock = (): WorldClockState => ({ tick: 0, phase: 'morning' });
const defaultPlayerProgress = (): PlayerProgressionState => ({ xp: 0, level: 1, traitPoints: 0 });
const levelFromXp = (xp: number): number => Math.max(1, Math.floor(xp / 100) + 1);

const advanceClock = (clock: WorldClockState, deltaTicks: number): WorldClockState => {
    const nextTick = clock.tick + Math.max(0, deltaTicks);
    return { tick: nextTick, phase: phaseAtTick(nextTick) };
};

const defaultLocationForCase = (caseId?: string): string => {
    if (!caseId) {
        return DEFAULT_LOCATION_ID;
    }
    return DEFAULT_LOCATION_BY_CASE[caseId] ?? DEFAULT_LOCATION_ID;
};

const defaultEtaByMode = (mode: TravelMode): number => mode === 'tram' ? 1 : 2;

const travelBeatFor = (riskLevel: number, toLocationId: string, caseId?: string): TravelBeat => {
    if (caseId === 'case_01_bank' && BANK_LOCATION_IDS.has(toLocationId)) {
        return {
            type: 'intel_audio',
            payload: { tapeId: 'audio_case01_clara_interrogation', hint: 'Private bank cell key is mentioned.' }
        };
    }
    if (riskLevel >= 3) {
        return { type: 'street_rumor', payload: { rumorId: 'rumor_black_carriage_bank' } };
    }
    return { type: 'none' };
};

const getDistrictAvailability = (locationId: string, phase: TimePhase): LocationAvailability | null => {
    const district = LOCATION_DISTRICTS[locationId];
    if (!district) {
        return null;
    }
    const rule = DISTRICT_ACCESS_RULES[district];
    if (!rule || !rule.blockedPhases.includes(phase)) {
        return null;
    }

    return {
        locationId,
        open: false,
        reason: rule.reason,
        alternatives: rule.alternatives
    };
};

const getLocationAvailability = (locationId: string, phase: TimePhase): LocationAvailability => {
    if (BANK_LOCATION_IDS.has(locationId) && phase === 'night') {
        return {
            locationId,
            open: false,
            reason: 'Bank is closed at night',
            alternatives: ['lockpick', 'bribe', 'warrant']
        };
    }

    const districtAvailability = getDistrictAvailability(locationId, phase);
    if (districtAvailability) {
        return districtAvailability;
    }

    return { locationId, open: true };
};

const toClockState = (row: WorldClockRow | null): WorldClockState => row
    ? { tick: row.tick, phase: normalizePhase(row.phase) }
    : defaultClock();

const toCaseProgressState = (row: CaseProgressRow): CaseProgressState => ({
    caseId: row.caseId,
    currentObjectiveId: row.currentObjectiveId,
    status: row.status === 'completed' || row.status === 'failed' ? row.status : 'active',
    updatedAt: row.updatedAt.toISOString()
});

const toCaseObjectiveState = (row: CaseObjectiveRow): CaseObjectiveState => ({
    id: row.id,
    caseId: row.caseId,
    title: row.title,
    description: row.description ?? null,
    sortOrder: row.sortOrder,
    locationId: row.locationId ?? null,
    data: (row.data && typeof row.data === 'object' && !Array.isArray(row.data))
        ? row.data as Record<string, unknown>
        : null
});

const toFactionState = (row: FactionReputationRow): FactionReputationState => ({ factionId: row.factionId, reputation: row.reputation });
const toRelationState = (row: CharacterRelationRow): CharacterRelationState => ({ characterId: row.characterId, trust: row.trust, lastInteractionTick: row.lastInteractionTick });
const toPlayerProgressState = (row: PlayerProgressionRow | null): PlayerProgressionState => row ? { xp: row.xp, level: row.level, traitPoints: row.traitPoints } : defaultPlayerProgress();
const toVoiceState = (row: VoiceProgressionRow): VoiceProgressionState => ({ voiceId: row.voiceId, xp: row.xp, level: row.level });
const toTravelSessionState = (row: TravelSessionRow): TravelSessionState => ({
    id: row.id,
    userId: row.userId,
    fromLocationId: row.fromLocationId,
    toLocationId: row.toLocationId,
    routeId: row.routeId,
    mode: (row.mode as TravelMode) ?? 'walk',
    status: row.status === 'completed' || row.status === 'cancelled' ? row.status : 'in_progress',
    startedTick: row.startedTick,
    etaTicks: row.etaTicks,
    arrivalTick: row.arrivalTick,
    beat: {
        type: (row.beatType as TravelBeat['type']) ?? 'none',
        payload: (row.beatPayload && typeof row.beatPayload === 'object' && !Array.isArray(row.beatPayload))
            ? row.beatPayload as Record<string, unknown>
            : undefined
    }
});

const appendEvent = async (
    repository: EngineRepository,
    userId: string,
    tick: number,
    type: DomainEventType,
    payload: Record<string, unknown>
): Promise<void> => {
    await repository.appendDomainEvent({
        id: crypto.randomUUID(),
        userId,
        tick,
        type,
        payload
    });
};

interface UserContextInput {
    request: Request;
    auth?: (options?: unknown) => { userId?: string | null } | null | undefined;
}

const resolveAndEnsureUserId = async (
    repository: EngineRepository,
    context: UserContextInput
): Promise<string> => {
    const userId = resolveUserId(context);
    await repository.ensureUserExists(userId);
    return userId;
};

const ensureWorldClock = async (repository: EngineRepository, userId: string): Promise<WorldClockState> => {
    const existing = await repository.getWorldClock(userId);
    if (existing) return toClockState(existing);
    const initial = defaultClock();
    await repository.upsertWorldClock({ userId, tick: initial.tick, phase: initial.phase });
    return initial;
};

const ensurePlayerProgress = async (repository: EngineRepository, userId: string): Promise<PlayerProgressionState> => {
    const existing = await repository.getPlayerProgress(userId);
    if (existing) return toPlayerProgressState(existing);
    const initial = defaultPlayerProgress();
    await repository.upsertPlayerProgress({ userId, xp: initial.xp, level: initial.level, traitPoints: initial.traitPoints });
    return initial;
};

const applyFactionDeltas = async (
    repository: EngineRepository,
    userId: string,
    tick: number,
    deltas: Array<{ factionId: string; delta: number }>
): Promise<FactionReputationState[]> => {
    const currentRows = await repository.listFactionReputation(userId);
    const map = new Map(currentRows.map((row) => [row.factionId, row.reputation]));

    for (const entry of deltas) {
        const next = (map.get(entry.factionId) ?? 0) + entry.delta;
        map.set(entry.factionId, next);
        await repository.upsertFactionReputation({ userId, factionId: entry.factionId, reputation: next });
        await appendEvent(repository, userId, tick, 'faction_reputation_changed', { factionId: entry.factionId, delta: entry.delta, reputation: next });
    }

    return Array.from(map.entries()).map(([factionId, reputation]) => ({ factionId, reputation }));
};

export const createDrizzleEngineRepository = (): EngineRepository => ({
    ensureUserExists: async (userId) => {
        await ensureDbUserExists(userId);
    },

    getWorldClock: async (userId) =>
        (await db.query.worldClocks.findFirst({ where: eq(worldClocks.userId, userId) })) ?? null,

    upsertWorldClock: async (input) => {
        await db.insert(worldClocks).values({
            userId: input.userId,
            tick: input.tick,
            phase: input.phase,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: worldClocks.userId,
            set: { tick: input.tick, phase: input.phase, updatedAt: new Date() }
        });
    },

    findRoute: async (fromLocationId, toLocationId, mode) =>
        (await db.query.cityRoutes.findFirst({
            where: and(
                eq(cityRoutes.fromLocationId, fromLocationId),
                eq(cityRoutes.toLocationId, toLocationId),
                eq(cityRoutes.mode, mode),
                eq(cityRoutes.active, true)
            )
        })) ?? null,

    createTravelSession: async (input) => {
        await db.insert(travelSessions).values({
            id: input.id,
            userId: input.userId,
            fromLocationId: input.fromLocationId,
            toLocationId: input.toLocationId,
            routeId: input.routeId,
            mode: input.mode,
            status: input.status,
            startedTick: input.startedTick,
            etaTicks: input.etaTicks,
            arrivalTick: input.arrivalTick,
            beatType: input.beat.type,
            beatPayload: input.beat.payload ?? null,
            meta: null,
            createdAt: new Date()
        });
    },

    getTravelSession: async (sessionId, userId) =>
        (await db.query.travelSessions.findFirst({
            where: and(eq(travelSessions.id, sessionId), eq(travelSessions.userId, userId))
        })) ?? null,

    getLatestCompletedTravelSession: async (userId) => {
        const [latestCompleted] = await db
            .select()
            .from(travelSessions)
            .where(and(
                eq(travelSessions.userId, userId),
                eq(travelSessions.status, 'completed')
            ))
            .orderBy(desc(travelSessions.arrivalTick), desc(travelSessions.startedTick))
            .limit(1);

        return latestCompleted ?? null;
    },

    completeTravelSession: async (input) => {
        await db.update(travelSessions)
            .set({ arrivalTick: input.arrivalTick, status: input.status })
            .where(and(eq(travelSessions.id, input.sessionId), eq(travelSessions.userId, input.userId)));
    },

    getCaseProgress: async (userId, caseId) =>
        (await db.query.userCaseProgress.findFirst({
            where: and(eq(userCaseProgress.userId, userId), eq(userCaseProgress.caseId, caseId))
        })) ?? null,

    listCaseObjectives: async (caseId) =>
        db.select().from(caseObjectives).where(eq(caseObjectives.caseId, caseId)),

    upsertCaseProgress: async (input) => {
        await db.insert(userCaseProgress).values({
            userId: input.userId,
            caseId: input.caseId,
            currentObjectiveId: input.currentObjectiveId,
            status: input.status,
            updatedAt: new Date(),
            lastAdvancedTick: input.lastAdvancedTick
        }).onConflictDoUpdate({
            target: [userCaseProgress.userId, userCaseProgress.caseId],
            set: {
                currentObjectiveId: input.currentObjectiveId,
                status: input.status,
                updatedAt: new Date(),
                lastAdvancedTick: input.lastAdvancedTick
            }
        });
    },

    listFactionReputation: async (userId) =>
        db.select().from(userFactionReputation).where(eq(userFactionReputation.userId, userId)),

    upsertFactionReputation: async (input) => {
        await db.insert(userFactionReputation).values({
            userId: input.userId,
            factionId: input.factionId,
            reputation: input.reputation,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: [userFactionReputation.userId, userFactionReputation.factionId],
            set: { reputation: input.reputation, updatedAt: new Date() }
        });
    },

    listCharacterRelations: async (userId) =>
        db.select().from(userCharacterRelations).where(eq(userCharacterRelations.userId, userId)),

    upsertCharacterRelation: async (input) => {
        await db.insert(userCharacterRelations).values({
            userId: input.userId,
            characterId: input.characterId,
            trust: input.trust,
            lastInteractionTick: input.lastInteractionTick,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: [userCharacterRelations.userId, userCharacterRelations.characterId],
            set: {
                trust: input.trust,
                lastInteractionTick: input.lastInteractionTick,
                updatedAt: new Date()
            }
        });
    },

    getPlayerProgress: async (userId) =>
        (await db.query.playerProgression.findFirst({ where: eq(playerProgression.userId, userId) })) ?? null,

    upsertPlayerProgress: async (input) => {
        await db.insert(playerProgression).values({
            userId: input.userId,
            xp: input.xp,
            level: input.level,
            traitPoints: input.traitPoints,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: playerProgression.userId,
            set: {
                xp: input.xp,
                level: input.level,
                traitPoints: input.traitPoints,
                updatedAt: new Date()
            }
        });
    },

    getVoiceProgress: async (userId, voiceId) =>
        (await db.query.voiceProgression.findFirst({
            where: and(eq(voiceProgression.userId, userId), eq(voiceProgression.voiceId, voiceId))
        })) ?? null,

    upsertVoiceProgress: async (input) => {
        await db.insert(voiceProgression).values({
            userId: input.userId,
            voiceId: input.voiceId,
            xp: input.xp,
            level: input.level,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: [voiceProgression.userId, voiceProgression.voiceId],
            set: { xp: input.xp, level: input.level, updatedAt: new Date() }
        });
    },

    listVoiceProgress: async (userId) =>
        db.select().from(voiceProgression).where(eq(voiceProgression.userId, userId)),

    appendDomainEvent: async (input) => {
        await db.insert(domainEventLog).values({
            id: input.id,
            userId: input.userId,
            tick: input.tick,
            type: input.type,
            payload: input.payload,
            createdAt: new Date()
        });
    },

    getEvidenceById: async (evidenceId) =>
        (await db.query.evidenceCatalog.findFirst({ where: eq(evidenceCatalog.id, evidenceId) })) ?? null,

    upsertUserEvidence: async (input) => {
        await db.insert(userEvidence).values({
            userId: input.userId,
            evidenceId: input.evidenceId,
            sourceSceneId: input.sourceSceneId,
            sourceEventId: input.sourceEventId,
            discoveredTick: input.discoveredTick
        }).onConflictDoUpdate({
            target: [userEvidence.userId, userEvidence.evidenceId],
            set: {
                sourceSceneId: input.sourceSceneId,
                sourceEventId: input.sourceEventId,
                discoveredTick: input.discoveredTick
            }
        });
    },

    hasUserEvidence: async (userId, evidenceId) =>
        Boolean(await db.query.userEvidence.findFirst({
            where: and(eq(userEvidence.userId, userId), eq(userEvidence.evidenceId, evidenceId))
        })),

    listUserEvidence: async (userId) =>
        db.select().from(userEvidence).where(eq(userEvidence.userId, userId))
});

export const createEngineModule = (repository: EngineRepository = createDrizzleEngineRepository()) =>
    new Elysia({ prefix: '/engine' })
        .get('/world', async (context) => {
            const { query, request } = context;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const caseId = typeof query.caseId === 'string' ? query.caseId : undefined;

            const worldClock = await ensureWorldClock(repository, userId);
            const player = await ensurePlayerProgress(repository, userId);
            const [factions, relations, evidenceRows, latestCompletedSession, activeCaseRow, objectiveRows] = await Promise.all([
                repository.listFactionReputation(userId),
                repository.listCharacterRelations(userId),
                repository.listUserEvidence(userId),
                repository.getLatestCompletedTravelSession(userId),
                caseId ? repository.getCaseProgress(userId, caseId) : Promise.resolve(null),
                caseId ? repository.listCaseObjectives(caseId) : Promise.resolve([])
            ]);

            const response: WorldSnapshotResponse = {
                success: true,
                worldClock,
                currentLocationId: latestCompletedSession?.toLocationId ?? defaultLocationForCase(caseId),
                player,
                factions: factions.map(toFactionState),
                relations: relations.map(toRelationState),
                activeCase: activeCaseRow ? toCaseProgressState(activeCaseRow) : null,
                objectives: objectiveRows
                    .slice()
                    .sort((left, right) => left.sortOrder - right.sortOrder)
                    .map(toCaseObjectiveState),
                evidence: evidenceRows.map((row) => ({
                    evidenceId: row.evidenceId,
                    sourceSceneId: row.sourceSceneId,
                    sourceEventId: row.sourceEventId,
                    discoveredTick: row.discoveredTick
                }))
            };
            return response;
        })
        .post('/time/tick', async (context) => {
            const { body, request } = context;
            const payload = body as TimeTickRequest;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const clock = await ensureWorldClock(repository, userId);

            const deltaByAction: Record<TimeTickRequest['actionType'], number> = {
                interrogate: 1,
                search: 1,
                travel: payload.ticks ?? 1,
                scene_major: 2,
                wait: 1
            };

            const delta = Math.max(0, deltaByAction[payload.actionType] ?? 1);
            const nextClock = advanceClock(clock, delta);
            await repository.upsertWorldClock({ userId, tick: nextClock.tick, phase: nextClock.phase });
            await appendEvent(repository, userId, nextClock.tick, 'world_tick_advanced', {
                actionType: payload.actionType,
                delta,
                fromTick: clock.tick,
                toTick: nextClock.tick
            });

            const response: TimeTickResponse = { success: true, worldClock: nextClock };
            return response;
        }, {
            body: t.Object({
                actionType: t.Union([
                    t.Literal('interrogate'),
                    t.Literal('search'),
                    t.Literal('travel'),
                    t.Literal('scene_major'),
                    t.Literal('wait')
                ]),
                ticks: t.Optional(t.Number())
            })
        })
        .post('/travel/start', async (context) => {
            const { body, request } = context;
            const payload = body as TravelStartRequest;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const clock = await ensureWorldClock(repository, userId);
            const mode: TravelMode = payload.mode ?? 'walk';

            const route = await repository.findRoute(payload.fromLocationId, payload.toLocationId, mode);
            const etaTicks = route ? Math.max(1, route.etaTicks) : defaultEtaByMode(mode);
            const beat = travelBeatFor(route?.riskLevel ?? 0, payload.toLocationId, payload.caseId);
            const sessionId = crypto.randomUUID();

            await repository.createTravelSession({
                id: sessionId,
                userId,
                fromLocationId: payload.fromLocationId,
                toLocationId: payload.toLocationId,
                routeId: route?.id ?? null,
                mode,
                status: 'in_progress',
                startedTick: clock.tick,
                etaTicks,
                arrivalTick: null,
                beat
            });

            await appendEvent(repository, userId, clock.tick, 'travel_started', {
                sessionId,
                fromLocationId: payload.fromLocationId,
                toLocationId: payload.toLocationId,
                mode,
                etaTicks
            });

            const session = await repository.getTravelSession(sessionId, userId);
            if (!session) throw new Error('Failed to persist travel session');

            const response: TravelStartResponse = {
                success: true,
                session: toTravelSessionState(session),
                predictedArrival: advanceClock(clock, etaTicks)
            };
            return response;
        }, {
            body: t.Object({
                fromLocationId: t.String(),
                toLocationId: t.String(),
                mode: t.Optional(t.Union([t.Literal('walk'), t.Literal('tram'), t.Literal('carriage')])),
                caseId: t.Optional(t.String())
            })
        })
        .post('/travel/complete/:sessionId', async (context) => {
            const { params, set, request } = context;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const session = await repository.getTravelSession(params.sessionId, userId);
            if (!session) {
                set.status = 404;
                return { success: false, error: 'Travel session not found' };
            }

            if (session.status !== 'in_progress') {
                set.status = 409;
                return { success: false, error: 'Travel session already finished' };
            }

            const clock = await ensureWorldClock(repository, userId);
            const nextClock = advanceClock(clock, Math.max(1, session.etaTicks));
            await repository.upsertWorldClock({ userId, tick: nextClock.tick, phase: nextClock.phase });
            await repository.completeTravelSession({
                sessionId: session.id,
                userId,
                arrivalTick: nextClock.tick,
                status: 'completed'
            });

            await appendEvent(repository, userId, nextClock.tick, 'world_tick_advanced', {
                actionType: 'travel',
                delta: Math.max(1, session.etaTicks),
                fromTick: clock.tick,
                toTick: nextClock.tick
            });
            await appendEvent(repository, userId, nextClock.tick, 'travel_completed', {
                sessionId: session.id,
                toLocationId: session.toLocationId,
                beatType: session.beatType ?? 'none'
            });

            const completed = await repository.getTravelSession(session.id, userId);
            if (!completed) {
                set.status = 500;
                return { success: false, error: 'Travel completion failed' };
            }

            const response: TravelCompleteResponse = {
                success: true,
                session: toTravelSessionState(completed),
                worldClock: nextClock,
                locationAvailability: getLocationAvailability(completed.toLocationId, nextClock.phase)
            };
            return response;
        })
        .post('/case/advance', async (context) => {
            const { body, request } = context;
            const payload = body as CaseAdvanceRequest;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const worldClock = await ensureWorldClock(repository, userId);

            if (
                Boolean(payload.locationId && BANK_LOCATION_IDS.has(payload.locationId)) &&
                worldClock.phase === 'night' &&
                !NIGHT_ACCESS_APPROACHES.has(payload.approach ?? 'standard')
            ) {
                const blocked: CaseAdvanceResponse = {
                    success: false,
                    blocked: true,
                    reason: 'Bank is closed at night. Choose an alternative approach.',
                    alternatives: ['lockpick', 'bribe', 'warrant'],
                    worldClock
                };
                return blocked;
            }

            const previous = await repository.getCaseProgress(userId, payload.caseId);
            await repository.upsertCaseProgress({
                userId,
                caseId: payload.caseId,
                currentObjectiveId: payload.nextObjectiveId,
                status: 'active',
                lastAdvancedTick: worldClock.tick
            });

            await appendEvent(repository, userId, worldClock.tick, 'case_objective_advanced', {
                caseId: payload.caseId,
                fromObjectiveId: previous?.currentObjectiveId ?? null,
                toObjectiveId: payload.nextObjectiveId,
                locationId: payload.locationId ?? null,
                approach: payload.approach ?? 'standard'
            });

            const factionDelta: Array<{ factionId: string; delta: number }> = [];
            if (payload.approach === 'bribe') {
                factionDelta.push({ factionId: 'fct_underworld', delta: 2 });
                factionDelta.push({ factionId: 'fct_police', delta: -1 });
            } else if (payload.approach === 'warrant') {
                factionDelta.push({ factionId: 'fct_police', delta: 2 });
                factionDelta.push({ factionId: 'fct_bankers', delta: -1 });
            } else if (payload.approach === 'lockpick') {
                factionDelta.push({ factionId: 'fct_police', delta: -2 });
            }

            const factions = factionDelta.length > 0
                ? await applyFactionDeltas(repository, userId, worldClock.tick, factionDelta)
                : (await repository.listFactionReputation(userId)).map(toFactionState);

            const current = await repository.getCaseProgress(userId, payload.caseId);
            if (!current) throw new Error('Failed to persist case progression');

            const success: CaseAdvanceResponse = {
                success: true,
                blocked: false,
                caseProgress: toCaseProgressState(current),
                worldClock,
                factionReputation: factions
            };
            return success;
        }, {
            body: t.Object({
                caseId: t.String(),
                nextObjectiveId: t.String(),
                locationId: t.Optional(t.String()),
                approach: t.Optional(t.Union([
                    t.Literal('standard'),
                    t.Literal('lockpick'),
                    t.Literal('bribe'),
                    t.Literal('warrant')
                ]))
            })
        })
        .post('/progress/apply', async (context) => {
            const { body, request } = context;
            const payload = body as ApplyProgressionRequest;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const clock = await ensureWorldClock(repository, userId);
            const current = await ensurePlayerProgress(repository, userId);

            const xpGain = Math.max(0, payload.xp ?? 0);
            const xp = current.xp + xpGain;
            const level = levelFromXp(xp);
            const traitPoints = current.traitPoints + Math.max(0, level - current.level);
            await repository.upsertPlayerProgress({ userId, xp, level, traitPoints });
            const updatedVoices: VoiceProgressionState[] = [];

            for (const voiceEntry of payload.voiceXp ?? []) {
                const currentVoice = await repository.getVoiceProgress(userId, voiceEntry.voiceId);
                const nextVoiceXp = (currentVoice?.xp ?? 0) + Math.max(0, voiceEntry.xp);
                const nextVoiceLevel = levelFromXp(nextVoiceXp);

                await repository.upsertVoiceProgress({
                    userId,
                    voiceId: voiceEntry.voiceId,
                    xp: nextVoiceXp,
                    level: nextVoiceLevel
                });

                updatedVoices.push({
                    voiceId: voiceEntry.voiceId,
                    xp: nextVoiceXp,
                    level: nextVoiceLevel
                });
            }

            const factions = await applyFactionDeltas(repository, userId, clock.tick, payload.factionDelta ?? []);
            const relationMap = new Map<string, CharacterRelationState>(
                (await repository.listCharacterRelations(userId)).map((row) => [row.characterId, toRelationState(row)])
            );

            for (const relationEntry of payload.relationDelta ?? []) {
                const nextTrust = (relationMap.get(relationEntry.characterId)?.trust ?? 0) + relationEntry.delta;
                await repository.upsertCharacterRelation({
                    userId,
                    characterId: relationEntry.characterId,
                    trust: nextTrust,
                    lastInteractionTick: clock.tick
                });
                relationMap.set(relationEntry.characterId, {
                    characterId: relationEntry.characterId,
                    trust: nextTrust,
                    lastInteractionTick: clock.tick
                });

                await appendEvent(repository, userId, clock.tick, 'character_relation_changed', {
                    characterId: relationEntry.characterId,
                    delta: relationEntry.delta,
                    trust: nextTrust
                });
            }

            await appendEvent(repository, userId, clock.tick, 'progression_updated', {
                xpGain,
                totalXp: xp,
                level
            });

            const response: ApplyProgressionResponse = {
                success: true,
                player: { xp, level, traitPoints },
                voices: updatedVoices.length > 0
                    ? updatedVoices
                    : (await repository.listVoiceProgress(userId)).map(toVoiceState),
                factions,
                relations: Array.from(relationMap.values())
            };
            return response;
        }, {
            body: t.Object({
                xp: t.Optional(t.Number()),
                voiceXp: t.Optional(t.Array(t.Object({
                    voiceId: t.String(),
                    xp: t.Number()
                }))),
                factionDelta: t.Optional(t.Array(t.Object({
                    factionId: t.String(),
                    delta: t.Number()
                }))),
                relationDelta: t.Optional(t.Array(t.Object({
                    characterId: t.String(),
                    delta: t.Number()
                })))
            })
        })
        .post('/evidence/discover', async (context) => {
            const { body, request } = context;
            const payload = body as DiscoverEvidenceRequest;
            const userId = await resolveAndEnsureUserId(repository, {
                request,
                auth: (context as UserContextInput).auth
            });
            const clock = await ensureWorldClock(repository, userId);

            const evidence = await repository.getEvidenceById(payload.evidenceId);
            if (!evidence) {
                const notFound: DiscoverEvidenceResponse = {
                    success: false,
                    error: 'Unknown evidence id'
                };
                return notFound;
            }

            await repository.upsertUserEvidence({
                userId,
                evidenceId: payload.evidenceId,
                sourceSceneId: payload.sourceSceneId ?? null,
                sourceEventId: payload.sourceEventId ?? null,
                discoveredTick: clock.tick
            });

            let conflict: EvidenceConflict | undefined;
            if (evidence.contradictsId) {
                const hasContradicted = await repository.hasUserEvidence(userId, evidence.contradictsId);
                if (hasContradicted) {
                    conflict = {
                        evidenceId: evidence.id,
                        contradictsEvidenceId: evidence.contradictsId
                    };
                }
            }

            await appendEvent(repository, userId, clock.tick, 'evidence_discovered', {
                evidenceId: evidence.id,
                sourceSceneId: payload.sourceSceneId ?? null,
                sourceEventId: payload.sourceEventId ?? null,
                conflict: Boolean(conflict)
            });

            const success: DiscoverEvidenceResponse = {
                success: true,
                evidence: {
                    evidenceId: payload.evidenceId,
                    sourceSceneId: payload.sourceSceneId ?? null,
                    sourceEventId: payload.sourceEventId ?? null,
                    discoveredTick: clock.tick
                },
                conflict
            };
            return success;
        }, {
            body: t.Object({
                evidenceId: t.String(),
                sourceSceneId: t.Optional(t.String()),
                sourceEventId: t.Optional(t.String())
            })
        });

export const engineModule = createEngineModule();
