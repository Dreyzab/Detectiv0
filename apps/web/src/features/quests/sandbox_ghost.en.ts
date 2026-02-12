import type { QuestContent } from './types';

export const SANDBOX_GHOST_EN: QuestContent = {
    title: 'The Haunted Estate',
    description: 'Investigate the estate, consult the guild, and present your final conclusion.',
    stages: {
        not_started: 'Not Started',
        client_met: 'Client Met',
        investigating: 'Investigating',
        evidence_collected: 'Evidence Collected',
        guild_visit: 'Guild Visit',
        accusation: 'Accusation',
        resolved: 'Resolved'
    },
    objectives: {
        obj_meet_estate_client: 'Meet the estate client',
        obj_investigate_estate: 'Investigate the estate',
        obj_visit_guild: 'Visit the guild',
        obj_make_accusation: 'Make the final accusation'
    }
};
