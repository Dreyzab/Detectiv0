import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDossierStore } from '../detective/dossier/store';
import { getQuestStageSequence } from '@repo/shared/data/quests';
import { api } from '../../shared/api/client';

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
    quests: Record<string, Quest>;
    userQuests: Record<string, UserQuestState>;

    registerQuest: (quest: Quest) => void;
    startQuest: (questId: string) => void;
    setQuestStage: (questId: string, stage: string) => void;
    getQuestStage: (questId: string) => string | null;

    evaluateQuests: (flags: Record<string, boolean>) => void;

    forceCompleteQuest: (questId: string) => void;
    resetQuests: () => void;

    isServerHydrated: boolean;
    isSyncing: boolean;
    syncError: string | null;
    hydrateFromServer: () => Promise<void>;
    syncToServer: () => Promise<void>;
}

const normalizeStatus = (status: string | undefined): UserQuestState['status'] => {
    if (status === 'completed' || status === 'failed') {
        return status;
    }
    return 'active';
};

const normalizeObjectiveIds = (objectiveIds: unknown): string[] => {
    if (!Array.isArray(objectiveIds)) {
        return [];
    }

    const unique = new Set<string>();
    objectiveIds.forEach((value) => {
        if (typeof value !== 'string') {
            return;
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            return;
        }
        unique.add(trimmed);
    });
    return Array.from(unique);
};

const normalizeUserQuests = (
    input: Record<string, Partial<UserQuestState>> | undefined
): Record<string, UserQuestState> => {
    if (!input) {
        return {};
    }

    const result: Record<string, UserQuestState> = {};
    Object.entries(input).forEach(([questIdRaw, quest]) => {
        const questId = questIdRaw.trim();
        if (questId.length === 0) {
            return;
        }

        const completedAt = typeof quest.completedAt === 'number' && Number.isFinite(quest.completedAt)
            ? Math.max(0, Math.floor(quest.completedAt))
            : undefined;

        result[questId] = {
            questId,
            status: normalizeStatus(quest.status),
            stage: typeof quest.stage === 'string' && quest.stage.trim().length > 0
                ? quest.stage
                : 'not_started',
            completedObjectiveIds: normalizeObjectiveIds(quest.completedObjectiveIds),
            completedAt
        };
    });

    return result;
};

const checkCondition = (condition: QuestCondition, flags: Record<string, boolean>): boolean => {
    switch (condition.type) {
        case 'flag':
            if (!condition.flag) return false;
            return flags[condition.flag] === (condition.value !== false);
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
            isServerHydrated: false,
            isSyncing: false,
            syncError: null,

            registerQuest: (quest) => set(state => ({
                quests: { ...state.quests, [quest.id]: quest }
            })),

            startQuest: (questId) => {
                let didMutate = false;
                set(state => {
                    if (state.userQuests[questId]) return state;
                    const initialStage = state.quests[questId]?.initialStage ?? 'not_started';
                    didMutate = true;
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
                });

                if (didMutate && get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            setQuestStage: (questId, stage) => {
                let didMutate = false;
                set(state => {
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

                    didMutate = true;
                    return {
                        userQuests: {
                            ...state.userQuests,
                            [questId]: nextState
                        }
                    };
                });

                if (didMutate && get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            getQuestStage: (questId) => get().userQuests[questId]?.stage ?? null,

            evaluateQuests: (flags) => {
                let didMutate = false;
                set(state => {
                    const updates: Record<string, UserQuestState> = {};
                    let hasAnyChanges = false;

                    Object.values(state.userQuests).forEach((originalQuestState) => {
                        let userQuest = originalQuestState;
                        if (userQuest.status !== 'active') return;

                        const quest = state.quests[userQuest.questId];
                        if (!quest) return;

                        let questChanged = false;

                        const newCompletedObjectives = quest.objectives
                            .filter(obj => !userQuest.completedObjectiveIds.includes(obj.id))
                            .filter(obj => checkCondition(obj.condition, flags))
                            .map(obj => obj.id);

                        if (newCompletedObjectives.length > 0) {
                            questChanged = true;
                            userQuest = {
                                ...userQuest,
                                completedObjectiveIds: [...userQuest.completedObjectiveIds, ...newCompletedObjectives]
                            };
                        }

                        const allObjectivesDone = quest.objectives.every(obj =>
                            userQuest.completedObjectiveIds.includes(obj.id)
                        );

                        const complexConditionMet = quest.completionCondition
                            ? checkCondition(quest.completionCondition, flags)
                            : true;

                        if (allObjectivesDone && complexConditionMet && userQuest.status === 'active') {
                            questChanged = true;
                            userQuest = {
                                ...userQuest,
                                status: 'completed',
                                completedAt: Date.now()
                            };

                            if (quest.rewards.xp) {
                                useDossierStore.getState().grantXp(quest.rewards.xp);
                            }
                            if (quest.rewards.traits) {
                                quest.rewards.traits.forEach(trait =>
                                    useDossierStore.getState().addTrait(trait)
                                );
                            }

                            console.log(`[Quest] Completed: ${getLocalizedText(quest.title, 'en')}`);
                        }

                        if (questChanged) {
                            hasAnyChanges = true;
                            updates[userQuest.questId] = userQuest;
                        }
                    });

                    if (!hasAnyChanges) return state;
                    didMutate = true;
                    return {
                        userQuests: { ...state.userQuests, ...updates }
                    };
                });

                if (didMutate && get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            forceCompleteQuest: (questId) => {
                set(state => ({
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
                }));

                if (get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            resetQuests: () => {
                set({ userQuests: {} });
                if (get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            hydrateFromServer: async () => {
                const current = get();
                if (current.isServerHydrated || current.isSyncing) {
                    return;
                }

                set({ isSyncing: true, syncError: null });
                const { data, error } = await api.quests.snapshot.get();
                if (error || !data?.success) {
                    set({
                        isSyncing: false,
                        isServerHydrated: true,
                        syncError: error?.message ?? data?.error ?? 'Failed to hydrate quests from server'
                    });
                    return;
                }

                const serverUserQuests = normalizeUserQuests(data.userQuests);
                if (Object.keys(serverUserQuests).length > 0) {
                    set({
                        userQuests: serverUserQuests,
                        isSyncing: false,
                        isServerHydrated: true,
                        syncError: null
                    });
                    return;
                }

                set({
                    isSyncing: false,
                    isServerHydrated: true,
                    syncError: null
                });

                if (Object.keys(current.userQuests).length > 0) {
                    void get().syncToServer();
                }
            },

            syncToServer: async () => {
                const state = get();
                if (!state.isServerHydrated) {
                    return;
                }

                const payload = normalizeUserQuests(state.userQuests);
                set({ isSyncing: true, syncError: null });
                const { data, error } = await api.quests.snapshot.post({
                    body: {
                        userQuests: payload
                    }
                });

                if (error || !data?.success) {
                    set({
                        isSyncing: false,
                        syncError: error?.message ?? data?.error ?? 'Failed to sync quests to server'
                    });
                    return;
                }

                set({
                    userQuests: normalizeUserQuests(data.userQuests ?? payload),
                    isSyncing: false,
                    syncError: null
                });
            }
        }),
        {
            name: 'gw4-quest-store',
            version: 3,
            migrate: (persistedState) => {
                const cast = persistedState as { userQuests?: Record<string, Partial<UserQuestState>> } | undefined;
                if (!cast?.userQuests) {
                    return persistedState;
                }

                return {
                    ...cast,
                    userQuests: normalizeUserQuests(cast.userQuests),
                    isServerHydrated: false,
                    isSyncing: false,
                    syncError: null
                };
            }
        }
    )
);
