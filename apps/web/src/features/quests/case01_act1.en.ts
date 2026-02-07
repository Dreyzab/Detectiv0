
import type { QuestContent } from './types';

export const CASE_01_ACT_1_EN: QuestContent = {
    title: 'Case 01: Shadows at the Bank',
    description: 'Act 1: Initials. A robbery has occurred at Bankhaus J.A. Krebs. Investigate the scene and find leads.',
    stages: {
        not_started: 'Not Started',
        briefing: 'Briefing',
        bank_investigation: 'Bank Investigation',
        leads_open: 'Leads Open',
        leads_done: 'Leads Completed',
        finale: 'Finale',
        resolved: 'Resolved'
    },
    transitions: {
        'not_started->briefing': 'Case intro starts and investigator enters the briefing flow.',
        'briefing->bank_investigation': 'Briefing wraps and the first major investigation stage begins.',
        'bank_investigation->leads_open': 'Bank clues are consolidated and city leads become available.',
        'leads_open->leads_done': 'All lead branches are resolved.',
        'leads_done->finale': 'Evidence chain converges and finale route opens.',
        'finale->resolved': 'Final confrontation is completed and case is closed.'
    },
    objectives: {
        visit_bank: 'Visit the Crime Scene (Bankhaus J.A. Krebs)',
        find_clue_safe: 'Inspect the Safe',
        interrogate_clerk: 'Interrogate the Clerk'
    }
};
