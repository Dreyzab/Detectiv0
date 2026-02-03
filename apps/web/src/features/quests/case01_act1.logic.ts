
import type { QuestLogic } from './types';

export const CASE_01_ACT_1_LOGIC: QuestLogic = {
    id: 'case01_act1',
    objectives: [
        {
            id: 'visit_bank',
            condition: { type: 'flag', flag: 'VISITED_p_bank' },
            targetPointId: 'p_bank'
        },
        {
            id: 'find_clue_safe',
            condition: { type: 'flag', flag: 'EVIDENCE_SAFE_CRACKED' }
        },
        {
            id: 'interrogate_clerk',
            condition: { type: 'flag', flag: 'INTERROGATION_CLERK_DONE' }
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
