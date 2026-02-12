import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import type { DeductionResult } from '../lib/deductions';

interface ConclusionPanelProps {
    conclusions: Array<{ id: string; result: DeductionResult }>;
}

const RESULT_ICONS: Record<string, string> = {
    new_evidence: '🔍',
    unlock_point: '📍',
    add_flag: '🏴',
    narrative: '📜',
    minigame: '🧪'
};

export const ConclusionPanel = ({ conclusions }: ConclusionPanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (conclusions.length === 0) return null;

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Art Deco border header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'w-full flex items-center justify-between px-4 py-2',
                    'bg-gradient-to-r from-[#2c1810] via-[#3d2518] to-[#2c1810]',
                    'border-t-2 border-b border-amber-600/50',
                    'text-amber-200 font-serif tracking-widest text-sm uppercase',
                    'hover:bg-[#3d2518] transition-colors'
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="text-amber-500">◆</span>
                    <span>Conclusions</span>
                    <span className="text-amber-500">◆</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400/70 font-mono">
                        {conclusions.length}
                    </span>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-amber-400"
                    >
                        ▾
                    </motion.span>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden bg-[#1a1410]/95 border-x border-b border-amber-900/30"
                    >
                        <div className="max-h-48 overflow-y-auto p-3 space-y-2">
                            {conclusions.map(({ id, result }) => (
                                <motion.div
                                    key={id}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex gap-3 p-2 border-b border-amber-900/20 last:border-0"
                                >
                                    <span className="text-lg shrink-0 mt-0.5">
                                        {RESULT_ICONS[result.type] ?? '📋'}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-amber-300 font-serif text-sm font-bold">
                                            {result.label}
                                        </div>
                                        <div className="text-amber-100/60 text-xs leading-relaxed">
                                            {result.description}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
