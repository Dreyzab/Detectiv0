import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_DOG_BAKERY_LOGIC: VNScenarioLogic = {
    id: 'sandbox_dog_bakery',
    packId: 'ka1905',
    title: "The Mayor's Dog: Bakery Lead",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_uni.webp',
    initialSceneId: 'bakery_intro',
    scenes: {
        bakery_intro: {
            id: 'bakery_intro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'question_baker',
                    nextSceneId: 'baker_statement'
                },
                {
                    id: 'inspect_flour_marks',
                    nextSceneId: 'flour_success',
                    skillCheck: {
                        id: 'chk_sandbox_dog_flour_marks',
                        voiceId: 'senses',
                        difficulty: 9,
                        onSuccess: {
                            nextSceneId: 'flour_success'
                        },
                        onFail: {
                            nextSceneId: 'flour_fail'
                        }
                    }
                },
                {
                    id: 'leave_bakery',
                    nextSceneId: 'END'
                }
            ]
        },
        baker_statement: {
            id: 'baker_statement',
            characterId: 'innkeeper',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_BAKERY_CLUE: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_park' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'searching' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_dog_flour_trail',
                        name: 'Flour Paw Trail',
                        description: 'Fresh paw marks coated with flour lead from the bakery toward Schlossgarten.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'bakery_outro'
        },
        flour_success: {
            id: 'flour_success',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_BAKERY_CLUE: true,
                        DOG_BAKERY_TRACE: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_park' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'searching' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_dog_flour_trail',
                        name: 'Flour Paw Trail',
                        description: 'Fresh paw marks coated with flour lead from the bakery toward Schlossgarten.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'bakery_outro'
        },
        flour_fail: {
            id: 'flour_fail',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_BAKERY_CLUE: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_park' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'searching' } }
            ],
            nextSceneId: 'bakery_outro'
        },
        bakery_outro: {
            id: 'bakery_outro',
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

export default SANDBOX_DOG_BAKERY_LOGIC;
