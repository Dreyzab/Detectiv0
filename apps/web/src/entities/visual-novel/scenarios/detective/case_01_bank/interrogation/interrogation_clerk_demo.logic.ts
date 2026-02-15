import type { VNScenarioLogic } from '../../../../model/types';

/**
 * Clerk Interrogation Demo — logic file.
 * Demonstrates: tension mechanic, sweet-spot progress, IP reward, lockout risk.
 * Clerk profile: sweetSpot 20-45, vulnerable to empathy, progressRequired 3.
 */
const INTERROGATION_CLERK_LOGIC: VNScenarioLogic = {
    id: 'interrogation_clerk_demo',
    packId: 'fbg1905',
    title: 'Interrogation: Ernst Vogel',
    defaultBackgroundUrl: '/images/scenarios/bank_hall_1905.webp',
    initialSceneId: 'intro',
    mode: 'fullscreen',
    scenes: {
        // --- Entry: Start interrogation session ---
        'intro': {
            id: 'intro',
            characterId: 'narrator',
            nextSceneId: 'clerk_greeting',
            onEnter: [
                {
                    type: 'start_interrogation',
                    payload: {
                        characterId: 'clerk',
                        topicId: 'robbery',
                        lockoutSceneId: 'beat_lockout_result'
                    }
                },
                { type: 'add_flag', payload: { 'interrogation_clerk_started': true } }
            ]
        },

        // --- Opening: NPC greeting ---
        'clerk_greeting': {
            id: 'clerk_greeting',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_direct_accusation',
                    nextSceneId: 'beat_accusation',
                    tensionDelta: 25,
                    type: 'action',
                    actions: [
                        { type: 'add_flag', payload: { 'clerk_confronted': true } }
                    ]
                },
                {
                    id: 'choice_sympathetic',
                    nextSceneId: 'beat_sympathy',
                    tensionDelta: -5,
                    type: 'inquiry',
                },
                {
                    id: 'choice_small_talk',
                    nextSceneId: 'beat_small_talk',
                    tensionDelta: 5,
                    type: 'flavor',
                }
            ]
        },

        // --- Branch: Direct accusation (high tension) ---
        'beat_accusation': {
            id: 'beat_accusation',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_press_harder',
                    nextSceneId: 'beat_pressed',
                    tensionDelta: 20,
                    type: 'action',
                },
                {
                    id: 'choice_back_off',
                    nextSceneId: 'beat_recovery',
                    tensionDelta: -15,
                    type: 'inquiry',
                }
            ]
        },

        // --- Branch: Sympathetic approach (lowers tension, into sweet spot) ---
        'beat_sympathy': {
            id: 'beat_sympathy',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_ask_about_night',
                    nextSceneId: 'beat_night_details',
                    tensionDelta: 10,
                    type: 'inquiry',
                },
                {
                    id: 'choice_show_evidence',
                    nextSceneId: 'beat_evidence_shown',
                    tensionDelta: 15,
                    type: 'action',
                    actions: [
                        { type: 'add_flag', payload: { 'evidence_shown_to_clerk': true } }
                    ]
                }
            ]
        },

        // --- Branch: Small talk ---
        'beat_small_talk': {
            id: 'beat_small_talk',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_mention_family',
                    nextSceneId: 'beat_sympathy',
                    tensionDelta: -5,
                    type: 'flavor',
                },
                {
                    id: 'choice_shift_topic',
                    nextSceneId: 'beat_night_details',
                    tensionDelta: 10,
                    type: 'inquiry',
                }
            ]
        },

        // --- Pressed too hard → potential lockout ---
        'beat_pressed': {
            id: 'beat_pressed',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_threaten',
                    nextSceneId: 'beat_lockout_result',
                    tensionDelta: 40,
                    type: 'action',
                },
                {
                    id: 'choice_calm_down',
                    nextSceneId: 'beat_recovery',
                    tensionDelta: -20,
                    type: 'inquiry',
                }
            ]
        },

        // --- Recovery after backing off ---
        'beat_recovery': {
            id: 'beat_recovery',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_gentle_probe',
                    nextSceneId: 'beat_night_details',
                    tensionDelta: 10,
                    type: 'inquiry',
                },
                {
                    id: 'choice_wait_silent',
                    nextSceneId: 'beat_sympathetic_reveal',
                    tensionDelta: -5,
                    type: 'flavor',
                }
            ]
        },

        // --- Night details (in sweet spot territory) ---
        'beat_night_details': {
            id: 'beat_night_details',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_push_details',
                    nextSceneId: 'beat_evidence_shown',
                    tensionDelta: 10,
                    type: 'inquiry',
                },
                {
                    id: 'choice_reassure',
                    nextSceneId: 'beat_sympathetic_reveal',
                    tensionDelta: -5,
                    type: 'flavor',
                }
            ]
        },

        // --- Evidence shown → progress boost ---
        'beat_evidence_shown': {
            id: 'beat_evidence_shown',
            characterId: 'clerk',
            choices: [
                {
                    id: 'choice_confront_with_evidence',
                    nextSceneId: 'beat_sympathetic_reveal',
                    tensionDelta: 15,
                    type: 'action',
                },
                {
                    id: 'choice_let_him_explain',
                    nextSceneId: 'beat_sympathetic_reveal',
                    tensionDelta: 5,
                    type: 'inquiry',
                }
            ]
        },

        // --- Sympathetic reveal → conclusion ---
        'beat_sympathetic_reveal': {
            id: 'beat_sympathetic_reveal',
            characterId: 'clerk',
            nextSceneId: 'beat_conclusion',
            onEnter: [
                { type: 'add_flag', payload: { 'clerk_revealed_info': true } }
            ]
        },

        // --- Lockout result ---
        'beat_lockout_result': {
            id: 'beat_lockout_result',
            characterId: 'clerk',
            nextSceneId: 'beat_conclusion',
            onEnter: [
                { type: 'add_flag', payload: { 'clerk_locked_out': true } }
            ]
        },

        // --- Conclusion ---
        'beat_conclusion': {
            id: 'beat_conclusion',
            characterId: 'narrator',
            nextSceneId: 'END',
            onEnter: [
                { type: 'end_interrogation' },
                { type: 'add_flag', payload: { 'interrogation_clerk_done': true } }
            ]
        }
    }
};

export default INTERROGATION_CLERK_LOGIC;
