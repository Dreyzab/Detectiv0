import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_INTRO_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'agency_arrival': {
            text: 'A modest office on the upper floor of a Karlsruhe Altstadt building. The brass nameplate on the door still smells of polish. Through the window, you see the bustle of [[Kaiserstrasse|kw_kaiserstrasse]].'
        },
        'partner_introduction': {
            text: 'A figure rises from the desk. "Ah, so you are the new investigator. I am your partner for the Karlsruhe region. Just call me Clara."'
        },
        'case_briefing': {
            text: '"We have three cases on the table. A worried banker whose son disappears every night. The mayor who has lost his dog, most embarrassing. And an estate on the outskirts with... unusual occurrences."',
            choices: {
                'accept_cases': 'Accept the cases and go to the map'
            }
        },
        'cases_accepted': {
            text: 'Clara spreads three case files across the desk. The locations appear on your map. Your investigations in Karlsruhe begin.',
            choices: {
                'to_map': 'Step out and open the city map'
            }
        }
    }
};

export default SANDBOX_INTRO_EN;
