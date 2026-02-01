
import type { VNScenarioLogic } from '../../../../model/types';

export const questLotteWiresLogic: VNScenarioLogic = {
    id: 'quest_lotte_wires',
    title: 'Quest: Ghost in the Wires',
    defaultBackgroundUrl: '/images/scenarios/telegraph_office_interior.png',
    initialSceneId: 'arrival',
    musicUrl: '/audio/ambient_telegraph.mp3',
    scenes: {
        arrival: {
            id: 'arrival',
            characterId: 'operator', // Lotte
            choices: [
                {
                    id: 'ask_problem',
                    nextSceneId: 'explain_problem'
                }
            ]
        },
        explain_problem: {
            id: 'explain_problem',
            characterId: 'operator',
            choices: [
                {
                    id: 'investigate_console',
                    nextSceneId: 'console_check'
                },
                {
                    id: 'dismiss_paranoia',
                    nextSceneId: 'lotte_upset'
                }
            ]
        },
        lotte_upset: {
            id: 'lotte_upset',
            choices: [
                { id: 'leave', nextSceneId: 'end_fail' }
            ]
        },
        console_check: {
            id: 'console_check',
            choices: [{
                id: 'attempt_decode',
                skillCheck: {
                    id: 'chk_tech_logic',
                    voiceId: 'logic',
                    difficulty: 12,
                    onSuccess: { nextSceneId: 'decode_success' },
                    onFail: { nextSceneId: 'decode_fail' }
                }
            }]
        },
        decode_success: {
            id: 'decode_success',
            onEnter: [{ type: 'add_flag', payload: { 'lotte_quest_complete': true, 'intel_network_access': true } }],
            choices: [
                { id: 'comfort_lotte', nextSceneId: 'end_success' }
            ]
        },
        decode_fail: {
            id: 'decode_fail',
            choices: [
                { id: 'force_break', nextSceneId: 'end_broke' }
            ]
        },
        end_success: {
            id: 'end_success',
            characterId: 'operator',
            // End
        },
        end_fail: {
            id: 'end_fail',
            characterId: 'operator',
            // End
        },
        end_broke: {
            id: 'end_broke',
            onEnter: [{ type: 'add_heat', payload: 1 }],
            // End
        }
    }
};

export default questLotteWiresLogic;
