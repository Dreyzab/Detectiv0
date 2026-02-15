import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_hbf_arrival',
    packId: 'fbg1905',
    title: 'Arrival at Freiburg HBF',
    defaultBackgroundUrl: '/images/scenarios/bahnhof_platform.webp',
    initialSceneId: 'beat1_atmosphere',
    mode: 'fullscreen',
    scenes: {
        'beat1_atmosphere': {
            id: 'beat1_atmosphere',
            characterId: 'narrator',
            nextSceneId: 'beat1_spot_fritz',
            choices: []
        },
        'beat1_spot_fritz': {
            id: 'beat1_spot_fritz',
            characterId: 'narrator',
            passiveChecks: [
                {
                    id: 'chk_case1_hbf_perception_fritz',
                    voiceId: 'perception',
                    difficulty: 7,
                    isPassive: true,
                    passiveText: 'In the flow of people, you notice a man in uniform with a spiked helmet.',
                    passiveFailText: 'The crowd is a chaotic blur of faces and luggage.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'spotted_fritz_early': true } }]
                    }
                }
            ],
            choices: [
                {
                    id: 'choice_approach_fritz',
                    nextSceneId: 'beat_fritz_intro_direct',
                    actions: [{
                        type: 'add_flag',
                        payload: {
                            'skipped_station_investigation': true,
                            'investigated_station': false
                        }
                    }]
                },
                {
                    id: 'choice_investigate_station',
                    nextSceneId: 'beat2_paperboy',
                    actions: [{
                        type: 'add_flag',
                        payload: {
                            'investigated_station': true,
                            'skipped_station_investigation': false
                        }
                    }]
                }
            ]
        },

        'beat2_paperboy': {
            id: 'beat2_paperboy',
            characterId: 'narrator',
            passiveChecks: [
                {
                    id: 'chk_case1_hbf_intuition_paperboy',
                    voiceId: 'intuition',
                    difficulty: 6,
                    isPassive: true,
                    passiveText: 'The newspaper boy is shouting too loud. He is hiding fear.',
                    passiveFailText: 'A boy shouts headlines about the robbery.',
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
                    nextSceneId: 'beat_paperboy_theft',
                    actions: [{ type: 'add_flag', payload: { 'paperboy_headline_glanced': true } }]
                }
            ]
        },
        'beat2_buy_result': {
            id: 'beat2_buy_result',
            characterId: 'narrator',
            nextSceneId: 'beat3_square',
            onEnter: [
                { type: 'modify_relationship', payload: { characterId: 'paperboy', amount: 1 } },
                { type: 'modify_relationship', payload: { characterId: 'gendarm', amount: 1 } }
            ]
        },

        'beat_paperboy_theft': {
            id: 'beat_paperboy_theft',
            characterId: 'narrator',
            nextSceneId: 'choice_paperboy_fate',
            onEnter: [{
                type: 'add_flag',
                payload: {
                    'caught_paperboy': true,
                    'paperboy_theft_seen': true,
                    'met_fritz_indirect': true,
                    'met_fritz_direct': false
                }
            }]
        },

        'choice_paperboy_fate': {
            id: 'choice_paperboy_fate',
            characterId: 'gendarm',
            choices: [
                {
                    id: 'choice_paperboy_mercy',
                    nextSceneId: 'beat_fritz_mission', // Merges back
                    actions: [
                        {
                            type: 'add_flag',
                            payload: {
                                'paperboy_mercy': true,
                                'paperboy_reported': false,
                                'paperboy_fate_mercy': true,
                                'paperboy_fate_report': false,
                                'paperboy_fate_resolved': true
                            }
                        },
                        { type: 'modify_relationship', payload: { characterId: 'paperboy', amount: 1 } },
                        { type: 'modify_relationship', payload: { characterId: 'faction_underground', amount: 5 } }
                    ]
                },
                {
                    id: 'choice_paperboy_report',
                    nextSceneId: 'beat_fritz_mission', // Merges back
                    actions: [
                        {
                            type: 'add_flag',
                            payload: {
                                'paperboy_reported': true,
                                'paperboy_mercy': false,
                                'paperboy_fate_report': true,
                                'paperboy_fate_mercy': false,
                                'paperboy_fate_resolved': true
                            }
                        },
                        { type: 'modify_relationship', payload: { characterId: 'paperboy', amount: -1 } },
                        { type: 'modify_relationship', payload: { characterId: 'gendarm', amount: 1 } }
                    ]
                }
            ]
        },

        'beat3_square': {
            id: 'beat3_square',
            characterId: 'narrator',
            passiveChecks: [
                {
                    id: 'chk_case1_hbf_senses_galdermann',
                    voiceId: 'senses',
                    difficulty: 7,
                    isPassive: true,
                    passiveText: 'The officers mention a familiar name: Galdermann.',
                    passiveFailText: 'Only tram bells and carriage wheels cut through the square.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_galdermann_mention': true } }]
                    }
                }
            ],
            nextSceneId: 'beat_fritz_intro_indirect'
        },

        'beat_fritz_intro_direct': {
            id: 'beat_fritz_intro_direct',
            characterId: 'gendarm',
            nextSceneId: 'beat_fritz_mission',
            onEnter: [{
                type: 'add_flag',
                payload: {
                    'met_fritz_direct': true,
                    'met_fritz_indirect': false
                }
            }]
        },

        'beat_fritz_intro_indirect': {
            id: 'beat_fritz_intro_indirect',
            characterId: 'gendarm',
            nextSceneId: 'beat_fritz_mission',
            onEnter: [{
                type: 'add_flag',
                payload: {
                    'met_fritz_indirect': true,
                    'met_fritz_direct': false
                }
            }]
        },

        'beat_fritz_mission': {
            id: 'beat_fritz_mission',
            characterId: 'gendarm',
            choices: [
                {
                    id: 'priority_bank_first',
                    nextSceneId: 'hbf_finalize',
                    actions: [
                        {
                            type: 'add_flag',
                            payload: {
                                'priority_bank_first': true,
                                'priority_mayor_first': false
                            }
                        }
                    ]
                },
                {
                    id: 'priority_mayor_first',
                    nextSceneId: 'hbf_finalize',
                    actions: [
                        {
                            type: 'add_flag',
                            payload: {
                                'priority_bank_first': false,
                                'priority_mayor_first': true
                            }
                        }
                    ]
                }
            ]
        },

        'hbf_finalize': {
            id: 'hbf_finalize',
            characterId: 'gendarm',
            nextSceneId: 'END',
            onEnter: [
                { type: 'unlock_point', payload: 'loc_hbf' },
                { type: 'unlock_point', payload: 'loc_freiburg_bank' },
                { type: 'unlock_point', payload: 'loc_rathaus' },
                {
                    type: 'add_flag', payload: {
                        'case01_started': true,
                        'telegram_acknowledged': true,
                        'arrived_at_hbf': true,
                        'map_tutorial_shown': true,
                        'hbf_priority_selected': true
                    }
                }
            ]
        }
    }
};

export default CASE1_HBF_ARRIVAL_LOGIC;
