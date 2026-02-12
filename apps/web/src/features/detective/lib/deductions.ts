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

// ── Karlsruhe Sandbox: Ghost Case Deductions ─────────────

export const SANDBOX_GHOST_DEDUCTIONS: DeductionRecipe[] = [
    {
        id: 'ghost_true_trail',
        inputs: ['ev_cold_draft', 'ev_ectoplasm_residue'],
        result: {
            type: 'add_flag',
            id: 'GHOST_TRUE_DEDUCTION',
            label: 'Übernatürliche Manifestation',
            description: 'The cold draft and ectoplasm cannot be explained by conventional means. This estate is genuinely haunted.'
        }
    },
    {
        id: 'ghost_false_trail',
        inputs: ['ev_hidden_passage', 'ev_servant_testimony'],
        result: {
            type: 'add_flag',
            id: 'GHOST_FALSE_DEDUCTION',
            label: 'Schmugglertheorie',
            description: 'The hidden passage and the maid\'s account of "figures walking through walls" suggest a contrabandist using the estate as a warehouse.'
        }
    }
];

SANDBOX_GHOST_DEDUCTIONS.forEach(d => DEDUCTION_REGISTRY[d.id] = d);
