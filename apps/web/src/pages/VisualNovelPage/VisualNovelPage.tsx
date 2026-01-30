import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { performSkillCheck } from '@repo/shared/lib/dice';
import { MobileVNLayout } from '@/entities/visual-novel/ui/MobileVNLayout';
import { EVIDENCE_REGISTRY } from '@/features/detective/registries';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { CHARACTERS } from '@repo/shared/data/characters';
import type { VNChoice, VNAction } from '@/entities/visual-novel/model/types';
import type { TextToken } from '@/entities/visual-novel/ui/TypedText';

/**
 * Fullscreen Visual Novel Page
 * Route: /vn/:scenarioId
 */
export const VisualNovelPage = () => {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const navigate = useNavigate();

    const {
        activeScenarioId,
        currentSceneId,
        advanceScene,
        endScenario,
        startScenario,
        locale,
        dialogueHistory,
        addDialogueEntry
    } = useVNStore();

    const {
        setPointState,
        addEvidence,
        setFlag,
        addEntry,
        recordCheckResult,
        voiceStats,
        gainVoiceXp
    } = useDossierStore();

    // Start scenario from URL param if not already active
    useEffect(() => {
        if (scenarioId && activeScenarioId !== scenarioId) {
            startScenario(scenarioId);
        }
    }, [scenarioId, activeScenarioId, startScenario]);

    // Resolve Scenario dynamically from ID + Locale
    const activeScenario = activeScenarioId ? getScenarioById(activeScenarioId, locale) : null;

    // Pick up initial scene if store doesn't have one yet
    let effectiveSceneId = currentSceneId || activeScenario?.initialSceneId || null;

    // Safety: fallback to initial if scene doesn't exist
    if (activeScenario && effectiveSceneId && !activeScenario.scenes[effectiveSceneId]) {
        console.warn(`[VN Recovery] Scene '${effectiveSceneId}' not found. Resetting to initial.`);
        effectiveSceneId = activeScenario.initialSceneId;
    }

    const scene = activeScenario?.scenes[effectiveSceneId || ''];
    const character = scene?.characterId ? CHARACTERS[scene.characterId] : null;
    const background = scene?.backgroundUrl || activeScenario?.defaultBackgroundUrl;

    // Handle end scenario - navigate back
    const handleEndScenario = () => {
        endScenario();
        navigate(-1); // Go back to previous page
    };

    // Token interaction (clues, notes)
    const handleInteract = (token: TextToken) => {
        if (token.type === 'clue' && token.payload) {
            const evidenceItem = EVIDENCE_REGISTRY[token.payload];
            if (evidenceItem) {
                addEvidence(evidenceItem);
                console.log("Toast: Evidence Collected:", evidenceItem.name);
            } else {
                console.warn(`Evidence ID ${token.payload} not found in registry`);
            }
        } else {
            const id = `${activeScenarioId}_${effectiveSceneId}_${token.text.replace(/\s+/g, '_').toLowerCase()}`;
            const result = addEntry({
                id,
                type: 'note',
                title: token.text,
                content: `Observed in ${activeScenario?.title || 'Unknown'}`,
                isLocked: false,
                packId: 'case_01'
            });
            if (result === 'added') {
                console.log("Toast: Note Added:", token.text);
            }
        }
    };

    // Execute VN actions
    const executeActions = (actions?: VNAction[]) => {
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
                case 'start_battle':
                    handleEndScenario();
                    navigate(`/tutorial-battle?scenarioId=${action.payload.scenarioId}&deckType=${action.payload.deckType}`);
                    break;
            }
        });
    };

    // Choice selection
    const handleChoice = (choice: VNChoice) => {
        // Add to history before processing
        addDialogueEntry({
            characterId: scene?.characterId,
            characterName: character?.name,
            text: scene?.text || '',
            choiceMade: choice.text
        });

        // Skill Check Logic
        if (choice.skillCheck) {
            const { id, voiceId, difficulty, onSuccess, onFail } = choice.skillCheck;
            const level = voiceStats[voiceId] || 0;
            const res = performSkillCheck(level, difficulty);
            recordCheckResult(id, res.success ? 'passed' : 'failed');

            if (res.success) {
                gainVoiceXp(voiceId, 20);
                executeActions(onSuccess?.actions);
                advanceScene(onSuccess?.nextSceneId || choice.nextSceneId);
            } else {
                gainVoiceXp(voiceId, 10);
                executeActions(onFail?.actions);
                if (onFail?.nextSceneId) advanceScene(onFail.nextSceneId);
            }
            return;
        }

        // Standard Choice
        executeActions(choice.actions);
        if (choice.nextSceneId === 'END') {
            handleEndScenario();
        } else {
            advanceScene(choice.nextSceneId);
        }
    };

    // Tap to advance (no choices)
    const handleTapAdvance = () => {
        if (!scene?.choices && scene?.nextSceneId) {
            addDialogueEntry({
                characterId: scene.characterId,
                characterName: character?.name,
                text: scene.text
            });

            if (scene.nextSceneId === 'END') {
                handleEndScenario();
            } else {
                advanceScene(scene.nextSceneId);
            }
        }
    };

    // Loading / Error state
    if (!activeScenario || !effectiveSceneId || !scene) {
        return (
            <div className="fixed inset-0 bg-stone-950 flex items-center justify-center">
                <div className="text-stone-400 text-center">
                    <div className="text-lg mb-2">Loading scenario...</div>
                    <div className="text-sm opacity-60">{scenarioId}</div>
                </div>
            </div>
        );
    }

    return (
        <MobileVNLayout
            scene={scene}
            character={character}
            background={background}
            dialogueHistory={dialogueHistory}
            onInteract={handleInteract}
            onChoice={handleChoice}
            onTapAdvance={handleTapAdvance}
        />
    );
};
