import type { VNContentPack } from '../../model/types';

export const INTERLUDE_LOTTE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'phone_rings': {
            text: 'The telephone in the booth rings. Sharp. Insistent. Once. Twice. Three times.',
            choices: {
                'answer': 'Answer it.'
            }
        },
        'lotte_speaks': {
            text: '"Inspector?" The voice is tinny, distorted by the wire. It\'s [[Lotte]]. "I... I shouldn\'t be calling. The line is monitored."'
        },
        'lotte_warning': {
            text: '"Commissioner Richter... my father... he gave the order to cut you off. He knows you\'re finding things. Real things. Please, stop. Before they hurt you."',
            choices: {
                'thank_personal': '"Thank you for the warning, Lotte. It means a lot."',
                'dismiss_professional': '"You are violating protocol, Fräulein. Clear the line."'
            }
        },
        'thank_res': {
            text: '"I... I just didn\'t want you to walk into a trap. Be careful, Detective." Click. The line goes dead.'
        },
        'dismiss_res': {
            text: 'A pause. "I see. I won\'t bother you again." Click. The line goes dead.'
        }
    }
};
