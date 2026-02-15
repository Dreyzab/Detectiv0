import { useState, useRef, useMemo, createRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { useDossierStore } from '../dossier/store';
import { DEDUCTION_REGISTRY, type DeductionRecipe, type DeductionResult } from '../lib/deductions';
import { EvidenceNode } from './EvidenceNode';
import { RedStringCanvas } from './RedStringCanvas';
import { ConclusionPanel, type ConclusionItem } from './ConclusionPanel';
import { ThoughtCloud } from './ThoughtCloud';
import { VoiceOrb } from './VoiceOrb';
import { VOICES } from '../lib/parliament';
import { useTranslation } from 'react-i18next';

type FeedbackState = {
    type: 'success' | 'failure' | 'red_herring';
    message: string;
} | null;

type VoiceFeedbackState = {
    voiceId: keyof typeof VOICES;
    text: string;
    subtitle: string;
    orbState: 'idle' | 'speaking';
    blocked?: boolean;
    requiredVoiceName?: string;
    requiredLevel?: number;
} | null;

const getFallbackResult = (recipe: DeductionRecipe): DeductionResult | null => {
    if (recipe.result) {
        return recipe.result;
    }
    if (recipe.results && recipe.results.length > 0) {
        return recipe.results[0].result;
    }
    return null;
};

const getRecipeTier = (recipe: DeductionRecipe | undefined): 0 | 1 | 2 => {
    if (!recipe) {
        return 0;
    }

    const tiers: number[] = [];
    if (typeof recipe.result?.tier === 'number') {
        tiers.push(recipe.result.tier);
    }
    recipe.results?.forEach((entry) => {
        if (typeof entry.result.tier === 'number') {
            tiers.push(entry.result.tier);
        }
    });

    if (tiers.length === 0) {
        return 0;
    }

    return Math.max(0, Math.min(2, Math.max(...tiers))) as 0 | 1 | 2;
};

export const MindPalaceBoard = () => {
    const evidence = useDossierStore((state) => state.evidence);
    const unlockedDeductions = useDossierStore((state) => state.unlockedDeductions);
    const combineEvidence = useDossierStore((state) => state.combineEvidence);
    const evidenceHistory = useDossierStore((state) => state.evidenceHistory);
    const hypotheses = useDossierStore((state) => state.hypotheses);
    const thoughtPoints = useDossierStore((state) => state.thoughtPoints);
    const requestHint = useDossierStore((state) => state.requestHint);
    const getHintableEvidence = useDossierStore((state) => state.getHintableEvidence);
    const { t } = useTranslation('detective');

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<FeedbackState>(null);
    const [voiceFeedback, setVoiceFeedback] = useState<VoiceFeedbackState>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!voiceFeedback) {
            return;
        }
        const timer = setTimeout(() => {
            setVoiceFeedback(null);
        }, voiceFeedback.blocked ? 6000 : 5000);
        return () => clearTimeout(timer);
    }, [voiceFeedback]);

    const hintableEvidenceIds = getHintableEvidence();

    const evidenceTierMap = useMemo(() => {
        const map: Record<string, 0 | 1 | 2> = {};

        evidence.forEach((entry) => {
            map[entry.id] = 0;
        });

        evidenceHistory.forEach((mutation) => {
            const recipe = mutation.fromDeductionId ? DEDUCTION_REGISTRY[mutation.fromDeductionId] : undefined;
            const recipeTier = getRecipeTier(recipe);
            const mutationTier = mutation.type === 'upgraded' ? Math.max(1, recipeTier) : recipeTier;
            const current = map[mutation.evidenceId] ?? 0;
            map[mutation.evidenceId] = Math.max(current, mutationTier) as 0 | 1 | 2;
        });

        return map;
    }, [evidence, evidenceHistory]);

    const latestMutationMap = useMemo(() => {
        const map: Record<string, { type: 'added' | 'upgraded' | 'destroyed'; timestamp: number }> = {};
        evidenceHistory.forEach((mutation) => {
            const current = map[mutation.evidenceId];
            if (!current || mutation.timestamp >= current.timestamp) {
                map[mutation.evidenceId] = {
                    type: mutation.type,
                    timestamp: mutation.timestamp
                };
            }
        });
        return map;
    }, [evidenceHistory]);

    const nodeRefs = useMemo(() => {
        const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {};
        evidence.forEach((item) => {
            refs[item.id] = createRef<HTMLDivElement>();
        });
        return refs;
    }, [evidence]);

    const connections = useMemo(() => {
        return unlockedDeductions
            .map((id) => {
                const recipe = DEDUCTION_REGISTRY[id] as DeductionRecipe | undefined;
                if (!recipe) return null;
                return {
                    id: recipe.id,
                    from: recipe.inputs[0],
                    to: recipe.inputs[1]
                };
            })
            .filter((connection): connection is NonNullable<typeof connection> => connection !== null);
    }, [unlockedDeductions]);

    const conclusions = useMemo(() => {
        const hypothesisByDeduction = Object.entries(hypotheses).reduce((acc, [hypothesisId, hypothesis]) => {
            acc[hypothesis.deductionId] = { hypothesisId, ...hypothesis };
            return acc;
        }, {} as Record<string, { hypothesisId: string; deductionId: string; resultId: string; label: string; description: string; confidence: number; isRedHerring: boolean; tier: 0 | 1 | 2; voiceModifiers: Record<string, number> }>);

        const items: ConclusionItem[] = unlockedDeductions
            .map((id) => {
                const recipe = DEDUCTION_REGISTRY[id] as DeductionRecipe | undefined;
                if (!recipe) return null;

                const hypothesis = hypothesisByDeduction[id];
                if (hypothesis) {
                    const resultFromRecipe = recipe.result?.id === hypothesis.resultId
                        ? recipe.result
                        : recipe.results?.find((entry) => entry.result.id === hypothesis.resultId)?.result;

                    return {
                        id: hypothesis.hypothesisId,
                        result: resultFromRecipe ?? {
                            type: 'hypothesis',
                            id: hypothesis.resultId,
                            label: hypothesis.label,
                            description: hypothesis.description,
                            tier: hypothesis.tier
                        },
                        confidence: hypothesis.confidence,
                        conflictsWith: recipe.conflictsWith
                    } as ConclusionItem;
                }

                const result = getFallbackResult(recipe);
                if (!result) {
                    return null;
                }

                return {
                    id: recipe.id,
                    result,
                    conflictsWith: recipe.conflictsWith
                } as ConclusionItem;
            })
            .filter((item): item is ConclusionItem => item !== null);

        Object.entries(hypotheses).forEach(([hypothesisId, hypothesis]) => {
            if (items.some((item) => item.id === hypothesisId)) {
                return;
            }
            items.push({
                id: hypothesisId,
                result: {
                    type: 'hypothesis',
                    id: hypothesis.resultId,
                    label: hypothesis.label,
                    description: hypothesis.description,
                    tier: hypothesis.tier
                },
                confidence: hypothesis.confidence
            });
        });

        return items;
    }, [unlockedDeductions, hypotheses]);

    const combinedIds = useMemo(() => {
        const ids = new Set<string>();
        unlockedDeductions.forEach((deductionId) => {
            const recipe = DEDUCTION_REGISTRY[deductionId] as DeductionRecipe | undefined;
            if (recipe) {
                recipe.inputs.forEach((inputId) => ids.add(inputId));
            }
        });
        return ids;
    }, [unlockedDeductions]);

    const totalDeductions = Object.keys(DEDUCTION_REGISTRY).length;

    const showFeedback = useCallback((nextFeedback: FeedbackState, durationMs = 3000) => {
        setFeedback(nextFeedback);
        if (!nextFeedback) {
            return;
        }
        setTimeout(() => setFeedback(null), durationMs);
    }, []);

    const showVoiceReaction = useCallback((voiceId: keyof typeof VOICES, text: string, subtitle: string, orbState: 'idle' | 'speaking', blocked?: boolean, requiredVoiceName?: string, requiredLevel?: number) => {
        setVoiceFeedback({
            voiceId,
            text,
            subtitle,
            orbState,
            blocked,
            requiredVoiceName,
            requiredLevel
        });
    }, []);

    const handleRequestHint = useCallback((evidenceId: string) => {
        const hint = requestHint(evidenceId);

        if (!hint) {
            if (thoughtPoints <= 0) {
                showFeedback({
                    type: 'failure',
                    message: t('mindPalace.noThoughts', { defaultValue: 'No thought points left.' })
                }, 2000);
            } else {
                showFeedback({
                    type: 'failure',
                    message: t('mindPalace.noHint', { defaultValue: 'No hint available for this clue.' })
                }, 2000);
            }
            return;
        }

        showVoiceReaction(hint.voiceId, hint.text, 'Voice Hint', 'speaking');
    }, [requestHint, thoughtPoints, showFeedback, showVoiceReaction, t]);

    const handleCardClick = useCallback((id: string) => {
        if (selectedId === null) {
            setSelectedId(id);
            return;
        }

        if (selectedId === id) {
            setSelectedId(null);
            return;
        }

        const result = combineEvidence(selectedId, id);
        if (result && !result.blocked) {
            const feedbackType = result.isRedHerring ? 'red_herring' : 'success';
            const feedbackDuration = result.isRedHerring ? 4500 : 3500;
            showFeedback({
                type: feedbackType,
                message: `${result.label}: ${result.description}`
            }, feedbackDuration);

            const reaction = result.matchedVoiceReactions[0];
            if (reaction) {
                showVoiceReaction(reaction.voiceId, reaction.text, 'Voice Interjection', 'speaking');
            }
        } else if (result?.blocked) {
            const lockedReaction = result.matchedVoiceReactions[0];
            const lockedText = lockedReaction?.text ?? t('mindPalace.blocked', { defaultValue: 'This deduction path is blocked by a low skill level.' });
            const requiredVoiceName = result.requiredVoice ? VOICES[result.requiredVoice.voiceId].name : undefined;
            const requiredLevel = result.requiredVoice?.minLevel;

            showVoiceReaction(
                lockedReaction?.voiceId ?? result.requiredVoice?.voiceId ?? 'logic',
                lockedText,
                'Locked Check',
                'idle',
                true,
                requiredVoiceName,
                requiredLevel
            );

            showFeedback({
                type: 'failure',
                message: t('mindPalace.lockedShort', { defaultValue: 'Deduction is locked.' })
            }, 2500);
        } else {
            showFeedback({
                type: 'failure',
                message: t('mindPalace.noConnection', { defaultValue: 'No meaningful connection found.' })
            }, 2000);
        }

        setSelectedId(null);
    }, [selectedId, combineEvidence, showFeedback, showVoiceReaction, t]);

    return (
        <div className="flex flex-col h-full w-full">
            <div
                ref={boardRef}
                className="relative flex-1 overflow-auto p-4 sm:p-6"
            >
                <div className="absolute top-2 right-2 z-40 rounded border border-amber-600/40 bg-black/45 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-amber-200">
                    thought: {thoughtPoints}
                </div>

                {voiceFeedback && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                        <VoiceOrb
                            voiceId={voiceFeedback.voiceId}
                            state={voiceFeedback.orbState}
                            size="md"
                        />
                    </div>
                )}

                {voiceFeedback && (
                    <ThoughtCloud
                        voiceId={voiceFeedback.voiceId}
                        text={voiceFeedback.text}
                        subtitle={voiceFeedback.subtitle}
                        isVisible={true}
                    />
                )}

                {voiceFeedback?.blocked && voiceFeedback.requiredVoiceName && (
                    <div className="absolute top-44 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                        <button
                            type="button"
                            className="rounded border border-amber-500/40 bg-black/70 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-amber-200"
                        >
                            Need to develop {voiceFeedback.requiredVoiceName} to level {voiceFeedback.requiredLevel}
                        </button>
                    </div>
                )}

                <RedStringCanvas
                    connections={connections}
                    nodeRefs={nodeRefs}
                    containerRef={boardRef}
                />

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
                    {evidence.map((item) => {
                        const latestMutation = latestMutationMap[item.id];
                        return (
                            <EvidenceNode
                                key={item.id}
                                ref={nodeRefs[item.id]}
                                item={item}
                                isSelected={selectedId === item.id}
                                isCombined={combinedIds.has(item.id)}
                                onClick={() => handleCardClick(item.id)}
                                onContextMenu={(event) => {
                                    event.preventDefault();
                                    handleRequestHint(item.id);
                                }}
                                tier={evidenceTierMap[item.id] ?? 0}
                                mutationType={latestMutation?.type}
                                mutationTimestamp={latestMutation?.timestamp}
                            />
                        );
                    })}
                </div>
            </div>

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

            <div className="flex items-center justify-center gap-2 pb-1">
                <button
                    type="button"
                    disabled={!selectedId || thoughtPoints === 0 || !hintableEvidenceIds.includes(selectedId)}
                    onClick={() => selectedId && handleRequestHint(selectedId)}
                    className={cn(
                        'rounded px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-colors',
                        selectedId && thoughtPoints > 0 && hintableEvidenceIds.includes(selectedId)
                            ? 'border-amber-500/50 bg-amber-950/40 text-amber-100 hover:bg-amber-900/50'
                            : 'border-zinc-700 bg-zinc-900/40 text-zinc-500 cursor-not-allowed'
                    )}
                    title={thoughtPoints === 0
                        ? t('mindPalace.noThoughts', { defaultValue: 'No thought points left.' })
                        : t('mindPalace.askVoices', { defaultValue: 'Ask voices (-1 thought).' })}
                >
                    {t('mindPalace.askVoices', { defaultValue: 'Ask voices (-1 thought)' })}
                </button>
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                            'mx-auto max-w-md px-5 py-3 rounded-lg shadow-2xl border backdrop-blur-md font-serif text-sm text-center mb-2',
                            feedback.type === 'success' && 'bg-emerald-900/80 border-emerald-500/50 text-emerald-100',
                            feedback.type === 'failure' && 'bg-red-900/80 border-red-500/50 text-red-100',
                            feedback.type === 'red_herring' && 'bg-zinc-900/90 border-zinc-600/60 text-zinc-200'
                        )}
                    >
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-center py-1">
                <span className="text-amber-400/50 font-mono text-[10px] tracking-widest uppercase">
                    {t('mindPalace.progress', {
                        solved: unlockedDeductions.length,
                        total: totalDeductions,
                        defaultValue: `${unlockedDeductions.length}/${totalDeductions} Deductions Solved`
                    })}
                </span>
            </div>

            <ConclusionPanel conclusions={conclusions} />
        </div>
    );
};
