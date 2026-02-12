import type { QuestContent } from './types';

export const SANDBOX_META_EN: QuestContent = {
    title: 'Karlsruhe Sandbox',
    description: 'Open-city sandbox progression across Karlsruhe contracts.',
    stages: {
        not_started: 'Not Started',
        intro: 'Agency Briefing',
        exploring: 'Client Contracts',
        guild_unlocked: 'Guild Access',
        completed: 'Completed'
    },
    transitions: {
        'not_started->intro': 'The sandbox begins after your first agency briefing.',
        'intro->exploring': 'Map hubs open and all three clients become available.',
        'exploring->guild_unlocked': 'Guild access is unlocked after estate investigation progress.',
        'guild_unlocked->completed': 'Banker and Ghost contracts are both resolved.'
    },
    objectives: {
        obj_start_sandbox: 'Start the Karlsruhe sandbox',
        obj_complete_banker: 'Resolve the Banker contract',
        obj_complete_ghost: 'Resolve the Haunted Estate contract'
    }
};
