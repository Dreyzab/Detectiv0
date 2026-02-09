import type { VNContentPack } from '../../../../../model/types';

export const CASE1_FINALE_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'deduction_start': {
            text: 'Sie stehen vor dem [[Alten Lagerhaus]]. Die Puzzleteile wirbeln durch Ihren Kopf. Der **rote Samt** aus der Schneiderei. Die **Chemikalien** aus der Apotheke. Der **Schattenzeuge** aus der Schenke. Es ist Zeit zu entscheiden, welcher Wahrheit Sie folgen.'
        },
        'deduction_choice': {
            text: 'Wer steckt hinter dem Uberfall auf das Bankhaus Krebs?',
            choices: {
                'theory_political': 'Es ist eine politische Provokation. Die "Anarchisten" sind Scheinfiguren der Elite.',
                'theory_criminal': 'Es ist ein Syndikatskrieg. Eine neue Bande fordert Kesslers Kontrolle heraus.'
            }
        },

        'path_political_entry': {
            text: 'Sie schlupfen an der Polizeisperre vorbei. Drinnen sehen Sie keine abgebruhte Verbrechertruppe, sondern verangstigte junge Manner in schlecht sitzender Arbeiterkleidung. Und... ein bekanntes Gesicht, das alles steuert.'
        },
        'political_confrontation': {
            text: '[[Kommissar Richter]]! Er dreht sich um, die Hand am Holster. "Inspektor? Sie sollten nicht hier sein. Das ist eine heikle Operation. Diese "Anarchisten" werden gleich gestehen."',
            choices: {
                'expose_corruption': '[Autoritat] "Lassen Sie die Show, Richter. Ich kenne Kostume, Chemikalien und Ablauf. Das ist ein Buhnenstuck, und Sie sind der Regisseur."'
            }
        },
        'political_victory': {
            text: 'Richter zogert. Dann sieht er Victoria hinter Ihnen aus dem Schatten treten. "Victoria? Mein Gott..." Er senkt die Waffe. "Es waren... Befehle. Von ganz oben. Um die Wahler einzuschuchtern." Der Zugriff wird abgebrochen. Die Wahrheit ist draussen.'
        },
        'political_compromise': {
            text: 'Richter grinst kalt. "Sie haben keine Beweise. Nehmt ihn fest!" Man zieht Sie ab, wahrend der "Zugriff" weiterlaeuft. Die Presse feiert den Sieg uber den Terror, aber Sie kennen die Luge.'
        },

        'path_criminal_entry': {
            text: 'Sie treten die Tur auf. Das Lagerhaus ist ein Kriegsfeld. Manner in teuren Wiener Anzugen schiessen auf Kesslers Schmuggler.'
        },
        'criminal_confrontation': {
            text: 'Ein Mann im samtgefutterten Mantel steht uber einem verwundeten Schmuggler und zielt mit der Pistole. "Freiburg gehort jetzt dem Syndikat!"',
            choices: {
                'stop_violence': '[Willenskraft] Einen Warnschuss abgeben und sich als Polizei zu erkennen geben.'
            }
        },
        'criminal_victory': {
            text: 'Ihr Schuss hallt durch die Halle und zerreisst die Spannung. Draussen ertonen Polizeipfiffe. Der Wiener Fluchtige flucht und entkommt durch das Oberlicht. Das Massaker ist verhindert, aber der Krieg hat erst begonnen.'
        },
        'criminal_chaos': {
            text: 'Das Schussfeuer ubertonte Ihre Stimme. Ein Querschlager streift Ihre Schulter. Als Verstaerkung eintrifft, ist das Lagerhaus ein Leichenhaus. Das Syndikat hat seine Botschaft in Blut geschrieben.'
        },

        'END_POLITICAL': { text: 'FALL ABGESCHLOSSEN. Ergebnis: Die Verschworung ist aufgedeckt. Der Burgermeister nimmt Schaden, aber Unschuldige kommen frei.' },
        'END_POLITICAL_BAD': { text: 'FALL ABGESCHLOSSEN. Ergebnis: Die Luge wird zur Geschichte. Sie sind diskreditiert.' },
        'END_CRIMINAL': { text: 'FALL ABGESCHLOSSEN. Ergebnis: Der Bandenkrieg ist gebremst. Fur die Offentlichkeit sind Sie ein Held, fur das Syndikat ein Ziel.' },
        'END_CRIMINAL_BAD': { text: 'FALL ABGESCHLOSSEN. Ergebnis: Blutbad. Die Stadt versinkt in Angst.' },
        'credits': { text: 'GLUCKWUNSCH. Sie haben die Open-City-Ermittlungsdemo abgeschlossen.' }
    }
};

export default CASE1_FINALE_DE;
