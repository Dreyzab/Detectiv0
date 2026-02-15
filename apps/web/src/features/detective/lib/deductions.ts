import type { VoiceId } from './parliament';

export type DeductionResultType =
    | 'new_evidence'
    | 'unlock_point'
    | 'add_flag'
    | 'narrative'
    | 'minigame'
    | 'hypothesis'
    | 'upgrade_evidence'
    | 'destroy_evidence';

export interface DeductionEvidenceGrant {
    id: string;
    name: string;
    description: string;
    icon?: string;
    packId: string;
}

export interface DeductionResult {
    type: DeductionResultType;
    id: string; // ID of the point, evidence, flag, hypothesis, or minigame name.
    label: string;
    description: string;
    grantsEvidence?: DeductionEvidenceGrant;
    removesEvidence?: string[];
    tier?: 0 | 1 | 2;
    baseConfidence?: number; // 0..100
}

export interface VoiceReaction {
    voiceId: VoiceId;
    trigger: 'on_attempt' | 'on_success' | 'on_fail' | 'on_locked';
    threshold?: number;
    text: string;
}

export interface VoiceGate {
    voiceId: VoiceId;
    minLevel: number;
}

export interface ConditionalResult {
    condition: 'default' | VoiceGate;
    result: DeductionResult;
    voiceLine?: string;
}

export interface DeductionRecipe {
    id: string;
    inputs: [string, string];
    // Backward compatibility for simple recipes.
    result?: DeductionResult;
    // Priority top->bottom, first matched condition wins.
    results?: ConditionalResult[];
    requiredVoice?: VoiceGate;
    voiceReactions?: VoiceReaction[];
    isRedHerring?: boolean;
    // Optional link used by confidence zero-sum behavior.
    conflictsWith?: string[];
}

export const sortEvidencePair = (id1: string, id2: string): [string, string] =>
    [id1, id2].sort((left, right) => left.localeCompare(right)) as [string, string];

export const isVoiceGate = (condition: ConditionalResult['condition']): condition is VoiceGate =>
    typeof condition !== 'string';

export const isGateSatisfied = (
    gate: VoiceGate | undefined,
    voiceStats: Partial<Record<VoiceId, number>>
): boolean => {
    if (!gate) {
        return true;
    }
    const level = voiceStats[gate.voiceId] ?? 0;
    return level >= gate.minLevel;
};

export const resolveDeductionResult = (
    recipe: DeductionRecipe,
    voiceStats: Partial<Record<VoiceId, number>>
): DeductionResult | null => {
    if (recipe.results && recipe.results.length > 0) {
        for (const candidate of recipe.results) {
            if (candidate.condition === 'default') {
                return candidate.result;
            }
            if (isGateSatisfied(candidate.condition, voiceStats)) {
                return candidate.result;
            }
        }
        return null;
    }
    return recipe.result ?? null;
};

export const findRecipeByInputs = (
    recipes: Record<string, DeductionRecipe>,
    id1: string,
    id2: string
): DeductionRecipe | null => {
    const inputs = sortEvidencePair(id1, id2);
    return Object.values(recipes).find((recipe) => {
        const recipeInputs = [...recipe.inputs].sort((left, right) => left.localeCompare(right));
        return recipeInputs[0] === inputs[0] && recipeInputs[1] === inputs[1];
    }) ?? null;
};

// TODO: Move these IDs to a central constants file later
export const CASE_1_DEDUCTIONS: DeductionRecipe[] = [
    {
        id: 'glass_match',
        inputs: ['shard_glass', 'factory_sample'],
        result: {
            type: 'unlock_point',
            id: 'stuhlinger_warehouse',
            label: 'Industrial Trace',
            description: 'The glass composition is unique to the Stuhlinger factory batch from 1904.'
        }
    },
    {
        id: 'safe_combo',
        inputs: ['ledger_page', 'cipher_key'],
        result: {
            type: 'add_flag',
            id: 'safe_cracked',
            label: 'Cipher Solved',
            description: 'The ledger numbers align with the cipher to reveal a combination: 18-93-05.'
        }
    },
    {
        id: 'chemical_test_01',
        inputs: ['unknown_powder', 'reagent_kit'],
        result: {
            type: 'minigame',
            id: 'chemical_analysis',
            label: 'Chemical Reaction',
            description: 'The powder reacts with the reagent. Further analysis is required.'
        }
    }
];

export const DEDUCTION_REGISTRY: Record<string, DeductionRecipe> = {};
CASE_1_DEDUCTIONS.forEach((deduction) => {
    DEDUCTION_REGISTRY[deduction.id] = deduction;
});

export const SANDBOX_GHOST_DEDUCTIONS: DeductionRecipe[] = [
    {
        id: 'ghost_true_trail',
        inputs: ['ev_cold_draft', 'ev_ectoplasm_residue'],
        result: {
            type: 'add_flag',
            id: 'GHOST_TRUE_DEDUCTION',
            label: 'Supernatural Manifestation',
            description: 'The cold draft and ectoplasm cannot be explained by conventional means. This estate is genuinely haunted.'
        },
        voiceReactions: [
            {
                voiceId: 'occultism',
                trigger: 'on_success',
                threshold: 2,
                text: 'Die Kalte ist nicht von dieser Welt. Das Ektoplasma bestatigt es.'
            },
            {
                voiceId: 'logic',
                trigger: 'on_success',
                threshold: 3,
                text: 'Korrelation ist nicht Kausalitat, aber hier fehlt eine bessere Erklarung.'
            }
        ]
    },
    {
        id: 'ghost_false_trail',
        inputs: ['ev_hidden_passage', 'ev_servant_testimony'],
        result: {
            type: 'add_flag',
            id: 'GHOST_FALSE_DEDUCTION',
            label: 'Smuggler Theory',
            description: 'The hidden passage and the maid testimony suggest contrabandists used the estate as a warehouse.'
        },
        voiceReactions: [
            {
                voiceId: 'deception',
                trigger: 'on_success',
                threshold: 2,
                text: 'Someone staged the fear. People lie better in the dark.'
            }
        ]
    }
];

SANDBOX_GHOST_DEDUCTIONS.forEach((deduction) => {
    DEDUCTION_REGISTRY[deduction.id] = deduction;
});

export const SANDBOX_DOG_DEDUCTIONS: DeductionRecipe[] = [
    {
        id: 'dog_bakery_route_from_note',
        inputs: ['ev_dog_vendor_tip', 'ev_dog_butcher_note'],
        result: {
            type: 'unlock_point',
            id: 'loc_ka_bakery',
            label: 'Bakery Route Confirmed',
            description: 'Vendor gossip and the butcher note align. Bruno likely moved toward bakery lane.',
            tier: 1
        },
        voiceReactions: [
            {
                voiceId: 'logic',
                trigger: 'on_success',
                threshold: 2,
                text: 'Two independent sources, one route. Bakery lane is the highest-probability path.'
            },
            {
                voiceId: 'perception',
                trigger: 'on_success',
                threshold: 2,
                text: 'Smell trail and witness report point the same way. Follow it before it fades.'
            }
        ]
    },
    {
        id: 'dog_bakery_route_from_wrapping',
        inputs: ['ev_dog_vendor_tip', 'ev_dog_meat_wrapping'],
        result: {
            type: 'unlock_point',
            id: 'loc_ka_bakery',
            label: 'Flour Trace Route',
            description: 'Flour on the butcher wrapping confirms movement from market chatter toward the bakery.',
            tier: 1
        },
        voiceReactions: [
            {
                voiceId: 'senses',
                trigger: 'on_success',
                threshold: 2,
                text: 'Grease, flour, and canine saliva. This package traveled with Bruno.'
            }
        ]
    },
    {
        id: 'dog_false_stables_hypothesis',
        inputs: ['ev_dog_vendor_tip', 'ev_dog_hay_fur'],
        result: {
            type: 'hypothesis',
            id: 'hyp_dog_stables_hideout',
            label: 'Stable Hideout Theory',
            description: 'Hay fibers suggest Bruno could be bedding down near the old stables.',
            tier: 1,
            baseConfidence: 34
        },
        isRedHerring: true,
        conflictsWith: ['hyp_dog_park_hideout'],
        voiceReactions: [
            {
                voiceId: 'deception',
                trigger: 'on_success',
                threshold: 2,
                text: 'Convenient clues are often planted. Still, the stables cannot be ruled out yet.'
            }
        ]
    },
    {
        id: 'dog_false_river_hypothesis',
        inputs: ['ev_dog_vendor_tip', 'ev_dog_river_prints'],
        result: {
            type: 'hypothesis',
            id: 'hyp_dog_river_escape',
            label: 'River Escape Theory',
            description: 'The riverbank prints imply Bruno headed toward the docks instead of the market loop.',
            tier: 1,
            baseConfidence: 39
        },
        isRedHerring: true,
        conflictsWith: ['hyp_dog_park_hideout'],
        voiceReactions: [
            {
                voiceId: 'intuition',
                trigger: 'on_success',
                threshold: 2,
                text: 'Something about these river tracks feels theatrical.'
            }
        ]
    },
    {
        id: 'dog_service_lane_debunk',
        inputs: ['ev_dog_laundry_thread', 'ev_dog_river_prints'],
        result: {
            type: 'destroy_evidence',
            id: 'dog_river_trail_debunked',
            label: 'River Lead Debunked',
            description: 'Laundry thread residue links back to bakery sacks. The river trail was a false branch.',
            removesEvidence: ['ev_dog_river_prints'],
            tier: 1
        },
        voiceReactions: [
            {
                voiceId: 'logic',
                trigger: 'on_success',
                threshold: 2,
                text: 'False correlation removed. We can collapse the river hypothesis.'
            }
        ]
    },
    {
        id: 'dog_true_park_hypothesis',
        inputs: ['ev_dog_vendor_tip', 'ev_dog_flour_trail'],
        result: {
            type: 'hypothesis',
            id: 'hyp_dog_park_hideout',
            label: 'Schlossgarten Rest Pattern',
            description: 'Bruno follows the food chain from market stalls to bakery and then naps in Schlossgarten.',
            tier: 2,
            baseConfidence: 67
        },
        conflictsWith: ['hyp_dog_stables_hideout', 'hyp_dog_river_escape'],
        voiceReactions: [
            {
                voiceId: 'empathy',
                trigger: 'on_success',
                threshold: 2,
                text: 'A spoiled dog seeks comfort, not adventure. The quiet park fits his habits.'
            },
            {
                voiceId: 'logic',
                trigger: 'on_success',
                threshold: 3,
                text: 'Route consistency is high. Park probability now dominates competing theories.'
            }
        ]
    }
];

SANDBOX_DOG_DEDUCTIONS.forEach((deduction) => {
    DEDUCTION_REGISTRY[deduction.id] = deduction;
});
