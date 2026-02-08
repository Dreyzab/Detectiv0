import type { VNContentPack } from '../../../../../model/types';
import { CASE1_ALT_BRIEFING_EN } from './case1_alt_briefing.en';

export const CASE1_ALT_BRIEFING_DE: VNContentPack = {
    ...CASE1_ALT_BRIEFING_EN,
    locale: 'de',
    scenes: {
        ...CASE1_ALT_BRIEFING_EN.scenes,
        'beat0_mayor_intro': {
            text: 'Burgermeister Thoma schliesst die Burotur hinter Ihnen. "Detektiv Vance, diese Stadt braucht Diskretion. Clara von Altenburg gibt Ihnen das Briefing. Horen Sie gut zu."'
        },
        'beat1_open': {
            text: 'Eine Frau im grauen Mantel erhebt sich neben dem Schreibtisch des Burgermeisters. "Sie sind spat. Setzen Sie sich. Wir haben zehn Minuten."',
            choices: {
                'tactic_professional': '"Die Bahn hatte Verspatung. Bleiben wir effizient."',
                'tactic_harsh': '"Ich bin nicht spat. Sie haben zu fruh begonnen."',
                'tactic_soft': '"Entschuldigung. Neue Stadt. Freut mich, Clara."'
            }
        },
        'beat2_intro_professional': {
            text: '"Kaiserliche Handelsbank. Vor drei Tagen ausgeraubt. Die Polizei steckt fest."',
            choices: {
                'beat2_ask_what_taken': '"Was wurde gestohlen?"',
                'beat2_ask_who_runs_case': '"Wer fuhrt die Ermittlungen auf Polizeiseite?"',
                'beat2_ask_exactly_happened': '"Was ist genau passiert?"'
            }
        },
        'beat2_intro_harsh': {
            text: '"Bankraub. Drei Tage. Kein Verdachtiger. Berlin hat Sie geschickt, weil hier niemand den ersten Schritt macht."',
            choices: {
                'beat2_ask_what_taken': '"Was wurde gestohlen?"',
                'beat2_ask_who_runs_case': '"Wer fuhrt die Ermittlungen auf Polizeiseite?"',
                'beat2_ask_exactly_happened': '"Was ist genau passiert?"'
            }
        },
        'beat2_intro_soft': {
            text: '"Vor drei Tagen wurde die Bank uberfallen. Die lokale Polizei ist uberfordert. Darum sind Sie hier."',
            choices: {
                'beat2_ask_what_taken': '"Was wurde gestohlen?"',
                'beat2_ask_who_runs_case': '"Wer fuhrt die Ermittlungen auf Polizeiseite?"',
                'beat2_ask_exactly_happened': '"Was ist genau passiert?"'
            }
        },
        'beat2_exactly_happened_professional': {
            text: '"Vor Sonnenaufgang Zugang, keine Aufbruchspuren, falsche Akten verschwunden und zu viele Leute, die Routine spielen. Das ist passiert."'
        },
        'beat2_exactly_happened_harsh': {
            text: '"Sauberer Zugriff und schmutzige Vertuschung. Niemand will sagen, wer in jener Nacht Tresorzugang hatte."'
        },
        'beat2_exactly_happened_soft': {
            text: '"Leiser Einstieg, fehlende Dokumente, verangstigtes Personal und politischer Druck. Das ist mehr als ein normaler Raub."'
        }
    }
};

export default CASE1_ALT_BRIEFING_DE;
