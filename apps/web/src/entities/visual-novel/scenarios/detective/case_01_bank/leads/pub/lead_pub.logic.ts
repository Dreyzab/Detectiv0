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
                {
                    id: 'follow_night_guard_rumor',
                    nextSceneId: 'pub_night_guard_path',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['rumor_night_guard'] && !flags['pub_asked_night_guard']
                },
                { id: 'approach_gustav', nextSceneId: 'gustav_intro' },
                { id: 'ask_barkeep', nextSceneId: 'barkeep_intro' },
                { id: 'eavesdrop', nextSceneId: 'eavesdrop' }
            ]
        },
        'pub_night_guard_path': {
            id: 'pub_night_guard_path',
            characterId: 'inspector',
            nextSceneId: 'gustav_intro',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'pub_asked_night_guard': true,
                        'clue_night_guard_pub_confirmed': true
                    }
                }
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
                    id: 'mention_hartmann_payments',
                    nextSceneId: 'gustav_hartmann_reply',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_hartmann_internal_contact'] && !flags['gustav_asked_hartmann'],
                    actions: [{ type: 'add_flag', payload: { 'gustav_asked_hartmann': true } }]
                },
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
        'gustav_hartmann_reply': {
            id: 'gustav_hartmann_reply',
            characterId: 'cleaner',
            nextSceneId: 'gustav_suspicious',
            onEnter: [
                { type: 'add_flag', payload: { 'clue_hartmann_cash_runner': true } }
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
                { type: 'add_flag', payload: { 'pub_lead_complete': true } },
                { type: 'unlock_point', payload: 'loc_telephone' }
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
                { id: 'barkeep_ask_rumors', nextSceneId: 'barkeep_rumors' },
                {
                    id: 'ask_previous_investigator',
                    nextSceneId: 'barkeep_previous_investigator',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_previous_investigator'] &&
                        !flags['barkeep_prev_investigator_asked']
                }
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
        'barkeep_previous_investigator': {
            id: 'barkeep_previous_investigator',
            characterId: 'innkeeper',
            nextSceneId: 'entrance',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'barkeep_prev_investigator_asked': true,
                        'clue_previous_investigator_last_seen_pub': true
                    }
                }
            ]
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

