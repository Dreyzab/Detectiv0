import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_BANKER_CASINO_LOGIC: VNScenarioLogic = {
    id: 'sandbox_banker_casino',
    packId: 'ka1905',
    title: "The Banker's Son: Casino Confrontation",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_suburbs.webp',
    initialSceneId: 'casino_arrival',
    scenes: {
        casino_arrival: {
            id: 'casino_arrival',
            characterId: 'narrator',
            preconditions: [
                (flags) => !flags['SON_DUEL_DONE'] && !flags['BANKER_CASE_DONE']
            ],
            choices: [
                {
                    id: 'start_duel',
                    nextSceneId: 'launch_duel'
                },
                {
                    id: 'step_back',
                    nextSceneId: 'END'
                }
            ]
        },
        launch_duel: {
            id: 'launch_duel',
            characterId: 'narrator',
            preconditions: [
                (flags) => !flags['SON_DUEL_DONE']
            ],
            onEnter: [
                {
                    type: 'start_battle',
                    payload: {
                        scenarioId: 'sandbox_son_duel',
                        deckType: 'starter'
                    }
                }
            ],
            nextSceneId: 'END'
        },
        casino_fallout: {
            id: 'casino_fallout',
            characterId: 'clara_altenburg',
            preconditions: [
                (flags) => Boolean(flags['SON_DUEL_DONE']) && !flags['BANKER_CASE_DONE']
            ],
            choices: [
                {
                    id: 'expose_publicly',
                    nextSceneId: 'resolution_public',
                    condition: (flags) => Boolean(flags['CLUE_B06_LEDGER_MISMATCH'])
                },
                {
                    id: 'settle_privately',
                    nextSceneId: 'resolution_private'
                }
            ]
        },
        resolution_public: {
            id: 'resolution_public',
            characterId: 'bank_manager',
            preconditions: [
                (flags) => Boolean(flags['SON_DUEL_DONE']) && !flags['BANKER_CASE_DONE']
            ],
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        BANKER_CASE_DONE: true,
                        banker_resolved: true,
                        BANKER_RESOLUTION_STYLE_PUBLIC: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'resolved' } }
            ],
            nextSceneId: 'case_closed'
        },
        resolution_private: {
            id: 'resolution_private',
            characterId: 'clara_altenburg',
            preconditions: [
                (flags) => Boolean(flags['SON_DUEL_DONE']) && !flags['BANKER_CASE_DONE']
            ],
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        BANKER_CASE_DONE: true,
                        banker_resolved: true,
                        BANKER_RESOLUTION_STYLE_PRIVATE: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_banker', stage: 'resolved' } }
            ],
            nextSceneId: 'case_closed'
        },
        case_closed: {
            id: 'case_closed',
            characterId: 'narrator',
            preconditions: [
                (flags) => Boolean(flags['BANKER_CASE_DONE'])
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

export default SANDBOX_BANKER_CASINO_LOGIC;
