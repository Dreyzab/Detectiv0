import type { VNScenario } from '../../model/types';

export const CASE1_BANK_SCENE: VNScenario = {
    id: 'detective_case1_bank_scene',
    title: 'Bankhaus J.A. Krebs Details',
    defaultBackgroundUrl: '/images/scenarios/bank_interior_1905.jpg',
    initialSceneId: 'arrival',
    scenes: {
        'arrival': {
            id: 'arrival',
            text: 'The grand hall of Bankhaus Krebs lacks its usual bustle. A nervous clerk stands near the heavy vault door.',
            characterId: 'inspector',
            choices: [
                { id: 'speak_clerk', text: 'Talk to the clerk', nextSceneId: 'clerk_1' },
                { id: 'inspect_vault', text: 'Examine the vault', nextSceneId: 'vault_1' }
            ]
        },
        'clerk_1': {
            id: 'clerk_1',
            text: 'I... I swear I locked it, Inspector! But this morning, it was just... open. Like magic.',
            characterId: 'bank_manager',
            nextSceneId: 'arrival'
        },
        'vault_1': {
            id: 'vault_1',
            text: 'The lock mechanism is intact. No scratches, no burns. But on the floor, you spot something.',
            characterId: 'inspector',
            choices: [
                {
                    id: 'take_fabric',
                    text: 'Pick up the torn fabric',
                    nextSceneId: 'evidence_found',
                    actions: [
                        {
                            type: 'grant_evidence',
                            payload: {
                                id: 'ev_torn_fabric',
                                name: 'Torn Velvet',
                                description: 'Expensive red velvet, often used in high-end upholstery... or uniforms.',
                                packId: 'fbg1905'
                            }
                        }
                    ]
                }
            ]
        },
        'evidence_found': {
            id: 'evidence_found',
            text: 'This fabric... it belongs to the upholstery of the Ganter Brewery VIP lounge. I would bet my badge on it.',
            characterId: 'inspector',
            choices: [
                {
                    id: 'goto_pub',
                    text: 'To the Brewery!',
                    nextSceneId: 'END',
                    actions: [
                        { type: 'unlock_point', payload: 'ganter_brauerei' }
                    ]
                }
            ]
        }
    }
};
