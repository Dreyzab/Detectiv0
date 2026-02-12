
import { useEffect, useRef } from 'react';
import { useMapActionHandler } from '../detective/lib/map-action-handler';
import { useDossierStore } from '../detective/dossier/store';
import { useQuestStore } from './store';
import { QUESTS } from './data';
import type { MapAction } from '@repo/shared';

export const useQuestEngine = () => {
    const flags = useDossierStore(state => state.flags);
    const {
        registerQuest,
        startQuest,
        evaluateQuests,
        hydrateFromServer,
        isServerHydrated,
        userQuests
    } = useQuestStore();

    const { executeAction } = useMapActionHandler();
    const previousStages = useRef<Record<string, string>>({});

    // Parse quest action string to MapAction
    const parseQuestAction = (actionStr: string): MapAction | null => {
        const startVnMatch = actionStr.match(/start_vn\(([^)]+)\)/);
        if (startVnMatch) {
            return { type: 'start_vn', scenarioId: startVnMatch[1] };
        }

        const setStageMatch = actionStr.match(/set_quest_stage\(([^,]+),\s*([^)]+)\)/);
        if (setStageMatch) {
            return { type: 'set_quest_stage', questId: setStageMatch[1], stage: setStageMatch[2] };
        }

        const addFlagMatch = actionStr.match(/add_flag\(([^)]+)\)/);
        if (addFlagMatch) {
            return { type: 'set_flag', flagId: addFlagMatch[1], value: true };
        }

        console.warn(`[QuestEngine] Unknown action format: ${actionStr}`);
        return null;
    };

    useEffect(() => {
        Object.values(QUESTS).forEach(quest => {
            registerQuest(quest);
        });
    }, [registerQuest]);

    useEffect(() => {
        void hydrateFromServer();
    }, [hydrateFromServer]);

    useEffect(() => {
        if (!isServerHydrated) {
            return;
        }

        if (!userQuests['case01']) {
            startQuest('case01');
        }
    }, [isServerHydrated, startQuest, userQuests]);

    useEffect(() => {
        if (!isServerHydrated) {
            return;
        }
        evaluateQuests(flags);
    }, [flags, evaluateQuests, isServerHydrated]);

    // Handle Stage Transitions & Trigger Actions
    useEffect(() => {
        if (!isServerHydrated) return;

        Object.entries(userQuests).forEach(([questId, userQuest]) => {
            const previousStage = previousStages.current[questId];
            const currentStage = userQuest.stage;

            // Detect transition
            if (previousStage !== undefined && previousStage !== currentStage) {
                console.log(`[QuestEngine] Transition detected for ${questId}: ${previousStage} -> ${currentStage}`);

                const quest = QUESTS[questId];
                if (quest && quest.stageTransitions) {
                    const transition = quest.stageTransitions.find(
                        t => t.from === previousStage && t.to === currentStage
                    );

                    if (transition && transition.triggerActions) {
                        console.log(`[QuestEngine] Executing actions for ${questId} transition:`, transition.triggerActions);
                        transition.triggerActions.forEach(actionStr => {
                            const action = parseQuestAction(actionStr);
                            if (action) {
                                executeAction(action);
                            }
                        });
                    }
                }
            }

            // Update ref
            previousStages.current[questId] = currentStage;
        });
    }, [userQuests, isServerHydrated, executeAction]);
};
