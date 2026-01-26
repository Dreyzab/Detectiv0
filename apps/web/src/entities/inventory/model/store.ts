import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type VoiceId, VOICE_ORDER } from '../../../features/detective/lib/parliament';

export type GameMode = 'detective';

const INITIAL_VOICE_LEVELS: Record<VoiceId, number> = VOICE_ORDER.reduce((acc: Record<VoiceId, number>, id: VoiceId) => {
    acc[id] = 0;
    return acc;
}, {} as Record<VoiceId, number>);

interface InventoryState {
    gameMode: GameMode;
    playerName: string | null;
    voicesVersion: number;
    voiceLevels: Record<VoiceId, number>;
    setGameMode: (mode: GameMode) => void;
    setPlayerName: (name: string) => void;

    // Voice Actions
    getVoiceLevel: (voiceId: VoiceId) => number;
    setVoiceLevel: (voiceId: VoiceId, value: number) => void;
    addVoiceLevels: (partialMap: Partial<Record<VoiceId, number>>) => void;
    resetVoices: () => void;

    // Placeholder for detective inventory (if needed separate items)
    detectiveInventory: Record<string, number>;
}

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            gameMode: 'detective', // Default mode
            playerName: null,
            voicesVersion: 1,
            voiceLevels: INITIAL_VOICE_LEVELS,
            detectiveInventory: {},

            setGameMode: (mode) => set({ gameMode: mode }),
            setPlayerName: (name) => set({ playerName: name }),

            getVoiceLevel: (voiceId) => get().voiceLevels[voiceId] ?? 0,

            setVoiceLevel: (voiceId, value) => set((state) => ({
                voiceLevels: { ...state.voiceLevels, [voiceId]: value }
            })),

            addVoiceLevels: (partialMap) => set((state) => {
                const newLevels = { ...state.voiceLevels };
                Object.entries(partialMap).forEach(([id, val]) => {
                    const voiceId = id as VoiceId;
                    newLevels[voiceId] = (newLevels[voiceId] ?? 0) + (val ?? 0);
                });
                return { voiceLevels: newLevels };
            }),

            resetVoices: () => set({ voiceLevels: INITIAL_VOICE_LEVELS }),
        }),
        {
            name: 'gw4-inventory-storage',
            // Simple migration strategy: if version mismatch, we could reset or patch
            version: 1,
        }
    )
);
