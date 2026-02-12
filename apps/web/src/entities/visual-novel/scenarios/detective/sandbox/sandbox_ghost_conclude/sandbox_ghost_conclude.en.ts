import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_CONCLUDE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        conclusion_intro: {
            text: 'You present your final accusation to the estate household. Every face tightens as the clues are named aloud.',
            choices: {
                accuse_supernatural: 'Accuse a supernatural force',
                accuse_contraband: 'Accuse a smuggling operation',
                push_weak_accusation: 'Force a weak accusation anyway',
                review_evidence: 'Review the evidence first'
            }
        },
        evidence_recap: {
            text: 'Clara quickly orders the facts: draft and residue support the haunting theory; passage and testimony support contraband. You can still choose either route if the pair is complete.'
        },
        weak_accusation: {
            text: 'The room pushes back. Clara interrupts before you lose control of the hearing and tells you to either pick a supported line or withdraw.',
            choices: {
                reconsider_supernatural: 'Reconsider: supernatural line',
                reconsider_contraband: 'Reconsider: contraband line',
                withdraw_and_return_map: 'Withdraw for now and return to map'
            }
        },
        verdict_supernatural: {
            text: 'You build the haunting argument from the cold draft and residue. The estate accepts the verdict and requests ritual containment.'
        },
        verdict_contraband: {
            text: 'You connect the hidden passage and servant testimony into a contraband operation. The estate secures the cellar and reports the route.'
        },
        conclusion_outro: {
            text: 'The estate case is closed and entered into your Karlsruhe ledger.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_GHOST_CONCLUDE_EN;
