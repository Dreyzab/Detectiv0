import type { VNContentPack } from '../../../../model/types';

export const questInspectorViennaDe: VNContentPack = {
    locale: 'de',
    scenes: {
        arrival: {
            text: 'Das Bureau ist dunkel, nur die Glut eines sterbenden Feuers wirft Licht. Richter sitzt am Schreibtisch, in einer Hand ein Schnapsglas, in der anderen ein zerknitterter Brief. Er starrt auf das Papier, als ware es ein Todesurteil.',
            choices: {
                approach: 'Sich raeuspern.'
            }
        },
        intro_dialogue: {
            text: 'Er blickt nicht auf. "Gehen Sie heim. Die Stadt kann eine Nacht auch ohne uns verfaulen." Seine Stimme ist schwer, aber nicht vom Alkohol. Es ist Trauer.',
            choices: {
                ask_letter: '"Schlechte Nachrichten aus Wien, Herr Inspektor?"',
                offer_drink: 'Sich ein Glas einschenken und schweigend setzen.'
            }
        },
        letter_deflection: {
            text: 'Seine Hand knuellt das Blatt brutal zusammen. "Geht Sie einen Dreck an. Ein Mann darf Geheimnisse haben, oder? Selbst in diesem verdammten Panoptikum."',
            choices: {
                press_authority: '[Autoritat] "Wir sind Partner. Wenn etwas Sie kompromittiert, kompromittiert es den Fall. Reden Sie."',
                back_off: 'Seine Privatsphare respektieren und gehen.'
            }
        },
        drink_shared: {
            text: 'Sie trinken. Die Uhr tickt. Richter seufzt, der Widerstand rinnt aus ihm heraus. "Sie schreibt mir jedes Jahr. Meine Tochter. Sie halt mich fur einen Helden. Einen Ritter des Reichs." Er lacht, bitter und zersplittert.',
            choices: {
                ask_softly: '[Empathie] "Dem Bild gerecht zu werden ist schwer. Aber Sie konnen es versuchen."'
            }
        },
        letter_revealed: {
            text: '[[empathy|Empathie Erfolg]]: Er streicht den Brief glatt. "Sie heiratet. Sie will, dass ich sie zum Altar fuhre. Ich. Ein Mann, der beruflich Finger bricht." Er sieht Sie mit nassen Augen an. "Vielleicht... vielleicht fahre ich. Nur fur eine Woche." Er faltet den Brief sorgfaltig und steckt ihn nah ans Herz.',
            choices: {
                leave_respect: '"Sie sollten fahren, Hans. Die Stadt wartet."'
            }
        },
        letter_burned: {
            text: '[[empathy|Empathie Fehlschlag]]: Er starrt ins Feuer. "Lugen. Alles Lugen. Ich bin dieser Mann nicht mehr." Er wirft den Brief in die Glut. Er rollt sich, schwarzelt und wird Asche. "Die Vergangenheit ist tot. Und wir auch."',
            choices: {
                leave_silent: 'Ihn in seiner Dunkelheit zurucklassen.'
            }
        },
        end_success: {
            text: 'Richter nickt. Ein stilles Band ist entstanden. Er wird das nicht vergessen.',
            choices: {}
        },
        end_fail: {
            text: 'Sie schliessen die Tur. Hinter Ihnen klingt die Flasche gegen das Glas. Wieder. Und wieder.',
            choices: {}
        }
    }
};

export default questInspectorViennaDe;
