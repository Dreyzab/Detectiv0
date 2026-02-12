import { create } from 'zustand';
import type {
    ApplyProgressionRequest,
    ApplyProgressionResponse,
    CaseAdvanceRequest,
    CaseAdvanceResponse,
    DiscoverEvidenceRequest,
    DiscoverEvidenceResponse,
    TravelCompleteResponse,
    WorldSnapshotResponse
} from '@repo/contracts';
import type {
    CaseObjectiveState,
    CaseProgressState,
    CharacterRelationState,
    FactionReputationState,
    LocationAvailability,
    PlayerProgressionState,
    TravelBeat,
    TravelMode,
    UserEvidenceState,
    VoiceProgressionState,
    WorldClockState
} from '@repo/shared';
import { api } from '@/shared/api/client';

const DEFAULT_LOCATION_ID = 'loc_hbf';
const DEFAULT_WORLD_CLOCK: WorldClockState = { tick: 0, phase: 'morning' };
const DEFAULT_PLAYER: PlayerProgressionState = { xp: 0, level: 1, traitPoints: 0 };

const upsertEvidence = (
    current: UserEvidenceState[],
    next: UserEvidenceState
): UserEvidenceState[] => {
    const index = current.findIndex((entry) => entry.evidenceId === next.evidenceId);
    if (index < 0) {
        return [...current, next];
    }

    const copy = current.slice();
    copy[index] = next;
    return copy;
};

interface TravelToLocationParams {
    toLocationId: string;
    caseId?: string;
    mode?: TravelMode;
    fromLocationId?: string;
}

interface WorldEngineState {
    isLoaded: boolean;
    isHydrating: boolean;
    isTraveling: boolean;
    error: string | null;

    worldClock: WorldClockState;
    player: PlayerProgressionState;
    voices: VoiceProgressionState[];
    factions: FactionReputationState[];
    relations: CharacterRelationState[];
    evidence: UserEvidenceState[];
    objectives: CaseObjectiveState[];
    activeCase: CaseProgressState | null;

    currentLocationId: string | null;
    lastTravelBeat: TravelBeat | null;
    locationAvailability: Record<string, LocationAvailability>;

    hydrateWorld: (params?: { caseId?: string }) => Promise<WorldSnapshotResponse | null>;
    travelToLocation: (params: TravelToLocationParams) => Promise<TravelCompleteResponse | null>;
    advanceCase: (request: CaseAdvanceRequest) => Promise<CaseAdvanceResponse | null>;
    applyProgression: (request: ApplyProgressionRequest) => Promise<ApplyProgressionResponse | null>;
    discoverEvidence: (request: DiscoverEvidenceRequest) => Promise<DiscoverEvidenceResponse | null>;

    setCurrentLocation: (locationId: string) => void;
    clearError: () => void;
}

export const useWorldEngineStore = create<WorldEngineState>((set, get) => ({
    isLoaded: false,
    isHydrating: false,
    isTraveling: false,
    error: null,

    worldClock: DEFAULT_WORLD_CLOCK,
    player: DEFAULT_PLAYER,
    voices: [],
    factions: [],
    relations: [],
    evidence: [],
    objectives: [],
    activeCase: null,

    currentLocationId: DEFAULT_LOCATION_ID,
    lastTravelBeat: null,
    locationAvailability: {},

    hydrateWorld: async (params) => {
        set({ isHydrating: true, error: null });
        const { data, error } = await api.engine.world.get({
            query: { caseId: params?.caseId }
        });

        if (error || !data?.success) {
            set({
                isHydrating: false,
                error: error?.message ?? 'Failed to fetch world snapshot'
            });
            return null;
        }

        set((state) => ({
            isLoaded: true,
            isHydrating: false,
            error: null,
            worldClock: data.worldClock,
            player: data.player,
            factions: data.factions,
            relations: data.relations,
            evidence: data.evidence,
            objectives: data.objectives ?? [],
            activeCase: data.activeCase ?? null,
            currentLocationId: data.currentLocationId ?? state.currentLocationId ?? DEFAULT_LOCATION_ID
        }));

        return data;
    },

    travelToLocation: async (params) => {
        const fromLocationId = params.fromLocationId ?? get().currentLocationId ?? DEFAULT_LOCATION_ID;
        if (fromLocationId === params.toLocationId) {
            return null;
        }

        set({ isTraveling: true, error: null });

        const start = await api.engine.travel.start.post({
            body: {
                fromLocationId,
                toLocationId: params.toLocationId,
                mode: params.mode,
                caseId: params.caseId
            }
        });

        if (start.error || !start.data) {
            set({
                isTraveling: false,
                error: start.error?.message ?? 'Failed to start travel session'
            });
            return null;
        }

        const complete = await api.engine.travel.complete({
            sessionId: start.data.session.id
        }).post();

        const completeData = complete.data;
        if (complete.error || !completeData || !completeData.success) {
            set({
                isTraveling: false,
                error: complete.error?.message ?? 'Failed to complete travel session'
            });
            return null;
        }

        set((state) => ({
            isTraveling: false,
            error: null,
            worldClock: completeData.worldClock,
            currentLocationId: completeData.session.toLocationId,
            lastTravelBeat: completeData.session.beat,
            locationAvailability: {
                ...state.locationAvailability,
                [completeData.locationAvailability.locationId]: completeData.locationAvailability
            }
        }));

        return completeData;
    },

    advanceCase: async (request) => {
        const response = await api.engine.case.advance.post({
            body: request
        });

        if (response.error || !response.data) {
            set({
                error: response.error?.message ?? 'Failed to advance case'
            });
            return null;
        }

        const caseData = response.data;

        if (caseData.success) {
            set((state) => ({
                error: null,
                activeCase: caseData.caseProgress,
                worldClock: caseData.worldClock,
                factions: caseData.factionReputation,
                locationAvailability: request.locationId
                    ? {
                        ...state.locationAvailability,
                        [request.locationId]: {
                            locationId: request.locationId,
                            open: true
                        }
                    }
                    : state.locationAvailability
            }));
        } else {
            const blockedData = caseData;
            set((state) => ({
                error: blockedData.reason,
                worldClock: blockedData.worldClock,
                locationAvailability: request.locationId
                    ? {
                        ...state.locationAvailability,
                        [request.locationId]: {
                            locationId: request.locationId,
                            open: false,
                            reason: blockedData.reason,
                            alternatives: blockedData.alternatives
                        }
                    }
                    : state.locationAvailability
            }));
        }

        return caseData;
    },

    applyProgression: async (request) => {
        const response = await api.engine.progress.apply.post({
            body: request
        });

        if (response.error || !response.data?.success) {
            set({
                error: response.error?.message ?? 'Failed to apply progression'
            });
            return null;
        }

        const progressionData = response.data;
        set({
            error: null,
            player: progressionData.player,
            voices: progressionData.voices,
            factions: progressionData.factions,
            relations: progressionData.relations
        });

        return progressionData;
    },

    discoverEvidence: async (request) => {
        const response = await api.engine.evidence.discover.post({
            body: request
        });

        if (response.error || !response.data) {
            set({
                error: response.error?.message ?? 'Failed to discover evidence'
            });
            return null;
        }

        const evidenceData = response.data;
        const discoveredEvidence = evidenceData.evidence;
        if (evidenceData.success && discoveredEvidence) {
            set((state) => ({
                error: null,
                evidence: upsertEvidence(state.evidence, discoveredEvidence)
            }));
        } else if (!evidenceData.success) {
            set({
                error: evidenceData.error ?? 'Evidence discovery failed'
            });
        }

        return evidenceData;
    },

    setCurrentLocation: (locationId) => {
        set({ currentLocationId: locationId });
    },

    clearError: () => set({ error: null })
}));

