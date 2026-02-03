import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Case 1 Briefing: Arrival in Freiburg
 * 
 * Two paths:
 * A) Mayor Path (canonical): Station → Mayor Office → Victoria intro → Bank
 * B) Bank Path (shortcut): Station → Bank chaos → Mayor arrives with Victoria
 * 
 * Both converge at Bank investigation with Victoria as companion.
 */

export const CASE1_BRIEFING_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_briefing',
    title: 'Arrival in Freiburg',
    defaultBackgroundUrl: '/images/regions/freiburg_old.png',
    initialSceneId: 'arrival_station',
    mode: 'fullscreen',
    scenes: {
        // ═══════════════════════════════════════════════════════════════
        // ARRIVAL AT STATION
        // ═══════════════════════════════════════════════════════════════
        'arrival_station': {
            id: 'arrival_station',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            choices: [
                {
                    id: 'look_around',
                    nextSceneId: 'meet_rookie',
                    type: 'action'
                }
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // MÜLLER HUB — Information gathering before proceeding
        // ═══════════════════════════════════════════════════════════════
        'meet_rookie': {
            id: 'meet_rookie',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            choices: [
                {
                    id: 'ask_bank',
                    nextSceneId: 'muller_lore_bank',
                    type: 'inquiry'
                },
                {
                    id: 'ask_mayor',
                    nextSceneId: 'muller_lore_mayor',
                    type: 'inquiry'
                },
                {
                    id: 'observe_muller',
                    nextSceneId: 'muller_observe_self',
                    type: 'flavor'
                },
                {
                    id: 'proceed_mayor',
                    nextSceneId: 'mayor_office_1',
                    type: 'action',
                    actions: [
                        { type: 'add_flag', payload: { 'met_mayor_first': true } }
                    ]
                },
                {
                    id: 'proceed_bank',
                    nextSceneId: 'bank_path_1',
                    type: 'action',
                    actions: [
                        { type: 'add_flag', payload: { 'met_mayor_first': false } }
                    ]
                }
            ]
        },

        // Inquiry responses (loop back to hub)
        'muller_lore_bank': {
            id: 'muller_lore_bank',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            nextSceneId: 'meet_rookie'
        },
        'muller_lore_mayor': {
            id: 'muller_lore_mayor',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            nextSceneId: 'meet_rookie'
        },
        'muller_observe_self': {
            id: 'muller_observe_self',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            nextSceneId: 'meet_rookie'
        },

        // ═══════════════════════════════════════════════════════════════
        // PATH A: MAYOR OFFICE (Canonical Path)
        // ═══════════════════════════════════════════════════════════════
        'mayor_office_1': {
            id: 'mayor_office_1',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'mayor',
            nextSceneId: 'mayor_office_2'
        },
        'mayor_office_2': {
            id: 'mayor_office_2',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'mayor',
            nextSceneId: 'mayor_introduces_victoria'
        },
        'mayor_introduces_victoria': {
            id: 'mayor_introduces_victoria',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'mayor',
            nextSceneId: 'victoria_first_impression'
        },
        'victoria_first_impression': {
            id: 'victoria_first_impression',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'assistant',
            choices: [
                {
                    id: 'react_respectful',
                    nextSceneId: 'victoria_react_respect',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'assistant', amount: 15 } }
                    ]
                },
                {
                    id: 'react_skeptical',
                    nextSceneId: 'victoria_react_skeptic',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'assistant', amount: -5 } }
                    ]
                },
                {
                    id: 'react_flirtatious',
                    nextSceneId: 'victoria_react_flirt',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'assistant', amount: -10 } }
                    ]
                },
                {
                    id: 'observe_victoria',
                    nextSceneId: 'victoria_observe_result',
                    type: 'flavor'
                }
            ]
        },
        'victoria_react_respect': {
            id: 'victoria_react_respect',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'assistant',
            nextSceneId: 'mayor_directive'
        },
        'victoria_react_skeptic': {
            id: 'victoria_react_skeptic',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'assistant',
            nextSceneId: 'mayor_directive'
        },
        'victoria_react_flirt': {
            id: 'victoria_react_flirt',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'assistant',
            nextSceneId: 'mayor_directive'
        },
        'victoria_observe_result': {
            id: 'victoria_observe_result',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            nextSceneId: 'victoria_first_impression' // Return to choice hub
        },
        'mayor_directive': {
            id: 'mayor_directive',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'mayor',
            choices: [
                {
                    id: 'accept_partnership',
                    nextSceneId: 'mayor_path_exit',
                    type: 'action'
                }
            ]
        },
        'mayor_path_exit': {
            id: 'mayor_path_exit',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            nextSceneId: 'END',
            onEnter: [
                { type: 'unlock_point', payload: 'munsterplatz_bank' },
                { type: 'add_flag', payload: { 'case01_started': true, 'victoria_introduced': true } }
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // PATH B: BANK SHORTCUT (Mayor arrives later)
        // ═══════════════════════════════════════════════════════════════
        'bank_path_1': {
            id: 'bank_path_1',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            nextSceneId: 'bank_path_2'
        },
        'bank_path_2': {
            id: 'bank_path_2',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            characterId: 'inspector',
            nextSceneId: 'mayor_arrives_bank'
        },
        'mayor_arrives_bank': {
            id: 'mayor_arrives_bank',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            characterId: 'mayor',
            nextSceneId: 'mayor_introduces_victoria_bank'
        },
        'mayor_introduces_victoria_bank': {
            id: 'mayor_introduces_victoria_bank',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            characterId: 'mayor',
            nextSceneId: 'victoria_bank_intro'
        },
        'victoria_bank_intro': {
            id: 'victoria_bank_intro',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            characterId: 'assistant',
            choices: [
                {
                    id: 'react_respectful_bank',
                    nextSceneId: 'victoria_react_respect_bank',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'assistant', amount: 10 } }
                    ]
                },
                {
                    id: 'react_annoyed_bank',
                    nextSceneId: 'victoria_react_annoyed_bank',
                    type: 'action',
                    actions: [
                        { type: 'modify_relationship', payload: { characterId: 'assistant', amount: -15 } }
                    ]
                }
            ]
        },
        'victoria_react_respect_bank': {
            id: 'victoria_react_respect_bank',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            characterId: 'assistant',
            nextSceneId: 'bank_path_exit'
        },
        'victoria_react_annoyed_bank': {
            id: 'victoria_react_annoyed_bank',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            characterId: 'assistant',
            nextSceneId: 'bank_path_exit'
        },
        'bank_path_exit': {
            id: 'bank_path_exit',
            backgroundUrl: '/images/scenarios/location_exterior_street.png',
            nextSceneId: 'END',
            onEnter: [
                { type: 'unlock_point', payload: 'munsterplatz_bank' },
                { type: 'add_flag', payload: { 'case01_started': true, 'victoria_introduced': true } }
            ]
        }
    }
};

export default CASE1_BRIEFING_LOGIC;
