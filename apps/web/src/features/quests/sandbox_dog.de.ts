import type { QuestContent } from './types';

export const SANDBOX_DOG_DE: QuestContent = {
    title: 'Der Hund des Buergermeisters',
    description: 'Folgen Sie der Futterspur und bringen Sie Bruno zurueck.',
    stages: {
        not_started: 'Nicht begonnen',
        client_met: 'Auftrag angenommen',
        searching: 'Suche',
        found: 'Hund gefunden',
        resolved: 'Geloest'
    },
    objectives: {
        obj_meet_mayor: 'Den Buergermeister treffen',
        obj_follow_trail: 'Der Haendler-Spur folgen',
        obj_find_dog: 'Bruno finden'
    }
};
