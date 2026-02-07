import type { VNContentPack } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'beat1_collision': {
            text: 'The train jerks to a stop. Steam and noise hit you at once. A porter slams your shoulder as he rushes by.',
            choices: {
                'beat1_authority': '"Watch where you are going."',
                'beat1_perception': 'Step aside and scan the platform.',
                'beat1_intuition': 'Track where the porter is heading.'
            }
        },
        'beat1_authority_result': {
            text: 'The porter mutters under his breath but remembers your face.'
        },
        'beat1_perception_result': {
            text: 'The crowd starts to make sense. Movement has a pattern.'
        },
        'beat1_intuition_result': {
            text: 'He turns toward the cargo exit. Odd route for normal luggage.'
        },

        'beat2_kiosk': {
            text: 'A kiosk girl snaps open a newspaper: "Freiburger Zeitung. Bank scandal on the front page."',
            choices: {
                'beat2_buy_newspaper': 'Buy the paper.',
                'beat2_glance_headline': 'Catch the headline and move.'
            }
        },
        'beat2_buy_result': {
            text: 'Headline: "Kaiserliche Handelsbank Robbery". A witness surname stands out: [[Hartmann]].'
        },
        'beat2_glance_result': {
            text: 'You only catch fragments: bank, police, dead end.'
        },

        'beat3_square': {
            text: 'Outside the station, trams ring and carriages cut through wet stone. The city is already moving.',
            choices: {
                'beat3_ask_driver': 'Ask for directions.',
                'beat3_self_orient': 'Orient by signs and traffic flow.',
                'beat3_go_blind': 'Move fast and improvise.'
            }
        },
        'beat3_driver_result': {
            text: '"Straight, then left near the Munster." Quick and precise.'
        },
        'beat3_orient_result': {
            text: 'A sign to Zentrum points your way. You lock in the route.'
        },
        'beat3_blind_result': {
            text: 'Not clean, but decisive. Momentum matters.'
        },

        'hbf_finalize': {
            text: 'Arrival complete. Clara is waiting with the first real briefing.'
        }
    }
};

export default CASE1_HBF_ARRIVAL_EN;
