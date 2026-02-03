import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useCharacterStore } from '@/entities/character/model/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { performSkillCheck } from '@repo/shared/lib/dice';
import { TypedText, type TextToken, type TypedTextHandle } from '@/shared/ui/TypedText/TypedText';
import { EVIDENCE_REGISTRY } from '@/features/detective/registries';
import { ParliamentKeywordCard } from '@/features/detective/ui/ParliamentKeywordCard';
import { getTooltipContent } from '@/features/detective/lib/tooltipRegistry';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { CHARACTERS } from '@repo/shared/data/characters';
import { useCallback, useEffect, useRef, useState } from 'react';
import { soundManager } from '@/shared/lib/audio/SoundManager';
import type { VNChoice } from '@/entities/visual-novel/model/types';
import { ChoiceButton } from './ChoiceButton';

export const VisualNovelOverlay = ({ mode: propMode }: { mode?: 'overlay' | 'fullscreen' }) => {
    const location = useLocation();

    if (location.pathname === '/' || location.pathname.startsWith('/vn')) {
        return null;
    }

    return <VisualNovelOverlayInner mode={propMode} />;
};

const VisualNovelOverlayInner = ({ mode: propMode }: { mode?: 'overlay' | 'fullscreen' }) => {
    const { activeScenarioId, currentSceneId, advanceScene, endScenario, locale, recordChoice, isChoiceVisited } = useVNStore();
    const { setPointState, addEvidence, setFlag, addEntry, recordCheckResult, voiceStats, gainVoiceXp } = useDossierStore();
    const { modifyRelationship, setCharacterStatus } = useCharacterStore();
    const navigate = useNavigate();

    // Refs
    const typedTextRef = useRef<TypedTextHandle>(null);
    const pointerDownAtRef = useRef<number | null>(null);

    const FAST_FORWARD_SPEED = 5;
    const HOLD_TO_SKIP_THRESHOLD_MS = 180;

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'evidence' | 'note' } | null>(null);
    const toastTimeoutRef = useRef<number | null>(null);
    const [activeTooltip, setActiveTooltip] = useState<{ keyword: string; rect: DOMRect } | null>(null);

    const showToast = useCallback((message: string, type: 'evidence' | 'note') => {
        setToast({ message, type });
        if (toastTimeoutRef.current) {
            window.clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3000);
    }, []);

    // 1. Resolve Scenario dynamically from ID + Locale
    const activeScenario = activeScenarioId ? getScenarioById(activeScenarioId, locale) : null;

    // 2. Pick up initial scene if store doesn't have one yet
    // SAFETY: If currentSceneId is set but doesn't exist in the scenario (e.g. stale save), fallback to initial
    let effectiveSceneId = currentSceneId || activeScenario?.initialSceneId || null;

    if (activeScenario && effectiveSceneId && !activeScenario.scenes[effectiveSceneId]) {
        console.warn(`[VN Recovery] Scene '${effectiveSceneId}' not found in scenario '${activeScenario.id}'. Resetting to initial.`);
        effectiveSceneId = activeScenario.initialSceneId;
    }

    const scene = activeScenario?.scenes[effectiveSceneId || ''];
    const sceneChoices = scene?.choices;
    const sceneNextSceneId = scene?.nextSceneId;

    const character = scene?.characterId ? CHARACTERS[scene.characterId] : null;
    const mode = activeScenario?.mode || propMode || 'overlay';
    const isFullscreen = mode === 'fullscreen';

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

    // --- Actions ---
    const handleInteract = (token: TextToken, element?: HTMLElement) => {
        const scenario = activeScenario;
        if (!scenario || !effectiveSceneId) {
            return;
        }

        if (token.type === 'clue' && token.payload) {
            // It's a Clue -> Add to Evidence Inventory
            const evidenceItem = EVIDENCE_REGISTRY[token.payload];
            if (evidenceItem) {
                addEvidence(evidenceItem);
                setFlag(token.payload, true); // Sync: Enable logic checks for this item
                showToast(evidenceItem.name, 'evidence');
                console.log("Toast: Evidence Collected:", evidenceItem.name);
            } else {
                console.warn(`Evidence ID ${token.payload} not found in registry`);
            }
        } else {
            // Check if it's a Parliament Tooltip keyword
            const tooltipContent = getTooltipContent(token.text);
            if (tooltipContent) {
                const rect = element ? element.getBoundingClientRect() : new DOMRect(0, 0, 0, 0);
                setActiveTooltip({ keyword: token.text, rect });
                return;
            }

            // It's a Note -> Add to Notebook Entries
            const id = `${scenario.id}_${effectiveSceneId}_${token.text.replace(/\s+/g, '_').toLowerCase()}`;

            const result = addEntry({
                id,
                type: 'note',
                title: token.text,
                content: `Observed in ${scenario.title}`,
                isLocked: false,
                packId: 'case_01'
            });

            if (result === 'added') {
                showToast(token.text, 'note');
                console.log("Toast: Note Added:", token.text);
            } else {
                console.log("Toast: Note already in notebook");
            }
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
                case 'add_flag':
                    Object.entries(action.payload).forEach(([k, v]) => setFlag(k, v));
                    break;
                case 'start_battle': {
                    endScenario();
                    navigate(`/battle?scenarioId=${action.payload.scenarioId}&deckType=${action.payload.deckType}`);
                    break;
                }
                case 'modify_relationship':
                    modifyRelationship(action.payload.characterId, action.payload.amount);
                    break;
                case 'set_character_status':
                    setCharacterStatus(action.payload.characterId, action.payload.status as import('@/entities/character/model/store').CharacterStatus);
                    break;
            }
        });
    };

    const handleChoice = (choice: VNChoice) => {
        // Record this choice as visited
        if (activeScenarioId && effectiveSceneId) {
            recordChoice(activeScenarioId, effectiveSceneId, choice.id);
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

    const handleGlobalAdvance = (target: EventTarget | null) => {
        // Ignore clicks on buttons/interactive elements to avoid double-firing or conflicts
        if (shouldIgnoreGlobalPointer(target)) {
            return;
        }

        // 1. If typing, finish effectively immediately
        if (typedTextRef.current?.isTyping) {
            typedTextRef.current.finish();
            return;
        }

        // 2. If finished typing and NO CHOICES (or only 'continue' implicit choice), advance
        // We check if the scene has explicit choices.
        if (!scene) return;

        const hasExplicitChoices = sceneChoices && sceneChoices.length > 0;

        if (!hasExplicitChoices) {
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
            className="fixed inset-0 z-[200] flex flex-col cursor-pointer" // Add cursor-pointer to indicate interactivity
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
        >
            <div className="flex-1" />
            <div className="pointer-events-auto p-0 max-w-4xl mx-auto w-full z-10 mb-8 px-4 cursor-default">
                <div className="relative bg-gradient-to-b from-stone-950/30 to-black/60 border-l-[1px] border-l-white/10 rounded-tr-[3rem] p-8 shadow-2xl backdrop-blur-xl min-h-[200px] flex flex-col gap-4">

                    {/* Decorative Backgrounds */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none rounded-tr-[3rem]" />
                    <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-[0.05] mix-blend-overlay pointer-events-none rounded-tr-[3rem]" />

                    {/* Speaker Badge - Connected Floating Label */}
                    {character && (
                        <div className="absolute left-0 -top-5 z-20 flex items-end group">
                            {/* Decorative Connection Line */}
                            <div className="absolute left-8 top-full h-4 w-[2px] bg-amber-500/40" />

                            <div className="relative px-6 py-2 bg-stone-950 border-l-[3px] border-amber-500 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform -skew-x-12 origin-bottom-left transition-transform duration-300 group-hover:-skew-x-6">
                                <div className="transform skew-x-12">
                                    <span className="font-heading font-bold text-lg uppercase tracking-[0.1em] text-[#d4c5a3]">
                                        {character.name}
                                    </span>
                                </div>
                                {/* Corner Accent */}
                                <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-amber-500/60" />
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

                    <div className="font-serif text-lg md:text-xl leading-relaxed text-gray-100 relative z-10 pt-4 cursor-text">
                        <TypedText
                            ref={typedTextRef}
                            text={scene.text}
                            onInteract={handleInteract}
                        />
                    </div>

                    <Choices choiceList={scene.choices} />
                </div>
            </div>
        </div>
    );

    const Choices = ({ choiceList }: { choiceList?: VNChoice[] }) => (
        <div className="flex flex-col gap-2 mt-4 relative z-10">
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
        </div>
    );

    // Fullscreen mode: render only on the dedicated page
    if (isFullscreen) {
        return null;
    }

    return (
        <>
            <OverlayLayout />
            {toast && (
                <div className="fixed top-8 right-8 z-[250] bg-surface border border-primary p-4 shadow-xl animate-bounce-in min-w-[300px]">
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
                    anchorRect={activeTooltip.rect}
                    onClose={() => setActiveTooltip(null)}
                />
            )}
        </>
    );
};
