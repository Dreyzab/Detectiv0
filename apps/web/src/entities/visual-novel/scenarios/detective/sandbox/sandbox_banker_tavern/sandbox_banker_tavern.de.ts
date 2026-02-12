import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_TAVERN_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        tavern_intro: {
            text: 'Rauch, Karten, geduckte Stimmen. Friedrichs Name faellt nur zusammen mit dem Initial W.',
            choices: {
                bribe_barkeep: 'Den Wirt fuer Details bezahlen',
                intimidate_witness: 'Einen Zeugen unter Druck setzen',
                leave_tavern: 'Die Taverne verlassen'
            }
        },
        bribe_success: {
            text: 'Der Wirt redet: Friedrich spielte, um Schulden zu tilgen, und gab Chips an einen Mann in Grau weiter.'
        },
        bribe_fail: {
            text: 'Der Wirt kassiert und bleibt vage. Ein verwertbarer Hinweis Richtung Casino bleibt trotzdem.'
        },
        intimidate_success: {
            text: 'Der Zeuge knickt ein und nennt einen Croupier-Vermerk mit Bezug zum Initial W.'
        },
        intimidate_fail: {
            text: 'Der Raum verstummt. Eine Notspur bestaetigt dennoch Friedrichs naechtliche Casino-Routine.'
        },
        tavern_outro: {
            text: 'Clara: "Der naechste Schritt ist das Casino. Dort klaert sich die Kette."',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_BANKER_TAVERN_DE;
