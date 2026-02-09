import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAYOR_FOLLOWUP_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entry_after_bank': {
            text: 'Mayor Thoma does not sit when you enter. He remains by the long table, hands clasped so tightly his knuckles pale.\n\n"So. You chose the bank before my office. Not ideal, Inspector, but we do not have the luxury of wounded protocol."',
            choices: {
                'mayor_after_bank_ack': '"I followed the strongest lead first. Now we align chain of command and evidence."',
                'mayor_after_bank_pressure': '"Your office cost us tempo. I need access and signatures, not speeches."'
            }
        },
        'entry_after_mayor_first': {
            text: 'Mayor Thoma skims witness statements without looking up. "You already had the formal briefing. Good. Then we skip ceremony and update only what can change outcomes today."'
        },
        'clara_after_bank': {
            text: 'Clara leaves the window and sets two folders on the table: witness contradictions on the left, municipal pressure notes on the right.\n\n"At the bank we had fragments. Here we align timeline, motive pressure, and who benefits from delay."',
            choices: {
                'clara_after_bank_share': '"Good. Start with what your father is holding back and why."',
                'clara_after_bank_distance': '"I run my own chain. Give me only verifiable items and source paths."'
            }
        },
        'clara_after_mayor_first': {
            text: 'Clara nods once, clipped and deliberate. "Same objective, tighter scope. We isolate politics from evidence and force each claim onto a timeline."',
            choices: {
                'clara_after_mayor_first_sync': '"Understood. Give me the update package and I move immediately."'
            }
        },
        'followup_finalize': {
            text: 'Rathaus follow-up complete. Channels are synchronized, signatures are in place, and both Clara and the Mayor are now tied to your active operational route.'
        }
    }
};

export default CASE1_MAYOR_FOLLOWUP_EN;
