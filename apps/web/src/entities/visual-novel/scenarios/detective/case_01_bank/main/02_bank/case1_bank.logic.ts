import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Case 1: Bank Investigation - Bankhaus Krebs
 *
 * Mainline Replace:
 * - mass sleep event at the crime scene
 * - lock breached by extreme controlled heat
 * - money theft used as cover for targeted relic removal
 *
 * Compatibility contract kept:
 * - completion gate: clerk_interviewed && vault_inspected
 * - legacy flags still set (found_velvet, found_residue, clue_sender_residue_match, etc.)
 */

export const CASE1_BANK_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_bank_scene',
    packId: 'fbg1905',
    title: 'Bankhaus Krebs Investigation',
    defaultBackgroundUrl: '/images/scenarios/bank_hall_1905.webp',
    initialSceneId: 'arrival',
    mode: 'fullscreen',
    scenes: {
        'arrival': {
            id: 'arrival',
            characterId: 'inspector',
            choices: [
                {
                    id: 'enter_solo',
                    nextSceneId: 'scene_solo_entry',
                    condition: (flags) => !flags['met_mayor_first'] && !flags['clara_introduced']
                },
                {
                    id: 'enter_duo',
                    nextSceneId: 'scene_duo_entry',
                    condition: (flags) => Boolean(flags['met_mayor_first'] || flags['clara_introduced'])
                }
            ]
        },
        'scene_duo_entry': {
            id: 'scene_duo_entry',
            characterId: 'inspector',
            onEnter: [{ type: 'add_flag', payload: { 'clara_seen_in_bank': true } }],
            nextSceneId: 'bank_hub'
        },
        'scene_solo_entry': {
            id: 'scene_solo_entry',
            characterId: 'inspector',
            nextSceneId: 'victoria_interrupts'
        },
        'victoria_interrupts': {
            id: 'victoria_interrupts',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'clara_introduced': true,
                        'clara_met_at_bank': true,
                        'clara_seen_in_bank': true
                    }
                }
            ],
            nextSceneId: 'victoria_intro_dialogue'
        },
        'victoria_intro_dialogue': {
            id: 'victoria_intro_dialogue',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'react_mockery',
                    nextSceneId: 'react_mockery_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: -10 } }]
                },
                {
                    id: 'react_surprise',
                    nextSceneId: 'react_surprise_res'
                },
                {
                    id: 'react_interest',
                    nextSceneId: 'react_interest_res',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 10 } }]
                }
            ]
        },
        'react_mockery_res': { id: 'react_mockery_res', characterId: 'clara_altenburg', nextSceneId: 'bank_hub' },
        'react_surprise_res': { id: 'react_surprise_res', characterId: 'clara_altenburg', nextSceneId: 'bank_hub' },
        'react_interest_res': { id: 'react_interest_res', characterId: 'clara_altenburg', nextSceneId: 'bank_hub' },

        'bank_hub': {
            id: 'bank_hub',
            characterId: 'inspector',
            choices: [
                { id: 'speak_manager', nextSceneId: 'manager_intro', type: 'inquiry' },
                { id: 'triage_witnesses', nextSceneId: 'triage_intro', type: 'inquiry' },
                { id: 'inspect_vault_forensics', nextSceneId: 'vault_entry', type: 'inquiry' },
                { id: 'run_reconstruction', nextSceneId: 'reconstruction_intro', type: 'inquiry' },
                {
                    id: 'conclude_investigation',
                    nextSceneId: 'bank_conclusion',
                    type: 'action',
                    condition: (flags) => Boolean(flags['vault_inspected'] && flags['clerk_interviewed'])
                }
            ]
        },

        'manager_intro': {
            id: 'manager_intro',
            characterId: 'bank_manager',
            choices: [
                {
                    id: 'manager_confront_seed',
                    nextSceneId: 'manager_seed_reaction',
                    type: 'inquiry',
                    condition: (flags) => Boolean(flags['clue_galdermann_mention'] || flags['clue_galdermann_leaflet'])
                },
                {
                    id: 'manager_open_case',
                    nextSceneId: 'manager_casefile',
                    type: 'action'
                }
            ]
        },
        'manager_seed_reaction': {
            id: 'manager_seed_reaction',
            characterId: 'bank_manager',
            nextSceneId: 'manager_casefile',
            onEnter: [{ type: 'add_flag', payload: { 'clue_galdermann_preseed_confirmed': true } }]
        },
        'manager_casefile': {
            id: 'manager_casefile',
            characterId: 'bank_manager',
            choices: [
                {
                    id: 'manager_press_hartmann',
                    nextSceneId: 'manager_hartmann_reaction',
                    type: 'inquiry',
                    condition: (flags) => Boolean(flags['clue_hartmann_newspaper'] || flags['clue_hartmann_letter'])
                },
                {
                    id: 'manager_press_relics',
                    nextSceneId: 'manager_relic_reaction',
                    type: 'inquiry'
                },
                {
                    id: 'manager_request_statements',
                    nextSceneId: 'manager_dismissive',
                    type: 'action'
                }
            ]
        },
        'manager_hartmann_reaction': {
            id: 'manager_hartmann_reaction',
            characterId: 'bank_manager',
            nextSceneId: 'manager_dismissive',
            onEnter: [{ type: 'add_flag', payload: { 'clue_hartmann_brushed_off': true } }]
        },
        'manager_relic_reaction': {
            id: 'manager_relic_reaction',
            characterId: 'bank_manager',
            nextSceneId: 'manager_dismissive',
            onEnter: [{ type: 'add_flag', payload: { 'clue_relic_gap': true } }]
        },
        'manager_dismissive': {
            id: 'manager_dismissive',
            characterId: 'bank_manager',
            nextSceneId: 'bank_hub',
            onEnter: [{ type: 'add_flag', payload: { 'met_galdermann': true } }]
        },

        'triage_intro': {
            id: 'triage_intro',
            characterId: 'inspector',
            passiveChecks: [
                {
                    id: 'chk_bank_triage_senses',
                    voiceId: 'senses',
                    difficulty: 9,
                    isPassive: true,
                    passiveText: 'Sweet residue near the ventilation grilles. Not panic, not alcohol.',
                    passiveFailText: 'The room smells wrong, but the source stays elusive.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_sleep_agent': true } }]
                    }
                },
                {
                    id: 'chk_bank_triage_volition',
                    voiceId: 'volition',
                    difficulty: 8,
                    isPassive: true,
                    passiveText: 'Everyone else is rushing to certainty. You do not have to.',
                    passiveFailText: 'Pressure from uniforms and officials bleeds into your focus.'
                }
            ],
            nextSceneId: 'triage_clerk_intro'
        },
        'triage_clerk_intro': {
            id: 'triage_clerk_intro',
            characterId: 'clerk',
            nextSceneId: 'triage_clerk'
        },
        'triage_clerk': {
            id: 'triage_clerk',
            characterId: 'clerk',
            choices: [
                {
                    id: 'ask_about_hartmann',
                    nextSceneId: 'triage_clerk_hartmann_response',
                    type: 'inquiry',
                    condition: (flags) =>
                        Boolean(flags['clue_hartmann_newspaper'] || flags['clue_hartmann_letter']) && !flags['asked_hartmann'],
                    actions: [{ type: 'add_flag', payload: { 'asked_hartmann': true, 'clue_hartmann_internal_contact': true } }]
                },
                {
                    id: 'ask_about_box_217',
                    nextSceneId: 'triage_clerk_box217_response',
                    type: 'inquiry',
                    condition: (flags) => Boolean(flags['clue_vault_box_217']) && !flags['asked_box_217'],
                    actions: [{ type: 'add_flag', payload: { 'asked_box_217': true, 'clue_box217_sensitive': true } }]
                },
                {
                    id: 'read_clerk_empathy',
                    nextSceneId: 'triage_medic_intro',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_empathy_clerk',
                        voiceId: 'empathy',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'triage_clerk_empathy_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_witness_rumor',
                                        name: 'Bachleputzer Sighting',
                                        description: 'A dawn cleaner saw a stage-clad figure near the scaffold line.',
                                        packId: 'fbg1905'
                                    }
                                },
                                { type: 'add_flag', payload: { 'clue_sleep_agent': true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'triage_clerk_empathy_fail'
                        }
                    }
                },
                {
                    id: 'ask_medical_chain',
                    nextSceneId: 'triage_medic_intro',
                    type: 'inquiry'
                },
                {
                    id: 'press_clerk',
                    nextSceneId: 'triage_clerk_press',
                    type: 'action'
                },
                {
                    id: 'leave_triage',
                    nextSceneId: 'triage_done',
                    type: 'action'
                }
            ]
        },
        'triage_clerk_hartmann_response': {
            id: 'triage_clerk_hartmann_response',
            characterId: 'clerk',
            nextSceneId: 'triage_clerk'
        },
        'triage_clerk_box217_response': {
            id: 'triage_clerk_box217_response',
            characterId: 'clerk',
            nextSceneId: 'triage_clerk'
        },
        'triage_clerk_empathy_success': {
            id: 'triage_clerk_empathy_success',
            characterId: 'clerk',
            nextSceneId: 'triage_medic_intro'
        },
        'triage_clerk_empathy_fail': {
            id: 'triage_clerk_empathy_fail',
            characterId: 'clerk',
            nextSceneId: 'triage_medic_intro'
        },
        'triage_clerk_press': {
            id: 'triage_clerk_press',
            characterId: 'clerk',
            nextSceneId: 'triage_medic_intro'
        },
        'triage_medic_intro': {
            id: 'triage_medic_intro',
            characterId: 'inspector',
            choices: [
                {
                    id: 'check_sleep_wave',
                    nextSceneId: 'triage_done',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_logic_sleep_wave',
                        voiceId: 'logic',
                        difficulty: 9,
                        onSuccess: {
                            nextSceneId: 'triage_medic_logic_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_sleep_agent_profile',
                                        name: 'Sleep Agent Profile',
                                        description: 'Symptoms indicate a dosed sedative cloud, not natural fatigue.',
                                        packId: 'fbg1905'
                                    }
                                },
                                { type: 'add_flag', payload: { 'clue_sleep_agent': true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'triage_medic_logic_fail'
                        }
                    }
                },
                {
                    id: 'ask_who_moved_first',
                    nextSceneId: 'triage_medic_timeline',
                    type: 'inquiry'
                },
                {
                    id: 'return_to_hub',
                    nextSceneId: 'triage_done',
                    type: 'action'
                }
            ]
        },
        'triage_medic_logic_success': {
            id: 'triage_medic_logic_success',
            characterId: 'inspector',
            nextSceneId: 'triage_done'
        },
        'triage_medic_logic_fail': {
            id: 'triage_medic_logic_fail',
            characterId: 'inspector',
            nextSceneId: 'triage_done'
        },
        'triage_medic_timeline': {
            id: 'triage_medic_timeline',
            characterId: 'inspector',
            nextSceneId: 'triage_done',
            onEnter: [{ type: 'add_flag', payload: { 'clue_hidden_slot': true } }]
        },
        'triage_done': {
            id: 'triage_done',
            characterId: 'inspector',
            nextSceneId: 'bank_hub',
            onEnter: [{ type: 'add_flag', payload: { 'clerk_interviewed': true, 'triage_completed': true } }]
        },

        'vault_entry': {
            id: 'vault_entry',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            passiveChecks: [
                {
                    id: 'chk_bank_vault_perception_heat',
                    voiceId: 'perception',
                    difficulty: 8,
                    isPassive: true,
                    passiveText: 'The lock ring was heat-sheared, then cooled with discipline. No panic cuts.',
                    passiveFailText: 'The lock is ruined, but the method remains unclear.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_lock_signature': true } }]
                    }
                }
            ],
            nextSceneId: 'vault_actions'
        },
        'vault_actions': {
            id: 'vault_actions',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            choices: [
                {
                    id: 'examine_lock_logic',
                    nextSceneId: 'vault_logic_fail',
                    type: 'flavor',
                    condition: (flags) => !flags['found_velvet'],
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
                                        description: 'Red theatrical velvet caught near the vault hinge.',
                                        packId: 'fbg1905'
                                    }
                                },
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_lock_signature_report',
                                        name: 'Lock Signature Report',
                                        description: 'The breach shows controlled high heat and deliberate cooling.',
                                        packId: 'fbg1905'
                                    }
                                },
                                { type: 'add_flag', payload: { 'clue_lock_signature': true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_logic_fail'
                        }
                    }
                },
                {
                    id: 'sense_atmosphere_intuition',
                    nextSceneId: 'vault_intuition_fail',
                    type: 'flavor',
                    condition: (flags) => !flags['found_residue'],
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
                                        description: 'Fine industrial residue with an anesthetic sweet note.',
                                        packId: 'fbg1905'
                                    }
                                },
                                { type: 'add_flag', payload: { 'clue_sleep_agent': true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_intuition_fail'
                        }
                    }
                },
                {
                    id: 'compare_chemical_sender',
                    nextSceneId: 'vault_sender_match_fail',
                    type: 'inquiry',
                    condition: (flags) => Boolean(flags['clue_chemical_sender']) && !flags['compared_sender_residue'],
                    skillCheck: {
                        id: 'chk_bank_logic_sender_chain',
                        voiceId: 'logic',
                        difficulty: 8,
                        onSuccess: {
                            nextSceneId: 'vault_sender_match_success',
                            actions: [{ type: 'add_flag', payload: { 'clue_sender_residue_match': true } }]
                        },
                        onFail: {
                            nextSceneId: 'vault_sender_match_fail'
                        }
                    }
                },
                {
                    id: 'inspect_relic_cradles',
                    nextSceneId: 'vault_relic_fail',
                    type: 'flavor',
                    condition: (flags) => !flags['relic_cradles_checked'],
                    skillCheck: {
                        id: 'chk_bank_imagination_relic_pattern',
                        voiceId: 'imagination',
                        difficulty: 11,
                        onSuccess: {
                            nextSceneId: 'vault_relic_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_relic_inventory_gap',
                                        name: 'Relic Inventory Gap',
                                        description: 'Removal pattern targets municipal relic storage, not bulk currency racks.',
                                        packId: 'fbg1905'
                                    }
                                },
                                { type: 'add_flag', payload: { 'clue_relic_gap': true, 'relic_cradles_checked': true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_relic_fail'
                        }
                    }
                },
                {
                    id: 'occult_shivers_check',
                    nextSceneId: 'vault_occult_fail',
                    type: 'flavor',
                    condition: (flags) => Boolean(flags['found_residue']) && !flags['occult_checked'],
                    skillCheck: {
                        id: 'chk_bank_occultism_symbols',
                        voiceId: 'occultism',
                        difficulty: 14,
                        onSuccess: {
                            nextSceneId: 'vault_occult_success',
                            actions: [
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_occult_circle',
                                        name: 'Occult Circle',
                                        description: 'Geometric chalk marks left as deliberate scene control, not random graffiti.',
                                        packId: 'fbg1905'
                                    }
                                },
                                { type: 'add_flag', payload: { 'clue_hidden_slot': true } }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'vault_occult_fail'
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
        'vault_logic_success': {
            id: 'vault_logic_success',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'found_velvet': true } }]
        },
        'vault_logic_fail': {
            id: 'vault_logic_fail',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions'
        },
        'vault_intuition_success': {
            id: 'vault_intuition_success',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'found_residue': true } }]
        },
        'vault_intuition_fail': {
            id: 'vault_intuition_fail',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions'
        },
        'vault_sender_match_success': {
            id: 'vault_sender_match_success',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'compared_sender_residue': true } }]
        },
        'vault_sender_match_fail': {
            id: 'vault_sender_match_fail',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'compared_sender_residue': true } }]
        },
        'vault_relic_success': {
            id: 'vault_relic_success',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions'
        },
        'vault_relic_fail': {
            id: 'vault_relic_fail',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'relic_cradles_checked': true } }]
        },
        'vault_occult_success': {
            id: 'vault_occult_success',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'occult_checked': true, 'sensed_presence': true } }]
        },
        'vault_occult_fail': {
            id: 'vault_occult_fail',
            characterId: 'inspector',
            backgroundUrl: '/images/scenarios/bank_vault_1905.webp',
            nextSceneId: 'vault_actions',
            onEnter: [{ type: 'add_flag', payload: { 'occult_checked': true } }]
        },
        'vault_leave': {
            id: 'vault_leave',
            characterId: 'inspector',
            nextSceneId: 'bank_hub',
            onEnter: [{ type: 'add_flag', payload: { 'vault_inspected': true } }]
        },

        'reconstruction_intro': {
            id: 'reconstruction_intro',
            characterId: 'inspector',
            passiveChecks: [
                {
                    id: 'chk_bank_reconstruction_perception',
                    voiceId: 'perception',
                    difficulty: 9,
                    isPassive: true,
                    passiveText: 'Three movement lanes: vent access, scaffold entry, vault extraction.',
                    passiveFailText: 'The scene is noisy with uniforms and assumptions.'
                }
            ],
            nextSceneId: 'reconstruction_table'
        },
        'reconstruction_table': {
            id: 'reconstruction_table',
            characterId: 'inspector',
            choices: [
                {
                    id: 'rebuild_entry_vector',
                    nextSceneId: 'reconstruction_entry_fail',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_imagination_entry_vector',
                        voiceId: 'imagination',
                        difficulty: 12,
                        onSuccess: {
                            nextSceneId: 'reconstruction_entry_success',
                            actions: [{ type: 'add_flag', payload: { 'clue_hidden_slot': true } }]
                        },
                        onFail: {
                            nextSceneId: 'reconstruction_entry_fail'
                        }
                    }
                },
                {
                    id: 'stress_test_timeline',
                    nextSceneId: 'reconstruction_timeline_fail',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_logic_timeline_pressure',
                        voiceId: 'logic',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'reconstruction_timeline_success',
                            actions: [{ type: 'add_flag', payload: { 'clue_relic_gap': true } }]
                        },
                        onFail: {
                            nextSceneId: 'reconstruction_timeline_fail'
                        }
                    }
                },
                {
                    id: 'check_witness_overlap',
                    nextSceneId: 'reconstruction_overlap_fail',
                    type: 'flavor',
                    skillCheck: {
                        id: 'chk_bank_empathy_witness_overlap',
                        voiceId: 'empathy',
                        difficulty: 9,
                        onSuccess: {
                            nextSceneId: 'reconstruction_overlap_success',
                            actions: [{ type: 'add_flag', payload: { 'clue_sleep_agent': true } }]
                        },
                        onFail: {
                            nextSceneId: 'reconstruction_overlap_fail'
                        }
                    }
                },
                {
                    id: 'return_to_hub',
                    nextSceneId: 'reconstruction_done',
                    type: 'action'
                }
            ]
        },
        'reconstruction_entry_success': {
            id: 'reconstruction_entry_success',
            characterId: 'inspector',
            nextSceneId: 'reconstruction_done'
        },
        'reconstruction_entry_fail': {
            id: 'reconstruction_entry_fail',
            characterId: 'inspector',
            nextSceneId: 'reconstruction_done'
        },
        'reconstruction_timeline_success': {
            id: 'reconstruction_timeline_success',
            characterId: 'inspector',
            nextSceneId: 'reconstruction_done'
        },
        'reconstruction_timeline_fail': {
            id: 'reconstruction_timeline_fail',
            characterId: 'inspector',
            nextSceneId: 'reconstruction_done'
        },
        'reconstruction_overlap_success': {
            id: 'reconstruction_overlap_success',
            characterId: 'inspector',
            nextSceneId: 'reconstruction_done'
        },
        'reconstruction_overlap_fail': {
            id: 'reconstruction_overlap_fail',
            characterId: 'inspector',
            nextSceneId: 'reconstruction_done'
        },
        'reconstruction_done': {
            id: 'reconstruction_done',
            characterId: 'inspector',
            nextSceneId: 'bank_hub',
            onEnter: [{ type: 'add_flag', payload: { 'bank_reconstruction_done': true } }]
        },

        'bank_conclusion': {
            id: 'bank_conclusion',
            characterId: 'inspector',
            nextSceneId: 'bank_conclusion_summary'
        },
        'bank_conclusion_summary': {
            id: 'bank_conclusion_summary',
            characterId: 'clara_altenburg',
            nextSceneId: 'END',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'case01', stage: 'leads_open' } },
                { type: 'unlock_point', payload: 'loc_tailor' },
                { type: 'unlock_point', payload: 'loc_apothecary' },
                { type: 'unlock_point', payload: 'loc_pub' },
                { type: 'add_flag', payload: { 'bank_investigation_complete': true } }
            ]
        }
    }
};

export default CASE1_BANK_LOGIC;
