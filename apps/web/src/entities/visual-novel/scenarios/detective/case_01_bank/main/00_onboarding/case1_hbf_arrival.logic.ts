import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_hbf_arrival',
    title: 'Arrival at Freiburg HBF',
    defaultBackgroundUrl: '/images/scenarios/bahnhof_platform.png',
    initialSceneId: 'beat1_collision',
    mode: 'fullscreen',
    scenes: {
        'beat1_collision': {
            id: 'beat1_collision',
            characterId: 'inspector',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'case01', stage: 'briefing' } }
            ],
            passiveChecks: [
                {
                    id: 'chk_case1_hbf_perception_schedule',
                    voiceId: 'perception',
                    difficulty: 7,
                    isPassive: true,
                    passiveText: 'A timetable route is marked in red: Freiburg - Basel - Zurich.',
                    passiveFailText: 'The station board is a blur of departures.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_marked_schedule': true } }]
                    }
                }
            ],
            choices: [
                {
                    id: 'beat1_authority',
                    nextSceneId: 'beat1_authority_result',
                    actions: [{ type: 'add_flag', payload: { 'beat1_choice_authority': true } }]
                },
                {
                    id: 'beat1_perception',
                    nextSceneId: 'beat1_perception_result',
                    actions: [{ type: 'add_flag', payload: { 'beat1_choice_perception': true } }]
                },
                {
                    id: 'beat1_intuition',
                    nextSceneId: 'beat1_intuition_result',
                    actions: [{ type: 'add_flag', payload: { 'beat1_choice_intuition': true } }]
                }
            ]
        },
        'beat1_authority_result': {
            id: 'beat1_authority_result',
            characterId: 'inspector',
            nextSceneId: 'beat2_kiosk'
        },
        'beat1_perception_result': {
            id: 'beat1_perception_result',
            characterId: 'inspector',
            nextSceneId: 'beat2_kiosk'
        },
        'beat1_intuition_result': {
            id: 'beat1_intuition_result',
            characterId: 'inspector',
            nextSceneId: 'beat2_kiosk'
        },

        'beat2_kiosk': {
            id: 'beat2_kiosk',
            characterId: 'inspector',
            passiveChecks: [
                {
                    id: 'chk_case1_hbf_intuition_kiosk',
                    voiceId: 'intuition',
                    difficulty: 6,
                    isPassive: true,
                    passiveText: 'The kiosk woman flinches at the word "bank". She knows more than she says.',
                    passiveFailText: 'The kiosk seller looks ordinary in the morning rush.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_kiosk_nervousness': true } }]
                    }
                }
            ],
            choices: [
                {
                    id: 'beat2_buy_newspaper',
                    nextSceneId: 'beat2_buy_result',
                    actions: [{
                        type: 'add_flag', payload: {
                            'newspaper_bought': true,
                            'item_newspaper_case01': true,
                            'clue_hartmann_newspaper': true
                        }
                    }]
                },
                {
                    id: 'beat2_glance_headline',
                    nextSceneId: 'beat2_glance_result'
                }
            ]
        },
        'beat2_buy_result': {
            id: 'beat2_buy_result',
            characterId: 'inspector',
            nextSceneId: 'beat3_square'
        },
        'beat2_glance_result': {
            id: 'beat2_glance_result',
            characterId: 'inspector',
            nextSceneId: 'beat3_square'
        },

        'beat3_square': {
            id: 'beat3_square',
            characterId: 'inspector',
            passiveChecks: [
                {
                    id: 'chk_case1_hbf_senses_galdermann',
                    voiceId: 'senses',
                    difficulty: 7,
                    isPassive: true,
                    passiveText: 'Two officers mention a familiar name: Galdermann.',
                    passiveFailText: 'Only tram bells and carriage wheels cut through the square.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_galdermann_mention': true } }]
                    }
                }
            ],
            choices: [
                {
                    id: 'beat3_ask_driver',
                    nextSceneId: 'beat3_driver_result'
                },
                {
                    id: 'beat3_self_orient',
                    nextSceneId: 'beat3_orient_result'
                },
                {
                    id: 'beat3_go_blind',
                    nextSceneId: 'beat3_blind_result'
                }
            ]
        },
        'beat3_driver_result': {
            id: 'beat3_driver_result',
            characterId: 'gendarm',
            nextSceneId: 'hbf_finalize'
        },
        'beat3_orient_result': {
            id: 'beat3_orient_result',
            characterId: 'inspector',
            nextSceneId: 'hbf_finalize'
        },
        'beat3_blind_result': {
            id: 'beat3_blind_result',
            characterId: 'inspector',
            nextSceneId: 'hbf_finalize'
        },

        'hbf_finalize': {
            id: 'hbf_finalize',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                { type: 'unlock_point', payload: 'loc_hbf' },
                {
                    type: 'add_flag', payload: {
                        'telegram_acknowledged': true,
                        'arrived_at_hbf': true,
                        'map_tutorial_shown': true
                    }
                }
            ]
        }
    }
};

export default CASE1_HBF_ARRIVAL_LOGIC;
