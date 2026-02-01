import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_LAB_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_lab_analysis',
    title: 'University Lab Analysis',
    defaultBackgroundUrl: '/images/scenarios/lab_bg.png',
    initialSceneId: 'start',
    mode: 'overlay',
    scenes: {
        'start': {
            id: 'start',
            characterId: 'unknown',
            choices: [
                {
                    id: 'analyze_fabric',
                    nextSceneId: 'analysis_result'
                }
            ]
        },
        'analysis_result': {
            id: 'analysis_result',
            characterId: 'unknown',
            choices: [
                {
                    id: 'take_report',
                    nextSceneId: 'END',
                    actions: [
                        {
                            type: 'grant_evidence',
                            payload: {
                                id: 'ev_lab_report',
                                name: 'Lab Report',
                                description: 'Confirms the fabric comes from Ganter\'s tailor.',
                                packId: 'case_01'
                            }
                        }
                    ]
                }
            ]
        }
    }
};

export default CASE1_LAB_LOGIC;
