
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDossierStore } from '../detective/dossier/store';

// --- TYPES ---
export interface QuestObjective {
    id: string;
    text: string;
    condition: QuestCondition;
    isCompleted?: boolean;
    targetPointId?: string;
}

export type QuestCondition =
    | { type: 'flag'; flag: string; value?: boolean }
    | { type: 'logic_and'; conditions: QuestCondition[] }
    | { type: 'logic_or'; conditions: QuestCondition[] };

export interface Quest {
    id: string;
    title: string;
    description: string;
    objectives: QuestObjective[];
    completionCondition: QuestCondition; // Or simplified 'AND' of all objectives
    rewards: {
        xp: number;
        traits?: string[];
    };
}

export interface UserQuestState {
    questId: string;
    status: 'active' | 'completed' | 'failed';
    completedObjectiveIds: string[];
    completedAt?: number;
}

interface QuestStoreState {
    quests: Record<string, Quest>; // Static data (loaded from server/config)
    userQuests: Record<string, UserQuestState>; // Dynamic state

    // Actions
    registerQuest: (quest: Quest) => void;
    startQuest: (questId: string) => void;

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
            return flags[condition.flag] === (condition.value !== false); // Default true
        case 'logic_and':
            return condition.conditions.every(c => checkCondition(c, flags));
        case 'logic_or':
            return condition.conditions.some(c => checkCondition(c, flags));
        default:
            return false;
    }
};

export const useQuestStore = create<QuestStoreState>()(
    persist(
        (set) => ({
            quests: {},
            userQuests: {},

            registerQuest: (quest) => set(state => ({
                quests: { ...state.quests, [quest.id]: quest }
            })),

            startQuest: (questId) => set(state => {
                if (state.userQuests[questId]) return state; // Already active
                return {
                    userQuests: {
                        ...state.userQuests,
                        [questId]: {
                            questId,
                            status: 'active',
                            completedObjectiveIds: []
                        }
                    }
                };
            }),

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

                        console.log(`🏆 Quest Completed: ${quest.title}`);
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
                        completedObjectiveIds: state.quests[questId]?.objectives.map(o => o.id) || [],
                        completedAt: Date.now()
                    }
                }
            })),

            resetQuests: () => set({ userQuests: {} })
        }),
        {
            name: 'gw4-quest-store',
        }
    )
);
