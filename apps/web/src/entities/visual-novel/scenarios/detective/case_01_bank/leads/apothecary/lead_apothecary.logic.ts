import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Lead 3: The Apothecary — Adalbert Weiss
 * 
 * The chemical residue leads here. The apothecary can identify
 * the strange powder found at the vault.
 */

export const LEAD_APOTHECARY_LOGIC: VNScenarioLogic = {
    id: 'lead_apothecary',
    packId: 'fbg1905',
    title: 'Löwen-Apotheke',
    defaultBackgroundUrl: '/images/scenarios/apothecary_1905.webp',
    initialSceneId: 'entrance',
    mode: 'fullscreen',
    scenes: {
        'entrance': {
            id: 'entrance',
            characterId: 'inspector',
            nextSceneId: 'apothecary_greets'
        },
        'apothecary_greets': {
            id: 'apothecary_greets',
            characterId: 'apothecary',
            choices: [
                {
                    id: 'show_residue',
                    nextSceneId: 'show_residue_scene',
                    condition: (flags) => flags['found_residue']
                },
                {
                    id: 'ask_sender_manifest',
                    nextSceneId: 'apothecary_sender_manifest',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_chemical_sender'] && !flags['apothecary_asked_sender']
                },
                {
                    id: 'ask_hartmann_procurement',
                    nextSceneId: 'apothecary_hartmann_reply',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_hartmann_internal_contact'] &&
                        !flags['apothecary_asked_hartmann']
                },
                {
                    id: 'ask_sleep_agent_profile',
                    nextSceneId: 'apothecary_sleep_agent_reply',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_sleep_agent'] &&
                        !flags['apothecary_asked_sleep_agent']
                },
                {
                    id: 'ask_relic_chain',
                    nextSceneId: 'apothecary_relic_gap_reply',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_relic_gap'] &&
                        !flags['apothecary_asked_relic_gap']
                },
                { id: 'ask_poisons', nextSceneId: 'ask_poisons' },
                { id: 'ask_chemicals', nextSceneId: 'ask_chemicals' },
                { id: 'leave_shop', nextSceneId: 'END' }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // SHOW RESIDUE — Main investigation path
        // ─────────────────────────────────────────────────────────────
        'show_residue_scene': {
            id: 'show_residue_scene',
            characterId: 'inspector',
            nextSceneId: 'apothecary_examines'
        },
        'apothecary_examines': {
            id: 'apothecary_examines',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_tests'
        },
        'apothecary_tests': {
            id: 'apothecary_tests',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_result'
        },
        'apothecary_result': {
            id: 'apothecary_result',
            characterId: 'apothecary',
            choices: [
                {
                    id: 'forensics_check',
                    nextSceneId: 'forensics_fail',
                    skillCheck: {
                        id: 'chk_apothecary_forensics',
                        voiceId: 'senses',
                        difficulty: 11,
                        onSuccess: { nextSceneId: 'forensics_success' },
                        onFail: { nextSceneId: 'forensics_fail' }
                    }
                },
                {
                    id: 'crosscheck_sender_chain',
                    nextSceneId: 'apothecary_sender_crosscheck',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_sender_residue_match'] &&
                        !flags['apothecary_crosschecked_sender']
                },
                {
                    id: 'crosscheck_lock_signature',
                    nextSceneId: 'apothecary_lock_signature_reply',
                    type: 'inquiry',
                    condition: (flags) =>
                        flags['clue_lock_signature'] &&
                        !flags['apothecary_checked_lock_signature']
                },
                { id: 'ask_source', nextSceneId: 'apothecary_source' },
                { id: 'thank_leave', nextSceneId: 'END' }
            ],
            onEnter: [
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_powder_analysis',
                        name: 'Chemical Analysis',
                        description: 'Weiss identified the powder: ammonium nitrate mixed with charcoal. A crude but effective explosive, distinct from dynamite.',
                        packId: 'fbg1905'
                    }
                }
            ]
        },
        'apothecary_sender_manifest': {
            id: 'apothecary_sender_manifest',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_greets',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'apothecary_asked_sender': true,
                        'clue_chemical_sender_confirmed': true
                    }
                }
            ]
        },
        'apothecary_hartmann_reply': {
            id: 'apothecary_hartmann_reply',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_greets',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'apothecary_asked_hartmann': true,
                        'clue_hartmann_chemical_orders': true
                    }
                }
            ]
        },
        'apothecary_sleep_agent_reply': {
            id: 'apothecary_sleep_agent_reply',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_greets',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'apothecary_asked_sleep_agent': true,
                        'clue_sleep_agent_confirmed': true
                    }
                }
            ]
        },
        'apothecary_relic_gap_reply': {
            id: 'apothecary_relic_gap_reply',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_greets',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'apothecary_asked_relic_gap': true,
                        'clue_relic_preservative_chain': true
                    }
                }
            ]
        },
        'forensics_success': {
            id: 'forensics_success',
            characterId: 'inspector',
            nextSceneId: 'apothecary_university',
            onEnter: [
                { type: 'add_flag', payload: { 'knows_university_connection': true } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_university_formula',
                        name: 'University Formula',
                        description: 'The specific mixture ratio matches research published last year by Prof. Kiliani\'s chemistry department.',
                        packId: 'fbg1905'
                    }
                }
            ]
        },
        'apothecary_lock_signature_reply': {
            id: 'apothecary_lock_signature_reply',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_result',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'apothecary_checked_lock_signature': true,
                        'clue_lock_cooling_agent': true
                    }
                }
            ]
        },
        'apothecary_sender_crosscheck': {
            id: 'apothecary_sender_crosscheck',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_university',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'apothecary_crosschecked_sender': true,
                        'clue_sender_route_to_kiliani': true
                    }
                },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_supplier_registry_note',
                        name: 'Supplier Registry Note',
                        description: 'Weiss confirms Breisgau Chemical Works batches were purchased through intermediary accounts tied to university procurement channels.',
                        packId: 'fbg1905'
                    }
                }
            ]
        },
        'forensics_fail': {
            id: 'forensics_fail',
            characterId: 'inspector',
            nextSceneId: 'apothecary_source'
        },
        'apothecary_source': {
            id: 'apothecary_source',
            characterId: 'apothecary',
            nextSceneId: 'END'
        },
        'apothecary_university': {
            id: 'apothecary_university',
            characterId: 'apothecary',
            nextSceneId: 'END',
            onEnter: [
                { type: 'add_flag', payload: { 'apothecary_lead_complete': true } },
                { type: 'unlock_point', payload: 'loc_uni_chem' },
                { type: 'unlock_point', payload: 'loc_telephone' } // Interlude B / Lotte channel
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // ALTERNATIVE PATHS
        // ─────────────────────────────────────────────────────────────
        'ask_poisons': {
            id: 'ask_poisons',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_greets'
        },
        'ask_chemicals': {
            id: 'ask_chemicals',
            characterId: 'apothecary',
            nextSceneId: 'apothecary_greets'
        }
    }
};

export default LEAD_APOTHECARY_LOGIC;

