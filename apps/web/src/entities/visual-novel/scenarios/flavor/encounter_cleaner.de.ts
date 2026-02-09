import type { VNContentPack } from '../../model/types';

export const encounterCleanerDe: VNContentPack = {
    locale: 'de',
    scenes: {
        start: {
            text: 'Sie setzen vorsichtig Schritt fur Schritt uber das Kopfsteinpflaster. Die Morgenluft ist klar. Vor Ihnen arbeitet ein **Bachleputzer**, der den kleinen Kanal mit einer Holzschutze staut, um Unrat zu entfernen. Das Wasser wirbelt um seine Gummistiefel.',
            choices: {
                observe: '[Wahrnehmung] Seine Technik beobachten. Vielleicht liegt etwas im Schlamm.',
                greet: '[Charisma] "Guten Morgen, mein Herr. Harte Arbeit?"',
                ignore: 'Uber den Bachle treten und weitergehen.'
            }
        },
        observe_success: {
            text: '[[perception|Wahrnehmung Erfolg]]: Sie sehen zu, wie das Wasser sinkt. Zwischen Schlamm und Zweigen blitzt Metall auf. Keine Munze, sondern ein sonderbarer Knopf von einer formellen Uniform. Militar? Oder Hotelportier? Sie stecken ihn ein. Ein kleines Teil im Puzzle der Stadt.',
            choices: {
                leave: 'Weiter.'
            }
        },
        observe_fail: {
            text: '[[perception|Wahrnehmung Fehlschlag]]: Sie starren auf Matsch. Es bleibt Matsch. Der Reiniger mustert Sie misstrauisch, und Ihnen wird klar, dass Sie zu lange unbeholfen herumstanden.',
            choices: {
                leave: 'Weitergehen.'
            }
        },
        chat_success: {
            text: '[[charisma|Charisma Erfolg]]: Der Mann stutzt sich auf die Schaufel und wischt sich uber die Stirn. "Harte Arbeit, ja. Aber man hort Dinge. Das Wasser tragt Flustern. Gestern Nacht gab es in der **Zahringer Loge** eine Privatfeier. Sehr laut. Glasbruch. Nicht die ubliche Herrenrunde." Er zwinkert.',
            choices: {
                leave: 'Danken und gehen.'
            }
        },
        chat_fail: {
            text: '[[charisma|Charisma Fehlschlag]]: Er grunzt und spritzt Wasser in Ihre Richtung, absichtlich oder nicht. "Beschaftigt, Herr. Auf die Stiefel achten." Offenbar hat er keine Lust auf Plauderei mit einem Anzug wie Ihrem.',
            choices: {
                leave: 'Ihn in Ruhe lassen.'
            }
        },
        end_ignore: {
            text: 'Sie uberschreiten den Bachle mit geubtem Schritt. Die Stadt wartet auf niemanden, Sie ebenfalls nicht. Das Wasserrauschen verblasst hinter Ihnen.',
            choices: {}
        },
        end: {
            text: 'Sie richten den Mantel und gehen weiter. Die Stadt ist wach.',
            choices: {}
        }
    }
};

export default encounterCleanerDe;
