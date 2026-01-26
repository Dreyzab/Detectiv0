
import type { MapAction } from '@repo/shared';
import { useDossierStore } from '../dossier/store';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { EVIDENCE_REGISTRY } from '../registries';
// import { useNavigate } from 'react-router-dom';

export const useMapActionHandler = () => {
    const { setPointState, addEvidence, setFlag } = useDossierStore();
    const startScenario = useVNStore(state => state.startScenario);
    // const navigate = useNavigate();

    const executeAction = (action: MapAction) => {
        console.log('[MapAction] Executing:', action);

        switch (action.type) {
            case 'start_vn': {
                const scenario = getScenarioById(action.scenarioId);
                if (scenario) {
                    startScenario(scenario);
                } else {
                    console.warn(`Scenario ${action.scenarioId} not found`);
                }
                break;
            }
            case 'unlock_point': {
                setPointState(action.pointId, 'discovered');
                // Removed 'silent' check as it's not in the shared type
                console.log(`Point ${action.pointId} discovered`);
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
            case 'add_fact': {
                // TODO: Implement add_fact in Dossier store
                console.log('Adding fact:', action.factId);
                break;
            }
            case 'start_battle': {
                console.log('Battle start not implemented yet', action.scenarioId);
                break;
            }
            case 'open_trade': {
                console.log('Trade start not implemented yet', action.shopId);
                break;
            }
            case 'teleport': {
                console.log('Teleport not implemented yet', action.targetPointId);
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
