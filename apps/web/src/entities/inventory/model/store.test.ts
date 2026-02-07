import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useInventoryStore } from './store';
import { createItem } from './types';
import type { ItemEffect } from '@repo/shared/data/items';

const mockGrantXp = vi.fn();
const mockSetFlag = vi.fn();

vi.mock('../../../features/detective/dossier/store', () => ({
    useDossierStore: {
        getState: () => ({
            grantXp: mockGrantXp,
            setFlag: mockSetFlag,
        }),
    }
}));

describe('Inventory Store useItem', () => {
    beforeEach(() => {
        useInventoryStore.getState().resetAll();
        vi.clearAllMocks();
    });

    it('should consume a consumable item and grant xp', async () => {
        const item = createItem({
            id: 'test_consumable',
            name: 'Test Potion',
            description: 'Testing',
            type: 'consumable',
            icon: '🧪',
            value: 10,
            effects: [{ type: 'grant_xp', amount: 50 } as ItemEffect]
        });

        useInventoryStore.getState().addItem(item, 1);

        expect(useInventoryStore.getState().items.length).toBe(1);

        const result = await useInventoryStore.getState().useItem('test_consumable');

        expect(result.success).toBe(true);
        expect(result.message).toContain('Used Test Potion');
        expect(useInventoryStore.getState().items.length).toBe(0); // consumed

        expect(mockGrantXp).toHaveBeenCalledWith(50);
    });

    it('should NOT consume a non-consumable item but still apply effects if any', async () => {
        const item = createItem({
            id: 'test_reusable',
            name: 'Magic Orb',
            description: 'Reusable',
            type: 'resource', // non-consumable type
            icon: '🔮',
            value: 100,
            effects: [{ type: 'add_flag', flagId: 'orb_used', value: true } as ItemEffect]
        });

        useInventoryStore.getState().addItem(item, 1);

        const result = await useInventoryStore.getState().useItem('test_reusable');

        expect(result.success).toBe(true);
        expect(result.message).toContain('Inspected Magic Orb');
        expect(useInventoryStore.getState().items.length).toBe(1); // not consumed

        expect(mockSetFlag).toHaveBeenCalledWith('orb_used', true);
    });

    it('should fail if item not found', async () => {
        const result = await useInventoryStore.getState().useItem('non_existent');
        expect(result.success).toBe(false);
    });

    it('should apply add_voice_level effect', async () => {
        const item = createItem({
            id: 'test_voice_boost',
            name: 'Sharp Tonic',
            description: 'Boosts confidence.',
            type: 'consumable',
            icon: '[TONIC]',
            value: 20,
            effects: [{ type: 'add_voice_level', voiceId: 'charisma', amount: 2 } as ItemEffect]
        });

        const before = useInventoryStore.getState().voiceLevels.charisma;
        useInventoryStore.getState().addItem(item, 1);
        const result = await useInventoryStore.getState().useItem('test_voice_boost');
        const after = useInventoryStore.getState().voiceLevels.charisma;

        expect(result.success).toBe(true);
        expect(after).toBe(before + 2);
    });
});
