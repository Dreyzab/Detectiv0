import type { QuestLogic } from './types';

/**
 * Sub-quest: Mayor's Dog ("Übergewichtiger Bruno")
 * Mechanic Focus: Dialogue Clues → MapPoint discovery chain
 * Flow: Rathaus → Marktplatz → Butcher → Bakery → Park
 * 
 * Note: This case is OPTIONAL — not required for sandbox completion.
 */
export const SANDBOX_DOG_LOGIC: QuestLogic = {
    id: 'sandbox_dog',
    initialStage: 'not_started',
    objectives: [
        {
            id: 'obj_meet_mayor',
            condition: { type: 'flag', flag: 'TALKED_MAYOR', value: true }
        },
        {
            id: 'obj_follow_trail',
            condition: { type: 'flag', flag: 'DOG_BAKERY_CLUE', value: true }
        },
        {
            id: 'obj_find_dog',
            condition: { type: 'flag', flag: 'DOG_FOUND', value: true }
        }
    ],
    stageTransitions: [
        {
            from: 'not_started',
            to: 'client_met',
            requiredFlags: ['TALKED_MAYOR']
        },
        {
            from: 'client_met',
            to: 'searching',
            requiredFlags: ['DOG_VENDOR_CLUE']
        },
        {
            from: 'searching',
            to: 'found',
            requiredFlags: ['DOG_FOUND']
        },
        {
            from: 'found',
            to: 'resolved',
            requiredFlags: ['DOG_RETURNED'],
            triggerActions: [
                'add_flag(DOG_CASE_DONE)'
            ]
        }
    ],
    completionCondition: {
        type: 'flag',
        flag: 'DOG_CASE_DONE',
        value: true
    },
    rewards: {
        xp: 40
    }
};
