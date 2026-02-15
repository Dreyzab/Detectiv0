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
        obj_vendor_sweep: 'Haendler am Marktplatz befragen',
        obj_check_butcher: 'Die Metzgerei-Spur pruefen',
        obj_check_stables: 'Die Stall-Spur pruefen',
        obj_check_docks: 'Die Hafen-Spur pruefen',
        obj_check_service_lane: 'Die Dienstgassen-Spur pruefen',
        obj_check_bakery: 'Die Baeckerei-Spur pruefen',
        obj_find_dog: 'Bruno im Schlossgarten finden'
    }
};
