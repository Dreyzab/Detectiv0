import type { QuestContent } from './types';

export const SANDBOX_DOG_EN: QuestContent = {
    title: "The Mayor's Dog",
    description: 'Follow the food trail and return Bruno safely.',
    stages: {
        not_started: 'Not Started',
        client_met: 'Client Met',
        searching: 'Searching',
        found: 'Dog Found',
        resolved: 'Resolved'
    },
    objectives: {
        obj_meet_mayor: 'Meet the mayor',
        obj_follow_trail: 'Follow the vendor trail',
        obj_find_dog: 'Find Bruno'
    }
};
