import type { VNScenarioLogic } from '../../../../model/types';

const hasSupernaturalPair = (flags: Record<string, boolean>): boolean =>
    Boolean(flags['CLUE_GHOST_COLD_DRAFT']) && Boolean(flags['CLUE_GHOST_ECTOPLASM']);

const hasContrabandPair = (flags: Record<string, boolean>): boolean =>
    Boolean(flags['CLUE_GHOST_HIDDEN_PASSAGE']) && Boolean(flags['CLUE_GHOST_SERVANT_TESTIMONY']);

export const SANDBOX_GHOST_GUILD_LOGIC: VNScenarioLogic = {
    id: 'sandbox_ghost_guild',
    packId: 'ka1905',
    title: 'Haunted Estate: Guild Review',
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_rathaus_archiv.webp',
    initialSceneId: 'guild_intro',
    scenes: {
        guild_intro: {
            id: 'guild_intro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'present_supernatural_pattern',
                    nextSceneId: 'guild_supernatural',
                    condition: hasSupernaturalPair
                },
                {
                    id: 'present_contraband_pattern',
                    nextSceneId: 'guild_contraband',
                    condition: hasContrabandPair
                },
                {
                    id: 'ask_for_neutral_method',
                    nextSceneId: 'guild_neutral'
                }
            ]
        },
        guild_supernatural: {
            id: 'guild_supernatural',
            characterId: 'clara_altenburg',
            nextSceneId: 'guild_outro'
        },
        guild_contraband: {
            id: 'guild_contraband',
            characterId: 'clara_altenburg',
            nextSceneId: 'guild_outro'
        },
        guild_neutral: {
            id: 'guild_neutral',
            characterId: 'clara_altenburg',
            nextSceneId: 'guild_outro'
        },
        guild_outro: {
            id: 'guild_outro',
            characterId: 'narrator',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        GUILD_VISITED: true,
                        GHOST_DEDUCTION_MADE: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'guild_visit' } }
            ],
            choices: [
                {
                    id: 'return_to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_GHOST_GUILD_LOGIC;
