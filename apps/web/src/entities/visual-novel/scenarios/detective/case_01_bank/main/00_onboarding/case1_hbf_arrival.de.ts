import type { VNContentPack } from '../../../../../model/types';
import { CASE1_HBF_ARRIVAL_EN } from './case1_hbf_arrival.en';

export const CASE1_HBF_ARRIVAL_DE: VNContentPack = {
    ...CASE1_HBF_ARRIVAL_EN,
    locale: 'de',
    scenes: {
        ...CASE1_HBF_ARRIVAL_EN.scenes,
        'beat1_atmosphere': {
            text: 'Der Zug kommt mit einem Quietschen der Bremsen zum Stehen. Dampf füllt den Bahnsteig und versperrt die Sicht. Die Luft riecht nach Kohle und feuchtem Stein.'
        },
        'beat1_spot_fritz': {
            text: 'Passagiere strömen heraus, ein chaotischer Fluss aus Mänteln und Koffern.',
            choices: {
                'choice_approach_fritz': 'Auf den uniformierten Mann zugehen.',
                'choice_investigate_station': 'Erst die Station untersuchen.'
            }
        },
        'beat2_paperboy': {
            text: 'Ein junger Zeitungsjunge schreit Schlagzeilen, aber seine Augen wandern nervös umher.',
            choices: {
                'beat2_buy_newspaper': 'Zeitung kaufen (1 Mark).',
                'beat2_glance_headline': 'Nur die Schlagzeile lesen.'
            }
        },
        'beat3_square': {
            text: 'Vor dem Bahnhof klingeln Strassenbahnen, Kutschen schneiden durch nasses Pflaster. Freiburg ist schon in Bewegung.',
            choices: {}
        },
        'beat_fritz_priority': {
            text: '"Ich bin Schutzmann Fritz Muller, Freiburger Polizei. Der Bankraub setzt uns unter Druck, und der Burgermeister fordert sofort Ergebnisse. Ihre Entscheidung: zuerst zur Bank oder zuerst ins Rathaus?"',
            choices: {
                'priority_bank_first': 'Hauptauftrag: Bank. Nebenauftrag: Burgermeister.',
                'priority_mayor_first': 'Hauptauftrag: Burgermeister. Nebenauftrag: Bank.'
            }
        },
        'hbf_finalize': {
            text: 'Ankunft abgeschlossen. Die Karte ist offen: Bankhaus Krebs und Rathaus stehen als Ziele bereit.'
        }
    }
};

export default CASE1_HBF_ARRIVAL_DE;
