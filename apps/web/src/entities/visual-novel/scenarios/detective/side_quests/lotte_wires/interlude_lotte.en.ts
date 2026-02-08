import type { VNContentPack } from '../../../../model/types';

export const INTERLUDE_LOTTE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'phone_rings': {
            text: 'A telegraph office handset rings once, then again. The clerk points at you as if he was told to expect exactly this moment.'
        },
        'lotte_speaks': {
            text: '"Inspector?" The voice arrives in fragments through static. It is [[Lotte]]. "Keep this brief. The city switchboard is being watched."'
        },
        'lotte_warning': {
            text: '"Your lead pattern is visible," Lotte whispers. "Someone in the Presidium is routing surveillance through maintenance lines. If you keep pushing, they will move before you do."',
            choices: {
                'thank_personal': '"You did the right thing, Lotte. Keep feeding me what they miss."',
                'dismiss_professional': '"Understood. Return to protocol and forget this call happened."'
            }
        },
        'thank_res': {
            text: '"Then we continue carefully," she says. "Come by the switchboard when you can. I found something buried in the dead channels." The line clicks dead.'
        },
        'dismiss_res': {
            text: 'A pause. "Fine. Professional, then. If you change your mind, ask for me at the central board." The line goes dead.'
        }
    }
};

export default INTERLUDE_LOTTE_EN;
