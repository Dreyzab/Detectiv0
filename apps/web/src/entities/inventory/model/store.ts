import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type VoiceId, VOICE_ORDER } from '../../../features/detective/lib/parliament';
import { api } from '../../../shared/api/client';
import { fromSharedItem, type InventoryItem, type InventorySlot } from './types';
import { ITEM_REGISTRY, STARTER_MONEY, type ItemStackDefinition } from '@repo/shared/data/items';

export type GameMode = 'detective';

const INITIAL_VOICE_LEVELS: Record<VoiceId, number> = VOICE_ORDER.reduce((acc: Record<VoiceId, number>, id: VoiceId) => {
    acc[id] = 0;
    return acc;
}, {} as Record<VoiceId, number>);

const toInventorySlots = (stacks: ItemStackDefinition[]): InventorySlot[] =>
    stacks
        .map((stack) => {
            const definition = ITEM_REGISTRY[stack.itemId];
            if (!definition || stack.quantity <= 0) {
                return null;
            }

            return {
                itemId: stack.itemId,
                quantity: Math.floor(stack.quantity),
                item: fromSharedItem(definition)
            };
        })
        .filter((slot): slot is InventorySlot => slot !== null);

const toItemStacks = (items: InventorySlot[]): ItemStackDefinition[] =>
    items
        .filter((slot) => slot.quantity > 0)
        .map((slot) => ({
            itemId: slot.itemId,
            quantity: Math.floor(slot.quantity)
        }));

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
    useItem: (itemId: string) => Promise<{ success: boolean; message: string }>;

    // Legacy/Detective specific (can be refactored into items[])
    detectiveInventory: Record<string, number>;
    isServerHydrated: boolean;
    isSyncing: boolean;
    syncError: string | null;
    hydrateFromServer: () => Promise<void>;
    syncToServer: () => Promise<void>;
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
            money: STARTER_MONEY,
            items: [],
            detectiveInventory: {},
            isServerHydrated: false,
            isSyncing: false,
            syncError: null,

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
            addItem: (item, quantity = 1) => {
                set((state) => {
                    const existingSlotIndex = state.items.findIndex(slot => slot.itemId === item.id);
                    if (existingSlotIndex >= 0 && item.stackable) {
                        const newItems = [...state.items];
                        newItems[existingSlotIndex].quantity += quantity;
                        return { items: newItems };
                    }
                    // Add new slot
                    return { items: [...state.items, { itemId: item.id, quantity, item }] };
                });

                if (get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            removeItem: (itemId, quantity = 1) => {
                set((state) => {
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
                });

                if (get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            hasItem: (itemId, quantity = 1) => {
                const slot = get().items.find(s => s.itemId === itemId);
                return slot ? slot.quantity >= quantity : false;
            },

            addMoney: (amount) => {
                set((state) => ({ money: state.money + amount }));
                if (get().isServerHydrated) {
                    void get().syncToServer();
                }
            },

            removeMoney: (amount) => {
                const current = get().money;
                if (current >= amount) {
                    set({ money: current - amount });
                    if (get().isServerHydrated) {
                        void get().syncToServer();
                    }
                    return true;
                }
                return false;
            },

            useItem: async (itemId) => {
                const state = get();
                const slot = state.items.find((s) => s.itemId === itemId);
                if (!slot || slot.quantity <= 0) return { success: false, message: 'Item not found' };

                const item = slot.item;

                try {
                    // Dynamic import to avoid circular dependency
                    const { useDossierStore } = await import('../../../features/detective/dossier/store');
                    const dossier = useDossierStore.getState();

                    if (item.effects) {
                        item.effects.forEach((effect) => {
                            switch (effect.type) {
                                case 'grant_xp':
                                    dossier.grantXp(effect.amount);
                                    break;
                                case 'add_flag':
                                    dossier.setFlag(effect.flagId, effect.value ?? true);
                                    break;
                                case 'add_voice_level':
                                    get().addVoiceLevels({
                                        [effect.voiceId]: effect.amount
                                    });
                                    break;
                            }
                        });
                    }
                } catch (error) {
                    console.error('Failed to load dossier store', error);
                }

                // Consume logic
                if (item.type === 'consumable') {
                    get().removeItem(itemId, 1);
                    return { success: true, message: `Used ${item.name}` };
                }

                return { success: true, message: `Inspected ${item.name}` };
            },

            hydrateFromServer: async () => {
                const current = get();
                if (current.isServerHydrated || current.isSyncing) {
                    return;
                }

                set({ isSyncing: true, syncError: null });
                const { data, error } = await api.inventory.snapshot.get();

                if (error || !data?.success || !data.snapshot) {
                    set({
                        isSyncing: false,
                        isServerHydrated: false, // Keep false to retry later
                        syncError: error?.message ?? data?.error ?? 'Failed to hydrate inventory from server',
                        // Do NOT grant starter items on error - this fixes BUG-028
                        // items: state.items, 
                        // money: state.money  
                    });
                    return;
                }

                set({
                    money: data.snapshot.money,
                    items: toInventorySlots(data.snapshot.items),
                    isSyncing: false,
                    isServerHydrated: true,
                    syncError: null
                });
            },

            syncToServer: async () => {
                const state = get();
                if (!state.isServerHydrated) {
                    return;
                }

                set({ isSyncing: true, syncError: null });
                const { data, error } = await api.inventory.snapshot.post({
                    body: {
                        money: state.money,
                        items: toItemStacks(state.items)
                    }
                });

                if (error || !data?.success) {
                    set({
                        isSyncing: false,
                        syncError: error?.message ?? data?.error ?? 'Failed to sync inventory to server'
                    });
                    return;
                }

                set({
                    isSyncing: false,
                    syncError: null
                });
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
                isServerHydrated: false,
                isSyncing: false,
                syncError: null
            }),
        }),
        {
            name: 'gw4-inventory-storage',
            version: 2,
        }
    )
);
