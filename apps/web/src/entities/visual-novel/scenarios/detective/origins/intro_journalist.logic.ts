import type { VNScenarioLogic } from '../../../model/types';

/**
 * Origin: Journalist
 * Scene: Cafe Riegler
 * 
 * Introduces Anna Mahler and the "Key Secret".
 */

export const INTRO_JOURNALIST_LOGIC: VNScenarioLogic = {
    id: 'intro_journalist',
    packId: 'fbg1905',
    title: 'Cafe Riegler - News & Nerves',
    defaultBackgroundUrl: '/images/scenarios/pub_interior_1905.webp', // Temporary placeholder for Cafe Riegler
    initialSceneId: 'start',
    mode: 'fullscreen',
    scenes: {
        'start': {
            id: 'start',
            characterId: 'journalist', // Anna Mahler
            choices: [
                {
                    id: 'shivers_check',
                    nextSceneId: 'shivers_realization'
                },
                {
                    id: 'selective_excavation',
                    nextSceneId: 'key_secret'
                }
            ]
        },
        'shivers_realization': {
            id: 'shivers_realization',
            characterId: 'inspector',
            nextSceneId: 'key_secret',
            onEnter: [
                { type: 'add_flag', payload: { 'used_shivers_intro': true } }
            ]
        },
        'key_secret': {
            id: 'key_secret',
            characterId: 'journalist',
            nextSceneId: 'messenger_arrival'
        },
        'messenger_arrival': {
            id: 'messenger_arrival',
            characterId: 'inspector', // Narration or internal focus on telegram
            choices: [
                {
                    id: 'show_seal',
                    nextSceneId: 'show_telegram',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'journalist', amount: 15 } },
                        { type: 'add_flag', payload: { 'anna_knows_secret': true } }
                    ]
                },
                {
                    id: 'hide_seal',
                    nextSceneId: 'exit_scene'
                }
            ]
        },
        'show_telegram': {
            id: 'show_telegram',
            characterId: 'inspector',
            nextSceneId: 'anna_tip'
        },
        'anna_tip': {
            id: 'anna_tip',
            characterId: 'journalist',
            nextSceneId: 'exit_scene',
            onEnter: [
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_bank_master_key',
                        name: 'The Master Key Rumor',
                        description: 'Anna says the vault was opened with a master key. Only a few exist.',
                        packId: 'journalist_origin'
                    }
                }
            ]
        },
        'exit_scene': {
            id: 'exit_scene',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                { type: 'add_flag', payload: { 'met_anna_intro': true } },
                { type: 'unlock_point', payload: 'loc_rathaus' } // Mayor is waiting
            ]
        }
    }
};

export default INTRO_JOURNALIST_LOGIC;
