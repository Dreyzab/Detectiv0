import type { QuestContent } from './types';

export const SANDBOX_BANKER_EN: QuestContent = {
    title: "The Banker's Son",
    description: 'Track Friedrich Richter, uncover the debt trail, and close the family scandal.',
    stages: {
        not_started: 'Not Started',
        client_met: 'Client Met',
        investigating: 'Investigating Leads',
        duel: 'Casino Duel',
        resolved: 'Resolved'
    },
    transitions: {
        'not_started->client_met': 'You accept Herr Richter\'s private contract.',
        'client_met->investigating': 'New leads open in Friedrich\'s house and the tavern.',
        'investigating->duel': 'The trail points to the casino confrontation.',
        'duel->resolved': 'The duel fallout closes the case and updates the city map.'
    },
    objectives: {
        obj_meet_banker: 'Meet the banker at Handelsbank',
        obj_collect_leads: 'Collect enough leads on Friedrich\'s debt trail',
        obj_confront_son: 'Confront Friedrich at the casino',
        obj_close_case: 'Close the banker contract and return to map'
    }
};
