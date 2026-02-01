import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Lead 1: The Pub — Find the Bächleputzer
 * 
 * The player follows the lead about the shadow witness.
 * Gustav, the canal cleaner, drinks here every evening.
 */

export const LEAD_PUB_LOGIC: VNScenarioLogic = {
    id: 'lead_pub',
    title: 'Gasthaus "Zum Schlappen"',
    defaultBackgroundUrl: '/images/scenarios/pub_interior_1905.png',
    initialSceneId: 'entrance',
    mode: 'fullscreen',
    scenes: {
        'entrance': {
            id: 'entrance',
            characterId: 'inspector',
            choices: [
                { id: 'approach_gustav', nextSceneId: 'gustav_intro' },
                { id: 'ask_barkeep', nextSceneId: 'barkeep_intro' },
                { id: 'eavesdrop', nextSceneId: 'eavesdrop' }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // GUSTAV — The Bächleputzer
        // ─────────────────────────────────────────────────────────────
        'gustav_intro': {
            id: 'gustav_intro',
            characterId: 'cleaner',
            nextSceneId: 'gustav_suspicious'
        },
        'gustav_suspicious': {
            id: 'gustav_suspicious',
            characterId: 'cleaner',
            choices: [
                {
                    id: 'charisma_buy_drink',
                    nextSceneId: 'gustav_charisma_result',
                    skillCheck: {
                        id: 'chk_pub_charisma_gustav',
                        voiceId: 'charisma',
                        difficulty: 8,
                        onSuccess: { nextSceneId: 'gustav_charisma_success' },
                        onFail: { nextSceneId: 'gustav_charisma_fail' }
                    }
                },
                {
                    id: 'authority_badge',
                    nextSceneId: 'gustav_authority_result',
                    skillCheck: {
                        id: 'chk_pub_authority_gustav',
                        voiceId: 'authority',
                        difficulty: 12,
                        onSuccess: { nextSceneId: 'gustav_authority_success' },
                        onFail: { nextSceneId: 'gustav_clams_up' }
                    }
                },
                { id: 'leave_gustav', nextSceneId: 'entrance' }
            ]
        },
        'gustav_charisma_success': {
            id: 'gustav_charisma_success',
            characterId: 'cleaner',
            nextSceneId: 'gustav_reveals'
        },
        'gustav_charisma_fail': {
            id: 'gustav_charisma_fail',
            characterId: 'cleaner',
            nextSceneId: 'gustav_suspicious'
        },
        'gustav_authority_success': {
            id: 'gustav_authority_success',
            characterId: 'cleaner',
            nextSceneId: 'gustav_reveals'
        },
        'gustav_clams_up': {
            id: 'gustav_clams_up',
            characterId: 'cleaner',
            nextSceneId: 'entrance'
        },
        'gustav_reveals': {
            id: 'gustav_reveals',
            characterId: 'cleaner',
            nextSceneId: 'gustav_description',
            onEnter: [
                { type: 'add_flag', payload: { 'gustav_talked': true } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_shadow_witness',
                        name: 'Gustav\'s Testimony',
                        description: 'The Bächleputzer saw a figure in theatrical clothing enter through the scaffolding at 3am.',
                        packId: 'fbg1905'
                    }
                }
            ]
        },
        'gustav_description': {
            id: 'gustav_description',
            characterId: 'cleaner',
            nextSceneId: 'END',
            onEnter: [
                { type: 'unlock_point', payload: 'p_goods_station' }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // BARKEEP — Alternative info source
        // ─────────────────────────────────────────────────────────────
        'barkeep_intro': {
            id: 'barkeep_intro',
            characterId: 'innkeeper',
            choices: [
                { id: 'barkeep_ask_gustav', nextSceneId: 'barkeep_points_gustav' },
                { id: 'barkeep_ask_rumors', nextSceneId: 'barkeep_rumors' }
            ]
        },
        'barkeep_points_gustav': {
            id: 'barkeep_points_gustav',
            characterId: 'innkeeper',
            nextSceneId: 'entrance'
        },
        'barkeep_rumors': {
            id: 'barkeep_rumors',
            characterId: 'innkeeper',
            nextSceneId: 'entrance'
        },

        // ─────────────────────────────────────────────────────────────
        // EAVESDROP — Workers talking
        // ─────────────────────────────────────────────────────────────
        'eavesdrop': {
            id: 'eavesdrop',
            characterId: 'inspector',
            nextSceneId: 'eavesdrop_content'
        },
        'eavesdrop_content': {
            id: 'eavesdrop_content',
            characterId: 'worker',
            nextSceneId: 'entrance',
            onEnter: [
                { type: 'add_flag', payload: { 'heard_warehouse_rumor': true } }
            ]
        }
    }
};

export default LEAD_PUB_LOGIC;
