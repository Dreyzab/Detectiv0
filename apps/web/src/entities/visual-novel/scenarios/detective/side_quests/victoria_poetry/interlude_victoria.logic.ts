import type { VNScenarioLogic } from '../../../../model/types';

/**
 * Interlude A: The Burden of Name
 * Trigger: Automatically after the first Lead is completed.
 * 
 * Skeleton:
 * 1. Street scene.
 * 2. NPC insults Victoria.
 * 3. Victoria explains her conflict.
 * 4. Inspector chooses stance (Support/Challenge).
 */

export const INTERLUDE_VICTORIA_LOGIC: VNScenarioLogic = {
    id: 'interlude_victoria_street',
    packId: 'fbg1905',
    title: 'Interlude: The Burden',
    defaultBackgroundUrl: '/images/scenarios/street_day_1905.webp',
    initialSceneId: 'street_encounter',
    mode: 'overlay',
    scenes: {
        'street_encounter': {
            id: 'street_encounter',
            characterId: 'unknown', // "Beggar" or "Passerby"
            nextSceneId: 'victoria_reaction',
            // Note: In full version, text would be specific insult
        },
        'victoria_reaction': {
            id: 'victoria_reaction',
            characterId: 'assistant',
            nextSceneId: 'victoria_confession'
        },
        'victoria_confession': {
            id: 'victoria_confession',
            characterId: 'assistant',
            choices: [
                {
                    id: 'comfort_empathy',
                    nextSceneId: 'comfort_res',
                    skillCheck: {
                        id: 'chk_interlude_empathy',
                        voiceId: 'empathy',
                        difficulty: 8,
                        onSuccess: {
                            nextSceneId: 'comfort_success',
                            actions: [{ type: 'modify_relationship', payload: { characterId: 'assistant', amount: 10 } }]
                        },
                        onFail: { nextSceneId: 'comfort_fail' }
                    }
                },
                {
                    id: 'challenge_authority',
                    nextSceneId: 'challenge_res',
                    skillCheck: {
                        id: 'chk_interlude_authority',
                        voiceId: 'authority',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'challenge_success',
                            actions: [{ type: 'modify_relationship', payload: { characterId: 'assistant', amount: 5 } }]
                        },
                        onFail: { nextSceneId: 'challenge_fail' }
                    }
                },
                { id: 'ignore', nextSceneId: 'ignore_res' }
            ]
        },
        // Outcome Stubs
        'comfort_success': {
            id: 'comfort_success',
            characterId: 'assistant',
            nextSceneId: 'END',
            onEnter: [
                { type: 'add_flag', payload: { 'victoria_quest_active': true } }
            ]
        },
        'comfort_fail': { id: 'comfort_fail', characterId: 'assistant', nextSceneId: 'END' },
        'challenge_success': {
            id: 'challenge_success',
            characterId: 'assistant',
            nextSceneId: 'END',
            onEnter: [
                { type: 'add_flag', payload: { 'victoria_quest_active': true } }
            ]
        },
        'challenge_fail': { id: 'challenge_fail', characterId: 'assistant', nextSceneId: 'END' },
        'ignore_res': { id: 'ignore_res', characterId: 'inspector', nextSceneId: 'END' }
    }
};

export default INTERLUDE_VICTORIA_LOGIC;
