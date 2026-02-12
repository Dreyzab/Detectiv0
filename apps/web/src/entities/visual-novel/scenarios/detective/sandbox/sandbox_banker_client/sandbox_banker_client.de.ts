import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_CLIENT_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        entry_hall: {
            text: 'Ein Schreiber schliesst die Buerotuer. Herr Richter wartet neben einem offenen Kassenbuch und einem privaten Safe.'
        },
        bank_intro: {
            text: '"Mein Sohn verschwindet jede Nacht", sagt der Bankier. "Geld fehlt aus meinem privaten Safe. Ich brauche Diskretion, keine Polizei."',
            choices: {
                accept_case: 'Den Auftrag annehmen',
                press_motive: 'Nach Motiv und Buchungen druecken'
            }
        },
        press_success: {
            text: 'Unter Druck verrutscht Richter. Sie entdecken frische Korrekturen im Kassenbuch und Wachs auf seinem Handschuh.'
        },
        press_fail: {
            text: 'Er blockt ab und antwortet knapper. Der Auftrag bleibt, aber das Vertrauen sinkt.'
        },
        case_accepted: {
            text: 'Clara markiert zwei Spuren auf Ihrer Karte: Friedrichs Haus und die Taverne.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_BANKER_CLIENT_DE;
