
import type { VNScenarioLogic } from '../../model/types';

export const encounterCleanerLogic: VNScenarioLogic = {
    id: 'encounter_cleaner',
    title: 'Encounter: The Bächleputzer',
    defaultBackgroundUrl: '/images/scenarios/street_morning.png',
    initialSceneId: 'start',
    musicUrl: '/audio/ambient_city_morning.mp3',
    scenes: {
        start: {
            id: 'start',
            // No characterId -> Narrator
            choices: [
                {
                    id: 'observe',
                    skillCheck: {
                        id: 'chk_observe',
                        voiceId: 'perception', // Correct voiceId
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'observe_success' },
                        onFail: { nextSceneId: 'observe_fail' }
                    }
                },
                {
                    id: 'greet',
                    skillCheck: {
                        id: 'chk_chat',
                        voiceId: 'charisma',
                        difficulty: 11,
                        onSuccess: { nextSceneId: 'chat_success' },
                        onFail: { nextSceneId: 'chat_fail' }
                    }
                },
                {
                    id: 'ignore',
                    nextSceneId: 'end_ignore'
                }
            ]
        },
        observe_success: {
            id: 'observe_success',
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        observe_fail: {
            id: 'observe_fail',
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        chat_success: {
            id: 'chat_success',
            characterId: 'worker',
            onEnter: [{ type: 'add_flag', payload: { 'xp_bonus_social': true } }], // Placeholder for XP
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        chat_fail: {
            id: 'chat_fail',
            characterId: 'worker',
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        end_ignore: {
            id: 'end_ignore',
            onEnter: [
                { type: 'unlock_point', payload: 'p_street_event' }
            ],
            nextSceneId: 'end'
        },
        end: {
            id: 'end',
            // Final node, usually handled by checking if (nextSceneId === undefined && choices === undefined) -> Close Overlay
        }
    }
};
