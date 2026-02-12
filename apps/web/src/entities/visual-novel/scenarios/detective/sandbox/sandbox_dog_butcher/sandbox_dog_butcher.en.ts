import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_BUTCHER_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        butcher_intro: {
            text: 'The butcher wipes his knife and nods at you. The floor is wet with meltwater and sausage fat.',
            choices: {
                question_butcher: 'Ask about Bruno',
                inspect_counter: 'Inspect the cutting counter',
                leave_shop: 'Leave for now'
            }
        },
        butcher_statement: {
            text: '"Big brown dog? Bruno eats here twice a day," the butcher says. "Then he waddles to the bakery for sweet crusts."'
        },
        butcher_trace_success: {
            text: 'You find grease paper dusted with flour near the back door. Clara taps it: "Good. Butcher to bakery confirmed."'
        },
        butcher_trace_fail: {
            text: 'You miss the finer traces, but the butcher still points you to the bakery street.'
        },
        butcher_outro: {
            text: 'The next lead is clear: bakery district.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_DOG_BUTCHER_EN;
