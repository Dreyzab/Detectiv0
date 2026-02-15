import type { VNContentPack } from '../../../../../model/types';

export const LEAD_TAILOR_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entrance': {
            text: 'The workshop is packed with bolts of fabric and half-finished costumes. Wool dust hangs in warm light.'
        },
        'tailor_greets': {
            text: 'A slight man with round spectacles looks up from his sewing machine. "Good day. I am [[Leopold Fein]]. What can I do for you, Inspector?"',
            choices: {
                'show_fabric': 'Show torn velvet from the bank.',
                'ask_hartmann_orders': '"Does the name Hartmann appear in your records?"',
                'ask_box217_usage': '"Any clients tied to private box 217?"',
                'ask_lock_signature_workshop': '"Anyone in your circle could produce controlled high heat tools?"',
                'ask_hidden_slot_pattern': '"Do hidden seam designs map to concealed transport routes?"',
                'ask_customers': '"Who commissions your premium work?"',
                'browse_stock': 'Inspect the workshop stock.',
                'leave_shop': 'Leave.'
            }
        },

        'show_fabric_scene': {
            text: 'You place the red scrap on his table. "Recognize this weave?"'
        },
        'tailor_examines': {
            text: 'Fein studies the fibers with professional care. Recognition lands before he can hide it.'
        },
        'tailor_recognition': {
            text: '"[[Venetian theatrical velvet]]. Rare and expensive. I am one of few tailors in Baden who keeps it."',
            choices: {
                'perception_check_records': '[Perception] Read what is visible on his ledger.',
                'press_galdermann_name': '"Galdermann surfaced in this case before your name did. Explain."',
                'press_relic_gap': '"Selective relic shelves were cleared. Who orders carrying capes for that?"',
                'ask_client': '"Who bought this recently?"',
                'thank_leave': 'Thank him and leave.'
            }
        },
        'perception_success': {
            text: 'Your eye catches an open ledger line: cash order, no name, "[[black cape with red lining]]."'
        },
        'perception_fail': {
            text: 'The desk is cluttered. Nothing readable before he closes it.'
        },
        'tailor_caught': {
            text: 'Fein notices your gaze too late. "Cash customers ask for discretion. I provide tailoring, not biography."'
        },
        'tailor_client_info': {
            text: '"One buyer this month. Young, student colors, asked for stage-grade concealment."'
        },
        'tailor_hartmann_response': {
            text: '"Hartmann appeared on discreet delivery notes. Always urgent. Always cash transfer through intermediaries."'
        },
        'tailor_box217_response': {
            text: '"Private-box clients request travel capes with hidden inner seams. Expensive work, minimal names."'
        },
        'tailor_lock_signature_response': {
            text: 'Fein studies your sketch. "That pattern needs controlled burners and cooling baths. Not common burglars, more workshop discipline."'
        },
        'tailor_hidden_slot_response': {
            text: '"Smuggling coats use fold-lock seams aligned with wall recess handoff. Stage crews call it a blind pass."'
        },
        'tailor_galdermann_reply': {
            text: 'Fein exhales. "I do not discuss banking patrons. I discuss measurements and payment."'
        },
        'tailor_relic_gap_reply': {
            text: '"Runners asked for padded liners sized for narrow relic cases. Not cash sacks. Whoever hired them knew dimensions."' 
        },
        'tailor_description': {
            text: '"Buyer had a [[dueling scar]] and slight limp. Mentioned [[Corps Suevia]]."'
        },

        'ask_customers': {
            text: '"Theater staff, festival committees, and private patrons who value discretion."'
        },
        'browse_stock': {
            text: 'You spot multiple red velvet bolts. Same premium grade as the bank sample.'
        }
    }
};

export default LEAD_TAILOR_EN;
