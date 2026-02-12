import { DEFAULT_PACK_ID } from '@repo/shared/data/pack-meta';
import type { BattleReturnAction, BattleScenario, TurnPhase } from '@repo/shared/data/battle';

export type BattleResumeTarget = {
    scenarioId: string;
    sceneId: string;
    route: string;
};

export type BattleReturnResolution = {
    mapRoute: string;
    fallbackPackId: string;
    actions: BattleReturnAction[];
    resume: BattleResumeTarget | null;
};

export type ResolveBattleReturnInput = {
    scenario: BattleScenario | null;
    turnPhase: TurnPhase;
    returnScenarioId: string | null;
    returnPackId: string | null;
};

export const resolveBattleReturn = ({
    scenario,
    turnPhase,
    returnScenarioId,
    returnPackId
}: ResolveBattleReturnInput): BattleReturnResolution => {
    const mapRoute = returnPackId ? `/city/${returnPackId}/map` : '/map';
    const fallbackPackId = returnPackId ?? DEFAULT_PACK_ID;

    if (!scenario) {
        return {
            mapRoute,
            fallbackPackId,
            actions: [],
            resume: null
        };
    }

    const outcome = turnPhase === 'defeat' ? scenario.onLose : scenario.onWin;
    const resumeSceneId = outcome?.resumeSceneId?.trim();
    const resume =
        returnScenarioId && resumeSceneId
            ? {
                scenarioId: returnScenarioId,
                sceneId: resumeSceneId,
                route: returnPackId
                    ? `/city/${returnPackId}/vn/${returnScenarioId}`
                    : `/vn/${returnScenarioId}`
            }
            : null;

    return {
        mapRoute,
        fallbackPackId,
        actions: outcome?.actions ?? [],
        resume
    };
};

