import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_PARK_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        park_intro: {
            text: 'Among old oaks in Schlossgarten, a heavy brown dog gnaws a stolen loaf. Bruno lifts one ear.',
            choices: {
                call_bruno: 'Call him by name',
                approach_with_sausage: 'Approach carefully with sausage',
                retreat: 'Retreat and return later'
            }
        },
        bruno_spooked: {
            text: 'Bruno darts behind a bench, then peeks out again. Clara whispers: "Easy now, no sudden moves."'
        },
        bruno_found: {
            text: 'The dog recognizes your voice and wags hard enough to shake leaves from a nearby branch.',
            choices: {
                check_collar: 'Inspect the collar',
                escort_to_rathaus: 'Escort Bruno back to city hall'
            }
        },
        collar_clue: {
            text: 'A brass tag stamped with the city seal glints on the collar. Ownership confirmed.'
        },
        dog_resolved: {
            text: 'Back at Rathaus, Pfeiffer exhales in relief. "You saved both my dog and my dignity, detective."',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_DOG_PARK_EN;
