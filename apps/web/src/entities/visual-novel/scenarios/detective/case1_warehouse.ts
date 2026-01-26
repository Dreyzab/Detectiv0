import type { VNScenario } from '../../model/types';

export const CASE1_WAREHOUSE_SCENE: VNScenario = {
    id: 'detective_case1_warehouse_finale',
    title: 'Showdown at the Warehouse',
    defaultBackgroundUrl: '/images/scenarios/warehouse_night_1905.jpg',
    initialSceneId: 'entry',
    scenes: {
        'entry': {
            id: 'entry',
            text: 'The warehouse is dark, but you see light flickering through the cracks. Voices inside.',
            characterId: 'inspector',
            choices: [
                { id: 'barge_in', text: 'Kick the door open!', nextSceneId: 'confrontation' },
                { id: 'sneak', text: 'Sneak in', nextSceneId: 'sneak_fail' }
            ]
        },
        'sneak_fail': {
            id: 'sneak_fail',
            text: 'You step on a loose board. CRACK. The voices stop.',
            characterId: 'inspector',
            nextSceneId: 'confrontation'
        },
        'confrontation': {
            id: 'confrontation',
            text: 'Director Krebs! And... hired thugs. They are loading the "stolen" gold into a carriage.',
            characterId: 'inspector',
            nextSceneId: 'reveal'
        },
        'reveal': {
            id: 'reveal',
            text: '"Inspector. You are persistent. But this gold is better off in Switzerland than paying the Kaiser\'s new taxes."',
            characterId: 'bank_manager',
            choices: [
                {
                    id: 'arrest',
                    text: 'You are under arrest!',
                    nextSceneId: 'battle_start',
                    actions: [
                        { type: 'start_battle', payload: { scenarioId: 'detective_boss_krebs', deckType: 'detective' } }
                    ]
                }
            ]
        },
        'battle_start': {
            id: 'battle_start',
            text: 'If you want it, come and get it!\n\n[BATTLE START PREVIEW]',
            characterId: 'bank_manager',
            nextSceneId: 'END'
        }
    }
};
