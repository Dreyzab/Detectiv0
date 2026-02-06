import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { useDossierStore } from '@/features/detective/dossier/store';
import { performSkillCheck } from '@repo/shared/lib/dice';
import { MobileVNLayout } from '@/widgets/visual-novel/MobileVNLayout';
import { EVIDENCE_REGISTRY } from '@/features/detective/registries';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { CHARACTERS } from '@repo/shared/data/characters';
import type { VNChoice, VNAction } from '@/entities/visual-novel/model/types';
import type { TextToken } from '@/shared/ui/TypedText/TypedText';
import { ParliamentKeywordCard } from '@/features/detective/ui/ParliamentKeywordCard';
import { PARLIAMENT_TOOLTIP_REGISTRY, getTooltipContent } from '@/features/detective/lib/tooltipRegistry';
import { preloadManager } from '@/shared/lib/preload';
import { OnboardingModal } from '@/features/detective/onboarding/OnboardingModal';
import { useInventoryStore } from '@/entities/inventory/model/store';

/**
 * Fullscreen Visual Novel Page
 * Route: /vn/:scenarioId
 */
export const VisualNovelPage = () => {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const navigate = useNavigate();
    const [activeTooltip, setActiveTooltip] = useState<{ keyword: string; rect: DOMRect } | null>(null);

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

    // Preload next scene backgrounds
    useEffect(() => {
        if (!activeScenario || !scene || !activeScenarioId) return;

        // Collect all possible next scene IDs
        const nextSceneIds = new Set<string>();

        // Auto-advance
        if (scene.nextSceneId && scene.nextSceneId !== 'END') {
            nextSceneIds.add(scene.nextSceneId);
        }

        // Choice destinations (including skill check outcomes)
        scene.choices?.forEach(choice => {
            if (choice.nextSceneId && choice.nextSceneId !== 'END') {
                nextSceneIds.add(choice.nextSceneId);
            }
            if (choice.skillCheck) {
                if (choice.skillCheck.onSuccess?.nextSceneId &&
                    choice.skillCheck.onSuccess.nextSceneId !== 'END') {
                    nextSceneIds.add(choice.skillCheck.onSuccess.nextSceneId);
                }
                if (choice.skillCheck.onFail?.nextSceneId &&
                    choice.skillCheck.onFail.nextSceneId !== 'END') {
                    nextSceneIds.add(choice.skillCheck.onFail.nextSceneId);
                }
            }
        });

        // Preload backgrounds of next scenes
        const assetsToPreload: Array<{ url: string; type: 'image' }> = [];
        nextSceneIds.forEach(nextId => {
            const nextScene = activeScenario.scenes[nextId];
            const bgUrl = nextScene?.backgroundUrl || activeScenario.defaultBackgroundUrl;
            if (bgUrl) {
                assetsToPreload.push({ url: bgUrl, type: 'image' });
            }
        });

        if (assetsToPreload.length > 0) {
            preloadManager.enqueue(
                assetsToPreload,
                `scene:${activeScenarioId}:${effectiveSceneId}`,
                { priority: 0 } // Urgent for next scene
            );
        }
    }, [activeScenario, scene, activeScenarioId, effectiveSceneId]);

    // Handle end scenario - navigate back
    const [showTelegram, setShowTelegram] = useState(false);
    const setPlayerName = useInventoryStore(state => state.setPlayerName);

    // Handle end scenario - navigate back
    const handleEndScenario = () => {
        const wasCreation = activeScenarioId === 'intro_char_creation';

        if (wasCreation) {
            setShowTelegram(true); // Show modal instead of navigating
            return; // Don't end scenario, keep it active so useEffect doesn't restart it
        }

        endScenario();
        navigate('/map'); // Return to map between scenarios
    };

    const handleTelegramComplete = (name: string) => {
        // 1. Set Player Name
        setPlayerName(name);

        // 2. Start Station Arrival (Briefing)
        setShowTelegram(false);

        // Navigate to the new URL which will trigger the useEffect to startScenario
        navigate('/vn/detective_case1_alt_briefing');
    };

    // Token interaction (clues, notes)
    const handleInteract = (token: TextToken, element?: HTMLElement) => {
        if (token.type === 'clue' && token.payload) {
            const evidenceItem = EVIDENCE_REGISTRY[token.payload];
            if (evidenceItem) {
                addEvidence(evidenceItem);
                console.log("Toast: Evidence Collected:", evidenceItem.name);
            } else {
                console.warn(`Evidence ID ${token.payload} not found in registry`);
            }
        } else {
            // Check if it's a Parliament Tooltip keyword
            const tooltipContent = getTooltipContent(token.text);
            if (tooltipContent) {
                // Determine rect
                const rect = element ? element.getBoundingClientRect() : new DOMRect(0, 0, 0, 0); // Fallback
                setActiveTooltip({ keyword: token.text, rect });
                return;
            }

            // Fallback: Add Note
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
                    navigate(`/battle?scenarioId=${action.payload.scenarioId}&deckType=${action.payload.deckType}`);
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

    const parliamentKeys = Object.keys(PARLIAMENT_TOOLTIP_REGISTRY);

    return (
        <>
            {showTelegram && (
                <OnboardingModal
                    onComplete={handleTelegramComplete}
                    onCancel={() => setShowTelegram(false)}
                />
            )}
            <MobileVNLayout
                scene={scene}
                character={character}
                background={background}
                dialogueHistory={dialogueHistory}
                onInteract={handleInteract}
                onChoice={handleChoice}
                onTapAdvance={handleTapAdvance}
                highlightedTerms={parliamentKeys}
            />

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
