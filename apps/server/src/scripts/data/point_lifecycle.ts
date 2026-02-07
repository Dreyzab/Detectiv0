import type { PointStateEnum } from '@repo/shared';

export type PointScope = 'global' | 'case' | 'progression';
export type PointRetentionPolicy = 'temporary' | 'persistent_on_unlock' | 'permanent';

export interface PointLifecycleConfig {
    scope: PointScope;
    retentionPolicy: PointRetentionPolicy;
    caseId: string | null;
    defaultState: PointStateEnum;
    active: boolean;
}

const CASE_01_ID = 'case_01_bank';

const GLOBAL_POINT_IDS = new Set<string>([
    // Core world services should remain available regardless of active case.
    'loc_apothecary'
]);

const PROGRESSION_POINT_IDS = new Set<string>([
    // Unlock mechanics during case and keep for long-term progression.
    'loc_uni_chem',
    'loc_uni_med'
]);

export const resolvePointLifecycle = (pointId: string): PointLifecycleConfig => {
    if (GLOBAL_POINT_IDS.has(pointId)) {
        return {
            scope: 'global',
            retentionPolicy: 'permanent',
            caseId: null,
            defaultState: 'discovered',
            active: true
        };
    }

    if (PROGRESSION_POINT_IDS.has(pointId)) {
        return {
            scope: 'progression',
            retentionPolicy: 'persistent_on_unlock',
            caseId: CASE_01_ID,
            defaultState: 'locked',
            active: true
        };
    }

    return {
        scope: 'case',
        retentionPolicy: 'temporary',
        caseId: CASE_01_ID,
        defaultState: 'locked',
        active: true
    };
};

