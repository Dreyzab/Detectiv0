import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAP_FIRST_EXPLORATION_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'event1_intro': {
            text: 'Auf dem Weg zur Bankhaus-Krebs-Route verschatzt sich ein Postbote in einer Kurve und kracht gegen einen Handkarren. Ledertaschen platzen auf. Briefe rutschen uber nasses Kopfsteinpflaster, wahrend die meisten Passanten demonstrativ wegsehen.\n\nDer Mann entschuldigt sich hektisch und greift nach dem nachsten Umschlag, bevor Sie es tun.',
            choices: {
                'event1_help_postman': 'Helfen, die Briefe einzusammeln.',
                'event1_walk_past': 'Weitergehen, aber den Stapel im Vorbeigehen erfassen.'
            }
        },
        'event1_envelope': {
            text: 'Ein Umschlag springt sofort ins Auge: Kaiserliche Handelsbank, zu Handen [[Hartmann]], [[Schliessfach 217]]. Teures Papier, saubere Schrift, ein Absendersiegel, das nur halb abgekratzt wurde.\n\nDer Postbote zieht den Brief mit gespielt ruhiger Hand zuruck und versteckt den Stapel unter dem Mantel.'
        },

        'event2_gate': {
            text: 'Am Rand des Universitatsviertels ubertonen Sprechchore die Strassenbahn. Ein Student im abgetragenen Mantel verteilt anti-bank Flugblatter im Akkord und kontrolliert nach jeder Ausgabe nervos die Kreuzung.',
            choices: {
                'event2_linger': 'Verlangsamen und das Gesprach suchen.',
                'event2_skip': 'Ignorieren und auf Bankkurs bleiben.'
            }
        },
        'event2_intro': {
            text: 'Die Schlagzeile nennt [[Galdermann]] direkt und behauptet, die Direktion nutze Scheinkonten fur politischen Druck. Im Kleingedruckten steht etwas uber einen entlassenen Schreiber und eine verschwundene Ledger-Kopie.',
            choices: {
                'event2_read_leaflet': 'Das Flugblatt Zeile fur Zeile lesen.',
                'event2_ask_source': '"Wer hat das gedruckt und wer bezahlt das?"',
                'event2_dismiss': 'Falten, einstecken, weitergehen.'
            }
        },
        'event2_resolution': {
            text: 'Jede Antwort kommt verzogert. Der Student blickt vor jedem Satz auf Stiefel, Ecken und Fensterlinien.\n\nDas wirkt nicht wie zufallige Emporung. Jemand steuert bereits das offentliche Narrativ, bevor die Beweise auf dem Tisch liegen.'
        },

        'approach_bank': {
            text: 'Bankhaus Krebs liegt vor Ihnen, abgesperrt durch Polizeiketten und kontrollierte Zugange. Was dort geschah, ist inzwischen in Verfahren, Prestige und Angst eingewickelt.\n\nSie sind nah genug, um mit dem Bank-Zutrittsprotokoll zu beginnen.'
        }
    }
};

export default CASE1_MAP_FIRST_EXPLORATION_DE;
