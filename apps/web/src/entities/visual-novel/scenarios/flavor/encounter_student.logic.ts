
import type { VNScenarioLogic } from '../../model/types';

export const encounterStudentLogic: VNScenarioLogic = {
    id: 'encounter_student',
    title: 'Encounter: The Scarred Youth',
    defaultBackgroundUrl: '/images/scenarios/university_street.png',
    initialSceneId: 'start',
    musicUrl: '/audio/ambient_city_day.mp3', // Placeholder
    scenes: {
        start: {
            id: 'start',
            choices: [
                {
                    id: 'authority',
                    skillCheck: {
                        id: 'chk_authority',
                        voiceId: 'authority',
                        difficulty: 12, // Needs genuine authority
                        onSuccess: { nextSceneId: 'auth_success' },
                        onFail: { nextSceneId: 'auth_fail' }
                    }
                },
                {
                    id: 'volition',
                    skillCheck: {
                        id: 'chk_composure',
                        voiceId: 'volition',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'comp_success' }, // Simply ignore him effectively
                        onFail: { nextSceneId: 'comp_fail' } // He provokes you
                    }
                },
                {
                    id: 'engage',
                    nextSceneId: 'engage_dialogue'
                }
            ]
        },
        auth_success: {
            id: 'auth_success',
            characterId: 'worker', // Using generic for student for now
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        auth_fail: {
            id: 'auth_fail',
            characterId: 'worker',
            choices: [
                { id: 'escalate', nextSceneId: 'duel_threat' },
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        comp_success: {
            id: 'comp_success',
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        comp_fail: {
            id: 'comp_fail',
            characterId: 'worker',
            choices: [
                { id: 'confront', nextSceneId: 'duel_threat' },
                { id: 'leave_shame', nextSceneId: 'end' }
            ]
        },
        engage_dialogue: {
            id: 'engage_dialogue',
            characterId: 'worker',
            choices: [
                { id: 'ask_scar', nextSceneId: 'ask_scar_scene' },
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        ask_scar_scene: {
            id: 'ask_scar_scene',
            characterId: 'worker',
            onEnter: [{ type: 'add_flag', payload: { 'xp_bonus_lore': true } }],
            choices: [
                { id: 'leave', nextSceneId: 'end' }
            ]
        },
        duel_threat: {
            id: 'duel_threat',
            characterId: 'worker',
            choices: [
                { id: 'accept', nextSceneId: 'end_duel' }, // Future content?
                { id: 'decline', nextSceneId: 'end' }
            ]
        },
        end_duel: {
            id: 'end_duel',
            onEnter: [
                { type: 'add_heat', payload: 1 } // Adding heat for public disturbance
            ],
            nextSceneId: 'end'
        },
        end: {
            id: 'end',
            // End
        }
    }
};

export default encounterStudentLogic;

