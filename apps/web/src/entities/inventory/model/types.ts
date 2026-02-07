export type ItemType = 'clue' | 'consumable' | 'key_item' | 'resource' | 'weapon';

export interface InventoryItem {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    icon: string; // Emoji or asset path
    value: number; // For merchant interactions
    stackable?: boolean;
    maxStack?: number;
    metadata?: Record<string, any>;
}

export interface InventorySlot {
    itemId: string;
    quantity: number;
    item: InventoryItem; // Denormalized for easier usage in UI, or we can look it up
}

// Helper to create items (can be moved to a registry later)
export const createItem = (data: Omit<InventoryItem, 'maxStack'>): InventoryItem => ({
    maxStack: data.stackable ? 99 : 1,
    ...data
});
