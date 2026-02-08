import { useState, useEffect, useMemo, useRef } from 'react';
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
import { useCharacterStore } from '@/entities/character/model/store';
import { useQuestStore } from '@/features/quests/store';
import { choiceIsAvailable, filterAvailableChoices, resolveAccessibleSceneId } from '@/entities/visual-novel/lib/runtime';
import type { VoiceId } from '@/features/detective/lib/parliament';
import { isQuestAtStage as checkQuestAtStage, isQuestPastStage as checkQuestPastStage } from '@repo/shared/data/quests';

const ONE_SHOT_SCENARIO_COMPLETION_FLAGS: Record<string, string> = {
    intro_char_creation: 'char_creation_complete',
    detective_case1_hbf_arrival: 'arrived_at_hbf',
    detective_case1_map_first_exploration: 'case01_map_exploration_intro_done'
};

/**
 * Fullscreen Visual Novel Page
 * Route: /vn/:scenarioId
 */
export const VisualNovelPage = () => {
    const { scenarioId } = useParams<{ scenarioId: string }>();
    const navigate = useNavigate();
    const [activeTooltip, setActiveTooltip] = useState<{ keyword: string; rect: DOMRect } | null>(null);
    const processedOnEnterRef = useRef<Set<string>>(new Set());
    const processedPassiveChecksRef = useRef<Set<string>>(new Set());
    const suppressUrlScenarioRestartRef = useRef<string | null>(null);

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
        gainVoiceXp,
        flags,
        evidence,
        setVoiceLevel
    } = useDossierStore();
    const { modifyRelationship, setCharacterStatus } = useCharacterStore();
    const userQuests = useQuestStore((state) => state.userQuests);
    const setQuestStage = useQuestStore((state) => state.setQuestStage);

    // Start scenario from URL param if not already active
    useEffect(() => {
        if (!scenarioId) {
            return;
        }

        const completionFlag = ONE_SHOT_SCENARIO_COMPLETION_FLAGS[scenarioId];
        if (completionFlag && flags[completionFlag]) {
            if (activeScenarioId === scenarioId) {
                suppressUrlScenarioRestartRef.current = scenarioId;
                endScenario();
            }
            navigate('/map', { replace: true });
            return;
        }

        if (activeScenarioId === scenarioId) {
            suppressUrlScenarioRestartRef.current = scenarioId;
            return;
        }

        const justEndedSameScenario =
            activeScenarioId === null &&
            suppressUrlScenarioRestartRef.current === scenarioId;

        if (justEndedSameScenario) {
            return;
        }

        startScenario(scenarioId);
        suppressUrlScenarioRestartRef.current = scenarioId;
    }, [scenarioId, activeScenarioId, flags, endScenario, navigate, startScenario]);

    // Resolve Scenario dynamically from ID + Locale
    const activeScenario = activeScenarioId ? getScenarioById(activeScenarioId, locale) : null;
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

    // Pick up initial scene if store doesn't have one yet
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

    // Safety: fallback to initial if scene doesn't exist
    if (activeScenario && effectiveSceneId && !activeScenario.scenes[effectiveSceneId]) {
        console.warn(`[VN Recovery] Scene '${effectiveSceneId}' not found. Resetting to initial.`);
        effectiveSceneId = activeScenario.initialSceneId;
    }

    const scene = activeScenario?.scenes[effectiveSceneId || ''];
    const availableChoices = useMemo(
        () => filterAvailableChoices(scene?.choices, flags, conditionContext),
        [scene?.choices, flags, conditionContext]
    );
    const runtimeScene = useMemo(
        () => (scene ? { ...scene, choices: availableChoices } : undefined),
        [scene, availableChoices]
    );
    const character = scene?.characterId ? CHARACTERS[scene.characterId] : null;
    const background = runtimeScene?.backgroundUrl || activeScenario?.defaultBackgroundUrl;

    // Preload next scene backgrounds
    useEffect(() => {
        if (!activeScenario || !runtimeScene || !activeScenarioId) return;

        // Collect all possible next scene IDs
        const nextSceneIds = new Set<string>();

        // Auto-advance
        if (runtimeScene.nextSceneId && runtimeScene.nextSceneId !== 'END') {
            nextSceneIds.add(runtimeScene.nextSceneId);
        }

        // Choice destinations (including skill check outcomes)
        runtimeScene.choices?.forEach(choice => {
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
    }, [activeScenario, runtimeScene, activeScenarioId, effectiveSceneId]);

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

        if (activeScenarioId === 'detective_case1_qr_scan_bank') {
            suppressUrlScenarioRestartRef.current = activeScenarioId;
            endScenario();
            navigate('/vn/detective_case1_bank_scene');
            return;
        }

        suppressUrlScenarioRestartRef.current = activeScenarioId;
        endScenario();
        navigate('/map'); // Return to map between scenarios
    };

    const handleTelegramComplete = (name: string) => {
        // 1. Set Player Name
        setPlayerName(name);
        setFlag('telegram_acknowledged', true);

        // 2. Start Station Arrival (Briefing)
        setShowTelegram(false);
        suppressUrlScenarioRestartRef.current = activeScenarioId;
        endScenario();

        // Navigate to the new URL which will trigger the useEffect to startScenario
        navigate('/vn/detective_case1_hbf_arrival');
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
                case 'set_quest_stage':
                    setQuestStage(action.payload.questId, action.payload.stage);
                    break;
                case 'start_battle':
                    handleEndScenario();
                    navigate(`/battle?scenarioId=${action.payload.scenarioId}&deckType=${action.payload.deckType}`);
                    break;
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
            }
        });
    };

    useEffect(() => {
        processedOnEnterRef.current.clear();
        processedPassiveChecksRef.current.clear();
    }, [activeScenarioId]);

    useEffect(() => {
        if (!activeScenarioId || !effectiveSceneId || !runtimeScene?.onEnter || runtimeScene.onEnter.length === 0) {
            return;
        }

        const sceneKey = `${activeScenarioId}:${effectiveSceneId}`;
        if (processedOnEnterRef.current.has(sceneKey)) {
            return;
        }

        processedOnEnterRef.current.add(sceneKey);
        executeActions(runtimeScene.onEnter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeScenarioId, effectiveSceneId, runtimeScene?.id]);

    useEffect(() => {
        if (!activeScenarioId || !effectiveSceneId || !runtimeScene?.passiveChecks || runtimeScene.passiveChecks.length === 0) {
            return;
        }

        for (const check of runtimeScene.passiveChecks) {
            const checkKey = `${activeScenarioId}:${effectiveSceneId}:${check.id}`;
            if (processedPassiveChecksRef.current.has(checkKey)) {
                continue;
            }
            processedPassiveChecksRef.current.add(checkKey);

            const level = voiceStats[check.voiceId] || 0;
            const res = performSkillCheck(level, check.difficulty);
            recordCheckResult(check.id, res.success ? 'passed' : 'failed');
            gainVoiceXp(check.voiceId, res.success ? 12 : 6);

            const outcome = res.success ? check.onSuccess : check.onFail;
            executeActions(outcome?.actions);

            const passiveText = res.success ? check.passiveText : check.passiveFailText;
            if (passiveText && passiveText.trim().length > 0) {
                addDialogueEntry({
                    characterName: check.voiceId.toUpperCase(),
                    text: passiveText
                });
            }

            if (outcome?.nextSceneId) {
                advanceScene(outcome.nextSceneId);
                return;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeScenarioId, effectiveSceneId, runtimeScene?.id]);

    // Choice selection
    const handleChoice = (choice: VNChoice) => {
        if (!choiceIsAvailable(choice, flags, conditionContext)) {
            return;
        }

        // Add to history before processing
        addDialogueEntry({
            characterId: runtimeScene?.characterId,
            characterName: character?.name,
            text: runtimeScene?.text || '',
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
        if ((!availableChoices || availableChoices.length === 0) && runtimeScene?.nextSceneId) {
            addDialogueEntry({
                characterId: runtimeScene.characterId,
                characterName: character?.name,
                text: runtimeScene.text
            });

            if (runtimeScene.nextSceneId === 'END') {
                handleEndScenario();
            } else {
                advanceScene(runtimeScene.nextSceneId);
            }
        }
    };

    // Loading / Error state
    if (!activeScenario || !effectiveSceneId || !runtimeScene) {
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
                    onCancel={() => {
                        setShowTelegram(false);
                        suppressUrlScenarioRestartRef.current = activeScenarioId;
                        endScenario();
                        navigate('/', { replace: true });
                    }}
                />
            )}
            <MobileVNLayout
                scene={runtimeScene}
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
