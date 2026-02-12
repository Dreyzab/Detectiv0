import type { VNScenarioLogic } from '../../../../model/types';

const hasSupernaturalPair = (flags: Record<string, boolean>): boolean =>
    Boolean(flags['CLUE_GHOST_COLD_DRAFT']) && Boolean(flags['CLUE_GHOST_ECTOPLASM']);

const hasContrabandPair = (flags: Record<string, boolean>): boolean =>
    Boolean(flags['CLUE_GHOST_HIDDEN_PASSAGE']) && Boolean(flags['CLUE_GHOST_SERVANT_TESTIMONY']);

const hasAnyFairPair = (flags: Record<string, boolean>): boolean =>
    hasSupernaturalPair(flags) || hasContrabandPair(flags);

export const SANDBOX_GHOST_CONCLUDE_LOGIC: VNScenarioLogic = {
    id: 'sandbox_ghost_conclude',
    packId: 'ka1905',
    title: 'Haunted Estate: Final Accusation',
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_stuhlinger_warehouse.webp',
    initialSceneId: 'conclusion_intro',
    scenes: {
        conclusion_intro: {
            id: 'conclusion_intro',
            characterId: 'narrator',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'accusation' } }
            ],
            choices: [
                {
                    id: 'accuse_supernatural',
                    nextSceneId: 'verdict_supernatural',
                    condition: hasSupernaturalPair
                },
                {
                    id: 'accuse_contraband',
                    nextSceneId: 'verdict_contraband',
                    condition: hasContrabandPair
                },
                {
                    id: 'push_weak_accusation',
                    nextSceneId: 'weak_accusation',
                    condition: (flags) => !hasAnyFairPair(flags)
                },
                {
                    id: 'review_evidence',
                    nextSceneId: 'evidence_recap'
                }
            ]
        },
        evidence_recap: {
            id: 'evidence_recap',
            characterId: 'clara_altenburg',
            nextSceneId: 'conclusion_intro'
        },
        weak_accusation: {
            id: 'weak_accusation',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'reconsider_supernatural',
                    nextSceneId: 'verdict_supernatural',
                    condition: hasSupernaturalPair
                },
                {
                    id: 'reconsider_contraband',
                    nextSceneId: 'verdict_contraband',
                    condition: hasContrabandPair
                },
                {
                    id: 'withdraw_and_return_map',
                    nextSceneId: 'END'
                }
            ]
        },
        verdict_supernatural: {
            id: 'verdict_supernatural',
            characterId: 'narrator',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        GHOST_ACCUSED: true,
                        GHOST_CASE_DONE: true,
                        GHOST_RESOLUTION_SUPERNATURAL: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'resolved' } }
            ],
            nextSceneId: 'conclusion_outro'
        },
        verdict_contraband: {
            id: 'verdict_contraband',
            characterId: 'narrator',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        GHOST_ACCUSED: true,
                        GHOST_CASE_DONE: true,
                        GHOST_RESOLUTION_CONTRABAND: true
                    }
                },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'resolved' } }
            ],
            nextSceneId: 'conclusion_outro'
        },
        conclusion_outro: {
            id: 'conclusion_outro',
            characterId: 'clara_altenburg',
            choices: [
                {
                    id: 'return_to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_GHOST_CONCLUDE_LOGIC;
