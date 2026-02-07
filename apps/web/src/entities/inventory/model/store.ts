import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type VoiceId, VOICE_ORDER } from '../../../features/detective/lib/parliament';
import type { InventoryItem, InventorySlot } from './types';

export type GameMode = 'detective';

const INITIAL_VOICE_LEVELS: Record<VoiceId, number> = VOICE_ORDER.reduce((acc: Record<VoiceId, number>, id: VoiceId) => {
    acc[id] = 0;
    return acc;
}, {} as Record<VoiceId, number>);

interface InventoryState {
    gameMode: GameMode;
    playerName: string | null;
    detectiveName: string | null;
    isOpen: boolean;
    flags: Record<string, boolean>;
    voiceStats: Record<VoiceId, number>;
    checkStates: Record<string, string>;
    voicesVersion: number;
    voiceLevels: Record<VoiceId, number>;
    setGameMode: (mode: GameMode) => void;
    setPlayerName: (name: string) => void;

    // Voice Actions
    getVoiceLevel: (voiceId: VoiceId) => number;
    setVoiceLevel: (voiceId: VoiceId, value: number) => void;
    addVoiceLevels: (partialMap: Partial<Record<VoiceId, number>>) => void;
    resetVoices: () => void;

    // Inventory Data
    money: number;
    items: InventorySlot[];
    addItem: (item: InventoryItem, quantity?: number) => void;
    removeItem: (itemId: string, quantity?: number) => void;
    hasItem: (itemId: string, quantity?: number) => boolean;
    addMoney: (amount: number) => void;
    removeMoney: (amount: number) => boolean;

    // Legacy/Detective specific (can be refactored into items[])
    detectiveInventory: Record<string, number>;
    resetAll: () => void;
}

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            gameMode: 'detective',
            flags: {},
            detectiveName: null,
            isOpen: false,

            // Stats
            voiceStats: {
                logic: 8, perception: 8, encyclopedia: 8,
                intuition: 8, empathy: 8, imagination: 8,
                authority: 8, charisma: 8, volition: 8,
                endurance: 8, agility: 8, senses: 8,
                stealth: 8, deception: 8, intrusion: 8,
                occultism: 8, tradition: 8, gambling: 8,
            },
            checkStates: {},
            playerName: null,
            voicesVersion: 1,
            voiceLevels: INITIAL_VOICE_LEVELS,

            // New Inventory State
            money: 140, // Starting money for testing
            items: [],
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

            // Inventory Actions
            addItem: (item, quantity = 1) => set((state) => {
                const existingSlotIndex = state.items.findIndex(slot => slot.itemId === item.id);
                if (existingSlotIndex >= 0 && item.stackable) {
                    const newItems = [...state.items];
                    newItems[existingSlotIndex].quantity += quantity;
                    return { items: newItems };
                }
                // Add new slot
                return { items: [...state.items, { itemId: item.id, quantity, item }] };
            }),

            removeItem: (itemId, quantity = 1) => set((state) => {
                const existingSlotIndex = state.items.findIndex(slot => slot.itemId === itemId);
                if (existingSlotIndex === -1) return {}; // Item not found

                const newItems = [...state.items];
                const slot = newItems[existingSlotIndex];

                if (slot.quantity > quantity) {
                    slot.quantity -= quantity;
                } else {
                    // Remove slot entirely
                    newItems.splice(existingSlotIndex, 1);
                }
                return { items: newItems };
            }),

            hasItem: (itemId, quantity = 1) => {
                const slot = get().items.find(s => s.itemId === itemId);
                return slot ? slot.quantity >= quantity : false;
            },

            addMoney: (amount) => set((state) => ({ money: state.money + amount })),

            removeMoney: (amount) => {
                const current = get().money;
                if (current >= amount) {
                    set({ money: current - amount });
                    return true;
                }
                return false;
            },

            resetAll: () => set({
                gameMode: 'detective',
                flags: {},
                detectiveName: null,
                isOpen: false,
                voiceStats: {
                    logic: 8, perception: 8, encyclopedia: 8,
                    intuition: 8, empathy: 8, imagination: 8,
                    authority: 8, charisma: 8, volition: 8,
                    endurance: 8, agility: 8, senses: 8,
                    stealth: 8, deception: 8, intrusion: 8,
                    occultism: 8, tradition: 8, gambling: 8,
                },
                checkStates: {},
                playerName: null,
                voicesVersion: 1,
                voiceLevels: INITIAL_VOICE_LEVELS,
                items: [],
                money: 0,
                detectiveInventory: {},
            }),
        }),
        {
            name: 'gw4-inventory-storage',
            version: 2, // Bumped version for new schema
        }
    )
);
