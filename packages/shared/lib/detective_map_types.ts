import type {
    PointStateEnum,
    TriggerType,
    MapCondition,
    MapAction,
    MapPointBinding,
    MapPoint
} from './map-validators';

// Re-export core types grounded in Zod schemas
export type {
    PointStateEnum,
    TriggerType,
    MapCondition,
    MapAction,
    MapPointBinding,
    MapPoint
};

// Aliases for backward compatibility if needed, or keeping non-validated types here

export type MapTrigger = TriggerType;

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
    sourcePointId: string;
    targetPointId: string;
    condition?: MapCondition;
    style?: 'solid' | 'dashed';
    label?: string;
}
