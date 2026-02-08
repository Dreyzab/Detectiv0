import type { VNContentPack } from '../../../../../model/types';
import { CASE1_HBF_ARRIVAL_EN } from './case1_hbf_arrival.en';

export const CASE1_HBF_ARRIVAL_DE: VNContentPack = {
    ...CASE1_HBF_ARRIVAL_EN,
    locale: 'de',
    scenes: {
        ...CASE1_HBF_ARRIVAL_EN.scenes,
        'beat3_square': {
            text: 'Vor dem Bahnhof klingeln Strassenbahnen, Kutschen schneiden durch nasses Pflaster. Freiburg ist schon in Bewegung.',
            choices: {
                'beat3_ask_driver': 'Nach dem Weg fragen.',
                'beat3_self_orient': 'An Schildern und Verkehrsfluss orientieren.',
                'beat3_go_blind': 'Schnell los und improvisieren.'
            }
        },
        'beat3_driver_result': {
            text: '"Geradeaus, dann links beim Munster", sagt Schutzmann Fritz Muller knapp. "Und passen Sie auf die Presse am Bankhaus auf."'
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
