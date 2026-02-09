import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAP_FIRST_EXPLORATION_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'event1_intro': {
            text: 'The city route toward Bankhaus Krebs is already crowded when a postman misjudges a turn and slams into a handcart. Leather satchels burst open. Letters fan out across wet cobblestone while passersby pretend not to notice.\n\nThe postman mutters apologies through clenched teeth and reaches for the nearest envelope before you do.',
            choices: {
                'event1_help_postman': 'Kneel and help gather the letters.',
                'event1_walk_past': 'Keep moving, but catalog what you can at a glance.'
            }
        },
        'event1_envelope': {
            text: 'One envelope catches your eye before he can pocket it: Kaiserliche Handelsbank, attention [[Hartmann]], [[vault box 217]]. The paper is expensive, the handwriting disciplined, and the sender seal only half-scraped away.\n\nThe postman snatches it back with forced calm and tucks the stack under his coat.'
        },

        'event2_gate': {
            text: 'Closer to the university quarter, tram bells compete with chanting. A student in a frayed coat hands out anti-bank pamphlets at speed, then checks every corner as if expecting a raid.',
            choices: {
                'event2_linger': 'Slow down and engage the student.',
                'event2_skip': 'Stay on route and avoid the crowd.'
            }
        },
        'event2_intro': {
            text: 'The leaflet headline names [[Galdermann]] directly and accuses the bank board of laundering influence through shell accounts. Beneath the slogan, small print references a dismissed clerk and a missing ledger copy.',
            choices: {
                'event2_read_leaflet': 'Read the leaflet line by line.',
                'event2_ask_source': '"Who printed this, and who paid for it?"',
                'event2_dismiss': 'Fold it, pocket it, move on.'
            }
        },
        'event2_resolution': {
            text: 'Every answer comes late. The student scans the street before each sentence, eyes flicking from patrol boots to print ink on his own fingers.\n\nThis is not random outrage. Someone is shaping the narrative before evidence reaches daylight.'
        },

        'approach_bank': {
            text: 'Bankhaus Krebs rises ahead behind police rope and controlled access points. Whatever happened inside is now wrapped in procedure, pride, and fear.\n\nYou are close enough to begin bank entry protocol.'
        }
    }
};

export default CASE1_MAP_FIRST_EXPLORATION_EN;
