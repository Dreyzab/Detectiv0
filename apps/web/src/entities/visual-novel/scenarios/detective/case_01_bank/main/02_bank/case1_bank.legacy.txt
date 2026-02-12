import type { VNScenario } from '../../../../../model/types';

export const CASE1_BANK_SCENE: VNScenario = {
    id: 'detective_case1_bank_scene',
    title: 'Bankhaus J.A. Krebs Details',
    defaultBackgroundUrl: '/images/scenarios/bank_interior_1905.jpg',
    initialSceneId: 'arrival',
    scenes: {
        'arrival': {
            id: 'arrival',
            text: 'The [[grand hall]] of Bankhaus Krebs lacks its usual bustle. A [[nervous clerk]] stands near the [[heavy vault door]].',
            characterId: 'inspector',
            choices: [
                { id: 'speak_clerk', text: 'Talk to the clerk', nextSceneId: 'clerk_1' },
                { id: 'inspect_vault', text: 'Examine the vault', nextSceneId: 'vault_1' }
            ]
        },
        'clerk_1': {
            id: 'clerk_1',
            text: 'I... I swear I [[locked it]], Inspector! But this morning, it was just... [[open]]. Like magic.',
            characterId: 'bank_manager',
            nextSceneId: 'arrival'
        },
        'vault_1': {
            id: 'vault_1',
            text: 'The [[lock mechanism]] is intact. No [[scratches]], no [[burns]]. But on the floor, you spot something.',
            characterId: 'inspector',
            choices: [
                {
                    id: 'check_logic_lock',
                    text: '[Logic] Analyze the lock mechanism',
                    nextSceneId: 'vault_logic_pass',
                    skillCheck: {
                        id: 'chk_bank_logic_lock',
                        voiceId: 'logic',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'vault_logic_pass' },
                        onFail: { nextSceneId: 'vault_logic_fail' }
                    }
                },
                {
                    id: 'take_fabric',
                    text: '[Perception] Search for traces',
                    nextSceneId: 'evidence_found',
                    skillCheck: {
                        id: 'chk_bank_perception_fabric',
                        voiceId: 'perception',
                        difficulty: 8,
                        onSuccess: {
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
                        },
                        onFail: { nextSceneId: 'vault_perception_fail' }
                    }
                }
            ]
        },
        'vault_logic_pass': {
            id: 'vault_logic_pass',
            text: 'Logic: "This isn\'t magic. It\'s a tension wrench and a rake. High-grade steel scratches inside the keyway. A professional did this. Someone who knew exactly what pin stack to target."',
            characterId: 'inspector',
            choices: [
                { id: 'logic_pass_continue', text: 'Note the professional MO', nextSceneId: 'arrival' }
            ]
        },
        'vault_logic_fail': {
            id: 'vault_logic_fail',
            text: 'Logic: "It... it defies reason. The metal is smooth. No signs of entry. Maybe the clerk is right? Maybe it just... opened?"',
            characterId: 'inspector',
            choices: [
                { id: 'logic_fail_continue', text: 'Shake head in confusion', nextSceneId: 'arrival' }
            ]
        },
        'vault_perception_fail': {
            id: 'vault_perception_fail',
            text: 'Perception: "Dust bunnies. Old receipts. Nothing of value here. The thief was clean."',
            characterId: 'inspector',
            choices: [
                { id: 'perception_fail_back', text: 'Step back', nextSceneId: 'arrival' }
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
