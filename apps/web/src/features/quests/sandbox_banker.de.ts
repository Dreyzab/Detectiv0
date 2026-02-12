import type { QuestContent } from './types';

export const SANDBOX_BANKER_DE: QuestContent = {
    title: 'Der Sohn des Bankiers',
    description: 'Verfolge Friedrich Richter, rekonstruiere die Schuldenkette und beende den Familienskandal.',
    stages: {
        not_started: 'Nicht begonnen',
        client_met: 'Auftrag angenommen',
        investigating: 'Spurenarbeit',
        duel: 'Duell im Casino',
        resolved: 'Geloest'
    },
    transitions: {
        'not_started->client_met': 'Sie nehmen den privaten Auftrag von Herr Richter an.',
        'client_met->investigating': 'Neue Spuren oeffnen sich im Haus und in der Taverne.',
        'investigating->duel': 'Die Spur fuehrt zur Konfrontation im Casino.',
        'duel->resolved': 'Die Folgen des Duells schliessen den Fall und aktualisieren die Karte.'
    },
    objectives: {
        obj_meet_banker: 'Den Bankier in der Handelsbank treffen',
        obj_collect_leads: 'Genug Spuren zur Schuldenkette sammeln',
        obj_confront_son: 'Friedrich im Casino stellen',
        obj_close_case: 'Banker-Vertrag abschliessen und zur Karte zurueckkehren'
    }
};
