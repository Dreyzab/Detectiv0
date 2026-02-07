import type { VNChoice, VNConditionContext, VNConditionPredicate, VNScene, VNScenario } from '../model/types';

const evaluateCondition = (
    condition: VNConditionPredicate,
    flags: Record<string, boolean>,
    context: VNConditionContext
): boolean => {
    try {
        return condition(flags, context);
    } catch (error) {
        console.warn('[VN Runtime] Condition evaluation failed', error);
        return false;
    }
};

export const sceneMeetsPreconditions = (
    scene: VNScene,
    flags: Record<string, boolean>,
    context: VNConditionContext
): boolean => {
    if (!scene.preconditions || scene.preconditions.length === 0) {
        return true;
    }

    return scene.preconditions.every((condition) => evaluateCondition(condition, flags, context));
};

export const choiceIsAvailable = (
    choice: VNChoice,
    flags: Record<string, boolean>,
    context: VNConditionContext
): boolean => {
    if (!choice.condition) {
        return true;
    }

    return evaluateCondition(choice.condition, flags, context);
};

export const filterAvailableChoices = (
    choices: VNChoice[] | undefined,
    flags: Record<string, boolean>,
    context: VNConditionContext
): VNChoice[] | undefined => {
    if (!choices || choices.length === 0) {
        return choices;
    }

    return choices.filter((choice) => choiceIsAvailable(choice, flags, context));
};

export const resolveAccessibleSceneId = (
    scenario: VNScenario,
    candidateSceneId: string,
    flags: Record<string, boolean>,
    context: VNConditionContext
): string | null => {
    const candidate = scenario.scenes[candidateSceneId];
    if (candidate && sceneMeetsPreconditions(candidate, flags, context)) {
        return candidateSceneId;
    }

    const initial = scenario.scenes[scenario.initialSceneId];
    if (initial && sceneMeetsPreconditions(initial, flags, context)) {
        return scenario.initialSceneId;
    }

    for (const [sceneId, scene] of Object.entries(scenario.scenes)) {
        if (sceneMeetsPreconditions(scene, flags, context)) {
            return sceneId;
        }
    }

    return null;
};
