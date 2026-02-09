import type { VNContentPack } from '../../../model/types';

export const introCharCreationDe: VNContentPack = {
    locale: 'de',
    scenes: {
        'start_game': {
            text: 'Die Morgendammerung kratzt sich uber Freiburg. Ein Telegramm mit Ihrem Namen wartet bereits, und die Stadt wetzt schon die Zahne.',
            choices: {
                'continue': 'Beginnen.'
            }
        },
        'select_origin': {
            text: 'Wer sind Sie? Das Spiegelbild in der dunklen Scheibe gibt keine klare Antwort. Ihr Gesicht ist eine Landkarte aus Entscheidungen und Wegen. Vor dem Telegramm, vor der Bank, vor dem Regen... was waren Sie?',
            choices: {
                'select_journalist': '[Rhetorik / Schauder] "Ich war Journalist. Ich verkaufte Wahrheit pro Spaltenzentimeter, bis der Preis zu hoch wurde."',
                'select_veteran': '[Gesperrt] Der Veteran (Bald verfugbar)',
                'select_academic': '[Gesperrt] Der Akademiker (Bald verfugbar)',
                'select_noble': '[Gesperrt] Der Adlige (Bald verfugbar)'
            }
        },
        'confirm_journalist': {
            text: 'Ja. Tintenflecken an den Fingern, Strassendreck an den Stiefeln. Sie kennen Freiburgs Geheimnisse, weil Sie sie fruher gedruckt haben. Heute Morgen verliessen Sie Stuttgart mit einem Einwegticket und schwerem Herzen. Die Stadt hat Sie zuruckgerufen.',
            choices: {
                'continue': 'Ins Licht treten.'
            }
        },
        'telegram_gate': {
            text: 'Ein Bote druckt Ihnen ein versiegeltes Telegramm in die Hand. Rathauswachs. Eilig. Keine Hoflichkeiten, keine Unterschrift, nur Befehle.',
            choices: {
                'continue': 'Siegel brechen und los.'
            }
        },
        'intro_journey': {
            text: 'Der Zug nach Freiburg stohnt durch den Morgennebel. Kohlenrauch, nasser Stein und eine Stadt, die Antworten verlangt.',
            choices: {}
        }
    }
};

export default introCharCreationDe;
