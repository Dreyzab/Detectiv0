
import type { VNScenarioLogic } from '../../model/types';

export const encounterTouristLogic: VNScenarioLogic = {
    id: 'encounter_tourist',
    title: 'Encounter: The Lost Tourist',
    defaultBackgroundUrl: '/images/scenarios/train_station_outside.png',
    initialSceneId: 'start',
    musicUrl: '/audio/ambient_city_day.mp3',
    scenes: {
        start: {
            id: 'start',
            choices: [
                {
                    id: 'directions',
                    skillCheck: {
                        id: 'chk_directions',
                        voiceId: 'encyclopedia', // Knowledge of geography
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'guide_success' },
                        onFail: { nextSceneId: 'guide_fail' }
                    }
                },
                {
                    id: 'pub',
                    skillCheck: {
                        id: 'chk_pub',
                        voiceId: 'volition', // Keeping a straight face while misleading him or just being chill
                        difficulty: 8,
                        onSuccess: { nextSceneId: 'pub_success' },
                        onFail: { nextSceneId: 'pub_fail' }
                    }
                },
                {
                    id: 'ignore',
                    nextSceneId: 'end_ignore'
                }
            ]
        },
        guide_success: {
            id: 'guide_success',
            characterId: 'worker', // Tourist
            onEnter: [{ type: 'add_flag', payload: { 'xp_bonus_intellect': true } }],
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        guide_fail: {
            id: 'guide_fail',
            characterId: 'worker',
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        pub_success: {
            id: 'pub_success',
            characterId: 'worker',
            onEnter: [{ type: 'add_flag', payload: { 'xp_bonus_social': true } }],
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        pub_fail: {
            id: 'pub_fail',
            characterId: 'worker',
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        end_ignore: {
            id: 'end_ignore',
            nextSceneId: 'end'
        },
        end: {
            id: 'end'
        }
    }
};

export default encounterTouristLogic;

