import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_BAKERY_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        bakery_intro: {
            text: 'Warm yeast and sugar fill the bakery. The owner recognizes Bruno at once.',
            choices: {
                question_baker: 'Ask where Bruno went',
                inspect_flour_marks: 'Track paw marks in flour',
                leave_bakery: 'Leave for now'
            }
        },
        baker_statement: {
            text: '"He steals sweet crusts and sprints to Schlossgarten," the baker sighs. "Big heart, bigger appetite."'
        },
        flour_success: {
            text: 'You trace flour paw marks toward the park road. Clara smiles: "Direct trail. No detours."'
        },
        flour_fail: {
            text: 'You lose the fine trail, but the baker points to the same destination: Schlossgarten.'
        },
        bakery_outro: {
            text: 'Bruno is likely in the palace gardens.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_DOG_BAKERY_EN;
