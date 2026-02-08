import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import type { DialogueEntry } from './types';
import { logger } from '@repo/shared';
import i18n from '@/shared/lib/i18n';
import { API_BASE_URL } from '@/shared/api/baseUrl';

const MAX_HISTORY_LENGTH = 200;
const MAX_DIALOGUE_HISTORY = 50;
const RECENT_SCENARIO_RESTART_GUARD_MS = 1200;

let lastEndedScenario: { id: string; endedAt: number } | null = null;

interface VNState {
    locale: string;
    activeScenarioId: string | null;
    currentSceneId: string | null;
    history: string[];
    dialogueHistory: DialogueEntry[];
    choiceHistory: string[]; // Array of "scenarioId:sceneId:choiceId" for visited tracking

    // Actions
    setLocale: (locale: string) => void;
    startScenario: (scenarioId: string) => void;
    advanceScene: (nextSceneId: string) => void;
    endScenario: () => void;
    resetStore: () => void;

    // Dialogue History
    addDialogueEntry: (entry: Omit<DialogueEntry, 'id' | 'timestamp'>) => void;

    // Choice History
    recordChoice: (scenarioId: string, sceneId: string, choiceId: string) => void;
    isChoiceVisited: (scenarioId: string, sceneId: string, choiceId: string) => boolean;

    // Persistence
    exportSave: () => string;
    importSave: (data: string) => void;
    syncToServer: (slotId: number) => Promise<boolean>;
    loadFromServer: (slotId: number) => Promise<boolean>;
}

type VNPersistedState = Pick<VNState, 'locale' | 'activeScenarioId' | 'currentSceneId' | 'history' | 'choiceHistory'>;

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
                choiceHistory: [],
                // Ensure all required action fields exist (will be replaced by store init)
                setLocale: () => { },
                startScenario: () => { },
                advanceScene: () => { },
                endScenario: () => { },
                resetStore: () => { },
                addDialogueEntry: () => { },
                clearDialogueHistory: () => { },
                recordChoice: () => { },
                isChoiceVisited: () => false,
                exportSave: () => "",
                importSave: () => { },
                syncToServer: async () => false,
                loadFromServer: async () => false
            } as VNState;
        }
        return persistedState as VNState;
    },
    partialize: (state) => ({
        locale: state.locale,
        activeScenarioId: state.activeScenarioId,
        currentSceneId: state.currentSceneId,
        history: state.history,
        choiceHistory: state.choiceHistory // Persist visited choices
    })
};

const initialState = {
    locale: 'en',
    activeScenarioId: null as string | null,
    currentSceneId: null as string | null,
    history: [] as string[],
    dialogueHistory: [] as DialogueEntry[],
    choiceHistory: [] as string[]
};

export const useVNStore = create<VNState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setLocale: (locale) => {
                logger.vn(`Setting locale: ${locale}`);
                i18n.changeLanguage(locale);
                set({ locale });
            },

            startScenario: (scenarioId) => {
                if (
                    lastEndedScenario &&
                    lastEndedScenario.id === scenarioId &&
                    Date.now() - lastEndedScenario.endedAt < RECENT_SCENARIO_RESTART_GUARD_MS
                ) {
                    logger.vn(`Ignoring immediate restart for scenario: ${scenarioId}`);
                    return;
                }
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
                const activeId = get().activeScenarioId;
                if (activeId) {
                    lastEndedScenario = {
                        id: activeId,
                        endedAt: Date.now()
                    };
                }
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

            clearDialogueHistory: () => set({ dialogueHistory: [] }),

            // --- Choice History Implementation ---

            recordChoice: (scenarioId, sceneId, choiceId) => {
                const key = `${scenarioId}:${sceneId}:${choiceId}`;
                set((state) => {
                    if (state.choiceHistory.includes(key)) return state;
                    return { choiceHistory: [...state.choiceHistory, key] };
                });
            },

            isChoiceVisited: (scenarioId, sceneId, choiceId) => {
                const key = `${scenarioId}:${sceneId}:${choiceId}`;
                return get().choiceHistory.includes(key);
            },

            // --- Persistence Implementation ---

            exportSave: () => {
                const state = get();
                const data: VNPersistedState = {
                    locale: state.locale,
                    activeScenarioId: state.activeScenarioId,
                    currentSceneId: state.currentSceneId,
                    history: state.history,
                    choiceHistory: state.choiceHistory
                };
                return JSON.stringify(data);
            },

            importSave: (jsonStr: string) => {
                try {
                    const data = JSON.parse(jsonStr) as VNPersistedState;
                    // Validate minimal structure
                    if (typeof data.locale !== 'string') throw new Error("Invalid save data");

                    set({
                        ...initialState,
                        locale: data.locale,
                        activeScenarioId: data.activeScenarioId,
                        currentSceneId: data.currentSceneId,
                        history: data.history || []
                    });
                    logger.vn("Save data imported successfully");
                } catch (e) {
                    logger.error("Failed to import save", { error: e });
                }
            },

            syncToServer: async (slotId: number) => {
                const json = get().exportSave();
                try {
                    const res = await fetch(`${API_BASE_URL}/detective/saves/${slotId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: JSON.parse(json) }) // Double wrap/unwrap to ensure it's sent as object, not string-in-string
                    });
                    return res.ok;
                } catch (e) {
                    logger.error("Sync failed", { error: e });
                    return false;
                }
            },

            loadFromServer: async (slotId: number) => {
                try {
                    const res = await fetch(`${API_BASE_URL}/detective/saves/${slotId}`);
                    if (!res.ok) return false;
                    const json = await res.json();
                    if (json.success && json.data) {
                        get().importSave(JSON.stringify(json.data));
                        return true;
                    }
                    return false;
                } catch (e) {
                    logger.error("Load failed", { error: e });
                    return false;
                }
            }
        }),
        persistConfig
    )
);
