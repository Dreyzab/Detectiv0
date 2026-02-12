import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_INVESTIGATE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        estate_entry: {
            text: 'The estate groans under winter wind. Clara opens her notebook: "Collect hard evidence before we accuse anyone."',
            choices: {
                inspect_cold_hall: 'Inspect the freezing corridor',
                inspect_fireplace: 'Inspect the fireplace wall',
                question_servant: 'Question the servant',
                inspect_residue: 'Inspect glowing residue',
                summarize_findings: 'Summarize findings',
                leave_estate: 'Leave the estate for now'
            }
        },
        cold_draft_clue: {
            text: 'A blade-cold draft cuts through a sealed hall. No window, no vent, no obvious source.'
        },
        hidden_passage_clue: {
            text: 'Behind the fireplace panel you reveal a narrow passage with fresh mud on stone steps.'
        },
        servant_testimony_clue: {
            text: '"Every night the cellar door trembles," the servant says. "And someone walks the corridor without footsteps."'
        },
        ectoplasm_clue: {
            text: 'The green residue glows faintly even in darkness. It remains icy on bare skin.'
        },
        estate_outro: {
            text: 'You have enough material for structured deduction. The guild can now review your case model.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_GHOST_INVESTIGATE_EN;
