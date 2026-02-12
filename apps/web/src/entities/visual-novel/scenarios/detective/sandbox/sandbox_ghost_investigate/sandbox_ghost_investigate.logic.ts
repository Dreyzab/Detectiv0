import type { VNScenarioLogic } from '../../../../model/types';

const ghostClueCount = (flags: Record<string, boolean>): number =>
    [
        flags['CLUE_GHOST_COLD_DRAFT'],
        flags['CLUE_GHOST_HIDDEN_PASSAGE'],
        flags['CLUE_GHOST_SERVANT_TESTIMONY'],
        flags['CLUE_GHOST_ECTOPLASM']
    ].filter(Boolean).length;

export const SANDBOX_GHOST_INVESTIGATE_LOGIC: VNScenarioLogic = {
    id: 'sandbox_ghost_investigate',
    packId: 'ka1905',
    title: 'Haunted Estate: Evidence Collection',
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_stuhlinger_warehouse.webp',
    initialSceneId: 'estate_entry',
    scenes: {
        estate_entry: {
            id: 'estate_entry',
            characterId: 'narrator',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'client_met' } }
            ],
            choices: [
                {
                    id: 'inspect_cold_hall',
                    nextSceneId: 'cold_draft_clue',
                    condition: (flags) => !flags['CLUE_GHOST_COLD_DRAFT']
                },
                {
                    id: 'inspect_fireplace',
                    nextSceneId: 'hidden_passage_clue',
                    condition: (flags) => !flags['CLUE_GHOST_HIDDEN_PASSAGE']
                },
                {
                    id: 'question_servant',
                    nextSceneId: 'servant_testimony_clue',
                    condition: (flags) => !flags['CLUE_GHOST_SERVANT_TESTIMONY']
                },
                {
                    id: 'inspect_residue',
                    nextSceneId: 'ectoplasm_clue',
                    condition: (flags) => !flags['CLUE_GHOST_ECTOPLASM']
                },
                {
                    id: 'summarize_findings',
                    nextSceneId: 'estate_outro',
                    condition: (flags) => ghostClueCount(flags) >= 2
                },
                {
                    id: 'leave_estate',
                    nextSceneId: 'END'
                }
            ]
        },
        cold_draft_clue: {
            id: 'cold_draft_clue',
            characterId: 'clara_altenburg',
            onEnter: [
                { type: 'add_flag', payload: { CLUE_GHOST_COLD_DRAFT: true } },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'investigating' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_cold_draft',
                        name: 'Unnatural Draft',
                        description: 'A freezing draft appears in a sealed corridor with no visible vent.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'estate_entry'
        },
        hidden_passage_clue: {
            id: 'hidden_passage_clue',
            characterId: 'clara_altenburg',
            onEnter: [
                { type: 'add_flag', payload: { CLUE_GHOST_HIDDEN_PASSAGE: true } },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'investigating' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_hidden_passage',
                        name: 'Hidden Passage',
                        description: 'A concealed passage behind the fireplace shows fresh boot prints.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'estate_entry'
        },
        servant_testimony_clue: {
            id: 'servant_testimony_clue',
            characterId: 'narrator',
            onEnter: [
                { type: 'add_flag', payload: { CLUE_GHOST_SERVANT_TESTIMONY: true } },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'investigating' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_servant_testimony',
                        name: "Servant's Testimony",
                        description: 'The servant reports nightly cellar sounds and a shadow in the corridor.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'estate_entry'
        },
        ectoplasm_clue: {
            id: 'ectoplasm_clue',
            characterId: 'clara_altenburg',
            onEnter: [
                { type: 'add_flag', payload: { CLUE_GHOST_ECTOPLASM: true } },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'investigating' } },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_ectoplasm_residue',
                        name: 'Ectoplasm Residue',
                        description: 'A phosphorescent residue remains cold and reactive to touch.',
                        packId: 'ka1905'
                    }
                }
            ],
            nextSceneId: 'estate_entry'
        },
        estate_outro: {
            id: 'estate_outro',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        ESTATE_INVESTIGATED: true,
                        GHOST_HAS_2_CLUES: true
                    }
                },
                { type: 'unlock_point', payload: 'loc_ka_guild' },
                { type: 'set_quest_stage', payload: { questId: 'sandbox_ghost', stage: 'evidence_collected' } }
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

export default SANDBOX_GHOST_INVESTIGATE_LOGIC;
