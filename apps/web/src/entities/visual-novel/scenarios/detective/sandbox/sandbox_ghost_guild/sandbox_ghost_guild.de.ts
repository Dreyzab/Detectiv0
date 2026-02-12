import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_GUILD_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        guild_intro: {
            text: 'In der Ermittlergilde haengen Karten und Sektionsskizzen an Eichenwaenden. Clara fragt, welches Muster zuerst geprueft werden soll.',
            choices: {
                present_supernatural_pattern: 'Uebernatuerliches Muster vorlegen',
                present_contraband_pattern: 'Schmuggel-Muster vorlegen',
                ask_for_neutral_method: 'Nach neutraler Methode fragen'
            }
        },
        guild_supernatural: {
            text: 'Der Gildenmeister markiert Luftzug und Rueckstand. "Wenn das gestellt ist, dann mit teurer Chemie und viel Aufwand."'
        },
        guild_contraband: {
            text: 'Er tippt auf den Geheimgang. "Schmuggler tarnen ihre Wege gern als Geistergeschichte. Folgen Sie der Logistik."'
        },
        guild_neutral: {
            text: '"Verlieben Sie sich nicht in die erste Theorie", warnt der Meister. "Beschuldigen Sie nur, was zwei getrennte Hinweise tragen."'
        },
        guild_outro: {
            text: 'Ihr Beschuldigungsrahmen steht. Kehren Sie zum Anwesen zurueck und sprechen Sie das Urteil.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_GHOST_GUILD_DE;
