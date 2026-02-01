import type { VNScenarioLogic } from '../../../../../model/types';

export const CASE1_BRIEFING_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_briefing',
    title: 'Arrival in Freiburg',
    defaultBackgroundUrl: '/images/regions/freiburg_old.png',
    initialSceneId: 'start',
    mode: 'fullscreen',
    scenes: {
        'start': {
            id: 'start',
            nextSceneId: 'mission'
        },
        'mission': {
            id: 'mission',
            choices: [
                {
                    id: 'accept',
                    nextSceneId: 'arrival_station'
                }
            ]
        },
        'arrival_station': {
            id: 'arrival_station',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            choices: [
                {
                    id: 'look_around',
                    nextSceneId: 'meet_rookie'
                }
            ]
        },
        'meet_rookie': {
            id: 'meet_rookie',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            nextSceneId: 'mayor_info'
        },
        'mayor_info': {
            id: 'mayor_info',
            backgroundUrl: '/images/scenarios/bahnhof_platform.png',
            characterId: 'gendarm',
            choices: [
                {
                    id: 'choice_visit_mayor',
                    nextSceneId: 'mayor_office_1',
                    actions: [
                        { type: 'add_flag', payload: { 'met_mayor_first': true } }
                    ]
                },
                {
                    id: 'choice_skip_mayor',
                    nextSceneId: 'END',
                    actions: [
                        { type: 'unlock_point', payload: 'munsterplatz_bank' },
                        { type: 'add_flag', payload: { 'case01_started': true, 'met_mayor_first': false } }
                    ]
                }
            ]
        },
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
            nextSceneId: 'meet_victoria_office'
        },
        'meet_victoria_office': {
            id: 'meet_victoria_office',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'assistant',
            nextSceneId: 'mayor_directive'
        },
        'mayor_directive': {
            id: 'mayor_directive',
            backgroundUrl: '/images/scenarios/mayor_office.png',
            characterId: 'mayor',
            choices: [
                {
                    id: 'accept_assistant',
                    nextSceneId: 'END',
                    actions: [
                        { type: 'unlock_point', payload: 'munsterplatz_bank' },
                        { type: 'add_flag', payload: { 'case01_started': true } }
                    ]
                }
            ]
        }
    }
};

export default CASE1_BRIEFING_LOGIC;
