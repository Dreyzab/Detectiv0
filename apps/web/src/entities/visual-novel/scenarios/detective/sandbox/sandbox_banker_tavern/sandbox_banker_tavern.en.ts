import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_TAVERN_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        tavern_intro: {
            text: 'Smoke, cards, and low voices. Friedrich\'s name is spoken only together with initial W.',
            choices: {
                bribe_barkeep: 'Pay the barkeep for details',
                intimidate_witness: 'Pressure a witness',
                leave_tavern: 'Leave the tavern'
            }
        },
        bribe_success: {
            text: 'The barkeep talks: Friedrich played to repay a debt and passed chips to a handler in gray.'
        },
        bribe_fail: {
            text: 'The barkeep takes your money but hedges. You still get one useful lead toward the casino.'
        },
        intimidate_success: {
            text: 'The witness folds and names a croupier ledger mark tied to initial W.'
        },
        intimidate_fail: {
            text: 'The room goes silent. A fallback tip still confirms Friedrich appears nightly at the casino.'
        },
        tavern_outro: {
            text: 'Clara: "The next move is the casino. We either confirm the chain, or lose it."',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_BANKER_TAVERN_EN;
