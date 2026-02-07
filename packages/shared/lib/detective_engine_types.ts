export type TimePhase = 'morning' | 'day' | 'evening' | 'night';

export const TIME_PHASES: TimePhase[] = ['morning', 'day', 'evening', 'night'];

export type TravelMode = 'walk' | 'tram' | 'carriage';
export type TravelSessionStatus = 'in_progress' | 'completed' | 'cancelled';
export type TravelBeatType = 'intel_audio' | 'street_rumor' | 'faction_contact' | 'none';

export type CaseProgressStatus = 'active' | 'completed' | 'failed';

export type DomainEventType =
    | 'world_tick_advanced'
    | 'travel_started'
    | 'travel_completed'
    | 'case_objective_advanced'
    | 'faction_reputation_changed'
    | 'character_relation_changed'
    | 'evidence_discovered'
    | 'progression_updated';

export interface WorldClockState {
    tick: number;
    phase: TimePhase;
}

export interface LocationAvailability {
    locationId: string;
    open: boolean;
    reason?: string;
    alternatives?: string[];
}

export interface TravelBeat {
    type: TravelBeatType;
    payload?: Record<string, unknown>;
}

export interface TravelSessionState {
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

export interface CaseProgressState {
    caseId: string;
    currentObjectiveId: string;
    status: CaseProgressStatus;
    updatedAt: string;
}

export interface CaseObjectiveState {
    id: string;
    caseId: string;
    title: string;
    description: string | null;
    sortOrder: number;
    locationId: string | null;
    data?: Record<string, unknown> | null;
}

export interface PlayerProgressionState {
    xp: number;
    level: number;
    traitPoints: number;
}

export interface VoiceProgressionState {
    voiceId: string;
    xp: number;
    level: number;
}

export interface FactionReputationState {
    factionId: string;
    reputation: number;
}

export interface CharacterRelationState {
    characterId: string;
    trust: number;
    lastInteractionTick: number | null;
}

export interface UserEvidenceState {
    evidenceId: string;
    sourceSceneId: string | null;
    sourceEventId: string | null;
    discoveredTick: number;
}

export interface EvidenceRecord {
    id: string;
    title: string;
    description: string | null;
    contradictsId: string | null;
}

export interface EvidenceConflict {
    evidenceId: string;
    contradictsEvidenceId: string;
}

export interface DomainEventRecord {
    id: string;
    userId: string;
    tick: number;
    type: DomainEventType;
    payload: Record<string, unknown>;
    createdAt: string;
}

export interface TravelStartRequest {
    fromLocationId: string;
    toLocationId: string;
    mode?: TravelMode;
    caseId?: string;
}

export interface TravelStartResponse {
    success: true;
    session: TravelSessionState;
    predictedArrival: WorldClockState;
}

export interface TravelCompleteResponse {
    success: true;
    session: TravelSessionState;
    worldClock: WorldClockState;
    locationAvailability: LocationAvailability;
}

export interface TimeTickRequest {
    actionType: 'interrogate' | 'search' | 'travel' | 'scene_major' | 'wait';
    ticks?: number;
}

export interface TimeTickResponse {
    success: true;
    worldClock: WorldClockState;
}

export interface CaseAdvanceRequest {
    caseId: string;
    nextObjectiveId: string;
    locationId?: string;
    approach?: 'standard' | 'lockpick' | 'bribe' | 'warrant';
}

export interface CaseAdvanceBlockedResponse {
    success: false;
    blocked: true;
    reason: string;
    alternatives: string[];
    worldClock: WorldClockState;
}

export interface CaseAdvanceSuccessResponse {
    success: true;
    blocked: false;
    caseProgress: CaseProgressState;
    worldClock: WorldClockState;
    factionReputation: FactionReputationState[];
}

export type CaseAdvanceResponse = CaseAdvanceBlockedResponse | CaseAdvanceSuccessResponse;

export interface ApplyProgressionRequest {
    xp?: number;
    voiceXp?: Array<{ voiceId: string; xp: number }>;
    factionDelta?: Array<{ factionId: string; delta: number }>;
    relationDelta?: Array<{ characterId: string; delta: number }>;
}

export interface ApplyProgressionResponse {
    success: true;
    player: PlayerProgressionState;
    voices: VoiceProgressionState[];
    factions: FactionReputationState[];
    relations: CharacterRelationState[];
}

export interface DiscoverEvidenceRequest {
    evidenceId: string;
    sourceSceneId?: string;
    sourceEventId?: string;
}

export interface DiscoverEvidenceResponse {
    success: boolean;
    evidence?: UserEvidenceState;
    conflict?: EvidenceConflict;
    error?: string;
}

export interface WorldSnapshotResponse {
    success: true;
    worldClock: WorldClockState;
    player: PlayerProgressionState;
    factions: FactionReputationState[];
    relations: CharacterRelationState[];
    activeCase?: CaseProgressState | null;
    objectives?: CaseObjectiveState[];
    evidence: UserEvidenceState[];
}
