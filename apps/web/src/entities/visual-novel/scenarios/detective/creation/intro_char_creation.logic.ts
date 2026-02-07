import type { VNScenarioLogic } from '../../../model/types';

/**
 * Character Creation Scenario
 * 
 * Allows the player to select their origin.
 * Currently only 'Journalist' is available.
 */

export const INTRO_CHAR_CREATION_LOGIC: VNScenarioLogic = {
    id: 'intro_char_creation',
    title: 'Character Selection',
    defaultBackgroundUrl: '/images/scenarios/inspector_office_night.png', // Placeholder: dark room or mirror
    initialSceneId: 'select_origin',
    mode: 'fullscreen',
    scenes: {
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
            nextSceneId: 'start_game_journalist',
            onEnter: [
                { type: 'set_stat', payload: { id: 'charisma', value: 4 } },
                { type: 'set_stat', payload: { id: 'perception', value: 4 } },
                { type: 'set_stat', payload: { id: 'empathy', value: 2 } },
                { type: 'add_flag', payload: { 'origin_journalist': true } }
            ]
        },
        'start_game_journalist': {
            id: 'start_game_journalist',
            characterId: 'inspector',
            nextSceneId: 'END', // Return to HomePage to trigger Telegram
            onEnter: [
                { type: 'add_flag', payload: { 'char_creation_complete': true } }
            ]
        }
    }
};

export default INTRO_CHAR_CREATION_LOGIC;
