import type { VNScenarioLogic } from '../../../model/types';

/**
 * Character Creation Scenario
 * 
 * Allows the player to select their origin.
 * Currently only 'Journalist' is available.
 */

export const INTRO_CHAR_CREATION_LOGIC: VNScenarioLogic = {
    id: 'intro_char_creation',
    packId: 'fbg1905',
    title: 'Case 01 Onboarding',
    defaultBackgroundUrl: '/images/scenarios/inspector_office_night.webp', // Placeholder: dark room or mirror
    initialSceneId: 'start_game',
    mode: 'fullscreen',
    scenes: {
        'start_game': {
            id: 'start_game',
            characterId: 'inspector',
            nextSceneId: 'select_origin',
            choices: []
        },
        'select_origin': {
            id: 'select_origin',
            characterId: 'inspector', // Internal monologue
            choices: [
                {
                    id: 'select_journalist',
                    nextSceneId: 'confirm_journalist',
                },
                {
                    id: 'select_veteran',
                    nextSceneId: 'select_origin', // Loop back or show "Locked" text
                    condition: () => false // Hidden or handled by UI style? VN engine might just hide false conditions. 
                    // Better to show it but make it unselectable or loop with "Not available in this version."
                },
                {
                    id: 'select_academic',
                    nextSceneId: 'select_origin',
                    condition: () => false
                },
                {
                    id: 'select_noble',
                    nextSceneId: 'select_origin',
                    condition: () => false
                }
            ]
        },
        'confirm_journalist': {
            id: 'confirm_journalist',
            characterId: 'inspector',
            nextSceneId: 'telegram_gate',
            onEnter: [
                { type: 'set_stat', payload: { id: 'charisma', value: 4 } },
                { type: 'set_stat', payload: { id: 'perception', value: 4 } },
                { type: 'set_stat', payload: { id: 'empathy', value: 2 } },
                { type: 'add_flag', payload: { 'origin_journalist': true } }
            ]
        },
        'telegram_gate': {
            id: 'telegram_gate',
            characterId: 'inspector',
            nextSceneId: 'intro_journey',
            onEnter: [
                { type: 'add_flag', payload: { 'telegram_received': true } }
            ]
        },
        'intro_journey': {
            id: 'intro_journey',
            characterId: 'inspector',
            nextSceneId: 'END',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        'char_creation_complete': true,
                        'journey_to_freiburg_complete': true
                    }
                }
            ]
        }
    }
};

export default INTRO_CHAR_CREATION_LOGIC;
