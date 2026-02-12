import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_DOG_BUTCHER_LOGIC: VNScenarioLogic = {
    id: 'sandbox_dog_butcher',
    packId: 'ka1905',
    title: "The Mayor's Dog: Butcher Lead",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_ganter_brauerei.webp',
    initialSceneId: 'butcher_intro',
    scenes: {
        butcher_intro: {
            id: 'butcher_intro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'question_butcher',
                    nextSceneId: 'butcher_statement'
                },
                {
                    id: 'inspect_counter',
                    nextSceneId: 'butcher_trace_success',
                    skillCheck: {
                        id: 'chk_sandbox_dog_counter_trace',
                        voiceId: 'perception',
                        difficulty: 9,
                        onSuccess: {
                            nextSceneId: 'butcher_trace_success'
                        },
                        onFail: {
                            nextSceneId: 'butcher_trace_fail'
                        }
                    }
                },
                {
                    id: 'leave_shop',
                    nextSceneId: 'END'
                }
            ]
        },
        butcher_statement: {
            id: 'butcher_statement',
            characterId: 'innkeeper',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_BUTCHER_CLUE: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_bakery' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'searching' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_dog_butcher_note',
                        name: 'Butcher Note',
                        description: 'The butcher confirms Bruno visits daily and always leaves toward the bakery lane.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'butcher_outro'
        },
        butcher_trace_success: {
            id: 'butcher_trace_success',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_BUTCHER_CLUE: true,
                        DOG_BUTCHER_TRACE: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_bakery' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'searching' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_dog_meat_wrapping',
                        name: 'Grease-Stained Wrapping',
                        description: 'A grease-stained paper marked with bakery flour. Bruno likely carried scraps there.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'butcher_outro'
        },
        butcher_trace_fail: {
            id: 'butcher_trace_fail',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_BUTCHER_CLUE: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_bakery' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'searching' } }
            ],
            nextSceneId: 'butcher_outro'
        },
        butcher_outro: {
            id: 'butcher_outro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'return_to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_DOG_BUTCHER_LOGIC;
