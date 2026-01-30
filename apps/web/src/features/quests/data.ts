
import type { Quest } from './store';

export const QUESTS: Record<string, Quest> = {
    'case01_act1': {
        id: 'case01_act1',
        title: 'Case 01: Shadows at the Bank',
        description: 'Act 1: Initials. A robbery has occurred at Bankhaus J.A. Krebs. Investigate the scene and find leads.',
        objectives: [
            {
                id: 'visit_bank',
                text: 'Visit the Crime Scene (Bankhaus J.A. Krebs)',
                condition: { type: 'flag', flag: 'VISITED_p_bank' },
                targetPointId: 'p_bank'
            },
            {
                id: 'find_clue_safe',
                text: 'Inspect the Safe',
                condition: { type: 'flag', flag: 'EVIDENCE_SAFE_CRACKED' }
            },
            {
                id: 'interrogate_clerk',
                text: 'Interrogate the Clerk',
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
    }
};
