import type { VNScenario } from '../../../../../model/types';

export const CASE1_LAB_SCENE: VNScenario = {
    id: 'detective_case1_lab_analysis',
    title: 'University Lab Analysis',
    defaultBackgroundUrl: '/images/scenarios/lab_bg.jpg', // Placeholder
    initialSceneId: 'start',
    mode: 'overlay',
    scenes: {
        'start': {
            id: 'start',
            text: 'The [[microscope]] sits ready on the workbench. Prof. Stein cleans his glasses. "Well, let\'s see what this [[fabric fragment]] tells us."',
            characterId: 'unknown',
            choices: [
                {
                    id: 'analyze_fabric',
                    text: 'Analyze the fabric',
                    nextSceneId: 'analysis_result'
                }
            ]
        },
        'analysis_result': {
            id: 'analysis_result',
            text: '"Interesting weave," Stein mutters. "[[Imported silk]]. Specific dye from the 1904 batch. Only one tailor in Freiburg uses this: [[Ganter\'s personal tailor]]."',
            characterId: 'unknown',
            choices: [
                {
                    id: 'take_report',
                    text: 'Take the lab report',
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
