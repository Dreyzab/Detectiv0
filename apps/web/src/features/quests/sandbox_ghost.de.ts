import type { QuestContent } from './types';

export const SANDBOX_GHOST_DE: QuestContent = {
    title: 'Das verfluchte Gutshaus',
    description: 'Untersuchen Sie das Gutshaus, besuchen Sie die Gilde und praesentieren Sie Ihr Urteil.',
    stages: {
        not_started: 'Nicht begonnen',
        client_met: 'Auftrag angenommen',
        investigating: 'Ermittlung',
        evidence_collected: 'Beweise gesammelt',
        guild_visit: 'Gildenbesuch',
        accusation: 'Beschuldigung',
        resolved: 'Geloest'
    },
    objectives: {
        obj_meet_estate_client: 'Den Auftraggeber des Gutshauses treffen',
        obj_investigate_estate: 'Das Gutshaus untersuchen',
        obj_visit_guild: 'Die Gilde besuchen',
        obj_make_accusation: 'Die finale Beschuldigung aussprechen'
    }
};
