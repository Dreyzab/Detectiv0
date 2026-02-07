import { cn } from '@/shared/lib/utils';
import type { InventorySlot } from '../model/types';
import { ItemCard } from './ItemCard';

interface InventoryGridProps {
    items: InventorySlot[];
    onItemClick: (slot: InventorySlot) => void;
    selectedItemId?: string | null;
    className?: string;
}

export const InventoryGrid = ({ items, onItemClick, selectedItemId, className }: InventoryGridProps) => {
    // Determine grid size (e.g. 12 slots minimum)
    const minSlots = 12;
    const slotsToRender = Math.max(minSlots, items.length + 4);
    const emptySlots = Array.from({ length: slotsToRender - items.length });

    return (
        <div className={cn("grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6", className)}>
            {items.map((slot) => (
                <ItemCard
                    key={slot.itemId}
                    slot={slot}
                    onClick={onItemClick}
                    isSelected={selectedItemId === slot.itemId}
                />
            ))}

            {/* Empty Slots */}
            {emptySlots.map((_, i) => (
                <div
                    key={`empty-${i}`}
                    className="w-full aspect-[3/4] border-2 border-dashed border-stone-300/50 rounded-sm flex items-center justify-center opacity-30"
                >
                    <span className="font-serif text-4xl text-stone-400 select-none">×</span>
                </div>
            ))}
        </div>
    );
};
