import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAYOR_FOLLOWUP_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'entry_after_bank': {
            text: 'Burgermeister Thoma faltet die Hande. "Sie haben Clara zuerst in der Bank getroffen und erst danach das Rathaus besucht. Nicht ideal, aber wir arbeiten damit."',
            choices: {
                'mayor_after_bank_ack': '"Ich bin der starksten Spur zuerst gefolgt. Jetzt koordinieren wir."',
                'mayor_after_bank_pressure': '"Ihr Amt hat Zeit gekostet. Ich brauche Zugriff, keine Reden."'
            }
        },
        'entry_after_mayor_first': {
            text: 'Burgermeister Thoma blickt in einen Stapel Aussagen. "Sie hatten bereits Ihr offizielles Briefing. Halten wir es kurz."'
        },
        'clara_after_bank': {
            text: 'Clara tritt vom Fenster zuruck. "In der Bank hatten wir nur Fragmente. Hier konnen wir Zeitlinien und Druckpunkte sauber abgleichen."',
            choices: {
                'clara_after_bank_share': '"Gut. Sagen Sie mir, was Ihr Vater verschweigt."',
                'clara_after_bank_distance': '"Ich folge meiner eigenen Spur. Geben Sie mir nur belastbare Fakten."'
            }
        },
        'clara_after_mayor_first': {
            text: 'Clara nickt knapp. "Gleiches Ziel, engerer Rahmen. Politik raus, Beweise rein."',
            choices: {
                'clara_after_mayor_first_sync': '"Verstanden. Geben Sie mir das Update, dann gehen wir weiter."'
            }
        },
        'followup_finalize': {
            text: 'Rathaus-Abgleich abgeschlossen. Clara und der Burgermeister sind mit Ihrer aktuellen Route synchronisiert.'
        }
    }
};

export default CASE1_MAYOR_FOLLOWUP_DE;
