import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_MAYOR_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        mayor_briefing: {
            text: 'Buergermeister Pfeiffer schliesst die Tuer. "Detektiv, mein Hund Bruno ist verschwunden. Wenn die Stadt davon erfaehrt, bin ich morgen die Schlagzeile."',
            choices: {
                accept_case: 'Den Auftrag annehmen',
                press_for_details: 'Nach dem politischen Risiko fragen',
                decline_for_now: 'Vorerst ablehnen'
            }
        },
        public_risk: {
            text: '"Die Opposition behauptet bereits, ich koenne nicht einmal mein Viertel fuehren", murmelt er. "Bringen Sie Bruno vor Sonnenuntergang zurueck."'
        },
        mayor_details: {
            text: 'Clara markiert das Metzgerviertel auf Ihrer Karte. "Bruno folgt dem Futter: zuerst Metzger, dann Baeckerei, dann Park."',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_DOG_MAYOR_DE;
