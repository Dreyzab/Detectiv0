
export enum PointStateEnum {
    LOCKED = 'locked',
    DISCOVERED = 'discovered',
    VISITED = 'visited',
    COMPLETED = 'completed',
}

export type MapCondition =
    | { type: 'all_of'; conditions: MapCondition[] }
    | { type: 'any_of'; conditions: MapCondition[] }
    | { type: 'not'; condition: MapCondition }
    | { type: 'flag_is'; flag: string; value: boolean }
    | { type: 'point_state_is'; pointId: string; state: PointStateEnum };

export type MapAction =
    | { type: 'start_vn'; scenarioId: string }
    | { type: 'unlock_point'; pointId: string; silent?: boolean }
    | { type: 'grant_evidence'; evidenceId: string }
    | { type: 'add_flags'; flags: string[] }
    | { type: 'start_battle'; battleId: string }
    | { type: 'unlock_entry'; entryId: string }
    | { type: 'set_active_case'; caseId: string };

export type MapTrigger = 'marker_click' | 'qr_scan' | 'arrive';

export interface DirectiveCase {
    id: string;
    title: string;
    description: string;
    color: string; // hex
    packId: string;
}

export interface NarrativeThread {
    id: string;
    caseId: string;
    fromPointId: string;
    toPointId: string;
    condition?: MapCondition;
    style: 'solid' | 'dashed';
    label?: string;
}


export interface MapPointBinding {
    id: string; // unique binding ID
    label?: string; // e.g. "Investigate", "Talk to witness"
    trigger: MapTrigger;
    priority: number; // Higher wins or floats to top
    condition?: MapCondition;
    actions: MapAction[];
}

export interface MapPoint {
    id: string;
    lat: number;
    lng: number;
    bindings: MapPointBinding[];
}
