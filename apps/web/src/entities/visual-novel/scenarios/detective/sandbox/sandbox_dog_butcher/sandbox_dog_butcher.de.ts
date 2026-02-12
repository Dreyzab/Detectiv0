import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_BUTCHER_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        butcher_intro: {
            text: 'Der Metzger wischt sein Messer ab und mustert Sie. Auf dem Boden liegt Schmelzwasser mit Fettspuren.',
            choices: {
                question_butcher: 'Nach Bruno fragen',
                inspect_counter: 'Den Verkaufstisch untersuchen',
                leave_shop: 'Vorerst gehen'
            }
        },
        butcher_statement: {
            text: '"Der grosse braune Hund? Bruno frisst hier zweimal taeglich", sagt der Metzger. "Danach zieht er weiter zur Baeckerei."'
        },
        butcher_trace_success: {
            text: 'Sie finden hinter der Tuer Fettpapier mit feinem Mehl. Clara nickt: "Sauber. Metzger, dann Baeckerei."'
        },
        butcher_trace_fail: {
            text: 'Die feinen Spuren entgehen Ihnen, doch der Metzger weist dennoch zur Baeckergasse.'
        },
        butcher_outro: {
            text: 'Die naechste Spur fuehrt eindeutig zur Baeckerei.',
            choices: {
                return_to_map: 'Zur Karte zurueck'
            }
        }
    }
};

export default SANDBOX_DOG_BUTCHER_DE;
