import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_ALT_BRIEFING_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_alt_briefing',
    title: 'Case 1 Briefing - Clara',
    defaultBackgroundUrl: '/images/scenarios/street_day_1905.png',
    initialSceneId: 'beat1_open',
    mode: 'fullscreen',
    scenes: {
        'beat1_open': {
            id: 'beat1_open',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'tactic_professional',
                    nextSceneId: 'beat1_professional_response',
                    actions: [{ type: 'add_flag', payload: { 'briefing_tactic_professional': true } }]
                },
                {
                    id: 'tactic_harsh',
                    nextSceneId: 'beat1_harsh_response',
                    actions: [{ type: 'add_flag', payload: { 'briefing_tactic_harsh': true } }]
                },
                {
                    id: 'tactic_soft',
                    nextSceneId: 'beat1_soft_response',
                    actions: [{ type: 'add_flag', payload: { 'briefing_tactic_soft': true } }]
                }
            ]
        },
        'beat1_professional_response': {
            id: 'beat1_professional_response',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat2_intro_professional'
        },
        'beat1_harsh_response': {
            id: 'beat1_harsh_response',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat2_intro_harsh'
        },
        'beat1_soft_response': {
            id: 'beat1_soft_response',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat2_intro_soft'
        },

        'beat2_intro_professional': {
            id: 'beat2_intro_professional',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'beat2_ask_what_taken',
                    nextSceneId: 'beat2_taken_answer',
                    actions: [{ type: 'add_flag', payload: { 'intel_vault_box_unknown': true } }]
                },
                {
                    id: 'beat2_ask_who_runs_case',
                    nextSceneId: 'beat2_inspector_answer',
                    actions: [{ type: 'add_flag', payload: { 'intel_inspector_weiss': true } }]
                }
            ]
        },
        'beat2_intro_harsh': {
            id: 'beat2_intro_harsh',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'beat2_ask_what_taken',
                    nextSceneId: 'beat2_taken_answer',
                    actions: [{ type: 'add_flag', payload: { 'intel_vault_box_unknown': true } }]
                },
                {
                    id: 'beat2_ask_who_runs_case',
                    nextSceneId: 'beat2_inspector_answer',
                    actions: [{ type: 'add_flag', payload: { 'intel_inspector_weiss': true } }]
                }
            ]
        },
        'beat2_intro_soft': {
            id: 'beat2_intro_soft',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'beat2_ask_what_taken',
                    nextSceneId: 'beat2_taken_answer',
                    actions: [{ type: 'add_flag', payload: { 'intel_vault_box_unknown': true } }]
                },
                {
                    id: 'beat2_ask_who_runs_case',
                    nextSceneId: 'beat2_inspector_answer',
                    actions: [{ type: 'add_flag', payload: { 'intel_inspector_weiss': true } }]
                }
            ]
        },
        'beat2_taken_answer': {
            id: 'beat2_taken_answer',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat2_empathy_read'
        },
        'beat2_inspector_answer': {
            id: 'beat2_inspector_answer',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat2_empathy_read'
        },
        'beat2_empathy_read': {
            id: 'beat2_empathy_read',
            characterId: 'inspector',
            nextSceneId: 'beat3_setup',
            passiveChecks: [
                {
                    id: 'chk_case1_briefing_empathy_clara',
                    voiceId: 'empathy',
                    difficulty: 7,
                    isPassive: true,
                    passiveText: 'Her tone is controlled, but she is personally invested in this case.',
                    passiveFailText: 'She sounds composed. Nothing else stands out.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_clara_personal_stake': true } }]
                    }
                }
            ]
        },

        'beat3_setup': {
            id: 'beat3_setup',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'beat3_professional_bonus',
                    nextSceneId: 'beat3_professional_result',
                    actions: [
                        { type: 'add_flag', payload: { 'contact_boehme': true } },
                        { type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 5 } }
                    ]
                },
                {
                    id: 'beat3_harsh_bonus',
                    nextSceneId: 'beat3_harsh_result',
                    actions: [
                        { type: 'add_flag', payload: { 'clue_previous_investigator': true } },
                        { type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 1 } }
                    ]
                },
                {
                    id: 'beat3_soft_bonus',
                    nextSceneId: 'beat3_soft_result',
                    actions: [
                        { type: 'add_flag', payload: { 'rumor_night_guard': true } },
                        { type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 3 } }
                    ]
                }
            ]
        },
        'beat3_professional_result': {
            id: 'beat3_professional_result',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat3_logic_gate'
        },
        'beat3_harsh_result': {
            id: 'beat3_harsh_result',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat3_logic_gate'
        },
        'beat3_soft_result': {
            id: 'beat3_soft_result',
            characterId: 'clara_altenburg',
            nextSceneId: 'beat3_logic_gate'
        },
        'beat3_logic_gate': {
            id: 'beat3_logic_gate',
            characterId: 'inspector',
            choices: [
                {
                    id: 'beat3_logic_deduce_coverup',
                    nextSceneId: 'beat3_logic_fail',
                    skillCheck: {
                        id: 'chk_case1_briefing_logic_coverup',
                        voiceId: 'logic',
                        difficulty: 8,
                        onSuccess: {
                            nextSceneId: 'beat3_logic_success',
                            actions: [{ type: 'add_flag', payload: { 'clue_coverup_suspicion': true } }]
                        },
                        onFail: {
                            nextSceneId: 'beat3_logic_fail'
                        }
                    }
                },
                {
                    id: 'beat3_logic_skip',
                    nextSceneId: 'beat4_exit'
                }
            ]
        },
        'beat3_logic_success': {
            id: 'beat3_logic_success',
            characterId: 'inspector',
            nextSceneId: 'beat4_exit'
        },
        'beat3_logic_fail': {
            id: 'beat3_logic_fail',
            characterId: 'inspector',
            nextSceneId: 'beat4_exit'
        },

        'beat4_exit': {
            id: 'beat4_exit',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'beat4_ask_where',
                    nextSceneId: 'beat4_ask_where_result'
                },
                {
                    id: 'beat4_silent_nod',
                    nextSceneId: 'beat4_silent_nod_result',
                    actions: [{ type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 1 } }]
                }
            ]
        },
        'beat4_ask_where_result': {
            id: 'beat4_ask_where_result',
            characterId: 'clara_altenburg',
            nextSceneId: 'briefing_finalize'
        },
        'beat4_silent_nod_result': {
            id: 'beat4_silent_nod_result',
            characterId: 'clara_altenburg',
            nextSceneId: 'briefing_finalize'
        },
        'briefing_finalize': {
            id: 'briefing_finalize',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'case01', stage: 'briefing' } },
                { type: 'unlock_point', payload: 'loc_freiburg_bank' },
                {
                    type: 'add_flag', payload: {
                        'case01_started': true,
                        'clara_introduced': true,
                        'alt_briefing_completed': true,
                        'item_briefing_envelope': true
                    }
                }
            ]
        }
    }
};

export default CASE1_ALT_BRIEFING_LOGIC;
