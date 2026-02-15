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
        obj_vendor_sweep: 'Ask vendors in Marktplatz',
        obj_check_butcher: 'Check the butcher lead',
        obj_check_stables: 'Check the stables lead',
        obj_check_docks: 'Check the river docks lead',
        obj_check_service_lane: 'Check the service alley lead',
        obj_check_bakery: 'Check the bakery lead',
        obj_find_dog: 'Find Bruno in Schlossgarten'
    }
};
