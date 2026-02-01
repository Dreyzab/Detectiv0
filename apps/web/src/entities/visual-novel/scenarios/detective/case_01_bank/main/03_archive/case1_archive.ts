import type { VNScenario } from '../../../../../model/types';

export const CASE1_ARCHIVE_SCENE: VNScenario = {
    id: 'detective_case1_archive_search',
    title: 'City Archive Search',
    defaultBackgroundUrl: '/images/scenarios/archive_1905.jpg',
    initialSceneId: 'start',
    scenes: {
        'start': {
            id: 'start',
            text: 'Rows of dusty ledgers. The plans for the Stühlinger district are somewhere here.',
            characterId: 'inspector',
            choices: [
                { id: 'search_plans', text: 'Search building plans', nextSceneId: 'plans_found' }
            ]
        },
        'plans_found': {
            id: 'plans_found',
            text: 'Here. "Warehouse 14B". It was condemned in 1899 due to structural instability. But the owner is listed as... "J.A. Krebs".',
            characterId: 'inspector',
            choices: [
                {
                    id: 'connect_dots',
                    text: 'The banker robbed himself?',
                    nextSceneId: 'deduction'
                }
            ]
        },
        'deduction': {
            id: 'deduction',
            text: 'Insurance fraud? Or hiding assets? The warehouse is the key.',
            characterId: 'inspector',
            choices: [
                {
                    id: 'finish_archive',
                    text: 'To the Warehouse!',
                    nextSceneId: 'END',
                    actions: [
                        { type: 'add_flag', payload: { 'evidence_archive_plans': true } }
                    ]
                }
            ]
        }
    }
};
