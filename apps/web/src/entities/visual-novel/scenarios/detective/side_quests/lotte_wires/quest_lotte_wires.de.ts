import type { VNContentPack } from '../../../../model/types';

export const questLotteWiresDe: VNContentPack = {
    locale: 'de',
    scenes: {
        arrival: {
            text: 'Das Zentrale Telegraphenamt summt im Klicken hundert Maschinen. Lotte steht an einem stillgelegten Terminal in der Ecke, ihre Hande zittern leicht. "Es ist wieder da", flustert sie. "Die Geisterfrequenz. 744 Hz. Offiziell tot, aber ich hore sie."',
            choices: {
                ask_problem: '"Zeigen Sie es mir. Was horen Sie?"'
            }
        },
        explain_problem: {
            text: 'Sie steckt einen Horer in die staubige Konsole. "Horen Sie. Im Rauschen. Es ist nicht zufallig. Punkt-Punkt-Strich... ein Code aus dem Krieg. Jemand sendet uber tote Leitungen innerhalb der Stadt. Und es kommt aus... dem Polizeiprasidium."',
            choices: {
                investigate_console: '[Logik] Das Signal analysieren. Nuchtern bleiben.',
                dismiss_paranoia: '[Autoritat] "Lotte, Sie sind ubermudet. Das ist nur Storung. Kommen Sie."'
            }
        },
        lotte_upset: {
            text: 'Lotte zuckt zuruck, als hatte man sie geschlagen. "Ich dachte, Sie sind anders. Sie sind wie die anderen. Blind." Sie reisst den Horer ab und sturmt hinaus.',
            choices: {
                leave: 'Ihr nachsehen.'
            }
        },
        console_check: {
            text: 'Sie setzen den Horer auf. Das Rauschen ist fast unertraglich, aber... da ist ein Takt. Ein mechanischer Herzschlag unter dem Larm. Sie versuchen, die Frequenz zu isolieren.',
            choices: {
                attempt_decode: 'Auf das Muster fokussieren.'
            }
        },
        decode_success: {
            text: '[[logic|Logik Erfolg]]: Vigenere-Chiffre, aber der Schlussel ist simpel: "ECHO". Sie notieren entschlusselte Fragmente: "...Lieferung bestaetigt... Mitternacht... Lagerhaus 4..." Kein Geist. Ein Schmugglerring uber den Wartungskanal der Polizei. Lotte hatte recht.',
            choices: {
                comfort_lotte: '"Sie sind nicht verruckt, Lotte. Sie haben deren Hintertur gefunden."'
            }
        },
        decode_fail: {
            text: '[[logic|Logik Fehlschlag]]: Nur Rauschen. Zufallige elektrische Entladungen. Sie drehen an den Reglern, suchen ein Muster und erzeugen nur eine schrille Ruckkopplung, die die anderen Schalterbeamten aufschreckt.',
            choices: {
                force_break: 'Konsole frustriert zerschlagen.'
            }
        },
        end_success: {
            text: 'Lotte lachelt, selten und echt. "Ich wusste es. Jetzt haben wir sie." Sie steckt das Transkript ein. "Danke, dass Sie zugehort haben."',
            choices: {}
        },
        end_fail: {
            text: 'Sie stehen allein im Telegraphenamt. Die Maschinen klicken weiter, gleichgultig gegen Ihr Scheitern.',
            choices: {}
        },
        end_broke: {
            text: 'Der Aufseher eilt herbei. "Was soll das?!" Man begleitet Sie hinaus. Lotte tut, als wurde sie Sie nicht kennen.',
            choices: {}
        }
    }
};

export default questLotteWiresDe;
