import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import type { DeductionResult } from '../lib/deductions';

export interface ConclusionItem {
    id: string;
    result: DeductionResult;
    confidence?: number;
    conflictsWith?: string[];
}

interface ConclusionPanelProps {
    conclusions: ConclusionItem[];
}

const RESULT_ICONS: Record<string, string> = {
    new_evidence: 'search',
    unlock_point: 'map',
    add_flag: 'flag',
    narrative: 'story',
    minigame: 'lab',
    hypothesis: 'idea',
    upgrade_evidence: 'upgrade',
    destroy_evidence: 'drop'
};

const getConfidenceColor = (confidence: number): string => {
    if (confidence < 33) {
        return 'bg-red-500';
    }
    if (confidence <= 66) {
        return 'bg-amber-400';
    }
    return 'bg-emerald-500';
};

export const ConclusionPanel = ({ conclusions }: ConclusionPanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const sortedConclusions = useMemo(() => {
        return [...conclusions].sort((left, right) => {
            const leftPriority = left.result.type === 'hypothesis' ? 0 : 1;
            const rightPriority = right.result.type === 'hypothesis' ? 0 : 1;
            return leftPriority - rightPriority;
        });
    }, [conclusions]);

    if (sortedConclusions.length === 0) return null;

    return (
        <div className="w-full max-w-3xl mx-auto">
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
                    <span className="text-amber-500">diamond</span>
                    <span>Conclusions</span>
                    <span className="text-amber-500">diamond</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400/70 font-mono">
                        {sortedConclusions.length}
                    </span>
                    <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-amber-400"
                    >
                        v
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
                        <div className="max-h-60 overflow-y-auto p-3 space-y-2">
                            {sortedConclusions.map(({ id, result, confidence, conflictsWith }) => {
                                const isHypothesis = result.type === 'hypothesis';
                                const safeConfidence = typeof confidence === 'number' ? Math.max(0, Math.min(100, confidence)) : 50;

                                return (
                                    <motion.div
                                        key={id}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className={cn(
                                            'flex gap-3 p-2 border-b border-amber-900/20 last:border-0',
                                            isHypothesis && 'relative border-l-2 border-l-amber-500/50 pl-3'
                                        )}
                                    >
                                        <span className="text-xs shrink-0 mt-0.5 uppercase text-amber-400/80">
                                            {RESULT_ICONS[result.type] ?? 'item'}
                                        </span>
                                        <div className="min-w-0 w-full">
                                            <div className="text-amber-300 font-serif text-sm font-bold">
                                                {isHypothesis
                                                    ? `Hypothesis: ${result.label} (${safeConfidence}%)`
                                                    : result.label}
                                            </div>
                                            <div className="text-amber-100/60 text-xs leading-relaxed">
                                                {result.description}
                                            </div>

                                            {isHypothesis && (
                                                <div className="mt-2">
                                                    <div className="h-1.5 w-full bg-black/40 rounded overflow-hidden">
                                                        <div
                                                            className={cn('h-full transition-all duration-500', getConfidenceColor(safeConfidence))}
                                                            style={{ width: `${safeConfidence}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {isHypothesis && conflictsWith && conflictsWith.length > 0 && (
                                                <div className="mt-2 text-[10px] uppercase tracking-widest text-red-300/70">
                                                    conflicts: {conflictsWith.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
