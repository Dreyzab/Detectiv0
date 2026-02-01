import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Lead 3: The Apothecary — Adalbert Weiss
 * 
 * The chemical residue leads here. The apothecary can identify
 * the strange powder found at the vault.
 */

export const LEAD_APOTHECARY_LOGIC: VNScenarioLogic = {
    id: 'lead_apothecary',
    title: 'Löwen-Apotheke',
    defaultBackgroundUrl: '/images/scenarios/apothecary_1905.png',
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
                    nextSceneId: 'forensics_result',
                    skillCheck: {
                        id: 'chk_apothecary_forensics',
                        voiceId: 'forensics',
                        difficulty: 11,
                        onSuccess: { nextSceneId: 'forensics_success' },
                        onFail: { nextSceneId: 'forensics_fail' }
                    }
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
                { type: 'unlock_point', payload: 'p_uni_chem' },
                { type: 'unlock_point', payload: 'p_telephone' } // Interlude B
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
