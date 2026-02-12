import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import type { Evidence } from '../dossier/store';

interface EvidenceNodeProps {
    item: Evidence;
    isSelected: boolean;
    isCombined: boolean;
    onClick: () => void;
}

export const EvidenceNode = forwardRef<HTMLDivElement, EvidenceNodeProps>(
    ({ item, isSelected, isCombined, onClick }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={{ scale: 1.06, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                layout
                className={cn(
                    'relative cursor-pointer select-none transition-shadow duration-300',
                    'w-full aspect-[3/4] flex flex-col',
                    // Aged index card aesthetic
                    'bg-gradient-to-br from-[#f5f0e1] to-[#e8dcc8]',
                    'shadow-[2px_4px_12px_rgba(0,0,0,0.4)]',
                    'border border-[#c9b896]',
                    // States
                    isSelected && 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(212,167,69,0.5)] z-20',
                    isCombined && 'ring-1 ring-emerald-500/60'
                )}
            >
                {/* Icon / Image area */}
                <div className="flex-1 overflow-hidden relative bg-[#2c2318]">
                    {item.icon ? (
                        <img
                            src={item.icon}
                            alt={item.name}
                            className="w-full h-full object-cover sepia-[.4] contrast-[1.1] opacity-90"
                            draggable={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl text-amber-700/40 font-serif italic">?</span>
                        </div>
                    )}

                    {/* Combined checkmark badge */}
                    {isCombined && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shadow"
                        >
                            <span className="text-white text-[10px] font-bold">✓</span>
                        </motion.div>
                    )}
                </div>

                {/* Label area */}
                <div className="px-2 py-2 flex items-center justify-center min-h-[40px]">
                    <span className="font-serif text-[#2c1810] font-bold text-center leading-tight text-xs tracking-wide">
                        {item.name}
                    </span>
                </div>

                {/* Selection pin */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-2 -right-2 text-lg drop-shadow-md z-30"
                    >
                        📌
                    </motion.div>
                )}

                {/* Tape effect top */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-amber-100/60 rotate-[-2deg] shadow-sm" />
            </motion.div>
        );
    }
);

EvidenceNode.displayName = 'EvidenceNode';
