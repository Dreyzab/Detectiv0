import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import {
    createEngineModule,
    type AppendDomainEventInput,
    type CaseObjectiveRow,
    type CaseProgressRow,
    type CharacterRelationRow,
    type CityRouteRow,
    type CompleteTravelSessionInput,
    type CreateTravelSessionInput,
    type EngineRepository,
    type EvidenceCatalogRow,
    type FactionReputationRow,
    type PlayerProgressionRow,
    type TravelSessionRow,
    type UpsertCaseProgressInput,
    type UpsertCharacterRelationInput,
    type UpsertFactionReputationInput,
    type UpsertPlayerProgressInput,
    type UpsertUserEvidenceInput,
    type UpsertVoiceProgressInput,
    type UpsertWorldClockInput,
    type UserEvidenceRow,
    type VoiceProgressionRow,
    type WorldClockRow
} from '../../src/modules/engine';

const BASE_URL = 'http://localhost:3000';
const DEMO_USER_ID = 'demo_user';

interface EngineMockContext {
    repo: EngineRepository;
    worldClock: WorldClockRow | null;
    routes: CityRouteRow[];
    sessions: TravelSessionRow[];
    objectives: CaseObjectiveRow[];
    caseProgress: CaseProgressRow[];
    factions: FactionReputationRow[];
    relations: CharacterRelationRow[];
    player: PlayerProgressionRow | null;
    voices: VoiceProgressionRow[];
    evidenceCatalog: EvidenceCatalogRow[];
    userEvidence: UserEvidenceRow[];
    eventLog: AppendDomainEventInput[];
}

const createMockRepository = (): EngineMockContext => {
    let worldClock: WorldClockRow | null = null;
    const routes: CityRouteRow[] = [];
    const sessions: TravelSessionRow[] = [];
    const objectives: CaseObjectiveRow[] = [];
    const caseProgress: CaseProgressRow[] = [];
    const factions: FactionReputationRow[] = [];
    const relations: CharacterRelationRow[] = [];
    let player: PlayerProgressionRow | null = null;
    const voices: VoiceProgressionRow[] = [];
    const evidenceCatalog: EvidenceCatalogRow[] = [];
    const userEvidence: UserEvidenceRow[] = [];
    const eventLog: AppendDomainEventInput[] = [];

    const repo: EngineRepository = {
        ensureUserExists: async () => { },
        getWorldClock: async () => worldClock,
        upsertWorldClock: async (input: UpsertWorldClockInput) => {
            worldClock = { userId: input.userId, tick: input.tick, phase: input.phase };
        },

        findRoute: async (fromLocationId, toLocationId, mode) =>
            routes.find((route) =>
                route.fromLocationId === fromLocationId &&
                route.toLocationId === toLocationId &&
                route.mode === mode &&
                route.active
            ) ?? null,

        createTravelSession: async (input: CreateTravelSessionInput) => {
            sessions.push({
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
                beatPayload: input.beat.payload ?? null
            });
        },
        getTravelSession: async (sessionId, userId) =>
            sessions.find((session) => session.id === sessionId && session.userId === userId) ?? null,
        completeTravelSession: async (input: CompleteTravelSessionInput) => {
            const session = sessions.find((row) => row.id === input.sessionId && row.userId === input.userId);
            if (!session) return;
            session.status = input.status;
            session.arrivalTick = input.arrivalTick;
        },

        getCaseProgress: async (userId, caseId) =>
            caseProgress.find((row) => row.userId === userId && row.caseId === caseId) ?? null,
        listCaseObjectives: async (caseId) =>
            objectives
                .filter((row) => row.caseId === caseId)
                .sort((left, right) => left.sortOrder - right.sortOrder),
        upsertCaseProgress: async (input: UpsertCaseProgressInput) => {
            const index = caseProgress.findIndex((row) => row.userId === input.userId && row.caseId === input.caseId);
            const nextRow: CaseProgressRow = {
                userId: input.userId,
                caseId: input.caseId,
                currentObjectiveId: input.currentObjectiveId,
                status: input.status,
                updatedAt: new Date(),
                lastAdvancedTick: input.lastAdvancedTick
            };
            if (index >= 0) {
                caseProgress[index] = nextRow;
            } else {
                caseProgress.push(nextRow);
            }
        },

        listFactionReputation: async (userId) => factions.filter((row) => row.userId === userId),
        upsertFactionReputation: async (input: UpsertFactionReputationInput) => {
            const index = factions.findIndex((row) => row.userId === input.userId && row.factionId === input.factionId);
            const next: FactionReputationRow = {
                userId: input.userId,
                factionId: input.factionId,
                reputation: input.reputation,
                updatedAt: new Date()
            };
            if (index >= 0) factions[index] = next;
            else factions.push(next);
        },

        listCharacterRelations: async (userId) => relations.filter((row) => row.userId === userId),
        upsertCharacterRelation: async (input: UpsertCharacterRelationInput) => {
            const index = relations.findIndex((row) => row.userId === input.userId && row.characterId === input.characterId);
            const next: CharacterRelationRow = {
                userId: input.userId,
                characterId: input.characterId,
                trust: input.trust,
                lastInteractionTick: input.lastInteractionTick,
                updatedAt: new Date()
            };
            if (index >= 0) relations[index] = next;
            else relations.push(next);
        },

        getPlayerProgress: async () => player,
        upsertPlayerProgress: async (input: UpsertPlayerProgressInput) => {
            player = {
                userId: input.userId,
                xp: input.xp,
                level: input.level,
                traitPoints: input.traitPoints,
                updatedAt: new Date()
            };
        },

        getVoiceProgress: async (userId, voiceId) =>
            voices.find((row) => row.userId === userId && row.voiceId === voiceId) ?? null,
        upsertVoiceProgress: async (input: UpsertVoiceProgressInput) => {
            const index = voices.findIndex((row) => row.userId === input.userId && row.voiceId === input.voiceId);
            const next: VoiceProgressionRow = {
                userId: input.userId,
                voiceId: input.voiceId,
                xp: input.xp,
                level: input.level,
                updatedAt: new Date()
            };
            if (index >= 0) voices[index] = next;
            else voices.push(next);
        },
        listVoiceProgress: async (userId) => voices.filter((row) => row.userId === userId),

        appendDomainEvent: async (input: AppendDomainEventInput) => {
            eventLog.push(input);
        },

        getEvidenceById: async (evidenceId) =>
            evidenceCatalog.find((row) => row.id === evidenceId) ?? null,
        upsertUserEvidence: async (input: UpsertUserEvidenceInput) => {
            const index = userEvidence.findIndex(
                (row) => row.userId === input.userId && row.evidenceId === input.evidenceId
            );
            const next: UserEvidenceRow = {
                userId: input.userId,
                evidenceId: input.evidenceId,
                sourceSceneId: input.sourceSceneId,
                sourceEventId: input.sourceEventId,
                discoveredTick: input.discoveredTick
            };
            if (index >= 0) userEvidence[index] = next;
            else userEvidence.push(next);
        },
        hasUserEvidence: async (userId, evidenceId) =>
            userEvidence.some((row) => row.userId === userId && row.evidenceId === evidenceId),
        listUserEvidence: async (userId) => userEvidence.filter((row) => row.userId === userId)
    };

    return {
        repo,
        get worldClock() { return worldClock; },
        routes,
        sessions,
        objectives,
        caseProgress,
        factions,
        relations,
        get player() { return player; },
        voices,
        evidenceCatalog,
        userEvidence,
        eventLog
    };
};

describe('Engine Module (Controlled Integration)', () => {
    let context: EngineMockContext;
    let app: { handle: (request: Request) => Promise<Response> };

    beforeEach(() => {
        context = createMockRepository();
        app = new Elysia().use(createEngineModule(context.repo));
    });

    it('world snapshot returns objectives for selected case', async () => {
        context.objectives.push(
            {
                id: 'obj_find_clara',
                caseId: 'case_01_bank',
                title: 'Find Clara',
                description: null,
                sortOrder: 1,
                locationId: 'loc_freiburg_bank',
                data: { style: 'investigation' }
            },
            {
                id: 'obj_search_bank_cell',
                caseId: 'case_01_bank',
                title: 'Search Clara Cell',
                description: null,
                sortOrder: 2,
                locationId: 'loc_freiburg_bank',
                data: { style: 'contradiction' }
            }
        );

        const response = await app.handle(new Request(`${BASE_URL}/engine/world?caseId=case_01_bank`));
        expect(response.status).toBe(200);

        const payload = await response.json() as {
            success: boolean;
            objectives?: Array<{ id: string; sortOrder: number; locationId: string | null }>;
        };

        expect(payload.success).toBe(true);
        expect(payload.objectives?.map((entry) => entry.id)).toEqual([
            'obj_find_clara',
            'obj_search_bank_cell'
        ]);
        expect(payload.objectives?.every((entry) => entry.locationId === 'loc_freiburg_bank')).toBe(true);
    });

    it('travel flow advances world tick and returns travel beat', async () => {
        context.routes.push({
            id: 'route_station_bank',
            fromLocationId: 'loc_station',
            toLocationId: 'loc_freiburg_bank',
            mode: 'walk',
            etaTicks: 2,
            riskLevel: 3,
            active: true
        });

        const startResponse = await app.handle(new Request(`${BASE_URL}/engine/travel/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromLocationId: 'loc_station',
                toLocationId: 'loc_freiburg_bank',
                mode: 'walk',
                caseId: 'case_01_bank'
            })
        }));
        expect(startResponse.status).toBe(200);

        const started = await startResponse.json() as {
            success: boolean;
            session: { id: string; beat: { type: string } };
            predictedArrival: { tick: number };
        };
        expect(started.success).toBe(true);
        expect(started.session.beat.type).toBe('intel_audio');
        expect(started.predictedArrival.tick).toBe(2);

        const completeResponse = await app.handle(new Request(`${BASE_URL}/engine/travel/complete/${started.session.id}`, {
            method: 'POST'
        }));
        expect(completeResponse.status).toBe(200);

        const completed = await completeResponse.json() as {
            success: boolean;
            worldClock: { tick: number; phase: string };
            locationAvailability: { open: boolean };
        };
        expect(completed.success).toBe(true);
        expect(completed.worldClock.tick).toBe(2);
        expect(completed.worldClock.phase).toBe('morning');
        expect(completed.locationAvailability.open).toBe(true);
        expect(context.eventLog.some((event) => event.type === 'travel_completed')).toBe(true);
    });

    it('marks industrial district as closed at night after travel', async () => {
        await context.repo.upsertWorldClock({
            userId: DEMO_USER_ID,
            tick: 9,
            phase: 'night'
        });

        context.routes.push({
            id: 'route_bank_warehouse_night',
            fromLocationId: 'loc_freiburg_bank',
            toLocationId: 'loc_freiburg_warehouse',
            mode: 'carriage',
            etaTicks: 1,
            riskLevel: 3,
            active: true
        });

        const startResponse = await app.handle(new Request(`${BASE_URL}/engine/travel/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromLocationId: 'loc_freiburg_bank',
                toLocationId: 'loc_freiburg_warehouse',
                mode: 'carriage',
                caseId: 'case_01_bank'
            })
        }));
        expect(startResponse.status).toBe(200);
        const started = await startResponse.json() as {
            success: boolean;
            session: { id: string };
        };
        expect(started.success).toBe(true);

        const completeResponse = await app.handle(new Request(`${BASE_URL}/engine/travel/complete/${started.session.id}`, {
            method: 'POST'
        }));
        expect(completeResponse.status).toBe(200);

        const completed = await completeResponse.json() as {
            success: boolean;
            locationAvailability: { open: boolean; reason?: string; alternatives?: string[] };
        };
        expect(completed.success).toBe(true);
        expect(completed.locationAvailability.open).toBe(false);
        expect(completed.locationAvailability.reason).toContain('district');
        expect(completed.locationAvailability.alternatives).toEqual(['district_pass', 'wait_until_day']);
    });

    it('blocks bank case objective at night without alternative approach', async () => {
        await context.repo.upsertWorldClock({
            userId: DEMO_USER_ID,
            tick: 9,
            phase: 'night'
        });

        const blockedResponse = await app.handle(new Request(`${BASE_URL}/engine/case/advance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                caseId: 'case_01_bank',
                nextObjectiveId: 'obj_search_bank_cell',
                locationId: 'loc_freiburg_bank',
                approach: 'standard'
            })
        }));
        expect(blockedResponse.status).toBe(200);
        const blocked = await blockedResponse.json() as {
            success: boolean;
            blocked: boolean;
            alternatives: string[];
        };
        expect(blocked.success).toBe(false);
        expect(blocked.blocked).toBe(true);
        expect(blocked.alternatives).toEqual(['lockpick', 'bribe', 'warrant']);

        const bypassResponse = await app.handle(new Request(`${BASE_URL}/engine/case/advance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                caseId: 'case_01_bank',
                nextObjectiveId: 'obj_search_bank_cell',
                locationId: 'loc_freiburg_bank',
                approach: 'bribe'
            })
        }));
        expect(bypassResponse.status).toBe(200);
        const bypassed = await bypassResponse.json() as {
            success: boolean;
            blocked: boolean;
            factionReputation: Array<{ factionId: string; reputation: number }>;
        };
        expect(bypassed.success).toBe(true);
        expect(bypassed.blocked).toBe(false);
        expect(bypassed.factionReputation.find((entry) => entry.factionId === 'fct_underworld')?.reputation).toBe(2);
    });

    it('applies progression and detects evidence contradiction', async () => {
        context.evidenceCatalog.push(
            {
                id: 'evi_statement_a',
                title: 'Statement A',
                description: null,
                contradictsId: 'evi_statement_b'
            },
            {
                id: 'evi_statement_b',
                title: 'Statement B',
                description: null,
                contradictsId: null
            }
        );

        const firstEvidence = await app.handle(new Request(`${BASE_URL}/engine/evidence/discover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ evidenceId: 'evi_statement_b', sourceSceneId: 'scene_b' })
        }));
        expect(firstEvidence.status).toBe(200);

        const secondEvidence = await app.handle(new Request(`${BASE_URL}/engine/evidence/discover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ evidenceId: 'evi_statement_a', sourceSceneId: 'scene_a' })
        }));
        expect(secondEvidence.status).toBe(200);
        const conflict = await secondEvidence.json() as {
            success: boolean;
            conflict?: { evidenceId: string; contradictsEvidenceId: string };
        };
        expect(conflict.success).toBe(true);
        expect(conflict.conflict?.contradictsEvidenceId).toBe('evi_statement_b');

        const progressionResponse = await app.handle(new Request(`${BASE_URL}/engine/progress/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                xp: 120,
                voiceXp: [{ voiceId: 'logic', xp: 40 }],
                relationDelta: [{ characterId: 'char_clara', delta: 3 }]
            })
        }));
        expect(progressionResponse.status).toBe(200);
        const progression = await progressionResponse.json() as {
            success: boolean;
            player: { xp: number; level: number; traitPoints: number };
            voices: Array<{ voiceId: string; xp: number; level: number }>;
            relations: Array<{ characterId: string; trust: number }>;
        };
        expect(progression.success).toBe(true);
        expect(progression.player.xp).toBe(120);
        expect(progression.player.level).toBe(2);
        expect(progression.player.traitPoints).toBe(1);
        expect(progression.voices.find((voice) => voice.voiceId === 'logic')?.xp).toBe(40);
        expect(progression.relations.find((entry) => entry.characterId === 'char_clara')?.trust).toBe(3);
    });
});

