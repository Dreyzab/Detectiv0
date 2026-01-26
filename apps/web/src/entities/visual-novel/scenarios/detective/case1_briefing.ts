import type { VNScenario } from '../../model/types';

export const CASE1_BRIEFING: VNScenario = {
    id: 'detective_case1_briefing',
    title: 'Case #1: The Bankhaus Krebs',
    defaultBackgroundUrl: '/images/regions/freiburg_old.jpg',
    initialSceneId: 'start',
    scenes: {
        'start': {
            id: 'start',
            text: 'Inspector. Berlin has received disturbing reports from Freiburg. The Bankhaus J.A. Krebs has been targeted.',
            characterId: 'unknown',
            choices: [
                { id: 'c1', text: 'Another robbery?', nextSceneId: 'briefing_1' },
                { id: 'c2', text: 'Krebs... an influential family.', nextSceneId: 'briefing_2' }
            ]
        },
        'briefing_1': {
            id: 'briefing_1',
            text: 'Precisely. But this is not a common burglary. The vault was breached without explosives, and nothing of monetary value was taken.',
            characterId: 'unknown',
            nextSceneId: 'mission'
        },
        'briefing_2': {
            id: 'briefing_2',
            text: 'Indeed. And potentially dangerous enemies of the Crown. The theft was subtle. No explosives, no alarms.',
            characterId: 'unknown',
            nextSceneId: 'mission'
        },
        'mission': {
            id: 'mission',
            text: 'We suspect political motives. Or perhaps... something more esoteric. Proceed to the Bank on Münsterplatz immediately.',
            characterId: 'unknown',
            choices: [
                {
                    id: 'accept',
                    text: 'Understood. I am on my way.',
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
