import type { VNContentPack } from '../../../../../model/types';

export const LEAD_APOTHECARY_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'entrance': {
            text: 'Die Lowen-Apotheke ist dicht gefullt mit Glasgeraten, Krautern und scharfem Arzneigeruch.'
        },
        'apothecary_greets': {
            text: 'Ein alterer Mann im weissen Kittel tritt vor. "Adalbert Weiss. Was genau brauchen Sie?"',
            choices: {
                'show_residue': 'Pulverprobe aus dem Banktresor zeigen.',
                'ask_sender_manifest': '"Haben Sie Lieferungen der Breisgauer Chemiewerke gesehen?"',
                'ask_hartmann_procurement': '"Liefen chemische Bestellungen uber einen Bankkontakt namens Hartmann?"',
                'ask_poisons': '"Welche Giftstoffe gehen durch dieses Viertel?"',
                'ask_chemicals': '"Wer liefert hier industrielle Reagenzien?"',
                'leave_shop': 'Gehen.'
            }
        },

        'show_residue_scene': {
            text: 'Sie wickeln die Probe aus. "Identifizieren Sie das."'
        },
        'apothecary_examines': {
            text: 'Weiss untersucht, riecht und misst die Korner in stillem Fokus.'
        },
        'apothecary_tests': {
            text: 'Ein Reagenztropfen trifft das Pulver. Die Mischung zischt und setzt eine bittere Note frei.'
        },
        'apothecary_result': {
            text: '"Ammoniumnitrat mit Holzkohle. Eine grobe Sprengmischung. Nicht Teil des regulaeren Bestands."',
            choices: {
                'forensics_check': '[Sinne] Mischungsverhaltnis und Formulierung analysieren.',
                'crosscheck_sender_chain': '"Gleichen Sie das mit der Breisgau-Absenderspur ab."',
                'ask_source': '"Woher bekommt ein Operator diese Mischung?"',
                'thank_leave': 'Danken und gehen.'
            }
        },
        'apothecary_sender_manifest': {
            text: 'Weiss nickt knapp. "Ja. Kleine versiegelte Lose, unregelmassiger Takt, Rechnung uber Zwischenkonten."'
        },
        'apothecary_hartmann_reply': {
            text: '"Hartmann taucht in Abrechnungsbelegen auf, nicht in Direktauftragen. Name auf Sachbearbeiterebene, Routing mit hoher Sensitivitat."'
        },
        'forensics_success': {
            text: 'Das Verhaltnis ist diszipliniert und reproduzierbar. Das stammt von geubten Handen, nicht aus Improvisation.'
        },
        'apothecary_sender_crosscheck': {
            text: 'Weiss gleicht Ihre Absenderspur mit seinen Unterlagen ab. "Dann zeigt die Kette auf universitatsnahe Beschaffung."'
        },
        'forensics_fail': {
            text: 'Sprengstoff bestatigt. Die Herkunft bleibt in der Praezision unklar.'
        },
        'apothecary_source': {
            text: '"Die Grundstoffe sind verbreitet. Eine sichere Mischung braucht chemische Kompetenz und kontrollierten Zugang."'
        },
        'apothecary_university': {
            text: 'Er schlagt ein Journal auf und tippt auf eine Formellinie. "Kilianis Verbrennungsarbeit. Dieses Profil ist zu nah, um es zu ignorieren."'
        },

        'ask_poisons': {
            text: '"Die Dosis macht das Gift. Die meisten Morder missbrauchen gewohnliche Verbindungen."'
        },
        'ask_chemicals': {
            text: '"Fabriken, Labore und Schmuggler behaupten saubere Bucher. Meistens stimmt nur eine dieser Behauptungen."'
        }
    }
};

export default LEAD_APOTHECARY_DE;
