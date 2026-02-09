import type { VNContentPack } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'beat1_atmosphere': {
            text: 'Der Zug kommt mit einem durchdringenden Quietschen der Bremsen zum Stehen. Dampf fullt den Bahnsteig und verdeckt die Umrisse des Bahnhofs. Die Luft riecht nach Kohlenrauch und feuchtem Stein.\n\nSie steigen aus dem Wagen und spuren die Morgenkalte durch den Mantel. Eine Menge Passagiere drangt zum Ausgang - Hute, Koffer, Regenschirme. Niemand achtet auf Sie.\n\nIrgendwo voraus liegt Freiburg. Und der Fall, der Sie hergebracht hat.'
        },
        'beat1_spot_fritz': {
            text: 'Der Dampf lichtet sich etwas. In der wogenden Menge bemerken Sie eine Gestalt, die unnaturlich still dasteht - ein Mann in dunkler Schutzmann-Uniform mit markanter Pickelhaube.\n\nSeine Augen scannen methodisch die Passagiere. Als sich Ihre Blicke treffen, nickt er knapp.',
            choices: {
                'choice_approach_fritz': 'Direkt auf den Beamten zugehen.',
                'choice_investigate_station': 'Zuerst den Bahnhof uberblicken.'
            }
        },
        'beat2_paperboy': {
            text: 'Ein junger Zeitungsjunge ruft Schlagzeilen neben einem Pfeiler, doch seine Augen huschen nervos durch die Halle.',
            choices: {
                'beat2_buy_newspaper': 'Zeitung kaufen (1 Mark).',
                'beat2_glance_headline': 'Nur kurz die Schlagzeile lesen.'
            }
        },
        'beat2_buy_result': {
            text: 'Sie reichen eine Munze. Der Junge wirft Ihnen die Zeitung fast entgegen und weicht schnell zuruck.\n\nDie Schlagzeile brullt: "IMPERIALE BANK AUSGERAUBT - POLIZEI RATLOS". Ein Zeugenname springt ins Auge: Hartmann. Sie falten das Blatt und stecken es ein.'
        },
        'beat2_glance_result': {
            text: 'Die Schlagzeile ist schon von hier zu lesen: "IMPERIALE BANK AUSGERAUBT". Ganz Freiburg weiss Bescheid. Sie starten ohne den Vorteil der Uberraschung.'
        },
        'beat3_square': {
            text: 'Vor dem Bahnhof klingeln Strassenbahnen, Kutschen schneiden durch nasses Pflaster. Freiburg ist bereits in Bewegung.\n\nZwei Beamte stehen am Brunnen und sprechen gedampft. Einer nennt einen Namen, den Sie sich merken: Galdermann.'
        },
        'beat_fritz_priority': {
            text: '"Schutzmann Fritz Muller, Freiburger Polizei. Bankhaus Krebs wurde hart getroffen, und Burgermeister Thoma verlangt sofort Antworten. Ihre Entscheidung, Detektiv: zuerst Bank oder zuerst Rathaus?"',
            choices: {
                'priority_bank_first': 'Hauptauftrag: Bank. Nebenauftrag: Burgermeister.',
                'priority_mayor_first': 'Hauptauftrag: Burgermeister. Nebenauftrag: Bank.'
            }
        },
        'hbf_finalize': {
            text: 'Ankunft abgeschlossen. Die Freiburg-Karte ist offen: Bankhaus Krebs und Rathaus sind jetzt verfugbar.'
        }
    }
};

export default CASE1_HBF_ARRIVAL_DE;
