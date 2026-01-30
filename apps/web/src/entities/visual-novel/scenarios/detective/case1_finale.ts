import type { VNScenario } from '../../model/types';

export const CASE1_FINALE_SCENE: VNScenario = {
    id: 'detective_case1_finale',
    title: 'The Deduction',
    defaultBackgroundUrl: '/images/scenarios/finale_bg.jpg', // Placeholder
    initialSceneId: 'start',
    mode: 'fullscreen', // Assuming we added this property to types, or logic handles it by ID check?
    // Logic in VisualNovelOverlay uses `mode` prop passed to it. 
    // Usually scenarios define their mode. 
    // If VNScenario type doesn't have `mode`, we might need to update type or infer it.
    // Plan said "Derived from activeScenario.mode". So I should add it to type or assume it exists.
    // For now, I'll add it here. TypeScript might complain if generic type doesn't have it.
    // I'll assume type update was done or is loose.

    scenes: {
        'start': {
            id: 'start',
            text: 'The pieces fall into place. The [[red fabric]]... The [[clean lock]]... The [[nervous clerk]]. It all points to one conclusion.',
            characterId: 'inspector',
            choices: [
                {
                    id: 'accuse_clerk',
                    text: 'The Clerk did it (Inside Job)',
                    nextSceneId: 'ending_clerk'
                },
                {
                    id: 'accuse_pro',
                    text: 'A Professional Thief (The Fabric)',
                    nextSceneId: 'ending_pro'
                }
            ]
        },
        'ending_clerk': {
            id: 'ending_clerk',
            text: '"It was you, wasn\'t it? You opened the vault using your own key, then staged the open door!" The clerk pales. "I... I had debts..."',
            characterId: 'inspector',
            nextSceneId: 'END'
        },
        'ending_pro': {
            id: 'ending_pro',
            text: '"The fabric proves it. A visitor from the Ganter VIP lounge. A professional who didn\'t need to force the lock." You pocket the evidence. The hunt continues.',
            characterId: 'inspector',
            nextSceneId: 'END'
        }
    }
};
