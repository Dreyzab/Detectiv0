import type { VNScenarioLogic } from '../../model/types';

/**
 * Interlude B: The Voice on the Wire
 * Trigger: Automatically after the second Lead is completed.
 * 
 * Skeleton:
 * 1. Telephone call/Telegram.
 * 2. Lotte warns Inspector.
 * 3. Reveals pressure from Commissioner.
 * 4. Inspector chooses stance (Gratitude/Professionalism).
 */

export const INTERLUDE_LOTTE_LOGIC: VNScenarioLogic = {
    id: 'interlude_lotte_warning',
    title: 'Interlude: The Wire',
    defaultBackgroundUrl: '/images/scenarios/black_screen.png', // Abstract or phone booth
    initialSceneId: 'phone_rings',
    mode: 'overlay',
    scenes: {
        'phone_rings': {
            id: 'phone_rings',
            characterId: 'inspector',
            nextSceneId: 'lotte_speaks'
        },
        'lotte_speaks': {
            id: 'lotte_speaks',
            characterId: 'operator',
            nextSceneId: 'lotte_warning'
        },
        'lotte_warning': {
            id: 'lotte_warning',
            characterId: 'operator',
            choices: [
                {
                    id: 'thank_personal',
                    nextSceneId: 'thank_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'operator', amount: 10 } }]
                },
                {
                    id: 'dismiss_professional',
                    nextSceneId: 'dismiss_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'operator', amount: -5 } }]
                }
            ]
        },
        'thank_res': { id: 'thank_res', characterId: 'operator', nextSceneId: 'END' },
        'dismiss_res': { id: 'dismiss_res', characterId: 'operator', nextSceneId: 'END' }
    }
};
