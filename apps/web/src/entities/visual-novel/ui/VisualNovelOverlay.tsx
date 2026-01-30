import { useVNStore } from '../model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { useCharacterStore } from '@/entities/character/model/store';
import { useNavigate } from 'react-router-dom';
import { performSkillCheck } from '@repo/shared/lib/dice';
import { TypedText, type TextToken } from './TypedText';
import { EVIDENCE_REGISTRY } from '@/features/detective/registries';
import { getScenarioById } from '../scenarios/registry';
import { CHARACTERS } from '@repo/shared/data/characters';
import { useCallback, useEffect, useRef, useState } from 'react';
import { soundManager } from '@/shared/lib/audio/SoundManager';
import type { VNChoice } from '../model/types';

export const VisualNovelOverlay = ({ mode: propMode }: { mode?: 'overlay' | 'fullscreen' }) => {
    const { activeScenarioId, currentSceneId, advanceScene, endScenario, locale } = useVNStore();
    const { setPointState, addEvidence, setFlag, addEntry, recordCheckResult, voiceStats, gainVoiceXp } = useDossierStore();
    const { modifyRelationship, setCharacterStatus } = useCharacterStore();
    const navigate = useNavigate();


    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'evidence' | 'note' } | null>(null);
    const toastTimeoutRef = useRef<number | null>(null);

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

    if (!activeScenario || !effectiveSceneId || !scene) {
        if (activeScenarioId) console.warn('[VN Error] Failed to load scenario or scene', { activeScenario, effectiveSceneId });
        return null;
    }

    // --- Actions ---
    const handleInteract = (token: TextToken) => {
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
            // It's a Note -> Add to Notebook Entries
            const id = `${activeScenario.id}_${effectiveSceneId}_${token.text.replace(/\s+/g, '_').toLowerCase()}`;

            const result = addEntry({
                id,
                type: 'note',
                title: token.text,
                content: `Observed in ${activeScenario.title}`,
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
                    navigate(`/tutorial-battle?scenarioId=${action.payload.scenarioId}&deckType=${action.payload.deckType}`);
                    break;
                }
                case 'modify_relationship':
                    modifyRelationship(action.payload.characterId, action.payload.amount);
                    break;
                case 'set_character_status':
                    // Cast generic string status to the specific union type if known, or just pass it
                    // The store expects 'unknown' | 'met' | 'ally' | 'enemy' | 'deceased'
                    // For now we assume the payload is correct.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setCharacterStatus(action.payload.characterId, action.payload.status as any);
                    break;
            }
        });
    };

    const handleChoice = (choice: import('../model/types').VNChoice) => {
        // Skill Check Logic
        if (choice.skillCheck) {
            const { id, voiceId, difficulty, onSuccess, onFail } = choice.skillCheck;
            const level = voiceStats[voiceId] || 0;
            const res = performSkillCheck(level, difficulty);
            recordCheckResult(id, res.success ? 'passed' : 'failed');

            // Hybrid Progression: Gain Voice XP
            if (res.success) {
                // Success: High XP
                gainVoiceXp(voiceId, 20); // TODO: use RPG_CONFIG.XP_GAIN_ON_CHECK_SUCCESS
                executeActions(onSuccess?.actions);
                advanceScene(onSuccess?.nextSceneId || choice.nextSceneId);
            } else {
                // Failure: Low XP (Learning from failure)
                gainVoiceXp(voiceId, 10); // TODO: use RPG_CONFIG.XP_GAIN_ON_CHECK_FAIL
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

    // --- Renderers ---

    const OverlayLayout = () => (
        <div
            className="fixed inset-0 z-[200] bg-black/80 flex flex-col pointer-events-none"
            onClick={() => soundManager.ensureAudioContext()}
        >
            <div className="flex-1" />
            <div className="pointer-events-auto p-4 md:p-12 pb-12 max-w-5xl mx-auto w-full z-10">
                <div className="bg-surface/95 border border-primary/30 p-6 md:p-8 rounded-sm shadow-2xl backdrop-blur-sm min-h-[200px] flex flex-col gap-4">
                    {character && (
                        <div className="self-start px-4 py-1 bg-surface border border-primary/50 transform -translate-y-10 shadow-lg">
                            <span className="font-serif font-bold text-lg uppercase tracking-widest" style={{ color: character.color }}>
                                {character.name}
                            </span>
                        </div>
                    )}
                    <div className="font-serif text-lg md:text-xl leading-relaxed text-gray-100">
                        <TypedText text={scene.text} onInteract={handleInteract} />
                    </div>
                    <Choices choiceList={scene.choices} />
                </div>
            </div>
        </div>
    );

    const Choices = ({ choiceList, center }: { choiceList?: import('../model/types').VNChoice[], center?: boolean }) => (
        <div className={`flex flex-wrap gap-3 mt-4 ${center ? 'justify-center' : 'justify-end'}`}>
            {choiceList ? (
                choiceList.map((choice) => (
                    <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="px-6 py-3 bg-surface border border-primary/30 hover:bg-primary hover:text-surface transition-colors font-serif text-sm uppercase tracking-widest text-primary"
                    >
                        {choice.skillCheck && (
                            <span className="mr-2 font-bold text-red-400">
                                [{choice.skillCheck.voiceId.toUpperCase()} {choice.skillCheck.difficulty}]
                            </span>
                        )}
                        {choice.text}
                    </button>
                ))
            ) : (
                <button
                    onClick={() => {
                        const continueChoice: VNChoice = {
                            id: 'continue',
                            text: 'Continue',
                            nextSceneId: scene.nextSceneId || 'END'
                        };
                        handleChoice(continueChoice);
                    }}
                    className="px-8 py-3 bg-primary text-surface font-bold font-serif uppercase tracking-widest hover:bg-white transition-colors animate-pulse"
                >
                    Continue ►
                </button>
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
        </>
    );
};
