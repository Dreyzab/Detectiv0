import type { VNScenario, VNScenarioLogic, VNContentPack, VNScene, VNChoice } from '../model/types';
import { DEFAULT_PACK_ID } from '@repo/shared/data/pack-meta';

/**
 * Merges a Logic Graph with a Content Pack to produce a runnable VNScenario.
 * Performs strictly validation in Dev environment.
 */
export const mergeScenario = (
    logic: VNScenarioLogic,
    content: VNContentPack,
    fallbackContent?: VNContentPack
): VNScenario => {

    const mergedScenes: Record<string, VNScene> = {};
    const missingKeys: string[] = [];

    // Iterate over all logic nodes
    Object.values(logic.scenes).forEach(sceneLogic => {
        const sceneContent = content.scenes[sceneLogic.id];
        const fallback = fallbackContent?.scenes[sceneLogic.id];

        // 1. Text Body
        let bodyText = sceneContent?.text;

        if (!bodyText) {
            if (fallback?.text) {
                console.warn(`[Localization] Missing body for scene '${sceneLogic.id}' in '${content.locale}'. Using fallback.`);
                bodyText = fallback.text;
            } else {
                missingKeys.push(`Scene '${sceneLogic.id}' text`);
                bodyText = `[MISSING TEXT: ${sceneLogic.id}]`;
            }
        }

        // 2. Choices
        const mergedChoices: VNChoice[] = [];
        if (sceneLogic.choices) {
            sceneLogic.choices.forEach(choiceLogic => {
                let choiceNumText = sceneContent?.choices?.[choiceLogic.id];

                if (!choiceNumText) {
                    if (fallback?.choices?.[choiceLogic.id]) {
                        console.warn(`[Localization] Missing choice '${choiceLogic.id}' in scene '${sceneLogic.id}' (${content.locale}). Using fallback.`);
                        choiceNumText = fallback.choices[choiceLogic.id];
                    } else {
                        missingKeys.push(`Scene '${sceneLogic.id}' choice '${choiceLogic.id}'`);
                        choiceNumText = `[MISSING CHOICE: ${choiceLogic.id}]`;
                    }
                }

                mergedChoices.push({
                    text: choiceNumText!,
                    // Copy logic properties
                    id: choiceLogic.id,
                    nextSceneId: choiceLogic.nextSceneId || 'END', // Default safety
                    type: choiceLogic.type, // action | inquiry | flavor
                    actions: choiceLogic.actions,
                    condition: choiceLogic.condition,
                    skillCheck: choiceLogic.skillCheck
                });
            });
        }

        // Assemble Final Scene
        mergedScenes[sceneLogic.id] = {
            id: sceneLogic.id,
            characterId: sceneLogic.characterId,
            backgroundUrl: sceneLogic.backgroundUrl,
            nextSceneId: sceneLogic.nextSceneId,
            onEnter: sceneLogic.onEnter,
            preconditions: sceneLogic.preconditions,
            passiveChecks: sceneLogic.passiveChecks,
            text: bodyText,
            choices: mergedChoices.length > 0 ? mergedChoices : undefined
        };
    });

    // Dev-only strict check
    if (import.meta.env.DEV && missingKeys.length > 0) {
        console.error(`[Localization] Scenario '${logic.id}' has missing keys for locale '${content.locale}':`, missingKeys);
    }

    return {
        id: logic.id,
        packId: logic.packId ?? DEFAULT_PACK_ID,
        title: logic.title,
        defaultBackgroundUrl: logic.defaultBackgroundUrl,
        musicUrl: logic.musicUrl,
        initialSceneId: logic.initialSceneId,
        mode: logic.mode,
        scenes: mergedScenes
    };
};
