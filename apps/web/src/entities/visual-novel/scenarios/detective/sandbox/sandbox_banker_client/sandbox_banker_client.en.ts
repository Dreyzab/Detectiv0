import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_CLIENT_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        entry_hall: {
            text: 'A clerk closes the office door behind you. Herr Richter waits by an open ledger and a locked private safe.'
        },
        bank_intro: {
            text: '"My son disappears every night," the banker says. "Money is missing from my private safe. I need discretion, not police."',
            choices: {
                accept_case: 'Accept the contract',
                press_motive: 'Press him about his motive and records'
            }
        },
        press_success: {
            text: 'Under pressure, Richter slips. You notice fresh corrections in the cash ledger and wax on his glove.'
        },
        press_fail: {
            text: 'He stiffens and gives shorter answers. You keep the case, but trust is reduced.'
        },
        case_accepted: {
            text: 'Clara marks two leads on your map: Friedrich\'s house and the tavern circuit.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_BANKER_CLIENT_EN;
