import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_SON_HOUSE_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        son_house_arrival: {
            text: 'The room is disordered, but not decadent. This looks like panic, not luxury.',
            choices: {
                inspect_desk: 'Inspect the writing desk',
                inspect_wardrobe: 'Inspect wardrobe and trunk',
                leave_house: 'Leave for now'
            }
        },
        desk_findings: {
            text: 'Between unpaid letters you find a debt note signed with initial W and a short deadline.'
        },
        wardrobe_findings: {
            text: 'Pawn receipts are tucked in a coat seam. Friedrich sold personal valuables before the theft dates.'
        },
        house_outro: {
            text: 'Clara: "He was plugging a leak, not burning money for sport."',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_BANKER_SON_HOUSE_EN;
