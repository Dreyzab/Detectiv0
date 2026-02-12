import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_GUILD_EN: VNContentPack = {
    locale: 'en',
    scenes: {
        guild_intro: {
            text: 'Inside the investigators guild, maps and autopsy sketches cover oak walls. Clara asks which pattern you want reviewed first.',
            choices: {
                present_supernatural_pattern: 'Present supernatural pattern',
                present_contraband_pattern: 'Present contraband pattern',
                ask_for_neutral_method: 'Ask for neutral method'
            }
        },
        guild_supernatural: {
            text: 'The guild master circles your cold-draft and residue notes. "If this is staged, it is staged with costly chemistry."'
        },
        guild_contraband: {
            text: 'He taps the hidden passage sketch. "Smuggling routes often dress themselves as ghost stories. Follow the logistics."'
        },
        guild_neutral: {
            text: '"Do not marry your first theory," the master warns. "At conclusion, accuse only what two independent clues support."'
        },
        guild_outro: {
            text: 'Your accusation framework is ready. Return to the estate and deliver the verdict.',
            choices: {
                return_to_map: 'Return to map'
            }
        }
    }
};

export default SANDBOX_GHOST_GUILD_EN;
