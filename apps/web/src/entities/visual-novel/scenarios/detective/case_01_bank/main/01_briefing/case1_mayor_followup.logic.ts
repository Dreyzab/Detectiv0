import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_MAYOR_FOLLOWUP_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_mayor_followup',
    packId: 'fbg1905',
    title: 'Case 1 Mayor Follow-up',
    defaultBackgroundUrl: '/images/scenarios/street_day_1905.webp',
    initialSceneId: 'entry_after_bank',
    mode: 'fullscreen',
    scenes: {
        'entry_after_bank': {
            id: 'entry_after_bank',
            characterId: 'mayor',
            preconditions: [(flags) => !flags['met_mayor_first']],
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'met_mayor_after_bank': true
                    }
                }
            ],
            choices: [
                {
                    id: 'mayor_after_bank_ack',
                    nextSceneId: 'clara_after_bank',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'mayor', amount: 2 } }]
                },
                {
                    id: 'mayor_after_bank_pressure',
                    nextSceneId: 'clara_after_bank',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'mayor', amount: -1 } }]
                }
            ]
        },
        'entry_after_mayor_first': {
            id: 'entry_after_mayor_first',
            characterId: 'mayor',
            preconditions: [(flags) => Boolean(flags['met_mayor_first'])],
            nextSceneId: 'clara_after_mayor_first'
        },
        'clara_after_bank': {
            id: 'clara_after_bank',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'clara_after_bank_share',
                    nextSceneId: 'followup_finalize',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 2 } }]
                },
                {
                    id: 'clara_after_bank_distance',
                    nextSceneId: 'followup_finalize',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: -1 } }]
                }
            ]
        },
        'clara_after_mayor_first': {
            id: 'clara_after_mayor_first',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'clara_after_mayor_first_sync',
                    nextSceneId: 'followup_finalize',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 1 } }]
                }
            ]
        },
        'followup_finalize': {
            id: 'followup_finalize',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'mayor_followup_completed': true
                    }
                }
            ]
        }
    }
};

export default CASE1_MAYOR_FOLLOWUP_LOGIC;
