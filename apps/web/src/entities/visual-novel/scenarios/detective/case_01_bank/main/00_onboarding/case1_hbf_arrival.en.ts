import type { VNContentPack } from '../../../../../model/types';

export const CASE1_HBF_ARRIVAL_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        'beat1_atmosphere': {
            text: 'The train stops with a piercing screech of brakes. Steam fills the platform, obscuring the outline of the station. The air smells of coal smoke and damp stone.\n\nYou step out of the carriage, feeling the morning chill through your coat. A crowd of passengers rushes toward the exit — hats, suitcases, umbrellas. No one pays attention to you.\n\nSomewhere ahead is Freiburg. And the case that brought you here.'
        },
        'beat1_spot_fritz': {
            text: 'The steam clears slightly. Through the shifting crowd, you notice a figure standing unnaturally still — a man in a dark Schutzmann uniform with a distinctive spiked helmet.\n\nHis eyes methodically scan the passengers. When his gaze meets yours, he gives a curt nod.',
            choices: {
                'choice_approach_fritz': 'Walk directly to the officer.',
                'choice_investigate_station': 'Look around the station first.'
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
            text: 'You hand over a coin. The boy practically throws the paper at you and moves away quickly.\n\nThe headline screams: "IMPERIAL BANK ROBBED — POLICE BAFFLED". A witness surname stands out: Hartmann. You fold the paper and tuck it away.'
        },
        'beat2_glance_result': {
            text: 'The headline is visible from here: "IMPERIAL BANK ROBBED". Everyone in Freiburg knows. You are not starting with surprise on your side.'
        },

        'beat3_square': {
            text: 'Outside the station, trams ring their bells and carriages cut through wet cobblestones. Freiburg is already in motion.\n\nTwo officers stand near the fountain, speaking in low voices. One mentions a name you file away: Galdermann.'
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
