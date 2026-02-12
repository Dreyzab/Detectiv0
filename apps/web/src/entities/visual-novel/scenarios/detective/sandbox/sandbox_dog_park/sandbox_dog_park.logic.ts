import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_DOG_PARK_LOGIC: VNScenarioLogic = {
    id: 'sandbox_dog_park',
    packId: 'ka1905',
    title: "The Mayor's Dog: Park Reunion",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_suburbs.webp',
    initialSceneId: 'park_intro',
    scenes: {
        park_intro: {
            id: 'park_intro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'call_bruno',
                    nextSceneId: 'bruno_found'
                },
                {
                    id: 'approach_with_sausage',
                    nextSceneId: 'bruno_found',
                    skillCheck: {
                        id: 'chk_sandbox_dog_park_approach',
                        voiceId: 'empathy',
                        difficulty: 8,
                        onSuccess: {
                            nextSceneId: 'bruno_found',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        DOG_SOOTHED_BRUNO: true
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'bruno_spooked'
                        }
                    }
                },
                {
                    id: 'retreat',
                    nextSceneId: 'END'
                }
            ]
        },
        bruno_spooked: {
            id: 'bruno_spooked',
            characterId: 'clara_altenburg',
            nextSceneId: 'bruno_found'
        },
        bruno_found: {
            id: 'bruno_found',
            characterId: 'narrator',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_FOUND: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'found' } }
            ],
            choices: [
                {
                    id: 'check_collar',
                    nextSceneId: 'collar_clue'
                },
                {
                    id: 'escort_to_rathaus',
                    nextSceneId: 'dog_resolved'
                }
            ]
        },
        collar_clue: {
            id: 'collar_clue',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_dog_mayor_tag',
                        name: 'Mayor Seal Collar Tag',
                        description: 'Bruno wears an official collar seal from Rathaus, proving identity and ownership.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'dog_resolved'
        },
        dog_resolved: {
            id: 'dog_resolved',
            characterId: 'mayor',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_RETURNED: true,
                        DOG_CASE_DONE: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'resolved' } }
            ],
            choices: [
                {
                    id: 'return_to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_DOG_PARK_LOGIC;
