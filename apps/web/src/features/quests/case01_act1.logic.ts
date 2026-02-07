
import type { QuestLogic } from './types';

export const CASE_01_ACT_1_LOGIC: QuestLogic = {
    id: 'case01',
    initialStage: 'not_started',
    stageTransitions: [
        {
            from: 'not_started',
            to: 'briefing',
            triggerActions: ['start_vn(detective_case1_alt_briefing)']
        },
        {
            from: 'briefing',
            to: 'bank_investigation',
            triggerActions: ['set_quest_stage(case01, bank_investigation) in briefing_exit']
        },
        {
            from: 'bank_investigation',
            to: 'leads_open',
            requiredFlags: ['vault_inspected', 'clerk_interviewed'],
            triggerActions: ['set_quest_stage(case01, leads_open) in bank_conclusion_summary']
        },
        {
            from: 'leads_open',
            to: 'leads_done',
            requiredFlags: ['all_leads_resolved'],
            triggerActions: ['set_quest_stage(case01, leads_done) in lead resolution chain']
        },
        {
            from: 'leads_done',
            to: 'finale',
            requiredFlags: ['finale_unlocked'],
            triggerActions: ['start_vn(case1_finale)']
        },
        {
            from: 'finale',
            to: 'resolved',
            requiredFlags: ['case_resolved'],
            triggerActions: ['set_quest_stage(case01, resolved) in finale ending']
        }
    ],
    objectives: [
        {
            id: 'visit_bank',
            condition: { type: 'flag', flag: 'VISITED_loc_freiburg_bank' },
            stage: 'bank_investigation',
            targetPointId: 'loc_freiburg_bank'
        },
        {
            id: 'find_clue_safe',
            condition: { type: 'flag', flag: 'EVIDENCE_SAFE_CRACKED' },
            stage: 'bank_investigation'
        },
        {
            id: 'interrogate_clerk',
            condition: { type: 'flag', flag: 'INTERROGATION_CLERK_DONE' },
            stage: 'bank_investigation'
        }
    ],
    completionCondition: {
        type: 'logic_and',
        conditions: [
            { type: 'flag', flag: 'EVIDENCE_SAFE_CRACKED' },
            { type: 'flag', flag: 'INTERROGATION_CLERK_DONE' }
        ]
    },
    rewards: {
        xp: 150,
        traits: ['observant']
    }
};

