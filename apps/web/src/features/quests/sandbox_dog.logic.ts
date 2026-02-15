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
            condition: { type: 'flag', flag: 'TALKED_MAYOR', value: true },
            targetPointId: 'loc_ka_rathaus'
        },
        {
            id: 'obj_vendor_sweep',
            stage: 'client_met',
            targetPointId: 'loc_ka_platz',
            condition: { type: 'flag', flag: 'DOG_VENDOR_CLUE', value: true }
        },
        {
            id: 'obj_check_butcher',
            stage: 'searching',
            targetPointId: 'loc_ka_butcher',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'DOG_BUTCHER_CLUE', value: true },
                    { type: 'flag', flag: 'DOG_CASE_DONE', value: true }
                ]
            }
        },
        {
            id: 'obj_check_stables',
            stage: 'searching',
            targetPointId: 'loc_ka_stables',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'DOG_FALSE_STABLES_DONE', value: true },
                    { type: 'flag', flag: 'DOG_CASE_DONE', value: true }
                ]
            }
        },
        {
            id: 'obj_check_docks',
            stage: 'searching',
            targetPointId: 'loc_ka_river_docks',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'DOG_FALSE_DOCKS_DONE', value: true },
                    { type: 'flag', flag: 'DOG_CASE_DONE', value: true }
                ]
            }
        },
        {
            id: 'obj_check_service_lane',
            stage: 'searching',
            targetPointId: 'loc_ka_service_lane',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'DOG_FALSE_SERVICE_DONE', value: true },
                    { type: 'flag', flag: 'DOG_CASE_DONE', value: true }
                ]
            }
        },
        {
            id: 'obj_check_bakery',
            stage: 'searching',
            targetPointId: 'loc_ka_bakery',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'DOG_BAKERY_CLUE', value: true },
                    { type: 'flag', flag: 'DOG_CASE_DONE', value: true }
                ]
            }
        },
        {
            id: 'obj_find_dog',
            stage: 'found',
            targetPointId: 'loc_ka_park',
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
