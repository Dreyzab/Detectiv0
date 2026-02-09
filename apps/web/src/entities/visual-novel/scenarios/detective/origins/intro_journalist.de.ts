import type { VNContentPack } from '../../../model/types';

export const introJournalistDe: VNContentPack = {
    locale: 'de',
    scenes: {
        'start': {
            text: 'Eine Wolke aus teurem Zigarettenrauch hangt zwischen Ihnen und Anna. Sie tippt mit dem Bleistift gegen die Marmorplatte im Cafe Riegler. "Seit du den Fuller gegen die Lupe getauscht hast, Arthur, bist du noch kryptischer geworden. Du siehst aus wie ein Mann, der weiss, wo die Leichen liegen, aber zu faul ist zu graben."',
            choices: {
                'shivers_check': '[Schauder] Augen schliessen und die Schwingung des Bodens spuren.',
                'selective_excavation': '"Ein Detektiv grabt nur, wenn der Auftraggeber auch die Schaufel bezahlt, Anna. Ich bleibe lieber sauber."'
            }
        },
        'shivers_realization': {
            text: 'Die Tasse kalten Kaffees auf Ihrem Tisch vibriert. Tief unter der nach Kaffee riechenden Altstadt laufen die grossen Rotationsmaschinen der *Freiburger Zeitung* im Takt, aber heute... stolpert der Schlag. Hoher Druck. Hohe Einsatze. "Spurst du das? Der Druckrhythmus ist falsch. Die Dreisam fliesst heute schneller. Die Stadt ist nervos, Anna."',
            choices: {
                'continue': 'Sie sieht Sie an, als ware Ihnen ein zweiter Kopf gewachsen.'
            }
        },
        'key_secret': {
            text: '"Du und deine "Gefuhle". Ich fuhle vor allem die Deadline der Morgenausgabe", seufzt Anna, dann lehnt sie sich vor und flustert scharf: "Muller hat mir gesteckt, dass der Tresor nicht aufgebrochen wurde. Er wurde mit einem Schlussel geoffnet. Aber im Bericht steht kein Wort dazu. Was hast du, Arthur?"',
            choices: {
                'continue': 'Ein Botenjunge mit zerschlissener blauer Kappe rutscht neben Ihren Tisch.'
            }
        },
        'messenger_arrival': {
            text: '"Telegramm fur Herrn Vance! Heute Morgen aus dem Rathaus!" Der Junge legt einen Umschlag mit schwerem violettem Wachssiegel auf den Tisch. "Man sagte, Sie seien gerade aus Stuttgart eingetroffen. Willkommen zuruck im Zirkus, mein Herr." Annas Augen weiten sich, als sie das personliche Wappen des Burgermeisters erkennt.',
            choices: {
                'show_seal': 'Ihr das Siegel zeigen. "Sieht aus, als bekamen wir eine Exklusivgeschichte. Aber halt den Mund."',
                'hide_seal': 'Telegramm wortlos einstecken.'
            }
        },
        'show_telegram': {
            text: 'Sie halten den Umschlag lange genug hoch, damit sie das Rathaussiegel sieht. "Sieht aus, als bekamen wir eine Exklusivgeschichte. Aber halt den Mund, Anna. Wenn das rausgeht, bevor ich drin bin, trocknen unsere Quellen aus wie die Bachle im August."',
            choices: {
                'continue': 'Annas Grinsen wird zu echtem Interesse.'
            }
        },
        'anna_tip': {
            text: '"Der Burgermeister selbst? Gott, Vance... du bist wirklich der Lieblingsstreuner dieser Stadt. Nimm das: Meine Quelle im Prasidium sagt, der "Schlussel" war keine Kopie. Es war der Generalschlussel. Nur drei Leute haben ihn. Galdermann, der Burgermeister und der Polizeichef."',
            choices: {
                'continue': 'Sie leeren den letzten kalten Kaffee und stehen auf.'
            }
        },
        'exit_scene': {
            text: 'Sie trinken den Kaffee in einem bitteren Zug aus, richten den Fedora und stehen auf. "Arbeit wartet nicht. Auf Wiedersehen, Anna." Sie sieht Ihnen nach und greift bereits nach dem Notizbuch. "Trocken wie Knochen, Vance. Kriech nicht zu mir, wenn du einen Titelblatt-Gefallen brauchst!"',
            choices: {}
        }
    }
};

export default introJournalistDe;
