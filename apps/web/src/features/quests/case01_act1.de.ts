
import type { QuestContent } from './types';

export const CASE_01_ACT_1_DE: QuestContent = {
    title: 'Fall 01: Schatten in der Bank',
    description: 'Akt 1: Initialen. Ein Raubüberfall im Bankhaus J.A. Krebs. Untersuchen Sie den Tatort.',
    stages: {
        not_started: 'Nicht begonnen',
        briefing: 'Briefing',
        bank_investigation: 'Bankermittlung',
        leads_open: 'Spuren offen',
        leads_done: 'Spuren abgeschlossen',
        finale: 'Finale',
        resolved: 'Abgeschlossen'
    },
    transitions: {
        'not_started->briefing': 'Telegramm-Übergabe führt zu HBF-Ankunft und Clara-Briefing.',
        'briefing->bank_investigation': 'Karten-Exploration und QR-Gate sind abgeschlossen; Bankermittlung beginnt.',
        'bank_investigation->leads_open': 'Die Bankhinweise sind konsolidiert, Stadtspuren werden freigeschaltet.',
        'leads_open->leads_done': 'Alle Spurzweige wurden abgeschlossen.',
        'leads_done->finale': 'Die Beweiskette verdichtet sich und das Finale wird freigeschaltet.',
        'finale->resolved': 'Die Schlusskonfrontation ist beendet, der Fall ist gelöst.'
    },
    objectives: {
        visit_bank: 'Besuchen Sie den Tatort (Bankhaus J.A. Krebs)',
        find_clue_safe: 'Untersuchen Sie den Tresor',
        interrogate_clerk: 'Verhören Sie den Angestellten'
    }
};
