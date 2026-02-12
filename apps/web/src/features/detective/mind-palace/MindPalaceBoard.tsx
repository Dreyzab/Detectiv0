import { useState, useRef, useMemo, createRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { useDossierStore } from '../dossier/store';
import { DEDUCTION_REGISTRY, type DeductionRecipe } from '../lib/deductions';
import { EvidenceNode } from './EvidenceNode';
import { RedStringCanvas } from './RedStringCanvas';
import { ConclusionPanel } from './ConclusionPanel';
import { useTranslation } from 'react-i18next';

type FeedbackState = {
    type: 'success' | 'failure';
    message: string;
} | null;

export const MindPalaceBoard = () => {
    const evidence = useDossierStore(state => state.evidence);
    const unlockedDeductions = useDossierStore(state => state.unlockedDeductions);
    const combineEvidence = useDossierStore(state => state.combineEvidence);
    const { t } = useTranslation('detective');

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    // Build stable refs for each evidence node
    const nodeRefs = useMemo(() => {
        const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
        evidence.forEach(item => {
            refs[item.id] = createRef<HTMLDivElement>();
        });
        return refs;
    }, [evidence]);

    // Build connections from unlocked deductions
    const connections = useMemo(() => {
        return unlockedDeductions
            .map(id => {
                const recipe = DEDUCTION_REGISTRY[id] as DeductionRecipe | undefined;
                if (!recipe) return null;
                return {
                    id: recipe.id,
                    from: recipe.inputs[0],
                    to: recipe.inputs[1]
                };
            })
            .filter((c): c is NonNullable<typeof c> => c !== null);
    }, [unlockedDeductions]);

    // Build conclusions from unlocked deductions
    const conclusions = useMemo(() => {
        return unlockedDeductions
            .map(id => {
                const recipe = DEDUCTION_REGISTRY[id] as DeductionRecipe | undefined;
                if (!recipe) return null;
                return { id: recipe.id, result: recipe.result };
            })
            .filter((c): c is NonNullable<typeof c> => c !== null);
    }, [unlockedDeductions]);

    // Set of evidence IDs that appear in any solved deduction
    const combinedIds = useMemo(() => {
        const ids = new Set<string>();
        unlockedDeductions.forEach(did => {
            const recipe = DEDUCTION_REGISTRY[did] as DeductionRecipe | undefined;
            if (recipe) {
                recipe.inputs.forEach(id => ids.add(id));
            }
        });
        return ids;
    }, [unlockedDeductions]);

    // Total possible deductions for progress counter
    const totalDeductions = Object.keys(DEDUCTION_REGISTRY).length;

    const handleCardClick = useCallback((id: string) => {
        if (selectedId === null) {
            setSelectedId(id);
            return;
        }

        if (selectedId === id) {
            setSelectedId(null);
            return;
        }

        // Attempt combination
        const result = combineEvidence(selectedId, id);
        if (result) {
            setFeedback({
                type: 'success',
                message: `${result.label}: ${result.description}`
            });
            setTimeout(() => setFeedback(null), 4000);
        } else {
            setFeedback({
                type: 'failure',
                message: t('mindPalace.noConnection', { defaultValue: 'No meaningful connection found.' })
            });
            setTimeout(() => setFeedback(null), 2000);
        }

        setSelectedId(null);
    }, [selectedId, combineEvidence, t]);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Board area */}
            <div
                ref={boardRef}
                className="relative flex-1 overflow-auto p-4 sm:p-6"
            >
                {/* Red string SVG layer */}
                <RedStringCanvas
                    connections={connections}
                    nodeRefs={nodeRefs}
                    containerRef={boardRef}
                />

                {/* Evidence grid */}
                <div className="relative z-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
                    {evidence.length === 0 && (
                        <div className="col-span-full text-center py-16">
                            <p className="text-amber-300/40 font-serif text-lg italic">
                                {t('mindPalace.empty', { defaultValue: 'No evidence collected yet...' })}
                            </p>
                            <p className="text-amber-300/25 font-mono text-xs mt-2">
                                {t('mindPalace.emptyHint', { defaultValue: 'Investigate locations to gather clues.' })}
                            </p>
                        </div>
                    )}
                    {evidence.map(item => (
                        <EvidenceNode
                            key={item.id}
                            ref={nodeRefs[item.id]}
                            item={item}
                            isSelected={selectedId === item.id}
                            isCombined={combinedIds.has(item.id)}
                            onClick={() => handleCardClick(item.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Interaction hint */}
            <AnimatePresence>
                {evidence.length > 0 && !feedback && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-amber-300/40 font-mono text-xs py-2 tracking-wider"
                    >
                        {selectedId
                            ? t('mindPalace.selectSecond', { defaultValue: 'Now select a second piece of evidence...' })
                            : t('mindPalace.hint', { defaultValue: 'Select two pieces of evidence to combine.' })}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Feedback toast */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            'mx-auto max-w-md px-5 py-3 rounded-lg shadow-2xl border backdrop-blur-md font-serif text-sm text-center mb-2',
                            feedback.type === 'success'
                                ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100'
                                : 'bg-red-900/80 border-red-500/50 text-red-100'
                        )}
                    >
                        {feedback.type === 'success' ? '🔎 ' : '✕ '}
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress counter */}
            <div className="text-center py-1">
                <span className="text-amber-400/50 font-mono text-[10px] tracking-widest uppercase">
                    {t('mindPalace.progress', {
                        solved: unlockedDeductions.length,
                        total: totalDeductions,
                        defaultValue: `${unlockedDeductions.length}/${totalDeductions} Deductions Solved`
                    })}
                </span>
            </div>

            {/* Conclusions panel */}
            <ConclusionPanel conclusions={conclusions} />
        </div>
    );
};
