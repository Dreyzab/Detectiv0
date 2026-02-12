import type { VNScenarioLogic } from '../../../../model/types';

export const INTERLUDE_LOTTE_LOGIC: VNScenarioLogic = {
    id: 'interlude_lotte_warning',
    packId: 'fbg1905',
    title: 'Interlude: The Wire',
    defaultBackgroundUrl: '/images/scenarios/black_screen.webp',
    initialSceneId: 'phone_rings',
    mode: 'overlay',
    scenes: {
        'phone_rings': {
            id: 'phone_rings',
            characterId: 'inspector',
            onEnter: [{ type: 'add_flag', payload: { 'lotte_interlude_started': true } }],
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
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'operator', amount: 8 } }]
                },
                {
                    id: 'dismiss_professional',
                    nextSceneId: 'dismiss_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'operator', amount: -4 } }]
                }
            ]
        },
        'thank_res': {
            id: 'thank_res',
            characterId: 'operator',
            nextSceneId: 'END',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'lotte_interlude_complete': true,
                        'lotte_quest_available': true,
                        'lotte_companion_introduced': true,
                        'lotte_warning_heeded': true
                    }
                }
            ]
        },
        'dismiss_res': {
            id: 'dismiss_res',
            characterId: 'operator',
            nextSceneId: 'END',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'lotte_interlude_complete': true,
                        'lotte_quest_available': true,
                        'lotte_companion_introduced': true,
                        'lotte_warning_heeded': false
                    }
                }
            ]
        }
    }
};

export default INTERLUDE_LOTTE_LOGIC;
