import type { QuestLogic } from './types';

/**
 * Sub-quest: Banker's Son ("Night Owl")
 * Mechanic Focus: Card Duels
 * Flow: Bank → Son's House → Tavern → Casino (duel)
 */
export const SANDBOX_BANKER_LOGIC: QuestLogic = {
    id: 'sandbox_banker',
    initialStage: 'not_started',
    objectives: [
        {
            id: 'obj_meet_banker',
            condition: { type: 'flag', flag: 'TALKED_BANKER', value: true },
            stage: 'client_met',
            targetPointId: 'loc_ka_bank'
        },
        {
            id: 'obj_collect_leads',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'TALKED_SON', value: true },
                    { type: 'flag', flag: 'TAVERN_GOSSIP', value: true }
                ]
            },
            stage: 'investigating'
        },
        {
            id: 'obj_confront_son',
            condition: { type: 'flag', flag: 'SON_DUEL_DONE', value: true },
            stage: 'duel',
            targetPointId: 'loc_ka_casino'
        },
        {
            id: 'obj_close_case',
            condition: { type: 'flag', flag: 'BANKER_CASE_DONE', value: true },
            stage: 'resolved'
        }
    ],
    stageTransitions: [
        {
            from: 'not_started',
            to: 'client_met',
            requiredFlags: ['TALKED_BANKER']
        },
        {
            from: 'client_met',
            to: 'investigating',
            requiredFlags: ['BANKER_INVESTIGATION_OPEN']
        },
        {
            from: 'investigating',
            to: 'duel',
            requiredFlags: ['TAVERN_GOSSIP']
        },
        {
            from: 'duel',
            to: 'resolved',
            requiredFlags: ['SON_DUEL_DONE'],
            triggerActions: [
                'add_flag(BANKER_CASE_DONE)'
            ]
        }
    ],
    completionCondition: {
        type: 'flag',
        flag: 'BANKER_CASE_DONE',
        value: true
    },
    rewards: {
        xp: 50
    }
};
