import type { VNContentPack } from '../../../../../model/types';

export const CASE1_ALT_BRIEFING_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'beat0_mayor_intro': {
            text: 'Burgermeister Thoma schliesst die Burotur hinter Ihnen. "Detektiv Vance, diese Stadt braucht Diskretion. Clara von Altenburg gibt Ihnen das Briefing personlich. Horen Sie genau zu."'
        },
        'beat1_open': {
            text: 'Eine Frau im grauen Mantel erhebt sich neben dem Schreibtisch des Burgermeisters. "Sie sind spat. Setzen Sie sich. Wir haben zehn Minuten, bevor das politisch wird."',
            choices: {
                'tactic_professional': '"Die Bahn hatte Verspatung. Bleiben wir effizient."',
                'tactic_harsh': '"Ich bin nicht spat. Sie haben zu fruh begonnen."',
                'tactic_soft': '"Entschuldigung. Neue Stadt. Freut mich, Clara."'
            }
        },
        'beat1_professional_response': {
            text: 'Sie nickt kurz. "Gut. Damit konnen wir arbeiten."'
        },
        'beat1_harsh_response': {
            text: 'Ihre Augen verengen sich. "Dann sollten wir beide aufhoren, Zeit zu verschwenden."'
        },
        'beat1_soft_response': {
            text: 'Ihre Haltung wird fur einen Moment weicher. "Dann horen Sie jetzt genau zu."'
        },

        'beat2_intro_professional': {
            text: '"Kaiserliche Handelsbank. Vor drei Tagen ausgeraubt. Die Polizei steckt fest."',
            choices: {
                'beat2_ask_what_taken': '"Was wurde entwendet?"',
                'beat2_ask_who_runs_case': '"Wer fuhrt die Ermittlungen auf Polizeiseite?"',
                'beat2_ask_exactly_happened': '"Was genau ist passiert?"'
            }
        },
        'beat2_intro_harsh': {
            text: '"Bankraub. Drei Tage. Kein Verdachtiger. Berlin hat Sie geschickt, weil hier keiner den ersten Schritt machen will."',
            choices: {
                'beat2_ask_what_taken': '"Was wurde entwendet?"',
                'beat2_ask_who_runs_case': '"Wer fuhrt die Ermittlungen auf Polizeiseite?"',
                'beat2_ask_exactly_happened': '"Was genau ist passiert?"'
            }
        },
        'beat2_intro_soft': {
            text: '"Vor drei Tagen wurde die Bank uberfallen. Die lokale Polizei ist uberlastet. Deshalb sind Sie hier."',
            choices: {
                'beat2_ask_what_taken': '"Was wurde entwendet?"',
                'beat2_ask_who_runs_case': '"Wer fuhrt die Ermittlungen auf Polizeiseite?"',
                'beat2_ask_exactly_happened': '"Was genau ist passiert?"'
            }
        },
        'beat2_exactly_happened_professional': {
            text: '"Zugang vor Morgengrauen, keine Aufbruchspuren, die falschen Akten verschwunden und zu viele Leute, die Routine spielen. Das ist passiert."'
        },
        'beat2_exactly_happened_harsh': {
            text: '"Sauberer Zugriff und eine schmutzige Vertuschung. Niemand gibt zu, wer in jener Nacht Tresorzugang hatte."'
        },
        'beat2_exactly_happened_soft': {
            text: '"Leiser Einstieg, fehlende Dokumente, verangstigtes Personal und Druck aus dem Rathaus. Das ist mehr als ein normaler Raub."'
        },
        'beat2_taken_answer': {
            text: '"Nicht Geld. Dokumente aus einem Tresorfach. Die Polizei weigert sich, die Fachnummer zu nennen."'
        },
        'beat2_inspector_answer': {
            text: '"Inspektor Weiss. Fahig, aber wenig begeistert von Besuch aus Berlin."'
        },
        'beat2_empathy_read': {
            text: 'Sie halt die Stimme ruhig, aber ihr Griff um die Tasse ist zu fest.'
        },

        'beat3_setup': {
            text: 'Clara schiebt Ihnen einen versiegelten Umschlag uber den Tisch. "Bank an der Bertholdstrasse. Sie sind inoffiziell. Bleiben Sie leise."',
            choices: {
                'beat3_professional_bonus': '"Wer weiss, dass ich angekommen bin?"',
                'beat3_harsh_bonus': '"Ist das ein Rat oder ein Befehl?"',
                'beat3_soft_bonus': '"Gehe ich allein hinein?"'
            }
        },
        'beat3_professional_result': {
            text: '"Nur ich und Archivar Boehme. Wenn Sie Akten brauchen, nennen Sie seinen Namen."'
        },
        'beat3_harsh_result': {
            text: '"Ein Befehl. Der letzte Ermittler, der Larm gemacht hat, ist verschwunden."'
        },
        'beat3_soft_result': {
            text: '"Ein Gerucht sagt, die Nachtwache trinkt im Wirtshaus Zum Storchen. Er konnte reden."'
        },
        'beat3_logic_gate': {
            text: 'Dokumente, Druck, Dringlichkeit. Das Muster wirkt nicht wie ein gewohnlicher Raub.',
            choices: {
                'beat3_logic_deduce_coverup': '[Logik] "Jemand will das still begraben."',
                'beat3_logic_skip': '"Ich halte mich zuerst an harte Fakten."'
            }
        },
        'beat3_logic_success': {
            text: 'Clara halt Ihren Blick einen Moment langer. "Dann wiederholen Sie diese Theorie besser nicht laut."'
        },
        'beat3_logic_fail': {
            text: 'Sie behalten den Gedanken fur sich. Erst den Tatort testen.'
        },

        'beat4_exit': {
            text: 'Sie steht auf und lasst den halben Kaffee stehen. "Zeit ist um. Bewegen Sie sich."',
            choices: {
                'beat4_ask_where': '"Wo finde ich Sie danach?"',
                'beat4_silent_nod': 'Den Umschlag nehmen und nicken.'
            }
        },
        'beat4_ask_where_result': {
            text: '"Suchen Sie mich nicht. Ich finde Sie."'
        },
        'beat4_silent_nod_result': {
            text: 'Sie neigt den Kopf einmal. Zustimmung ohne Warme.'
        },
        'briefing_finalize': {
            text: 'Adresse bestatigt. Bankhaus Krebs ist jetzt Ihr nachstes Ziel.'
        }
    }
};

export default CASE1_ALT_BRIEFING_DE;
