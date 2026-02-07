import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_MAP_FIRST_EXPLORATION_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_map_first_exploration',
    title: 'Case 1 - First Exploration',
    defaultBackgroundUrl: '/images/scenarios/street_day_1905.png',
    initialSceneId: 'event1_intro',
    mode: 'fullscreen',
    scenes: {
        'event1_intro': {
            id: 'event1_intro',
            characterId: 'inspector',
            choices: [
                {
                    id: 'event1_help_postman',
                    nextSceneId: 'event1_envelope',
                    actions: [{
                        type: 'add_flag', payload: {
                            'event_postman_triggered': true,
                            'clue_vault_box_217': true,
                            'clue_hartmann_letter': true
                        }
                    }]
                },
                {
                    id: 'event1_walk_past',
                    nextSceneId: 'event1_envelope',
                    actions: [{
                        type: 'add_flag', payload: {
                            'event_postman_triggered': true,
                            'clue_vault_box_217': true,
                            'clue_hartmann_letter': true
                        }
                    }]
                }
            ]
        },
        'event1_envelope': {
            id: 'event1_envelope',
            characterId: 'inspector',
            passiveChecks: [
                {
                    id: 'chk_case1_exploration_postman_perception',
                    voiceId: 'perception',
                    difficulty: 7,
                    isPassive: true,
                    passiveText: 'Return address: Breisgau Chemical Works, Lorrach.',
                    passiveFailText: 'You keep only the name and vault box number in mind.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_chemical_sender': true } }]
                    }
                }
            ],
            nextSceneId: 'event2_gate'
        },

        'event2_gate': {
            id: 'event2_gate',
            characterId: 'inspector',
            choices: [
                {
                    id: 'event2_linger',
                    nextSceneId: 'event2_intro'
                },
                {
                    id: 'event2_skip',
                    nextSceneId: 'approach_bank'
                }
            ]
        },
        'event2_intro': {
            id: 'event2_intro',
            characterId: 'inspector',
            choices: [
                {
                    id: 'event2_read_leaflet',
                    nextSceneId: 'event2_resolution',
                    actions: [{
                        type: 'add_flag', payload: {
                            'event_student_triggered': true,
                            'clue_galdermann_leaflet': true,
                            'item_leaflet': true
                        }
                    }]
                },
                {
                    id: 'event2_ask_source',
                    nextSceneId: 'event2_resolution',
                    actions: [{
                        type: 'add_flag', payload: {
                            'event_student_triggered': true,
                            'clue_fired_clerk': true
                        }
                    }]
                },
                {
                    id: 'event2_dismiss',
                    nextSceneId: 'event2_resolution',
                    actions: [{
                        type: 'add_flag', payload: {
                            'event_student_triggered': true,
                            'clue_galdermann_leaflet': true,
                            'item_leaflet': true
                        }
                    }]
                }
            ]
        },
        'event2_resolution': {
            id: 'event2_resolution',
            characterId: 'inspector',
            passiveChecks: [
                {
                    id: 'chk_case1_exploration_student_intuition',
                    voiceId: 'intuition',
                    difficulty: 8,
                    isPassive: true,
                    passiveText: 'This pamphlet wave is coordinated pressure, not random protest.',
                    passiveFailText: 'Looks like ordinary street agitation.',
                    onSuccess: {
                        actions: [{ type: 'add_flag', payload: { 'clue_organized_opposition': true } }]
                    }
                }
            ],
            nextSceneId: 'approach_bank'
        },

        'approach_bank': {
            id: 'approach_bank',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                {
                    type: 'add_flag', payload: {
                        'exploration_phase_active': true,
                        'case01_map_exploration_intro_done': true,
                        'near_bank': true
                    }
                }
            ]
        }
    }
};

export default CASE1_MAP_FIRST_EXPLORATION_LOGIC;
