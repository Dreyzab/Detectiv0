import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_CASINO_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        casino_arrival: {
            text: 'Green felt, loud chips, and Friedrich at the center table. He agrees to talk only after a duel.',
            choices: {
                start_duel: 'Accept the duel',
                step_back: 'Withdraw for now'
            }
        },
        launch_duel: {
            text: 'You take your seat. The table goes quiet as the first cards are drawn.'
        },
        casino_fallout: {
            text: 'The duel is over. Friedrich admits the debt chain and his father\'s hidden accounting edits.',
            choices: {
                expose_publicly: 'Expose the truth publicly',
                settle_privately: 'Settle privately'
            }
        },
        resolution_public: {
            text: 'You force the issue into the open. The city hears the truth, but the family fractures.'
        },
        resolution_private: {
            text: 'You contain the scandal behind closed doors. The family is shaken, but not destroyed in public.'
        },
        case_closed: {
            text: 'The banker contract is closed. New opportunities await on the city map.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_BANKER_CASINO_EN;
