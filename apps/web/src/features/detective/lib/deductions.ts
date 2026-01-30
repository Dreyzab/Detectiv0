export type DeductionResultType = 'new_evidence' | 'unlock_point' | 'add_flag' | 'narrative' | 'minigame';

export interface DeductionResult {
    type: DeductionResultType;
    id: string; // ID of the point, evidence, or flag. For minigame, id is the minigame name.
    label: string; // "You matched the glass shard!"
    description: string;
}

export interface DeductionRecipe {
    id: string;
    inputs: [string, string]; // We limit to 2 for simplicity for now
    result: DeductionResult;
}

// TODO: Move these IDs to a central constants file later
export const CASE_1_DEDUCTIONS: DeductionRecipe[] = [
    {
        id: 'glass_match',
        inputs: ['shard_glass', 'factory_sample'], // Hypothetical IDs
        result: {
            type: 'unlock_point',
            id: 'stuhlinger_warehouse',
            label: 'Industrial Trace',
            description: 'The glass composition is unique to the Stühlinger factory batch from 1904.'
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
CASE_1_DEDUCTIONS.forEach(d => DEDUCTION_REGISTRY[d.id] = d);
