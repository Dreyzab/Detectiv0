import type { QuestContent } from './types';

export const SANDBOX_META_DE: QuestContent = {
    title: 'Karlsruhe-Sandbox',
    description: 'Offene Stadtstruktur mit mehreren Ermittlungsvertraegen in Karlsruhe.',
    stages: {
        not_started: 'Nicht begonnen',
        intro: 'Einfuehrung',
        exploring: 'Mandate aktiv',
        guild_unlocked: 'Gilde freigeschaltet',
        completed: 'Abgeschlossen'
    },
    transitions: {
        'not_started->intro': 'Die Sandbox startet nach dem ersten Agentur-Briefing.',
        'intro->exploring': 'Die Karten-Hubs sind offen und alle drei Auftraggeber verfuegbar.',
        'exploring->guild_unlocked': 'Der Gildenzugang wird durch den Gutshaus-Fortschritt freigeschaltet.',
        'guild_unlocked->completed': 'Banker- und Geisterfall sind beide geloest.'
    },
    objectives: {
        obj_start_sandbox: 'Karlsruhe-Sandbox starten',
        obj_complete_banker: 'Banker-Fall abschliessen',
        obj_complete_ghost: 'Gutshaus-Fall abschliessen'
    }
};
