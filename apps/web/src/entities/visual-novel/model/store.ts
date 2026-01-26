import { create } from 'zustand';
import { type VNScenario } from './types';

interface VNState {
    activeScenario: VNScenario | null;
    currentSceneId: string | null;
    history: string[]; // Log of scene IDs

    // Actions
    startScenario: (scenario: VNScenario) => void;
    advanceScene: (nextSceneId: string) => void;
    endScenario: () => void;
}

export const useVNStore = create<VNState>((set) => ({
    activeScenario: null,
    currentSceneId: null,
    history: [],

    startScenario: (scenario) => set({
        activeScenario: scenario,
        currentSceneId: scenario.initialSceneId,
        history: [scenario.initialSceneId]
    }),

    advanceScene: (nextSceneId) => set((state) => ({
        currentSceneId: nextSceneId,
        history: [...state.history, nextSceneId]
    })),

    endScenario: () => set({
        activeScenario: null,
        currentSceneId: null,
        history: []
    }),
}));
