import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useTensionStore } from '@/features/detective/interrogation/tensionStore';
import { TensionHUD } from '@/features/detective/interrogation/ui/TensionHUD';
import { useCharacterStore } from '@/entities/character/model/store';
import { useQuestStore } from '@/features/quests/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { performSkillCheck } from '@repo/shared/lib/dice';
import { TypedText, type TextToken, type TypedTextHandle } from '@/shared/ui/TypedText/TypedText';
import { EVIDENCE_REGISTRY } from '@/features/detective/registries';
import { ParliamentKeywordCard } from '@/features/detective/ui/ParliamentKeywordCard';
import { getTooltipContent } from '@/features/detective/lib/tooltipRegistry';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { CHARACTERS } from '@repo/shared/data/characters';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { soundManager } from '@/shared/lib/audio/SoundManager';
import type { VNChoice } from '@/entities/visual-novel/model/types';
import { ChoiceButton } from './ChoiceButton';
import { MindPalaceOverlay } from '@/features/detective/mind-palace/MindPalaceOverlay';
import { choiceIsAvailable, filterAvailableChoices, resolveAccessibleSceneId } from '@/entities/visual-novel/lib/runtime';
import type { VoiceId } from '@/features/detective/lib/parliament';
import { isQuestAtStage as checkQuestAtStage, isQuestPastStage as checkQuestPastStage } from '@repo/shared/data/quests';
import { buildNotebookEntryId, resolveTooltipKeyword } from '@/entities/visual-novel/lib/interactiveToken';
import { DEFAULT_PACK_ID } from '@repo/shared/data/pack-meta';
import { isOneShotScenarioComplete } from '@/entities/visual-novel/lib/oneShotScenarios';
import { AnimatePresence, motion } from 'framer-motion';
import { resolveUnlockGroupPointIds } from '@/features/detective/lib/unlock-group';

export const VisualNovelOverlay = () => {
    const location = useLocation();

    if (location.pathname === '/' || location.pathname.startsWith('/vn')) {
        return null;
    }

    return <VisualNovelOverlayInner />;
};

const VisualNovelOverlayInner = () => {
    const { activeScenarioId, currentSceneId, advanceScene, endScenario, locale, recordChoice, isChoiceVisited } = useVNStore();
    const { setPointState, addEvidence, setFlag, addEntry, recordCheckResult, voiceStats, gainVoiceXp, flags, evidence, setVoiceLevel } = useDossierStore();
    const tensionStore = useTensionStore();
    const { modifyRelationship, setCharacterStatus } = useCharacterStore();
    const userQuests = useQuestStore((state) => state.userQuests);
    const setQuestStage = useQuestStore((state) => state.setQuestStage);
    const navigate = useNavigate();

    // Refs
    const typedTextRef = useRef<TypedTextHandle>(null);
    const pointerDownAtRef = useRef<number | null>(null);
    const overlayCardRef = useRef<HTMLDivElement | null>(null);
    const processedOnEnterRef = useRef<Set<string>>(new Set());

    const FAST_FORWARD_SPEED = 5;
    const HOLD_TO_SKIP_THRESHOLD_MS = 180;

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'evidence' | 'note' } | null>(null);
    const toastTimeoutRef = useRef<number | null>(null);
    const [activeTooltip, setActiveTooltip] = useState<{ keyword: string; rect: DOMRect } | null>(null);

    // Typing State for Animation Control
    const [isTyping, setIsTyping] = useState(true);

    const showToast = useCallback((message: string, type: 'evidence' | 'note') => {
        setToast({ message, type });
        if (toastTimeoutRef.current) {
            window.clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3000);
    }, []);

    // 1. Resolve Scenario dynamically from ID + Locale
    const activeScenario = activeScenarioId ? getScenarioById(activeScenarioId, locale) : null;
    const activePackId = activeScenario?.packId ?? DEFAULT_PACK_ID;
    const evidenceIds = useMemo(() => new Set(evidence.map((item) => item.id)), [evidence]);
    const questStages = useMemo(() => {
        const stages: Record<string, string> = {};
        for (const [questId, questState] of Object.entries(userQuests)) {
            if (questState.stage) {
                stages[questId] = questState.stage;
            }
        }
        return stages;
    }, [userQuests]);
    const conditionContext = useMemo(
        () => ({
            evidenceIds,
            hasEvidence: (evidenceId: string) => evidenceIds.has(evidenceId),
            questStages,
            isQuestAtStage: (questId: string, stage: string) =>
                checkQuestAtStage(questId, questStages[questId], stage),
            isQuestPastStage: (questId: string, stage: string) =>
                checkQuestPastStage(questId, questStages[questId], stage)
        }),
        [evidenceIds, questStages]
    );

    useEffect(() => {
        if (!activeScenarioId) {
            return;
        }

        if (isOneShotScenarioComplete(activeScenarioId, flags)) {
            endScenario();
        }
    }, [activeScenarioId, flags, endScenario]);

    // 2. Pick up initial scene if store doesn't have one yet
    const requestedSceneId = currentSceneId || activeScenario?.initialSceneId || null;
    let effectiveSceneId = requestedSceneId;

    if (activeScenario && requestedSceneId) {
        const resolvedSceneId = resolveAccessibleSceneId(activeScenario, requestedSceneId, flags, conditionContext);
        if (!resolvedSceneId) {
            console.warn(`[VN Recovery] No accessible scene found in scenario '${activeScenario.id}'.`);
            effectiveSceneId = null;
        } else {
            if (resolvedSceneId !== requestedSceneId) {
                console.warn(`[VN Recovery] Scene '${requestedSceneId}' blocked by preconditions in scenario '${activeScenario.id}'. Using '${resolvedSceneId}'.`);
            }
            effectiveSceneId = resolvedSceneId;
        }
    }

    if (activeScenario && effectiveSceneId && !activeScenario.scenes[effectiveSceneId]) {
        console.warn(`[VN Recovery] Scene '${effectiveSceneId}' not found in scenario '${activeScenario.id}'. Resetting to initial.`);
        effectiveSceneId = activeScenario.initialSceneId;
    }

    const scene = activeScenario?.scenes[effectiveSceneId || ''];
    const sceneChoices = useMemo(
        () => filterAvailableChoices(scene?.choices, flags, conditionContext),
        [scene?.choices, flags, conditionContext]
    );
    const sceneNextSceneId = scene?.nextSceneId;

    const character = scene?.characterId ? CHARACTERS[scene.characterId] : null;

    // 3. Audio Effect
    useEffect(() => {
        if (activeScenario) {
            soundManager.playAmbient(activeScenario.musicUrl || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeScenario?.id, activeScenario?.musicUrl]);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                window.clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    // Reset typing state on scene change
    useEffect(() => {
        // We set to true whenever scene changes so choices hide and text types
        setIsTyping(true);
    }, [activeScenarioId, effectiveSceneId]);

    // Tick interrogation progress on every scene change
    useEffect(() => {
        if (!effectiveSceneId) return;
        if (!tensionStore.targetCharacterId) return;
        tensionStore.tickProgress(voiceStats as Partial<Record<import('@repo/shared/data/parliament').VoiceId, number>>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveSceneId]);

    // --- Actions ---
    const handleInteract = (token: TextToken, element?: HTMLElement) => {
        const scenario = activeScenario;
        if (!scenario || !effectiveSceneId) {
            return;
        }

        const tooltipKeyword = resolveTooltipKeyword(
            token,
            (lookupKey) => getTooltipContent(lookupKey, activePackId)
        );

        if (token.type === 'clue' && token.payload) {
            // It's a Clue -> Add to Evidence Inventory
            const evidenceItem = EVIDENCE_REGISTRY[token.payload];
            if (evidenceItem) {
                addEvidence(evidenceItem);
                setFlag(token.payload, true); // Sync: Enable logic checks for this item
                showToast(evidenceItem.name, 'evidence');
                console.log("Toast: Evidence Collected:", evidenceItem.name);
                return;
            } else {
                console.warn(`Evidence ID ${token.payload} not found in registry, falling back to tooltip/note handling`);
            }
        }

        if (tooltipKeyword) {
            const rect = element ? element.getBoundingClientRect() : new DOMRect(0, 0, 0, 0);
            setActiveTooltip({ keyword: tooltipKeyword, rect });
            return;
        }

        // Fallback: save as notebook note to avoid losing interactive content.
        const id = buildNotebookEntryId(scenario.id, effectiveSceneId, token.text);
        const result = addEntry({
            id,
            type: 'note',
            title: token.text,
            content: `Observed in ${scenario.title}`,
            isLocked: false,
            packId: activePackId,
            refId: token.type === 'clue' ? token.payload : undefined
        });

        if (result === 'added') {
            showToast(token.text, 'note');
            console.log("Toast: Note Added:", token.text);
        } else {
            console.log("Toast: Note already in notebook");
        }
    };

    const executeActions = (actions?: import('@/entities/visual-novel/model/types').VNAction[]) => {
        if (!actions) return;
        actions.forEach(action => {
            switch (action.type) {
                case 'grant_evidence':
                    addEvidence(action.payload);
                    break;
                case 'unlock_point':
                    setPointState(action.payload, 'discovered');
                    break;
                case 'unlock_group': {
                    const pointIds = resolveUnlockGroupPointIds(action.payload, activePackId);
                    if (pointIds.length === 0) {
                        console.warn(`[VN Action] unlock_group matched no points: ${action.payload}`);
                        break;
                    }

                    pointIds.forEach((pointId) => setPointState(pointId, 'discovered'));
                    break;
                }
                case 'add_flag':
                    Object.entries(action.payload).forEach(([k, v]) => setFlag(k, v));
                    break;
                case 'set_quest_stage':
                    setQuestStage(action.payload.questId, action.payload.stage);
                    break;
                case 'start_battle': {
                    endScenario();
                    const params = new URLSearchParams({
                        scenarioId: action.payload.scenarioId
                    });
                    if (activeScenarioId) {
                        params.set('returnScenarioId', activeScenarioId);
                    }
                    if (activeScenario?.packId) {
                        params.set('returnPackId', activeScenario.packId);
                    }
                    if (action.payload.deckType) {
                        params.set('deckType', action.payload.deckType);
                    }
                    navigate(`/battle?${params.toString()}`);
                    break;
                }
                case 'modify_relationship':
                    modifyRelationship(action.payload.characterId, action.payload.amount);
                    break;
                case 'set_character_status':
                    setCharacterStatus(action.payload.characterId, action.payload.status as import('@/entities/character/model/store').CharacterStatus);
                    break;
                case 'set_stat':
                    if (action.payload.id in voiceStats) {
                        setVoiceLevel(action.payload.id as VoiceId, action.payload.value);
                    } else {
                        console.warn(`[VN Action] Unknown stat id '${action.payload.id}'`);
                    }
                    break;
                case 'add_heat':
                    console.warn('[VN Action] add_heat is not wired into progression yet', action.payload);
                    break;
                case 'add_tension':
                    tensionStore.applyTensionDelta(action.payload);
                    break;
                case 'grant_influence_point':
                    tensionStore.addInfluencePoints(action.payload);
                    break;
                case 'start_interrogation':
                    tensionStore.startInterrogation({
                        characterId: action.payload.characterId,
                        scenarioId: action.payload.scenarioId ?? activeScenarioId ?? 'global',
                        topicId: action.payload.topicId,
                        lockoutSceneId: action.payload.lockoutSceneId
                    });
                    break;
                case 'end_interrogation':
                    tensionStore.endInterrogation();
                    break;
            }
        });
    };

    useEffect(() => {
        processedOnEnterRef.current.clear();
    }, [activeScenarioId]);

    useEffect(() => {
        if (!activeScenarioId || !effectiveSceneId || !scene?.onEnter || scene.onEnter.length === 0) {
            return;
        }

        const sceneKey = `${activeScenarioId}:${effectiveSceneId}`;
        if (processedOnEnterRef.current.has(sceneKey)) {
            return;
        }

        processedOnEnterRef.current.add(sceneKey);
        executeActions(scene.onEnter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeScenarioId, effectiveSceneId, scene?.id]);

    const handleChoice = (choice: VNChoice) => {
        if (!choiceIsAvailable(choice, flags, conditionContext)) {
            return;
        }

        const applyChoiceTension = (): boolean => {
            if (typeof choice.tensionDelta !== 'number') {
                return false;
            }
            const tensionResult = tensionStore.applyTensionDelta(choice.tensionDelta);
            if (tensionResult.justLockedOut && tensionStore.lockoutSceneId) {
                advanceScene(tensionStore.lockoutSceneId);
                return true;
            }
            return false;
        };

        // Record this choice as visited
        if (activeScenarioId && effectiveSceneId) {
            recordChoice(activeScenarioId, effectiveSceneId, choice.id);
        }

        if (applyChoiceTension()) {
            return;
        }

        // Skill Check Logic
        if (choice.skillCheck) {
            const { id, voiceId, difficulty, onSuccess, onFail } = choice.skillCheck;
            const level = voiceStats[voiceId] || 0;
            const res = performSkillCheck(level, difficulty);
            recordCheckResult(id, res.success ? 'passed' : 'failed');

            // Hybrid Progression: Gain Voice XP
            if (res.success) {
                // Success: High XP
                gainVoiceXp(voiceId, 20);
                executeActions(onSuccess?.actions);
                advanceScene(onSuccess?.nextSceneId || choice.nextSceneId);
            } else {
                // Failure: Low XP (Learning from failure)
                gainVoiceXp(voiceId, 10);
                executeActions(onFail?.actions);
                if (onFail?.nextSceneId) advanceScene(onFail.nextSceneId);
            }
            return;
        }

        // Standard Choice
        executeActions(choice.actions);
        if (choice.nextSceneId === 'END') {
            endScenario();
        } else {
            advanceScene(choice.nextSceneId);
        }
    };

    const shouldIgnoreGlobalPointer = useCallback((target: EventTarget | null) => {
        if (!target) return false;
        const element = target as HTMLElement;
        return Boolean(
            element.closest('button, a, input, textarea, select, [role="button"], [role="link"]') ||
            element.closest('.typed-text-container span[title]')
        );
    }, []);

    const isOverlayCardTarget = useCallback((target: EventTarget | null) => {
        if (!(target instanceof Node)) return false;
        return Boolean(overlayCardRef.current?.contains(target));
    }, []);

    const handleGlobalAdvance = (target: EventTarget | null) => {
        // Ignore clicks on buttons/interactive elements to avoid double-firing or conflicts
        if (shouldIgnoreGlobalPointer(target)) {
            return;
        }

        const shouldPlayAdvanceSound = isOverlayCardTarget(target);

        // 1. If typing, finish effectively immediately
        if (typedTextRef.current?.isTyping) {
            if (shouldPlayAdvanceSound) {
                soundManager.playOverlayAdvance();
            }
            typedTextRef.current.finish();
            return;
        }

        // 2. If finished typing and NO CHOICES (or only 'continue' implicit choice), advance
        // We check if the scene has explicit choices.
        if (!scene) return;

        const hasExplicitChoices = sceneChoices && sceneChoices.length > 0;

        if (!hasExplicitChoices) {
            if (shouldPlayAdvanceSound) {
                soundManager.playOverlayAdvance();
            }
            const continueChoice: VNChoice = {
                id: 'continue',
                text: 'Continue',
                nextSceneId: sceneNextSceneId || 'END'
            };
            handleChoice(continueChoice);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) {
            return;
        }
        if (shouldIgnoreGlobalPointer(e.target)) {
            return;
        }

        pointerDownAtRef.current = performance.now();
        soundManager.ensureAudioContext();

        if (typedTextRef.current?.isTyping) {
            typedTextRef.current.setSpeedOverride(FAST_FORWARD_SPEED);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (pointerDownAtRef.current === null) {
            return;
        }

        const heldMs = performance.now() - pointerDownAtRef.current;
        pointerDownAtRef.current = null;
        typedTextRef.current?.setSpeedOverride(null);

        if (shouldIgnoreGlobalPointer(e.target)) {
            return;
        }

        if (heldMs < HOLD_TO_SKIP_THRESHOLD_MS) {
            handleGlobalAdvance(e.target);
        }
    };

    const handlePointerCancel = () => {
        pointerDownAtRef.current = null;
        typedTextRef.current?.setSpeedOverride(null);
    };

    if (!activeScenario || !effectiveSceneId || !scene) {
        if (activeScenarioId) console.warn('[VN Error] Failed to load scenario or scene', { activeScenario, effectiveSceneId });
        return null;
    }

    // --- Renderers ---

    const OverlayLayout = () => (
        <div
            className="fixed inset-0 z-200 flex flex-col cursor-pointer" // Add cursor-pointer to indicate interactivity
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
        >
            <div className="flex-1" />
            <div className="pointer-events-auto p-0 max-w-4xl mx-auto w-full z-10 mb-8 px-4 cursor-default">
                <motion.div
                    layout
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    ref={overlayCardRef as any}
                    className="relative bg-linear-to-b from-stone-950/30 to-black/60 border-l border-l-white/10 rounded-tr-[3rem] p-8 shadow-2xl backdrop-blur-xl min-h-[200px] flex flex-col gap-4"
                >

                    {/* Decorative Backgrounds */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none rounded-tr-[3rem]" />
                    <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none rounded-tr-[3rem]" />

                    {/* Speaker Badge - Connected Floating Label */}
                    {character && (
                        <div className="absolute left-0 -top-5 z-20 flex items-end group">
                            {/* Decorative Connection Line */}
                            <div className="absolute left-8 top-full h-4 w-[2px] bg-amber-500/40" />

                            <div className="relative px-6 py-2 bg-stone-950 border-l-[3px] border-amber-500 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform -skew-x-12 origin-bottom-left transition-transform duration-300 group-hover:-skew-x-6">
                                <div className="transform skew-x-12">
                                    <span className="font-heading font-bold text-lg uppercase tracking-widest text-[#d4c5a3]">
                                        {character.name}
                                    </span>
                                </div>
                                {/* Corner Accent */}
                                <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-amber-500/60" />
                            </div>
                        </div>
                    )}

                    {/* Scene Context Header */}
                    <div className="absolute top-4 right-8 flex items-center gap-3 text-[10px] font-mono tracking-widest text-stone-500 opacity-60">
                        {activeScenario && (
                            <>
                                <span className="uppercase">{activeScenario.title}</span>
                                <span>//</span>
                            </>
                        )}
                        <span>14:00</span>
                    </div>

                    <motion.div
                        layout="position"
                        className="font-serif text-lg md:text-xl leading-relaxed text-gray-100 relative z-10 pt-4 cursor-text"
                    >
                        <TypedText
                            ref={typedTextRef}
                            text={scene.text}
                            onInteract={handleInteract}
                            onTypingChange={setIsTyping}
                        />
                    </motion.div>

                    <Choices choiceList={sceneChoices} isVisible={!isTyping} />
                </motion.div>
            </div>
        </div>
    );

    const Choices = ({ choiceList, isVisible }: { choiceList?: VNChoice[], isVisible: boolean }) => (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 30, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    className="flex flex-col gap-2 relative z-10 overflow-hidden"
                >
                    {/* Add top spacing inside motion div to animate it cleanly */}
                    <div className="h-4" />

                    {choiceList && choiceList.length > 0 && (
                        choiceList.map((choice, index) => {
                            const isVisited = activeScenarioId && effectiveSceneId
                                ? isChoiceVisited(activeScenarioId, effectiveSceneId, choice.id)
                                : false;

                            return (
                                <ChoiceButton
                                    key={choice.id}
                                    choice={choice}
                                    index={index}
                                    isVisited={isVisited}
                                    onClick={() => handleChoice(choice)}
                                />
                            );
                        })
                    )}
                    {/* Standard "Continue" prompt when no choices */}
                    {(!choiceList || choiceList.length === 0) && (
                        <div className="h-6 animate-pulse mt-2 flex justify-center opacity-50">
                            <span className="text-[10px] font-mono tracking-widest text-stone-500">CLICK TO CONTINUE ▼</span>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <AnimatePresence>
                {tensionStore.targetCharacterId && <TensionHUD />}
            </AnimatePresence>

            <OverlayLayout />

            {/* Mind Palace Layer - Fixed to ensure correct positioning relative to viewport */}
            <div className="fixed inset-0 pointer-events-none z-210">
                <MindPalaceOverlay />
            </div>

            {toast && (
                <div className="fixed top-8 right-8 z-250 bg-surface border border-primary p-4 shadow-xl animate-bounce-in min-w-[300px]">
                    <div className="flex items-center gap-3">
                        <div className={`w-1 h-10 ${toast.type === 'evidence' ? 'bg-accent' : 'bg-primary'}`} />
                        <div>
                            <h4 className={`font-bold font-serif uppercase tracking-widest text-xs mb-1 ${toast.type === 'evidence' ? 'text-accent' : 'text-primary'}`}>
                                {toast.type === 'evidence' ? 'Evidence Collected' : 'Notebook Updated'}
                            </h4>
                            <p className="text-gray-300 text-sm font-mono truncate max-w-[250px]">{toast.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTooltip && (
                <ParliamentKeywordCard
                    keyword={activeTooltip.keyword}
                    packId={activePackId}
                    anchorRect={activeTooltip.rect}
                    onClose={() => setActiveTooltip(null)}
                />
            )}
        </>
    );
};
