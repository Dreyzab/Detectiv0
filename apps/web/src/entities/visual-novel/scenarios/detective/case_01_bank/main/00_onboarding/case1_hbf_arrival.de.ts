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
            text: 'Sie reichen dem Jungen eine Munze. Er wirkt uberrascht, druckt Ihnen eine Zeitung in die Hand und zieht die Mutze tiefer ins Gesicht.\n\nNoch bevor Sie weiterlesen, fallt ein Schatten uber den Kioskbereich. Fritz Muller beobachtet die Szene mit ruhigem Blick.'
        },
        'beat_paperboy_theft': {
            text: 'Sie beugen sich nur kurz zur Schlagzeile, ohne zu zahlen. Der Junge stolpert scheinbar zufallig in Sie hinein.\n\nSeine Hand schnellt nach Ihrer Uhr, doch Sie sind schneller und packen sein Handgelenk.\n\nDie Menge geht einen Schritt zuruck. Fritz Muller tritt heran, die Stimme ruhig, aber unmissverstandlich.'
        },
        'choice_paperboy_fate': {
            text: '"Probleme, Herr Detektiv? Dieser Spatz greift wieder nach fremden Taschen?"\n\nDer Junge windet sich in Ihrem Griff und wartet auf Ihr Urteil.',
            choices: {
                'choice_paperboy_mercy': '"Lauf. Und lass dich nicht wieder erwischen." (Gnade)',
                'choice_paperboy_report': '"Ihr Fall, Schutzmann." (An Fritz ubergeben)'
            }
        },
        'beat3_square': {
            text: 'Vor dem Bahnhof klingeln Strassenbahnen, Kutschen schneiden durch nasses Pflaster. Freiburg ist bereits in Bewegung.\n\nAm Brunnen sprechen Beamte leise miteinander. Einer nennt einen Namen, den Sie sich merken: Galdermann.'
        },
        'beat_fritz_intro_direct': {
            text: 'Sie gehen direkt auf den Beamten zu. Fritz erkennt Sie sofort und macht einen Schritt nach vorn.\n\n"Herr Detektiv? Schutzmann Fritz Muller, Freiburger Polizei. Gut, Sie personlich zu treffen."'
        },
        'beat_fritz_intro_indirect': {
            text: 'Sie nahern sich erst nach einem Rundgang durch den Bahnhof. Fritz entlasst seinen jungen Kollegen mit einem knappen Nicken und wendet sich Ihnen zu.\n\n"Sie nehmen sich Zeit, Detektiv. Scharfe Augen. Das konnen wir brauchen."'
        },
        'beat_fritz_mission': {
            text: 'Fritz senkt die Stimme.\n\n"Bankhaus Krebs wurde hart getroffen, und Burgermeister Thoma verlangt sofort Ergebnisse. Ihre Entscheidung: zuerst Bank oder zuerst Rathaus?"',
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
