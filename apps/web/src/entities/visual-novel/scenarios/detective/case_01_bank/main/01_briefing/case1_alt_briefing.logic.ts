import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Case 1 Alt Briefing: Bahnhof & Banküberfall (Alternative Opening)
 * 
 * Dynamic, modern visual novel style:
 * - Short text blocks, frequent transitions
 * - Station arrival → Police recognition → Bank crime scene → Clara meeting
 * 
 * This is a PARALLEL scenario to the original briefing, not a replacement.
 */

export const CASE1_ALT_BRIEFING_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_alt_briefing',
    title: 'Ankunft am Hauptbahnhof',
    defaultBackgroundUrl: '/images/scenarios/bahnhof_platform.png',
    initialSceneId: 'arrival_platform',
    mode: 'fullscreen',
    scenes: {
        // ═══════════════════════════════════════════════════════════════
        // ACT 1: ANKUNFT AM BAHNHOF (3 short scenes)
        // ═══════════════════════════════════════════════════════════════
        'arrival_platform': {
            id: 'arrival_platform',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            nextSceneId: 'platform_atmosphere'
        },
        'platform_atmosphere': {
            id: 'platform_atmosphere',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            nextSceneId: 'police_approach'
        },
        'police_approach': {
            id: 'police_approach',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            nextSceneId: 'police_briefing'
        },
        'police_briefing': {
            id: 'police_briefing',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            choices: [
                {
                    id: 'ask_details',
                    nextSceneId: 'briefing_details',
                    type: 'inquiry'
                },
                {
                    id: 'go_immediately',
                    nextSceneId: 'transition_to_bank',
                    type: 'action'
                }
            ]
        },
        'briefing_details': {
            id: 'briefing_details',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            nextSceneId: 'transition_to_bank'
        },

        // ═══════════════════════════════════════════════════════════════
        // ACT 2: FAHRT ZUM TATORT (2 scenes - transition)
        // ═══════════════════════════════════════════════════════════════
        'transition_to_bank': {
            id: 'transition_to_bank',
            backgroundUrl: '/images/scenarios/carriage_interior.png',
            nextSceneId: 'bank_arrival'
        },
        'bank_arrival': {
            id: 'bank_arrival',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            nextSceneId: 'notice_argument'
        },

        // ═══════════════════════════════════════════════════════════════
        // ACT 3: BEGEGNUNG MIT CLARA (6 scenes - main interaction)
        // ═══════════════════════════════════════════════════════════════
        'notice_argument': {
            id: 'notice_argument',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'ask_about_clara'
        },
        'ask_about_clara': {
            id: 'ask_about_clara',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'gendarm',
            nextSceneId: 'clara_confronts'
        },
        'clara_confronts': {
            id: 'clara_confronts',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'respond_professional',
                    nextSceneId: 'clara_react_professional',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 10 } },
                        { type: 'add_flag', payload: { 'clara_respect_earned': true } }
                    ]
                },
                {
                    id: 'respond_curious',
                    nextSceneId: 'clara_react_curious',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 5 } },
                        { type: 'add_flag', payload: { 'clara_intrigued': true } }
                    ]
                },
                {
                    id: 'respond_direct',
                    nextSceneId: 'clara_react_direct',
                    type: 'action',
                    actions: [
                        { type: 'add_flag', payload: { 'clara_tested': true } }
                    ]
                }
            ]
        },
        'clara_react_professional': {
            id: 'clara_react_professional',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'clara_introduces'
        },
        'clara_react_curious': {
            id: 'clara_react_curious',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'clara_introduces'
        },
        'clara_react_direct': {
            id: 'clara_react_direct',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'clara_introduces'
        },

        // ═══════════════════════════════════════════════════════════════
        // ACT 4: CLARA'S OBSERVATIONS (5 scenes - exposition)
        // ═══════════════════════════════════════════════════════════════
        'clara_introduces': {
            id: 'clara_introduces',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'clara_observation_1'
        },
        'clara_observation_1': {
            id: 'clara_observation_1',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'officer_interrupts'
        },
        'officer_interrupts': {
            id: 'officer_interrupts',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'gendarm',
            nextSceneId: 'detective_intervenes'
        },
        'detective_intervenes': {
            id: 'detective_intervenes',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            // No characterId = detective's inner monologue / action
            nextSceneId: 'clara_continues',
            onEnter: [
                { type: 'modify_relationship', payload: { characterId: 'clara_altenburg', amount: 5 } }
            ]
        },
        'clara_continues': {
            id: 'clara_continues',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            nextSceneId: 'clara_smell_clue'
        },
        'clara_smell_clue': {
            id: 'clara_smell_clue',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'enter_bank',
                    nextSceneId: 'briefing_exit',
                    type: 'action'
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // EXIT: Transition to Bank Investigation
        // ═══════════════════════════════════════════════════════════════
        'briefing_exit': {
            id: 'briefing_exit',
            backgroundUrl: '/images/scenarios/bank_exterior_crowd.png',
            nextSceneId: 'END',
            onEnter: [
                { type: 'unlock_point', payload: 'munsterplatz_bank' },
                {
                    type: 'add_flag', payload: {
                        'case01_started': true,
                        'clara_introduced': true,
                        'alt_briefing_completed': true
                    }
                }
            ]
        }
    }
};

export default CASE1_ALT_BRIEFING_LOGIC;
