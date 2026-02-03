import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Case 1: Bank Investigation — Bankhaus Krebs
 * 
 * This scenario introduces the skill check system and grants 3 leads
 * that unlock new map locations for the "Open City" phase.
 * 
 * Flow:
 * arrival → bank_hub → (vault_inspection | clerk_interrogation)
 *                    ↓
 *           bank_conclusion → unlock 3 map points
 */

export const CASE1_BANK_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_bank_scene',
    title: 'Bankhaus Krebs Investigation',
    defaultBackgroundUrl: '/images/scenarios/bank_hall_1905.png',
    initialSceneId: 'arrival',
    mode: 'fullscreen',
    scenes: {
        // ─────────────────────────────────────────────────────────────
        // ARRIVAL
        // ─────────────────────────────────────────────────────────────
        'arrival': {
            id: 'arrival',
            characterId: 'inspector',
            choices: [
                {
                    id: 'enter_solo',
                    nextSceneId: 'scene_solo_entry',
                    condition: (flags) => !flags['met_mayor_first']
                },
                {
                    id: 'enter_duo',
                    nextSceneId: 'scene_duo_entry',
                    condition: (flags) => flags['met_mayor_first']
                }
            ]
        },
        'scene_duo_entry': {
            id: 'scene_duo_entry',
            characterId: 'inspector',
            nextSceneId: 'bank_hub'
        },
        'scene_solo_entry': {
            id: 'scene_solo_entry',
            characterId: 'inspector',
            nextSceneId: 'victoria_interrupts'
        },
        'victoria_interrupts': {
            id: 'victoria_interrupts',
            characterId: 'assistant',
            nextSceneId: 'victoria_intro_dialogue'
        },
        'victoria_intro_dialogue': {
            id: 'victoria_intro_dialogue',
            characterId: 'assistant',
            choices: [
                {
                    id: 'react_mockery',
                    nextSceneId: 'react_mockery_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'assistant', amount: -10 } }]
                },
                {
                    id: 'react_surprise',
                    nextSceneId: 'react_surprise_res'
                },
                {
                    id: 'react_interest',
                    nextSceneId: 'react_interest_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'assistant', amount: 10 } }]
                }
            ]
        },
        'react_mockery_res': { id: 'react_mockery_res', characterId: 'assistant', nextSceneId: 'bank_hub' },
        'react_surprise_res': { id: 'react_surprise_res', characterId: 'assistant', nextSceneId: 'bank_hub' },
        'react_interest_res': { id: 'react_interest_res', characterId: 'assistant', nextSceneId: 'bank_hub' },

        // ─────────────────────────────────────────────────────────────
        // BANK HUB — Central navigation point
        // ─────────────────────────────────────────────────────────────
        'bank_hub': {
            id: 'bank_hub',
            characterId: 'inspector',
            choices: [
                { id: 'speak_manager', nextSceneId: 'manager_intro', type: 'inquiry' },
                { id: 'speak_clerk', nextSceneId: 'clerk_intro', type: 'inquiry' },
                { id: 'inspect_vault', nextSceneId: 'vault_inspection', type: 'inquiry' },
                {
                    id: 'conclude_investigation',
                    nextSceneId: 'bank_conclusion',
                    type: 'action',
                    condition: (flags) =>
                        flags['vault_inspected'] && flags['clerk_interviewed']
                }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // MANAGER DIALOGUE (Heinrich Galdermann)
        // ─────────────────────────────────────────────────────────────
        'manager_intro': {
            id: 'manager_intro',
            characterId: 'bank_manager',
            nextSceneId: 'manager_about_robbery'
        },
        'manager_about_robbery': {
            id: 'manager_about_robbery',
            characterId: 'bank_manager',
            nextSceneId: 'manager_dismissive'
        },
        'manager_dismissive': {
            id: 'manager_dismissive',
            characterId: 'bank_manager',
            nextSceneId: 'bank_hub',
            onEnter: [
                { type: 'add_flag', payload: { 'met_galdermann': true } }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // CLERK INVESTIGATION (Ernst Vogel) — Empathy Check
        // ─────────────────────────────────────────────────────────────
        'clerk_intro': {
            id: 'clerk_intro',
            characterId: 'clerk',
            nextSceneId: 'clerk_nervous'
        },
        'clerk_nervous': {
            id: 'clerk_nervous',
            characterId: 'clerk',
            choices: [
                {
                    id: 'read_clerk_empathy',
                    nextSceneId: 'clerk_empathy_result',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_empathy_clerk',
                        voiceId: 'empathy',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'clerk_empathy_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_witness_rumor',
                                        name: 'Bächleputzer Sighting',
                                        description: 'The night cleaner overheard the Bächleputzer saw "a shadow" near the bank at dawn.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'clerk_empathy_fail'
                        }
                    }
                },
                {
                    id: 'press_clerk',
                    nextSceneId: 'clerk_press',
                    type: 'action'
                },
                {
                    id: 'leave_clerk',
                    nextSceneId: 'bank_hub',
                    type: 'action'
                }
            ]
        },
        'clerk_empathy_success': {
            id: 'clerk_empathy_success',
            characterId: 'clerk',
            nextSceneId: 'clerk_revelation'
        },
        'clerk_empathy_fail': {
            id: 'clerk_empathy_fail',
            characterId: 'clerk',
            nextSceneId: 'clerk_closes_up'
        },
        'clerk_revelation': {
            id: 'clerk_revelation',
            characterId: 'clerk',
            nextSceneId: 'clerk_done',
            onEnter: [
                { type: 'add_flag', payload: { 'clerk_revealed_shadow': true } }
            ]
        },
        'clerk_closes_up': {
            id: 'clerk_closes_up',
            characterId: 'clerk',
            nextSceneId: 'clerk_done'
        },
        'clerk_press': {
            id: 'clerk_press',
            characterId: 'clerk',
            nextSceneId: 'clerk_done'
        },
        'clerk_done': {
            id: 'clerk_done',
            characterId: 'inspector',
            nextSceneId: 'bank_hub',
            onEnter: [
                { type: 'add_flag', payload: { 'clerk_interviewed': true } }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // VAULT INSPECTION — Logic & Intuition Checks
        // ─────────────────────────────────────────────────────────────
        'vault_inspection': {
            id: 'vault_inspection',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            choices: [
                {
                    id: 'examine_lock_logic',
                    nextSceneId: 'vault_logic_result',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_logic_safe',
                        voiceId: 'logic',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'vault_logic_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_torn_velvet',
                                        name: 'Torn Velvet',
                                        description: 'Expensive red velvet fabric, theatrical quality. Found snagged near the safe.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_logic_fail'
                        }
                    }
                },
                {
                    id: 'sense_atmosphere_intuition',
                    nextSceneId: 'vault_intuition_result',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_intuition_atmosphere',
                        voiceId: 'intuition',
                        difficulty: 12,
                        onSuccess: {
                            nextSceneId: 'vault_intuition_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_chemical_residue',
                                        name: 'Strange Dust',
                                        description: 'Industrial powder with a faint bitter almond scent. Not standard explosives.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_intuition_fail'
                        }
                    }
                },
                {
                    id: 'return_to_hub',
                    nextSceneId: 'vault_leave',
                    type: 'action'
                }
            ]
        },

        // Logic Check Results
        'vault_logic_success': {
            id: 'vault_logic_success',
            characterId: 'inspector',
            nextSceneId: 'vault_continue',
            onEnter: [
                { type: 'add_flag', payload: { 'found_velvet': true } }
            ]
        },
        'vault_logic_fail': {
            id: 'vault_logic_fail',
            characterId: 'inspector',
            nextSceneId: 'vault_continue'
        },

        // Intuition Check Results
        'vault_intuition_success': {
            id: 'vault_intuition_success',
            characterId: 'inspector',
            nextSceneId: 'vault_occult_discovery',
            onEnter: [
                { type: 'add_flag', payload: { 'found_residue': true } }
            ]
        },
        'vault_intuition_fail': {
            id: 'vault_intuition_fail',
            characterId: 'inspector',
            nextSceneId: 'vault_continue'
        },

        // ─────────────────────────────────────────────────────────────
        // OCCULT SYMBOLS DISCOVERY — Hidden layer of mystery
        // ─────────────────────────────────────────────────────────────
        'vault_occult_discovery': {
            id: 'vault_occult_discovery',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            nextSceneId: 'vault_occult_victoria'
        },
        'vault_occult_victoria': {
            id: 'vault_occult_victoria',
            characterId: 'assistant',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            choices: [
                {
                    id: 'occult_shivers_check',
                    nextSceneId: 'vault_shivers_result',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_occultism_symbols',
                        voiceId: 'occultism',
                        difficulty: 14,
                        onSuccess: {
                            nextSceneId: 'vault_shivers_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_occult_circle',
                                        name: 'Occult Circle',
                                        description: 'Chalk markings with geometric precision. Not mere vandalism—a deliberate ritual pattern.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_shivers_fail'
                        }
                    }
                },
                {
                    id: 'dismiss_occult',
                    nextSceneId: 'vault_dismiss_theatrics',
                    type: 'action'
                },
                {
                    id: 'ask_victoria_occult',
                    nextSceneId: 'vault_victoria_analysis',
                    type: 'inquiry'
                }
            ]
        },
        'vault_shivers_success': {
            id: 'vault_shivers_success',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            nextSceneId: 'vault_continue',
            onEnter: [
                { type: 'add_flag', payload: { 'sensed_presence': true } }
            ]
        },
        'vault_shivers_fail': {
            id: 'vault_shivers_fail',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            nextSceneId: 'vault_continue'
        },
        'vault_dismiss_theatrics': {
            id: 'vault_dismiss_theatrics',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            nextSceneId: 'vault_continue'
        },
        'vault_victoria_analysis': {
            id: 'vault_victoria_analysis',
            characterId: 'assistant',
            backgroundUrl: '/images/scenarios/bank_vault_1905.png',
            nextSceneId: 'vault_continue',
            onEnter: [
                { type: 'modify_relationship', payload: { characterId: 'assistant', amount: 5 } },
                { type: 'add_flag', payload: { 'victoria_analyzed_occult': true } }
            ]
        },

        // Continue investigating or leave
        'vault_continue': {
            id: 'vault_continue',
            characterId: 'inspector',
            choices: [
                {
                    id: 'examine_lock_logic',
                    nextSceneId: 'vault_logic_result',
                    condition: (flags) => !flags['found_velvet'],
                    skillCheck: {
                        id: 'chk_bank_logic_safe',
                        voiceId: 'logic',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'vault_logic_success' },
                        onFail: { nextSceneId: 'vault_logic_fail' }
                    }
                },
                {
                    id: 'sense_atmosphere_intuition',
                    nextSceneId: 'vault_intuition_result',
                    condition: (flags) => !flags['found_residue'],
                    skillCheck: {
                        id: 'chk_bank_intuition_atmosphere',
                        voiceId: 'intuition',
                        difficulty: 12,
                        onSuccess: { nextSceneId: 'vault_intuition_success' },
                        onFail: { nextSceneId: 'vault_intuition_fail' }
                    }
                },
                {
                    id: 'return_to_hub',
                    nextSceneId: 'vault_leave'
                }
            ]
        },

        'vault_leave': {
            id: 'vault_leave',
            characterId: 'inspector',
            nextSceneId: 'bank_hub',
            onEnter: [
                { type: 'add_flag', payload: { 'vault_inspected': true } }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // CONCLUSION — Unlock 3 Map Points
        // ─────────────────────────────────────────────────────────────
        'bank_conclusion': {
            id: 'bank_conclusion',
            characterId: 'inspector',
            nextSceneId: 'bank_conclusion_summary'
        },
        'bank_conclusion_summary': {
            id: 'bank_conclusion_summary',
            characterId: 'assistant',
            nextSceneId: 'END',
            onEnter: [
                // Unlock the 3 investigation leads
                { type: 'unlock_point', payload: 'loc_tailor' },
                { type: 'unlock_point', payload: 'loc_apothecary' },
                { type: 'unlock_point', payload: 'loc_pub' },
                // Set completion flag
                { type: 'add_flag', payload: { 'bank_investigation_complete': true } }
            ]
        }
    }
};

export default CASE1_BANK_LOGIC;
