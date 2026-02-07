import type { VNContentPack } from '../../../../../model/types';

export const CASE1_MAP_FIRST_EXPLORATION_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'event1_intro': {
            text: 'A postman brakes hard and letters scatter across cobblestone.',
            choices: {
                'event1_help_postman': 'Help gather the letters.',
                'event1_walk_past': 'Keep moving, but glance down.'
            }
        },
        'event1_envelope': {
            text: 'One envelope is addressed to Kaiserliche Handelsbank, attention [[Hartmann]], vault box 217.'
        },

        'event2_gate': {
            text: 'Near the university quarter, a student is handing out anti-bank leaflets.',
            choices: {
                'event2_linger': 'Slow down and engage.',
                'event2_skip': 'Ignore it and keep to the bank route.'
            }
        },
        'event2_intro': {
            text: 'The leaflet headline names [[Galdermann]] directly and hints at internal bank ties.',
            choices: {
                'event2_read_leaflet': 'Read the leaflet in full.',
                'event2_ask_source': '"Who printed this?"',
                'event2_dismiss': 'Pocket it and move on.'
            }
        },
        'event2_resolution': {
            text: 'The student keeps scanning the street before every answer.'
        },

        'approach_bank': {
            text: 'You are close enough to begin bank entry protocol.'
        }
    }
};

export default CASE1_MAP_FIRST_EXPLORATION_EN;
