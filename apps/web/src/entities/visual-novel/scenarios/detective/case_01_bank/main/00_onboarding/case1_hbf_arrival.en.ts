import type { VNContentPack } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'beat1_atmosphere': {
            text: 'The train comes to a halt with a screeching of brakes. Steam fills the platform, obscuring the view. The air smells of coal and damp stone.'
        },
        'beat1_spot_fritz': {
            text: 'Passengers stream out, a chaotic river of coats and luggage.',
            choices: {
                'choice_approach_fritz': 'Approach the officer in uniform.',
                'choice_investigate_station': 'Investigate the station first.'
            }
        },

        'beat2_paperboy': {
            text: 'A young newspaper boy is shouting headlines near the pillar, but his eyes dart nervously around the hall.',
            choices: {
                'beat2_buy_newspaper': 'Buy the paper (1 Mark).',
                'beat2_glance_headline': 'Just glance at the headline.'
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
            choices: {}
        },
        'beat_fritz_priority': {
            text: '"Schutzmann Fritz Muller, Freiburg police. Bankhaus Krebs was hit hard, and Mayor Thoma is demanding answers. Your call, detective: bank first or Rathaus first."',
            choices: {
                'priority_bank_first': 'Primary task: Bank. Secondary: Mayor.',
                'priority_mayor_first': 'Primary task: Mayor. Secondary: Bank.'
            }
        },

        'hbf_finalize': {
            text: 'Arrival complete. Freiburg map is open: Bankhaus Krebs and Rathaus are now available.'
        }
    }
};

export default CASE1_HBF_ARRIVAL_EN;
