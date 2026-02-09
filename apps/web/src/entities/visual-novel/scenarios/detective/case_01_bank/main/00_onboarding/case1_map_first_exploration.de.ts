import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAP_FIRST_EXPLORATION_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'event1_intro': {
            text: 'Ein Postbote bremst hart, und Briefe verteilen sich uber das Kopfsteinpflaster.',
            choices: {
                'event1_help_postman': 'Beim Einsammeln der Briefe helfen.',
                'event1_walk_past': 'Weitergehen, aber kurz nach unten schauen.'
            }
        },
        'event1_envelope': {
            text: 'Ein Umschlag ist an die Kaiserliche Handelsbank adressiert, zu Handen [[Hartmann]], Schliessfach 217.'
        },

        'event2_gate': {
            text: 'Nahe des Universitatsviertels verteilt ein Student anti-bank Flugblatter.',
            choices: {
                'event2_linger': 'Langsamer werden und das Gesprach suchen.',
                'event2_skip': 'Ignorieren und auf Bankkurs bleiben.'
            }
        },
        'event2_intro': {
            text: 'Die Schlagzeile nennt [[Galdermann]] direkt und deutet interne Bankverbindungen an.',
            choices: {
                'event2_read_leaflet': 'Flugblatt vollstandig lesen.',
                'event2_ask_source': '"Wer hat das gedruckt?"',
                'event2_dismiss': 'Einstecken und weitergehen.'
            }
        },
        'event2_resolution': {
            text: 'Der Student scannt vor jeder Antwort nervos die Strasse.'
        },

        'approach_bank': {
            text: 'Sie sind nah genug, um mit dem Bank-Zutrittsprotokoll zu beginnen.'
        }
    }
};

export default CASE1_MAP_FIRST_EXPLORATION_DE;
