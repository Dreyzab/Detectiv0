import type { ItemStackDefinition } from '@repo/shared/data/items';

export interface InventorySnapshot {
    money: number;
    items: ItemStackDefinition[];
    updatedAt: string | null;
}

export interface InventorySnapshotResponse {
    success: boolean;
    snapshot?: InventorySnapshot;
    error?: string;
}

export interface SaveInventorySnapshotRequest {
    money: number;
    items: ItemStackDefinition[];
}

export interface SaveInventorySnapshotResponse {
    success: boolean;
    snapshot?: InventorySnapshot;
    error?: string;
}
