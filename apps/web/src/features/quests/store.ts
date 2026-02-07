
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDossierStore } from '../detective/dossier/store';
import { getQuestStageSequence } from '@repo/shared/data/quests';

import type { Quest, QuestCondition } from './types';
import { getLocalizedText } from './utils';

export interface UserQuestState {
    questId: string;
    status: 'active' | 'completed' | 'failed';
    stage: string;
    completedObjectiveIds: string[];
    completedAt?: number;
}

interface QuestStoreState {
    quests: Record<string, Quest>; // Static data (loaded from server/config)
    userQuests: Record<string, UserQuestState>; // Dynamic state

    // Actions
    registerQuest: (quest: Quest) => void;
    startQuest: (questId: string) => void;
    setQuestStage: (questId: string, stage: string) => void;
    getQuestStage: (questId: string) => string | null;

    // Evaluation (Called by Engine)
    evaluateQuests: (flags: Record<string, boolean>) => void;

    // Debug
    forceCompleteQuest: (questId: string) => void;
    resetQuests: () => void;
}

// --- EVALUATOR LOGIC ---
const checkCondition = (condition: QuestCondition, flags: Record<string, boolean>): boolean => {
    switch (condition.type) {
        case 'flag':
            if (!condition.flag) return false;
            return flags[condition.flag] === (condition.value !== false); // Default true
        case 'logic_and':
            return (condition.conditions || []).every(c => checkCondition(c, flags));
        case 'logic_or':
            return (condition.conditions || []).some(c => checkCondition(c, flags));
        default:
            return false;
    }
};

export const useQuestStore = create<QuestStoreState>()(
    persist(
        (set, get) => ({
            quests: {},
            userQuests: {},

            registerQuest: (quest) => set(state => ({
                quests: { ...state.quests, [quest.id]: quest }
            })),

            startQuest: (questId) => set(state => {
                if (state.userQuests[questId]) return state; // Already active
                const initialStage = state.quests[questId]?.initialStage ?? 'not_started';
                return {
                    userQuests: {
                        ...state.userQuests,
                        [questId]: {
                            questId,
                            status: 'active',
                            stage: initialStage,
                            completedObjectiveIds: []
                        }
                    }
                };
            }),

            setQuestStage: (questId, stage) => set(state => {
                const sequence = getQuestStageSequence(questId);
                if (sequence && !sequence.includes(stage)) {
                    console.warn(`[Quest] Invalid stage '${stage}' for quest '${questId}'. Allowed: ${sequence.join(', ')}`);
                    return state;
                }

                const existing = state.userQuests[questId];
                if (existing?.stage === stage) {
                    return state;
                }

                const nextState: UserQuestState = existing
                    ? { ...existing, stage }
                    : {
                        questId,
                        status: 'active',
                        stage,
                        completedObjectiveIds: []
                    };

                console.log(`[Quest] Stage set: ${questId} -> ${stage}`);

                return {
                    userQuests: {
                        ...state.userQuests,
                        [questId]: nextState
                    }
                };
            }),

            getQuestStage: (questId) => get().userQuests[questId]?.stage ?? null,

            evaluateQuests: (flags) => set(state => {
                const updates: Record<string, UserQuestState> = {};
                let hasChanges = false;

                Object.values(state.userQuests).forEach(userQuest => {
                    if (userQuest.status !== 'active') return;

                    const quest = state.quests[userQuest.questId];
                    if (!quest) return;

                    // 1. Check Objectives
                    const newCompletedObjectives = quest.objectives
                        .filter(obj => !userQuest.completedObjectiveIds.includes(obj.id)) // Only check pending
                        .filter(obj => checkCondition(obj.condition, flags))
                        .map(obj => obj.id);

                    if (newCompletedObjectives.length > 0) {
                        hasChanges = true;
                        userQuest = {
                            ...userQuest,
                            completedObjectiveIds: [...userQuest.completedObjectiveIds, ...newCompletedObjectives]
                        };
                    }

                    // 2. Check Quest Completion
                    // Default logic: All objectives completed? 
                    // Or use completionCondition if complex.
                    const allObjectivesDone = quest.objectives.every(obj =>
                        userQuest.completedObjectiveIds.includes(obj.id)
                    );

                    const complexConditionMet = quest.completionCondition
                        ? checkCondition(quest.completionCondition, flags)
                        : true;

                    if (allObjectivesDone && complexConditionMet) {
                        hasChanges = true;
                        updates[userQuest.questId] = {
                            ...userQuest,
                            status: 'completed',
                            completedAt: Date.now()
                        };

                        // Grant Rewards
                        if (quest.rewards.xp) {
                            useDossierStore.getState().grantXp(quest.rewards.xp);
                        }
                        if (quest.rewards.traits) {
                            quest.rewards.traits.forEach(trait =>
                                useDossierStore.getState().addTrait(trait)
                            );
                        }

                        console.log(`🏆 Quest Completed: ${getLocalizedText(quest.title, 'en')}`);
                    } else if (hasChanges) {
                        updates[userQuest.questId] = userQuest;
                    }
                });

                if (!hasChanges) return state;

                return {
                    userQuests: { ...state.userQuests, ...updates }
                };
            }),

            forceCompleteQuest: (questId) => set(state => ({
                userQuests: {
                    ...state.userQuests,
                    [questId]: {
                        questId,
                        status: 'completed',
                        stage: state.userQuests[questId]?.stage ?? state.quests[questId]?.initialStage ?? 'resolved',
                        completedObjectiveIds: state.quests[questId]?.objectives.map(o => o.id) || [],
                        completedAt: Date.now()
                    }
                }
            })),

            resetQuests: () => set({ userQuests: {} })
        }),
        {
            name: 'gw4-quest-store',
            version: 2,
            migrate: (persistedState) => {
                const cast = persistedState as QuestStoreState | undefined;
                if (!cast?.userQuests) {
                    return persistedState;
                }

                const normalized = Object.fromEntries(
                    Object.entries(cast.userQuests).map(([questId, quest]) => [
                        questId,
                        {
                            ...quest,
                            stage: quest.stage ?? 'not_started'
                        }
                    ])
                );

                return {
                    ...cast,
                    userQuests: normalized
                };
            }
        }
    )
);
