
import type { QuestLogic } from './types';

export const CASE_01_ACT_1_LOGIC: QuestLogic = {
    id: 'case01',
    initialStage: 'not_started',
    stageTransitions: [
        {
            from: 'not_started',
            to: 'briefing'
        },
        {
            from: 'briefing',
            to: 'bank_investigation'
        },
        {
            from: 'bank_investigation',
            to: 'leads_open',
            requiredFlags: ['vault_inspected', 'clerk_interviewed']
        },
        {
            from: 'leads_open',
            to: 'leads_done',
            requiredFlags: ['all_leads_resolved']
        },
        {
            from: 'leads_done',
            to: 'finale',
            requiredFlags: ['finale_unlocked']
        },
        {
            from: 'finale',
            to: 'resolved',
            requiredFlags: ['case_resolved']
        }
    ],
    objectives: [
        {
            id: 'select_priority_route',
            condition: {
                type: 'logic_or',
                conditions: [
                    { type: 'flag', flag: 'priority_bank_first' },
                    { type: 'flag', flag: 'priority_mayor_first' }
                ]
            },
            stage: 'briefing'
        },
        {
            id: 'visit_briefing_bank',
            condition: { type: 'flag', flag: 'VISITED_loc_freiburg_bank' },
            stage: 'briefing',
            targetPointId: 'loc_freiburg_bank'
        },
        {
            id: 'visit_briefing_mayor',
            condition: { type: 'flag', flag: 'VISITED_loc_rathaus' },
            stage: 'briefing',
            targetPointId: 'loc_rathaus'
        },
        {
            id: 'visit_bank',
            condition: { type: 'flag', flag: 'VISITED_loc_freiburg_bank' },
            stage: 'bank_investigation',
            targetPointId: 'loc_freiburg_bank'
        },
        {
            id: 'find_clue_safe',
            condition: { type: 'flag', flag: 'vault_inspected' },
            stage: 'bank_investigation'
        },
        {
            id: 'interrogate_clerk',
            condition: { type: 'flag', flag: 'clerk_interviewed' },
            stage: 'bank_investigation'
        },
        {
            id: 'close_case',
            condition: { type: 'flag', flag: 'case_resolved' },
            stage: 'finale'
        }
    ],
    completionCondition: { type: 'flag', flag: 'case_resolved' },
    rewards: {
        xp: 150,
        traits: ['observant']
    }
};

