import type { VNContentPack } from '../../model/types';

export const LEAD_TAILOR_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'entrance': {
            text: 'The cramped workshop is a riot of color — bolts of fabric, half-finished garments, and theatrical costumes crowd every surface. The smell of wool and sizing fills the air.'
        },
        'tailor_greets': {
            text: 'A slight man with round spectacles looks up from his sewing machine. "Good day, mein Herr. What can [[Leopold Fein]] do for you?"',
            choices: {
                'show_fabric': 'Show the torn velvet from the bank',
                'ask_customers': '"Who are your clients, Herr Fein?"',
                'browse_stock': 'Look around the shop',
                'leave_shop': 'Leave'
            }
        },

        // SHOW FABRIC
        'show_fabric_scene': {
            text: 'I produce the scrap of red velvet. "Have you seen this fabric before?"'
        },
        'tailor_examines': {
            text: 'Fein takes the fabric, holds it to the light. His fingers run across the weave with professional precision. His expression changes — recognition, then worry.'
        },
        'tailor_recognition': {
            text: '"This is... this is [[Venetian theatrical velvet]]. Very expensive. I am one of three tailors in Baden who stock it."',
            choices: {
                'perception_check_records': '[Perception] Notice something on his desk',
                'ask_client': '"Did you sell any recently?"',
                'thank_leave': 'Thank him and leave'
            }
        },
        'perception_success': {
            text: 'Your eye catches an open ledger on his desk. An entry from last week — paid in cash, no name. "[[Black theatrical cape with red lining]]."'
        },
        'perception_fail': {
            text: 'His desk is cluttered with papers and fabric samples. Nothing stands out.'
        },
        'tailor_caught': {
            text: 'Fein notices your gaze and quickly closes the ledger, but it\'s too late. "I... the customer paid in cash. I never ask questions when the money is good."'
        },
        'tailor_client_info': {
            text: '"I have sold this fabric only once in the past month. A gentleman — younger, wore student colors. He said it was for a [[theatrical performance]]. I did not ask further."'
        },
        'tailor_description': {
            text: '"He had a [[dueling scar]] on his cheek. Very proud of it. Walked with a slight limp — old injury, I think. Mentioned [[Corps Suevia]]..."'
        },

        // ALTERNATIVES
        'ask_customers': {
            text: '"My clients? The theater, mostly. Some private individuals who need costumes for festivals. The occasional eccentric."'
        },
        'browse_stock': {
            text: 'The shop contains fabrics from across Europe. You spot several bolts of the same red velvet — clearly expensive stock.'
        }
    }
};
