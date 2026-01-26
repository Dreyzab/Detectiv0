import type { VNScenario } from '../../model/types';

export const CASE1_PUB_SCENE: VNScenario = {
    id: 'detective_case1_pub_rumors',
    title: 'Ganter Brewery Rumors',
    defaultBackgroundUrl: '/images/scenarios/pub_interior_1905.jpg',
    initialSceneId: 'entrance',
    scenes: {
        'entrance': {
            id: 'entrance',
            text: 'The air is thick with smoke and the smell of roasting malt. A group of workers is whispering in the corner.',
            characterId: 'inspector',
            choices: [
                { id: 'listen', text: 'Eavesdrop', nextSceneId: 'rumor_1' },
                { id: 'confront', text: 'Show badge', nextSceneId: 'silence' }
            ]
        },
        'silence': {
            id: 'silence',
            text: 'As soon as your badge glints in the lantern light, the room goes silent. You will get nothing from them now.',
            characterId: 'worker',
            nextSceneId: 'END'
        },
        'rumor_1': {
            id: 'rumor_1',
            text: '"...saw them moving crates to the old warehouse in Stühlinger last night. Big wooden crates. Royal seal."',
            characterId: 'worker',
            nextSceneId: 'rumor_2'
        },
        'rumor_2': {
            id: 'rumor_2',
            text: '"Hush! The police think it was anarchists. Let them think that."',
            characterId: 'worker',
            choices: [
                {
                    id: 'warehouse_lead',
                    text: 'They mentioned the Warehouse.',
                    nextSceneId: 'END',
                    actions: [
                        { type: 'unlock_point', payload: 'stuhlinger_warehouse' },
                        { type: 'unlock_point', payload: 'rathaus_archiv' } // Unlock archive to check plans
                    ]
                }
            ]
        }
    }
};
