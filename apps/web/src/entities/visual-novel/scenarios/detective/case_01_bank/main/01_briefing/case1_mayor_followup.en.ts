import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAYOR_FOLLOWUP_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entry_after_bank': {
            text: 'Mayor Thoma folds his hands. "So you met Clara at the bank before coming here. Not ideal, but we move forward."',
            choices: {
                'mayor_after_bank_ack': '"I followed the strongest lead first. Now we coordinate."',
                'mayor_after_bank_pressure': '"Your office delayed things. I need access, not speeches."'
            }
        },
        'entry_after_mayor_first': {
            text: 'Mayor Thoma reviews a stack of statements. "You already had your formal briefing. Keep this short."'
        },
        'clara_after_bank': {
            text: 'Clara steps away from the window. "At the bank we only had fragments. Here we can align timelines and pressure points."',
            choices: {
                'clara_after_bank_share': '"Good. Walk me through what your father is not saying."',
                'clara_after_bank_distance': '"I will work my own chain. Share only what is verifiable."'
            }
        },
        'clara_after_mayor_first': {
            text: 'Clara nods once. "Same objective, tighter scope. We keep politics out and evidence in."',
            choices: {
                'clara_after_mayor_first_sync': '"Understood. Give me the updates and we move."'
            }
        },
        'followup_finalize': {
            text: 'Rathaus check-in complete. Clara and the Mayor are now synchronized with your active route.'
        }
    }
};

export default CASE1_MAYOR_FOLLOWUP_EN;
