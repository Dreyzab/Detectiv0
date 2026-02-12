import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_MAYOR_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        mayor_briefing: {
            text: 'Mayor Pfeiffer closes the office door. "Detective, my dog Bruno vanished. If the city learns I lost him, tomorrow will be a parade of jokes."',
            choices: {
                accept_case: 'Accept the contract',
                press_for_details: 'Ask why this matters politically',
                decline_for_now: 'Decline for now'
            }
        },
        public_risk: {
            text: '"The opposition already says I cannot run a city block," he mutters. "Find Bruno before sunset and spare this office a scandal."'
        },
        mayor_details: {
            text: 'Clara marks the butcher quarter on your map. "Bruno follows food, not mystery. Start there, then bakery, then park."',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_DOG_MAYOR_EN;
