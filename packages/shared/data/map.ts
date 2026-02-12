
export type MapPointCategory =
    | 'CRIME_SCENE'
    | 'NPC'
    | 'QUEST'
    | 'EVENT'
    | 'ACTIVITY'
    | 'INTEREST'
    | 'TRAVEL';

export type PointStateEnum = 'locked' | 'discovered' | 'visited' | 'completed';

export type TriggerType = 'marker_click' | 'qr_scan' | 'arrive';

// --- Serializable Condition DSL ---

export type MapCondition =
    | { type: 'flag_is'; flagId: string; value: boolean }
    | { type: 'item_count'; itemId: string; min: number }
    | { type: 'point_state'; pointId: string; state: PointStateEnum }
    | { type: 'quest_stage'; questId: string; stage: string }
    | { type: 'quest_past_stage'; questId: string; stage: string }
    | { type: 'logic_and'; conditions: MapCondition[] }
    | { type: 'logic_or'; conditions: MapCondition[] }
    | { type: 'logic_not'; condition: MapCondition };

// --- Serializable Action DSL ---

export type MapAction =
    | { type: 'start_vn'; scenarioId: string }
    | { type: 'unlock_point'; pointId: string }
    | { type: 'unlock_group'; groupId: string }
    | { type: 'grant_evidence'; evidenceId: string }
    | { type: 'add_fact'; factId: string } // Generic fact/flag
    | { type: 'set_flag'; flagId: string; value: boolean }
    | { type: 'set_quest_stage'; questId: string; stage: string }
    | { type: 'start_battle'; scenarioId: string; deckType?: string }
    | { type: 'open_trade'; shopId: string }
    | { type: 'teleport'; targetPointId: string }
    | { type: 'show_toast'; message: string; variant?: 'info' | 'success' | 'warning' };

// --- Core Data Types ---

export interface MapPointBinding {
    id: string; // unique binding ID
    trigger: TriggerType;
    label?: string; // For UI (e.g. "Examine Body")
    priority?: number; // Higher wins
    conditions?: MapCondition[]; // If met, binding is available
    actions: MapAction[];
}

export interface MapPoint {
    id: string;
    title: string;
    category: MapPointCategory;
    lat: number;
    lng: number;
    description?: string;

    // Logic
    packId: string;
    caseId?: string; // Optional: linked to specific investigation
    bindings: MapPointBinding[];

    // Visuals
    iconOverride?: string;
    isHiddenInitially?: boolean;
    unlockGroup?: string;
}

export interface NarrativeThread {
    id: string;
    caseId: string;
    sourcePointId: string;
    targetPointId: string;
    label?: string;
    condition?: MapCondition; // Only show thread if condition met (e.g. clue found)
}

export interface DirectiveCase {
    id: string;
    title: string;
    description: string;
    color: string;
    packId: string;
}
