import type { VNContentPack } from '../../../../../model/types';

export const CASE1_ALT_BRIEFING_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'beat0_mayor_intro': {
            text: 'Mayor Thoma closes the office door behind you. "Detective Vance, this city needs discretion. Clara von Altenburg will brief you personally. Hear her out."'
        },
        'beat1_open': {
            text: 'A woman in a grey coat rises beside the Mayor\'s desk. "You are late. Sit. We have ten minutes before this turns political."',
            choices: {
                'tactic_professional': '"The train was delayed. Let us keep this efficient."',
                'tactic_harsh': '"I am not late. You started early."',
                'tactic_soft': '"My apologies. New city. Glad to meet you, Clara."'
            }
        },
        'beat1_professional_response': {
            text: 'She gives a short nod. "Good. We can work with that."'
        },
        'beat1_harsh_response': {
            text: 'Her eyes narrow. "Then we should both stop wasting time."'
        },
        'beat1_soft_response': {
            text: 'Her posture softens for a moment. "Then listen carefully."'
        },

        'beat2_intro_professional': {
            text: '"Kaiserliche Handelsbank. Robbed three days ago. Police are stalled."',
            choices: {
                'beat2_ask_what_taken': '"What was taken?"',
                'beat2_ask_who_runs_case': '"Who is in charge on the police side?"',
                'beat2_ask_exactly_happened': '"What exactly happened?"'
            }
        },
        'beat2_intro_harsh': {
            text: '"Bank robbery. Three days. No suspect. Berlin sent you because nobody here wants to move first."',
            choices: {
                'beat2_ask_what_taken': '"What was taken?"',
                'beat2_ask_who_runs_case': '"Who is in charge on the police side?"',
                'beat2_ask_exactly_happened': '"What exactly happened?"'
            }
        },
        'beat2_intro_soft': {
            text: '"Three days ago they robbed the bank. Local police are overwhelmed. That is why you are here."',
            choices: {
                'beat2_ask_what_taken': '"What was taken?"',
                'beat2_ask_who_runs_case': '"Who is in charge on the police side?"',
                'beat2_ask_exactly_happened': '"What exactly happened?"'
            }
        },
        'beat2_exactly_happened_professional': {
            text: '"Pre-dawn access, no signs of forced entry, the wrong files missing, and too many people pretending this is routine. That is what happened."'
        },
        'beat2_exactly_happened_harsh': {
            text: '"A clean breach and a dirty cover story. Nobody admits who had vault access that night."'
        },
        'beat2_exactly_happened_soft': {
            text: '"Quiet entry, missing documents, frightened staff, and pressure from city hall. It is not just a robbery."'
        },
        'beat2_taken_answer': {
            text: '"Not money. Documents from a vault box. Police refuse to name the box number."'
        },
        'beat2_inspector_answer': {
            text: '"Inspector Weiss. Competent, but not fond of visitors from Berlin."'
        },
        'beat2_empathy_read': {
            text: 'She keeps her tone level, but the grip on her cup is too tight.'
        },

        'beat3_setup': {
            text: 'Clara slides a sealed envelope across the table. "Bank on Bertholdstrasse. You are unofficial. Stay quiet."',
            choices: {
                'beat3_professional_bonus': '"Who knows I arrived?"',
                'beat3_harsh_bonus': '"Is that advice, or an order?"',
                'beat3_soft_bonus': '"I am going in alone?"'
            }
        },
        'beat3_professional_result': {
            text: '"Only me and archivist Boehme. If you need records, use his name."'
        },
        'beat3_harsh_result': {
            text: '"An order. The last investigator who made noise disappeared."'
        },
        'beat3_soft_result': {
            text: '"Rumor says the night guard drinks at pub Zum Storchen. He may talk."'
        },
        'beat3_logic_gate': {
            text: 'Documents, pressure, and urgency. The pattern does not look like a normal robbery.',
            choices: {
                'beat3_logic_deduce_coverup': '[Logic] "Someone wants this buried quietly."',
                'beat3_logic_skip': '"I will focus on facts first."'
            }
        },
        'beat3_logic_success': {
            text: 'Clara holds your gaze for one extra second. "Then do not repeat that theory out loud."'
        },
        'beat3_logic_fail': {
            text: 'You keep the thought to yourself. Better to test the scene first.'
        },

        'beat4_exit': {
            text: 'She stands and leaves half her coffee untouched. "Time is gone. Move."',
            choices: {
                'beat4_ask_where': '"Where do I find you after this?"',
                'beat4_silent_nod': 'Take the envelope and nod.'
            }
        },
        'beat4_ask_where_result': {
            text: '"Do not look for me. I will find you."'
        },
        'beat4_silent_nod_result': {
            text: 'She tilts her head once. Approval without warmth.'
        },
        'briefing_finalize': {
            text: 'Address confirmed. Bankhouse Krebs is now your next destination.'
        }
    }
};

export default CASE1_ALT_BRIEFING_EN;
