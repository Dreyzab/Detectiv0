import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAYOR_FOLLOWUP_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'entry_after_bank': {
            text: 'Burgermeister Thoma bleibt stehen, als Sie eintreten. Er verschrankt die Hande so fest, dass die Knochel hell werden.\n\n"Sie waren zuerst in der Bank und erst danach hier. Nicht ideal, Inspektor, aber wir konnen uns jetzt keine gekrankte Etikette leisten."',
            choices: {
                'mayor_after_bank_ack': '"Ich bin der starksten Spur gefolgt. Jetzt synchronisieren wir Befehl und Beweise."',
                'mayor_after_bank_pressure': '"Ihr Amt hat Tempo gekostet. Ich brauche Zugriff und Unterschriften, keine Reden."'
            }
        },
        'entry_after_mayor_first': {
            text: 'Burgermeister Thoma uberfliegt Aussagen, ohne aufzusehen. "Sie hatten das formale Briefing bereits. Gut. Dann nur noch das, was heute den Verlauf verandert."'
        },
        'clara_after_bank': {
            text: 'Clara kommt vom Fenster an den Tisch und legt zwei Mappen ab: Widerspruche in Zeugenaussagen links, politische Drucklinien rechts.\n\n"In der Bank hatten wir Fragmente. Hier legen wir Zeitlinie, Motivdruck und Nutzen aus Verzogerung ubereinander."',
            choices: {
                'clara_after_bank_share': '"Gut. Beginnen Sie mit dem, was Ihr Vater zuruckhalt und warum."',
                'clara_after_bank_distance': '"Ich fahre meine eigene Linie. Geben Sie mir nur belastbare Punkte mit Quelle."'
            }
        },
        'clara_after_mayor_first': {
            text: 'Clara nickt kurz und prazise. "Gleiches Ziel, engerer Rahmen. Politik raus aus der Bewertung, Beweise rein in die Taktung."',
            choices: {
                'clara_after_mayor_first_sync': '"Verstanden. Geben Sie mir das Update-Paket, ich gehe sofort weiter."'
            }
        },
        'followup_finalize': {
            text: 'Rathaus-Follow-up abgeschlossen. Kanale sind synchronisiert, Freigaben gesetzt, und Clara sowie der Burgermeister sind an Ihre aktive Einsatzroute gebunden.'
        }
    }
};

export default CASE1_MAYOR_FOLLOWUP_DE;
