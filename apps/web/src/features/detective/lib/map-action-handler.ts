
import type { MapAction } from '@repo/shared';
import { useDossierStore } from '../dossier/store';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { EVIDENCE_REGISTRY } from '../registries';
import { useQuestStore } from '@/features/quests/store';
import { useMerchantUiStore } from '@/features/merchant/model/store';
import { useNavigate } from 'react-router-dom';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { useWorldEngineStore } from '../engine/store';
import { isOneShotScenarioComplete } from '@/entities/visual-novel/lib/oneShotScenarios';
import { getPackMeta } from '@repo/shared/data/pack-meta';
import { resolveRegionMeta } from '@repo/shared/data/regions';
import { useRegionStore } from '@/features/region/model/store';
import { resolveUnlockGroupPointIds } from './unlock-group';

export const useMapActionHandler = () => {
    const {
        setPointState,
        addEvidence,
        setFlag,
        addFlags,
        unlockEntry,
        setActiveCase
    } = useDossierStore();
    const flags = useDossierStore((state) => state.flags);
    const setQuestStage = useQuestStore((state) => state.setQuestStage);
    const openMerchant = useMerchantUiStore((state) => state.openMerchant);
    const setCurrentLocation = useWorldEngineStore((state) => state.setCurrentLocation);
    const setActiveRegion = useRegionStore((state) => state.setActiveRegion);
    const startScenario = useVNStore(state => state.startScenario);
    const locale = useVNStore(state => state.locale);
    const navigate = useNavigate();

    const executeAction = (action: MapAction) => {
        console.log('[MapAction] Executing:', action);

        switch (action.type) {
            case 'start_vn': {
                if (isOneShotScenarioComplete(action.scenarioId, flags)) {
                    console.log('[MapAction] Skipping one-shot VN replay:', action.scenarioId);
                    break;
                }

                startScenario(action.scenarioId);

                // Check if we need to navigate (Fullscreen mode)
                const scenario = getScenarioById(action.scenarioId, locale);
                if (scenario?.mode === 'fullscreen') {
                    if (scenario.packId) {
                        navigate(`/city/${scenario.packId}/vn/${action.scenarioId}`);
                    } else {
                        navigate(`/vn/${action.scenarioId}`);
                    }
                }
                // Otherwise, VisualNovelOverlay will pick it up on the current page
                break;
            }
            case 'unlock_point': {
                setPointState(action.pointId, 'discovered');
                console.log(`Point ${action.pointId} discovered`);
                break;
            }
            case 'unlock_group': {
                const pointIds = resolveUnlockGroupPointIds(action.groupId);
                if (pointIds.length === 0) {
                    console.warn(`[MapAction] unlock_group matched no points: ${action.groupId}`);
                    break;
                }

                pointIds.forEach((pointId) => setPointState(pointId, 'discovered'));
                console.log(`Unlock group ${action.groupId}: ${pointIds.join(', ')}`);
                break;
            }
            case 'grant_evidence': {
                const evidence = EVIDENCE_REGISTRY[action.evidenceId];
                if (evidence) {
                    addEvidence(evidence);
                } else {
                    console.warn(`Evidence ${action.evidenceId} not found in registry`);
                }
                break;
            }
            case 'set_flag': {
                setFlag(action.flagId, action.value);
                break;
            }
            case 'add_flags': {
                const toEnable = Object.fromEntries(action.flags.map((flagId) => [flagId, true]));
                addFlags(toEnable);
                break;
            }
            case 'unlock_entry': {
                unlockEntry(action.entryId);
                break;
            }
            case 'set_active_case': {
                setActiveCase(action.caseId);
                break;
            }
            case 'set_region': {
                const regionMeta = resolveRegionMeta(action.regionId);
                if (!regionMeta) {
                    console.warn('Unknown region id:', action.regionId);
                    break;
                }
                const packMeta = getPackMeta(regionMeta.packId);
                setActiveRegion(regionMeta.id, 'qr');
                setActiveCase(packMeta.defaultCaseId);
                navigate(`/city/${packMeta.packId}/map`);
                break;
            }
            case 'set_quest_stage': {
                setQuestStage(action.questId, action.stage);
                break;
            }
            case 'start_battle': {
                const deckType = action.deckType ? `&deckType=${encodeURIComponent(action.deckType)}` : '';
                navigate(`/battle?scenarioId=${encodeURIComponent(action.scenarioId)}${deckType}`);
                break;
            }
            case 'open_trade': {
                openMerchant(action.shopId);
                break;
            }
            case 'teleport': {
                setCurrentLocation(action.targetPointId);
                setPointState(action.targetPointId, 'visited');
                break;
            }
            case 'show_toast': {
                console.log('Toast:', action.message);
                break;
            }
            default: {
                console.warn('Unknown or unimplemented action type:', (action as { type: string }).type);
                break;
            }
        }
    };

    return { executeAction };
};
