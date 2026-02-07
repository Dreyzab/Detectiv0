import { describe, expect, it } from 'bun:test';
import {
    getMerchantAccessResult,
    getMerchantBuyPrice,
    getMerchantDefinition,
    getMerchantSellPrice,
    getMerchantStock
} from './items';

describe('merchant access and economy', () => {
    it('locks The Fence without contact flag or reputation', () => {
        const result = getMerchantAccessResult(getMerchantDefinition('the_fence'), {
            flags: {},
            factionReputation: {}
        });

        expect(result.unlocked).toBe(false);
    });

    it('unlocks The Fence by underworld contact flag', () => {
        const result = getMerchantAccessResult(getMerchantDefinition('the_fence'), {
            flags: { underworld_contact: true },
            factionReputation: {}
        });

        expect(result.unlocked).toBe(true);
    });

    it('unlocks The Fence by underworld reputation', () => {
        const result = getMerchantAccessResult(getMerchantDefinition('the_fence'), {
            flags: {},
            factionReputation: { fct_underworld: 2 }
        });

        expect(result.unlocked).toBe(true);
    });

    it('applies merchant-specific pricing multipliers', () => {
        const apothecaryBuy = getMerchantBuyPrice(getMerchantDefinition('apothecary_shop'), 100);
        const tailorBuy = getMerchantBuyPrice(getMerchantDefinition('tailor_shop'), 100);
        const pubSell = getMerchantSellPrice(getMerchantDefinition('pub_keeper'), 100);

        expect(apothecaryBuy).toBe(105);
        expect(tailorBuy).toBe(120);
        expect(pubSell).toBe(35);
    });

    it('reveals stage-aware stock only after required quest stage', () => {
        const pub = getMerchantDefinition('pub_keeper');

        const beforeLeads = getMerchantStock(pub, { case01: 'bank_investigation' });
        const atLeadsOpen = getMerchantStock(pub, { case01: 'leads_open' });

        expect(beforeLeads.some((entry) => entry.itemId === 'rumor_note')).toBe(false);
        expect(atLeadsOpen.some((entry) => entry.itemId === 'rumor_note')).toBe(true);
    });
});
