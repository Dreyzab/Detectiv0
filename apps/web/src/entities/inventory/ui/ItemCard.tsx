import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import type { InventorySlot } from '../model/types';

interface ItemCardProps {
    slot: InventorySlot;
    onClick: (slot: InventorySlot) => void;
    isSelected?: boolean;
}

export const ItemCard = ({ slot, onClick, isSelected }: ItemCardProps) => {
    return (
        <motion.div
            layoutId={slot.itemId}
            onClick={() => onClick(slot)}
            className={cn(
                "relative group cursor-pointer",
                "w-full aspect-[3/4] p-2",
                "bg-white shadow-md transform transition-all duration-300",
                "hover:rotate-1 hover:scale-105 hover:shadow-xl hover:z-10",
                isSelected ? "ring-2 ring-orange-500 rotate-0 scale-105 z-20" : "rotate-[-1deg]"
            )}
        >
            {/* Paperclip visual */}
            <div className="absolute -top-3 right-4 w-4 h-8 bg-zinc-400 rounded-full border-2 border-zinc-500 z-20 shadow-sm" />

            {/* Photo/Content Area */}
            <div className="w-full h-3/5 bg-stone-200 overflow-hidden relative mb-2 border border-stone-300">
                {/* Placeholder for real image or emoji */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {slot.item.icon || "📦"}
                </div>
            </div>

            {/* Label (Typewriter style) */}
            <div className="font-mono text-xs text-stone-900 leading-tight">
                <div className="font-bold uppercase tracking-tighter mb-1 line-clamp-2 h-8">
                    {slot.item.name}
                </div>
                {slot.quantity > 1 && (
                    <div className="absolute bottom-2 right-2 text-red-700 font-bold font-serif text-lg transform -rotate-12 border-2 border-red-800 rounded px-1 min-w-[30px] text-center bg-white/80">
                        x{slot.quantity}
                    </div>
                )}
            </div>

            {/* Usage hint on hover */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
};
