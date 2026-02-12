import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_BANKER_CLIENT_LOGIC: VNScenarioLogic = {
    id: 'sandbox_banker_client',
    packId: 'ka1905',
    title: "The Banker's Son: Client Briefing",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_bankhaus.webp',
    initialSceneId: 'entry_hall',
    scenes: {
        entry_hall: {
            id: 'entry_hall',
            characterId: 'narrator',
            nextSceneId: 'bank_intro'
        },
        bank_intro: {
            id: 'bank_intro',
            characterId: 'bank_manager',
            choices: [
                {
                    id: 'accept_case',
                    nextSceneId: 'case_accepted'
                },
                {
                    id: 'press_motive',
                    nextSceneId: 'press_success',
                    type: 'inquiry',
                    skillCheck: {
                        id: 'chk_sandbox_banker_press_motive',
                        voiceId: 'logic',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'press_success',
                            actions: [
                                { type: 'add_flag', payload: { CLUE_B05_WAX_ON_GLOVE: true, CLUE_B06_LEDGER_MISMATCH: true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'press_fail',
                            actions: [
                                { type: 'add_flag', payload: { BANKER_CLIENT_HOSTILE: true } }
                            ]
                        }
                    }
                }
            ]
        },
        press_success: {
            id: 'press_success',
            characterId: 'bank_manager',
            nextSceneId: 'case_accepted'
        },
        press_fail: {
            id: 'press_fail',
            characterId: 'bank_manager',
            nextSceneId: 'case_accepted'
        },
        case_accepted: {
            id: 'case_accepted',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        TALKED_BANKER: true,
                        BANKER_INVESTIGATION_OPEN: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_son_house' },
                { type: 'unlock_point', payload: 'loc_ka_tavern' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'client_met' } }
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

export default SANDBOX_BANKER_CLIENT_LOGIC;
