import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_BAKERY_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        bakery_intro: {
            text: 'Warmer Hefeduft liegt in der Luft. Die Baeckerin erkennt Bruno sofort.',
            choices: {
                question_baker: 'Fragen, wohin Bruno lief',
                inspect_flour_marks: 'Pfotenabdruecke im Mehl verfolgen',
                leave_bakery: 'Vorerst gehen'
            }
        },
        baker_statement: {
            text: '"Er stiehlt suesse Brotkanten und rennt in den Schlossgarten", seufzt die Baeckerin. "Viel Herz, noch mehr Hunger."'
        },
        flour_success: {
            text: 'Sie folgen den mehligen Pfotenabdruecken bis zur Parkstrasse. Clara nickt: "Direkte Linie. Kein Umweg."'
        },
        flour_fail: {
            text: 'Die feinen Spuren verlieren sich, doch die Baeckerin weist auf denselben Ort: Schlossgarten.'
        },
        bakery_outro: {
            text: 'Bruno duerfte im Schlossgarten sein.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_DOG_BAKERY_DE;
