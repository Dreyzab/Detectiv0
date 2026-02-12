import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_INTRO_DE: VNContentPack = {
    locale: 'de',
    scenes: {
        'agency_arrival': {
            text: 'Eine bescheidene Bueroetage in der Karlsruher Altstadt. Das Messingschild an der Tuer riecht noch nach Politur. Durch das Fenster sieht man das geschäftige Treiben der [[Kaiserstrasse|kw_kaiserstrasse]].'
        },
        'partner_introduction': {
            text: 'Eine Gestalt erhebt sich vom Schreibtisch. "Ah, Sie sind also der neue Ermittler. Ich bin Ihre Partnerin fuer die Region Karlsruhe. Nennen Sie mich einfach Clara."'
        },
        'case_briefing': {
            text: '"Wir haben drei Faelle auf dem Tisch. Ein besorgter Bankier, dessen Sohn jede Nacht verschwindet. Der Buergermeister, der seinen Hund vermisst, hoechst peinlich. Und ein Anwesen am Stadtrand mit... ungewoehnlichen Vorkommnissen."',
            choices: {
                'accept_cases': 'Die Faelle annehmen und zur Karte gehen'
            }
        },
        'cases_accepted': {
            text: 'Clara breitet drei Akten auf dem Schreibtisch aus. Die Punkte erscheinen auf Ihrer Karte. Die Ermittlungen in Karlsruhe beginnen.',
            choices: {
                'to_map': 'Nach draussen gehen und Stadtkarte oeffnen'
            }
        }
    }
};

export default SANDBOX_INTRO_DE;
