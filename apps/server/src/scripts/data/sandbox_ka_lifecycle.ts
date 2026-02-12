import type { PointLifecycleConfig } from './point_lifecycle';

/**
 * Karlsruhe Sandbox — Point Lifecycle Rules
 * 
 * Points follow 3 visibility categories at pack level:
 * - ALWAYS_VISIBLE: Agency, Marktplatz (landmarks visible from the start)
 * - CASE_UNLOCKED: Appear when a case is started (via set_flag + unlock_point actions)
 * - QUEST_CHAINED: Discovered during investigation chains (e.g., Tavern → Casino)
 */

const SANDBOX_CASE_ID = 'sandbox_karlsruhe';

const ALWAYS_VISIBLE_POINTS = new Set<string>([
    'loc_ka_agency',
    'loc_ka_platz'
]);

const GLOBAL_SANDBOX_POINTS = new Set<string>([
    'loc_ka_guild'
]);

export const resolveSandboxPointLifecycle = (pointId: string): PointLifecycleConfig => {
    if (ALWAYS_VISIBLE_POINTS.has(pointId)) {
        return {
            scope: 'global',
            retentionPolicy: 'permanent',
            caseId: null,
            defaultState: 'discovered',
            active: true
        };
    }

    if (GLOBAL_SANDBOX_POINTS.has(pointId)) {
        return {
            scope: 'progression',
            retentionPolicy: 'persistent_on_unlock',
            caseId: SANDBOX_CASE_ID,
            defaultState: 'locked',
            active: true
        };
    }

    // All other points are case-scoped and start locked
    return {
        scope: 'case',
        retentionPolicy: 'temporary',
        caseId: SANDBOX_CASE_ID,
        defaultState: 'locked',
        active: true
    };
};
