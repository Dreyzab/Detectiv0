
import type { VNScenarioLogic } from '../../../../model/types';

export const questInspectorViennaLogic: VNScenarioLogic = {
    id: 'quest_inspector_vienna',
    title: 'Quest: Letters from Vienna',
    defaultBackgroundUrl: '/images/scenarios/inspector_office_night.png', // or generic office night
    initialSceneId: 'arrival',
    musicUrl: '/audio/ambient_office_night.mp3',
    scenes: {
        arrival: {
            id: 'arrival',
            characterId: 'inspector', // Narrator? Or just him sitting there
            // Actually let's start with narrator describing him
            choices: [
                {
                    id: 'approach',
                    nextSceneId: 'intro_dialogue'
                }
            ]
        },
        intro_dialogue: {
            id: 'intro_dialogue',
            characterId: 'corrupt_cop', // Richter
            choices: [
                {
                    id: 'ask_letter',
                    nextSceneId: 'letter_deflection'
                },
                {
                    id: 'offer_drink',
                    nextSceneId: 'drink_shared' // Easier path
                }
            ]
        },
        letter_deflection: {
            id: 'letter_deflection',
            characterId: 'corrupt_cop',
            choices: [
                {
                    id: 'press_authority',
                    skillCheck: {
                        id: 'chk_auth_inspector',
                        voiceId: 'authority',
                        difficulty: 12,
                        onSuccess: { nextSceneId: 'letter_revealed' },
                        onFail: { nextSceneId: 'letter_burned' }
                    }
                },
                {
                    id: 'back_off',
                    nextSceneId: 'end_fail'
                }
            ]
        },
        drink_shared: {
            id: 'drink_shared',
            characterId: 'corrupt_cop',
            onEnter: [{ type: 'modify_relationship', payload: { characterId: 'corrupt_cop', amount: 5 } }],
            choices: [
                {
                    id: 'ask_softly',
                    skillCheck: {
                        id: 'chk_emp_inspector',
                        voiceId: 'empathy',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'letter_revealed' },
                        onFail: { nextSceneId: 'letter_burned' }
                    }
                }
            ]
        },
        letter_revealed: {
            id: 'letter_revealed',
            // He reads it / shows it
            onEnter: [{ type: 'add_flag', payload: { 'inspector_quest_complete': true, 'inspector_loyal': true } }],
            choices: [
                { id: 'leave_respect', nextSceneId: 'end_success' }
            ]
        },
        letter_burned: {
            id: 'letter_burned',
            // He burns it
            choices: [
                { id: 'leave_silent', nextSceneId: 'end_fail' }
            ]
        },
        end_success: {
            id: 'end_success',
            characterId: 'corrupt_cop',
            // End
        },
        end_fail: {
            id: 'end_fail',
            characterId: 'corrupt_cop',
            // End
        }
    }
};

export default questInspectorViennaLogic;
