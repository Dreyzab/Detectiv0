import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import type { DialogueEntry } from './types';
import { logger } from '@repo/shared';

const MAX_HISTORY_LENGTH = 200;
const MAX_DIALOGUE_HISTORY = 50;

interface VNState {
    locale: string;
    activeScenarioId: string | null;
    currentSceneId: string | null;
    history: string[];
    dialogueHistory: DialogueEntry[];

    // Actions
    setLocale: (locale: string) => void;
    startScenario: (scenarioId: string) => void;
    advanceScene: (nextSceneId: string) => void;
    endScenario: () => void;
    resetStore: () => void;

    // Dialogue History
    addDialogueEntry: (entry: Omit<DialogueEntry, 'id' | 'timestamp'>) => void;
    clearDialogueHistory: () => void;
}

type VNPersistedState = Pick<VNState, 'locale' | 'activeScenarioId' | 'currentSceneId' | 'history'>;

const persistConfig: PersistOptions<VNState, VNPersistedState> = {
    name: 'gw4-vn-store',
    version: 2,
    migrate: (persistedState, version) => {
        if (version < 2 && persistedState) {
            // v1 -> v2: Add dialogueHistory (session-only, not persisted)
            const oldState = persistedState as VNPersistedState;
            return {
                ...oldState,
                dialogueHistory: [],
                // Ensure all required action fields exist (will be replaced by store init)
                setLocale: () => { },
                startScenario: () => { },
                advanceScene: () => { },
                endScenario: () => { },
                resetStore: () => { },
                addDialogueEntry: () => { },
                clearDialogueHistory: () => { }
            } as VNState;
        }
        return persistedState as VNState;
    },
    partialize: (state) => ({
        locale: state.locale,
        activeScenarioId: state.activeScenarioId,
        currentSceneId: state.currentSceneId,
        history: state.history
        // Note: dialogueHistory is NOT persisted (session-only)
    })
};

const initialState = {
    locale: 'en',
    activeScenarioId: null as string | null,
    currentSceneId: null as string | null,
    history: [] as string[],
    dialogueHistory: [] as DialogueEntry[]
};

export const useVNStore = create<VNState>()(
    persist(
        (set) => ({
            ...initialState,

            setLocale: (locale) => {
                logger.vn(`Setting locale: ${locale}`);
                set({ locale });
            },

            startScenario: (scenarioId) => {
                logger.vn(`Starting Scenario: ${scenarioId}`);
                set({
                    activeScenarioId: scenarioId,
                    currentSceneId: null,
                    history: [],
                    dialogueHistory: [] // Clear on new scenario
                });
            },

            advanceScene: (nextSceneId) => {
                logger.vn(`Advancing Scene -> ${nextSceneId}`);
                set((state) => ({
                    currentSceneId: nextSceneId,
                    history: [...state.history, nextSceneId].slice(-MAX_HISTORY_LENGTH)
                }));
            },

            endScenario: () => {
                logger.vn("Ending Scenario");
                set({
                    activeScenarioId: null,
                    currentSceneId: null,
                    history: [],
                    dialogueHistory: []
                });
            },

            resetStore: () => set(initialState),

            addDialogueEntry: (entry) => set((state) => ({
                dialogueHistory: [
                    ...state.dialogueHistory,
                    {
                        ...entry,
                        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                        timestamp: Date.now()
                    }
                ].slice(-MAX_DIALOGUE_HISTORY)
            })),

            clearDialogueHistory: () => set({ dialogueHistory: [] })
        }),
        persistConfig
    )
);
