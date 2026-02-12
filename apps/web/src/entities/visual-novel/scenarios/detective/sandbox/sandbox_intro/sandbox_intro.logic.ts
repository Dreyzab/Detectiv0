import type { VNScenarioLogic } from '../../../../model/types';

/**
 * Sandbox Intro — First visit to the Karlsruhe Agency.
 * Player meets their partner and gets the briefing on available cases.
 * 
 * Flow:
 * 1. Agency description scene
 * 2. Partner introduction
 * 3. Three cases mentioned → map points unlocked
 */
export const SANDBOX_INTRO_LOGIC: VNScenarioLogic = {
    id: 'sandbox_intro',
    packId: 'ka1905',
    title: 'A New Office',
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_rathaus_archiv.webp',
    initialSceneId: 'agency_arrival',
    scenes: {
        'agency_arrival': {
            id: 'agency_arrival',
            nextSceneId: 'partner_introduction'
        },
        'partner_introduction': {
            id: 'partner_introduction',
            characterId: 'clara_altenburg',
            nextSceneId: 'case_briefing'
        },
        'case_briefing': {
            id: 'case_briefing',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'accept_cases',
                    nextSceneId: 'cases_accepted'
                }
            ]
        },
        'cases_accepted': {
            id: 'cases_accepted',
            onEnter: [
                { type: 'add_flag', payload: { 'ka_sandbox_started': true, 'ka_intro_complete': true, 'GHOST_CLIENT_MET': true } },
                { type: 'unlock_group', payload: 'ka_intro_hubs' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_karlsruhe', stage: 'exploring' } }
            ],
            choices: [
                {
                    id: 'to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_INTRO_LOGIC;
