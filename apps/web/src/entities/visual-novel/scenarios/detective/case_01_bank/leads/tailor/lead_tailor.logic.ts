import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Lead 2: The Tailor — Leopold Fein
 * 
 * The torn red velvet leads here. The Jewish tailor specializes in 
 * theatrical costumes and might recognize the fabric.
 */

export const LEAD_TAILOR_LOGIC: VNScenarioLogic = {
    id: 'lead_tailor',
    title: 'Schneider\'s Workshop',
    defaultBackgroundUrl: '/images/scenarios/tailor_shop_1905.png',
    initialSceneId: 'entrance',
    mode: 'fullscreen',
    scenes: {
        'entrance': {
            id: 'entrance',
            characterId: 'inspector',
            nextSceneId: 'tailor_greets'
        },
        'tailor_greets': {
            id: 'tailor_greets',
            characterId: 'tailor',
            choices: [
                {
                    id: 'show_fabric',
                    nextSceneId: 'show_fabric_scene',
                    condition: (flags) => flags['found_velvet']
                },
                { id: 'ask_customers', nextSceneId: 'ask_customers' },
                { id: 'browse_stock', nextSceneId: 'browse_stock' },
                { id: 'leave_shop', nextSceneId: 'END' }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // SHOW FABRIC — Main investigation path
        // ─────────────────────────────────────────────────────────────
        'show_fabric_scene': {
            id: 'show_fabric_scene',
            characterId: 'inspector',
            nextSceneId: 'tailor_examines'
        },
        'tailor_examines': {
            id: 'tailor_examines',
            characterId: 'tailor',
            nextSceneId: 'tailor_recognition'
        },
        'tailor_recognition': {
            id: 'tailor_recognition',
            characterId: 'tailor',
            choices: [
                {
                    id: 'perception_check_records',
                    nextSceneId: 'perception_result',
                    skillCheck: {
                        id: 'chk_tailor_perception',
                        voiceId: 'perception',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'perception_success' },
                        onFail: { nextSceneId: 'perception_fail' }
                    }
                },
                { id: 'ask_client', nextSceneId: 'tailor_client_info' },
                { id: 'thank_leave', nextSceneId: 'END' }
            ]
        },
        'perception_success': {
            id: 'perception_success',
            characterId: 'inspector',
            nextSceneId: 'tailor_caught',
            onEnter: [
                { type: 'add_flag', payload: { 'saw_tailor_ledger': true } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_tailor_ledger_entry',
                        name: 'Masked Order',
                        description: 'Leopold\'s ledger shows an anonymous cash order for a "black theatrical cape with red lining" - picked up last week.',
                        packId: 'fbg1905'
                    }
                }
            ]
        },
        'perception_fail': {
            id: 'perception_fail',
            characterId: 'inspector',
            nextSceneId: 'tailor_client_info'
        },
        'tailor_caught': {
            id: 'tailor_caught',
            characterId: 'tailor',
            nextSceneId: 'tailor_description'
        },
        'tailor_client_info': {
            id: 'tailor_client_info',
            characterId: 'tailor',
            nextSceneId: 'END'
        },
        'tailor_description': {
            id: 'tailor_description',
            characterId: 'tailor',
            nextSceneId: 'END',
            onEnter: [
                { type: 'add_flag', payload: { 'tailor_lead_complete': true } },
                { type: 'unlock_point', payload: 'loc_student_house' },
                { type: 'unlock_point', payload: 'loc_street_event' } // Interlude A
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // ALTERNATIVE PATHS
        // ─────────────────────────────────────────────────────────────
        'ask_customers': {
            id: 'ask_customers',
            characterId: 'tailor',
            nextSceneId: 'tailor_greets'
        },
        'browse_stock': {
            id: 'browse_stock',
            characterId: 'inspector',
            nextSceneId: 'tailor_greets'
        }
    }
};

export default LEAD_TAILOR_LOGIC;

