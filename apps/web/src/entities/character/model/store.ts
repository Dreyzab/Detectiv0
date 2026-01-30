import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterId } from '@repo/shared/data/characters';

export interface CharacterState {
    id: CharacterId;
    relationship: number; // -100 to 100
    status: 'unknown' | 'met' | 'ally' | 'enemy' | 'deceased';
    flags: Record<string, boolean>;
}

interface CharacterStore {
    characters: Record<string, CharacterState>;

    // Actions
    setRelationship: (id: CharacterId, value: number) => void;
    modifyRelationship: (id: CharacterId, delta: number) => void;
    setCharacterStatus: (id: CharacterId, status: CharacterState['status']) => void;
    setFlag: (id: CharacterId, flag: string, value: boolean) => void;

    // Getters helpers (optional, can just access state directly)
    getCharacter: (id: CharacterId) => CharacterState | undefined;
}

const DEFAULT_STATE: CharacterState = {
    id: 'unknown', // Placeholder
    relationship: 0,
    status: 'unknown',
    flags: {}
};

export const useCharacterStore = create<CharacterStore>()(
    persist(
        (set, get) => ({
            characters: {},

            setRelationship: (id, value) => set((state) => {
                const char = state.characters[id] || { ...DEFAULT_STATE, id };
                return {
                    characters: {
                        ...state.characters,
                        [id]: {
                            ...char,
                            relationship: Math.max(-100, Math.min(100, value))
                        }
                    }
                };
            }),

            modifyRelationship: (id, delta) => set((state) => {
                const char = state.characters[id] || { ...DEFAULT_STATE, id };
                const newValue = (char.relationship || 0) + delta;
                return {
                    characters: {
                        ...state.characters,
                        [id]: {
                            ...char,
                            relationship: Math.max(-100, Math.min(100, newValue))
                        }
                    }
                };
            }),

            setCharacterStatus: (id, status) => set((state) => {
                const char = state.characters[id] || { ...DEFAULT_STATE, id };
                return {
                    characters: {
                        ...state.characters,
                        [id]: { ...char, status }
                    }
                };
            }),

            setFlag: (id, flag, value) => set((state) => {
                const char = state.characters[id] || { ...DEFAULT_STATE, id };
                return {
                    characters: {
                        ...state.characters,
                        [id]: {
                            ...char,
                            flags: { ...char.flags, [flag]: value }
                        }
                    }
                };
            }),

            getCharacter: (id) => get().characters[id]
        }),
        {
            name: 'character-storage',
        }
    )
);
