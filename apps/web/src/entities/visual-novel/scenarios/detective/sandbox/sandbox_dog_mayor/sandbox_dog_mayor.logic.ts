import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_DOG_MAYOR_LOGIC: VNScenarioLogic = {
    id: 'sandbox_dog_mayor',
    packId: 'ka1905',
    title: "The Mayor's Dog: Contract",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_rathaus_archiv.webp',
    initialSceneId: 'mayor_briefing',
    scenes: {
        mayor_briefing: {
            id: 'mayor_briefing',
            characterId: 'mayor',
            choices: [
                {
                    id: 'accept_case',
                    nextSceneId: 'mayor_details'
                },
                {
                    id: 'press_for_details',
                    nextSceneId: 'public_risk'
                },
                {
                    id: 'decline_for_now',
                    nextSceneId: 'END'
                }
            ]
        },
        public_risk: {
            id: 'public_risk',
            characterId: 'mayor',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        DOG_PUBLIC_PRESSURE: true
                    }
                }
            ],
            nextSceneId: 'mayor_details'
        },
        mayor_details: {
            id: 'mayor_details',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        TALKED_MAYOR: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_dog', stage: 'client_met' } }
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

export default SANDBOX_DOG_MAYOR_LOGIC;
