import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_BANKER_TAVERN_LOGIC: VNScenarioLogic = {
    id: 'sandbox_banker_tavern',
    packId: 'ka1905',
    title: "The Banker's Son: Tavern Lead",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_ganter_brauerei.webp',
    initialSceneId: 'tavern_intro',
    scenes: {
        tavern_intro: {
            id: 'tavern_intro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'bribe_barkeep',
                    nextSceneId: 'bribe_success',
                    skillCheck: {
                        id: 'chk_sandbox_tavern_bribe',
                        voiceId: 'charisma',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'bribe_success',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        TAVERN_GOSSIP: true,
                                        BANKER_LEAD_TAVERN_DONE: true,
                                        CLUE_B03_TAVERN_TESTIMONY: true
                                    }
                                },
                                { type: 'unlock_point', payload: 'loc_ka_casino' },
                                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'duel' } },
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_banker_tavern_testimony',
                                        name: 'Tavern Testimony',
                                        description: 'The barkeep confirms Friedrich played to repay an external debt, not to celebrate wins.',
                                        packId: 'ka1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'bribe_fail',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        TAVERN_GOSSIP: true,
                                        BANKER_LEAD_TAVERN_DONE: true,
                                        CLUE_B03_PARTIAL: true
                                    }
                                },
                                { type: 'unlock_point', payload: 'loc_ka_casino' },
                                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'duel' } }
                            ]
                        }
                    }
                },
                {
                    id: 'intimidate_witness',
                    nextSceneId: 'intimidate_success',
                    skillCheck: {
                        id: 'chk_sandbox_tavern_intimidate',
                        voiceId: 'authority',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'intimidate_success',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        TAVERN_GOSSIP: true,
                                        BANKER_LEAD_TAVERN_DONE: true,
                                        CLUE_B04_CROUPIER_LEDGER: true
                                    }
                                },
                                { type: 'unlock_point', payload: 'loc_ka_casino' },
                                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'duel' } },
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_banker_croupier_ledger',
                                        name: 'Croupier Ledger Fragment',
                                        description: 'A croupier memo links Friedrich\'s winnings to a handler marked with initial W.',
                                        packId: 'ka1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'intimidate_fail',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        TAVERN_GOSSIP: true,
                                        BANKER_LEAD_TAVERN_DONE: true,
                                        CLUE_B04_PARTIAL: true
                                    }
                                },
                                { type: 'unlock_point', payload: 'loc_ka_casino' },
                                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'duel' } }
                            ]
                        }
                    }
                },
                {
                    id: 'leave_tavern',
                    nextSceneId: 'END'
                }
            ]
        },
        bribe_success: {
            id: 'bribe_success',
            characterId: 'narrator',
            nextSceneId: 'tavern_outro'
        },
        bribe_fail: {
            id: 'bribe_fail',
            characterId: 'narrator',
            nextSceneId: 'tavern_outro'
        },
        intimidate_success: {
            id: 'intimidate_success',
            characterId: 'narrator',
            nextSceneId: 'tavern_outro'
        },
        intimidate_fail: {
            id: 'intimidate_fail',
            characterId: 'narrator',
            nextSceneId: 'tavern_outro'
        },
        tavern_outro: {
            id: 'tavern_outro',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'return_to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_BANKER_TAVERN_LOGIC;
