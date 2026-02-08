import type { VNContentPack } from '../../../model/types';

export const introCharCreationEn: VNContentPack = {
    locale: 'en',
    scenes: {
        'start_game': {
            text: `Dawn claws its way over Freiburg. A telegram waits with your name on it, and the city is already sharpening its teeth.`,
            choices: {
                'continue': `Begin.`
            }
        },
        'select_origin': {
            text: `Who are you? The reflection in the darkened window offers no clear answer. Your face is a map of choices made and paths taken. Before the telegram, before the bank, before the rain... what were you?`,
            choices: {
                'select_journalist': `[Rhetoric / Shivers] "I was a Journalist. I sold truth by the column-inch until the price got too high."`,
                'select_veteran': `[Locked] The Veteran (Coming Soon)`,
                'select_academic': `[Locked] The Academic (Coming Soon)`,
                'select_noble': `[Locked] The Noble (Coming Soon)`
            }
        },
        'confirm_journalist': {
            text: `Yes. Ink stains on your fingers, street dirt on your boots. You know Freiburg's secrets because you used to print them. You left Stuttgart this morning with a one-way ticket and a heavy heart. The city called you back.`,
            choices: {
                'continue': `Step into the light.`
            }
        },
        'telegram_gate': {
            text: `A courier slaps a sealed telegram into your hand. Rathaus wax. Urgent. No pleasantries, no signatures, only orders.`,
            choices: {
                'continue': `Break the seal and move.`
            }
        },
        'intro_journey': {
            text: `The train to Freiburg groans through morning fog. Coal smoke, wet stone, and a city waiting for answers.`,
            choices: {}
        }
    }
};

export default introCharCreationEn;
