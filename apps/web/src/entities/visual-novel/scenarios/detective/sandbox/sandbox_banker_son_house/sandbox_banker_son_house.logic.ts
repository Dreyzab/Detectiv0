import type { VNScenarioLogic } from '../../../../model/types';

export const SANDBOX_BANKER_SON_HOUSE_LOGIC: VNScenarioLogic = {
    id: 'sandbox_banker_son_house',
    packId: 'ka1905',
    title: "The Banker's Son: Friedrich's House",
    mode: 'fullscreen',
    defaultBackgroundUrl: '/images/detective/loc_student_house.webp',
    initialSceneId: 'son_house_arrival',
    scenes: {
        son_house_arrival: {
            id: 'son_house_arrival',
            characterId: 'narrator',
            choices: [
                {
                    id: 'inspect_desk',
                    nextSceneId: 'desk_findings'
                },
                {
                    id: 'inspect_wardrobe',
                    nextSceneId: 'wardrobe_findings'
                },
                {
                    id: 'leave_house',
                    nextSceneId: 'END'
                }
            ]
        },
        desk_findings: {
            id: 'desk_findings',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        TALKED_SON: true,
                        BANKER_INVESTIGATION_OPEN: true,
                        BANKER_LEAD_SON_DONE: true,
                        CLUE_B01_DEBT_NOTE: true
                    }
                },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_banker_debt_note',
                        name: 'Debt Note with Initial W',
                        description: 'A torn debt note signed only with the initial W. Friedrich owed repayment within three nights.',
                        packId: 'ka1905'
                    }
                },
                {
                    type: 'set_quest_stage',
                    payload: { questId: 'sandbox_banker', stage: 'investigating' }
                }
            ],
            nextSceneId: 'house_outro'
        },
        wardrobe_findings: {
            id: 'wardrobe_findings',
            characterId: 'clara_altenburg',
            onEnter: [
                {
                    type: 'add_flag',
                    payload: {
                        TALKED_SON: true,
                        BANKER_INVESTIGATION_OPEN: true,
                        BANKER_LEAD_SON_DONE: true,
                        CLUE_B02_PAWN_RECEIPT: true
                    }
                },
                {
                    type: 'grant_evidence',
                    payload: {
                        id: 'ev_banker_pawn_receipt',
                        name: 'Pawnshop Receipt',
                        description: 'Receipts show Friedrich pawned family items before the reported theft dates.',
                        packId: 'ka1905'
                    }
                },
                {
                    type: 'set_quest_stage',
                    payload: { questId: 'sandbox_banker', stage: 'investigating' }
                }
            ],
            nextSceneId: 'house_outro'
        },
        house_outro: {
            id: 'house_outro',
            characterId: 'narrator',
            choices: [
                {
                    id: 'return_to_map',
                    nextSceneId: 'END'
                }
            ]
        }
    }
};

export default SANDBOX_BANKER_SON_HOUSE_LOGIC;
