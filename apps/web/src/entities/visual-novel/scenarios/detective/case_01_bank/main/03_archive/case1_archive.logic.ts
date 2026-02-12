import type { VNScenarioLogic } from '../../../../../model/types';

const hasAllLeads = (flags: Record<string, boolean>): boolean =>
    Boolean(flags['tailor_lead_complete'] && flags['apothecary_lead_complete'] && flags['pub_lead_complete']);

const hasCompletedAllArchiveChecks = (flags: Record<string, boolean>): boolean =>
    Boolean(
        flags['archive_check_registry_attempted'] &&
        flags['archive_check_stamps_attempted'] &&
        flags['archive_check_customs_attempted']
    );

const hasStrongArchivePacket = (flags: Record<string, boolean>): boolean => {
    const successCount = [
        flags['archive_check_registry_success'],
        flags['archive_check_stamps_success'],
        flags['archive_check_customs_success']
    ].filter(Boolean).length;
    return successCount >= 2;
};

export const CASE1_ARCHIVE_LOGIC: VNScenarioLogic = {
    id: 'detective_case1_archive_search',
    packId: 'fbg1905',
    title: 'City Archive Search',
    defaultBackgroundUrl: '/images/scenarios/archive_1905.jpg',
    initialSceneId: 'archive_entry',
    mode: 'fullscreen',
    scenes: {
        'archive_entry': {
            id: 'archive_entry',
            characterId: 'inspector',
            choices: [
                {
                    id: 'archive_request_access',
                    nextSceneId: 'archive_keeper_intro',
                    condition: (flags) => hasAllLeads(flags) && !flags['archive_casefile_complete']
                },
                {
                    id: 'archive_revisit_casefile',
                    nextSceneId: 'archive_revisit_summary',
                    condition: (flags) => Boolean(flags['archive_casefile_complete'])
                },
                {
                    id: 'archive_insufficient_leads',
                    nextSceneId: 'archive_insufficient',
                    condition: (flags) => !hasAllLeads(flags) && !flags['archive_casefile_complete']
                }
            ]
        },
        'archive_insufficient': {
            id: 'archive_insufficient',
            characterId: 'librarian',
            nextSceneId: 'END'
        },
        'archive_revisit_summary': {
            id: 'archive_revisit_summary',
            characterId: 'inspector',
            nextSceneId: 'END'
        },
        'archive_keeper_intro': {
            id: 'archive_keeper_intro',
            characterId: 'librarian',
            nextSceneId: 'archive_research_hub'
        },
        'archive_research_hub': {
            id: 'archive_research_hub',
            characterId: 'librarian',
            choices: [
                {
                    id: 'archive_check_registry',
                    nextSceneId: 'archive_registry_result',
                    type: 'inquiry',
                    condition: (flags) => !flags['archive_check_registry_attempted'],
                    skillCheck: {
                        id: 'chk_case1_archive_encyclopedia_registry',
                        voiceId: 'encyclopedia',
                        difficulty: 10,
                        onSuccess: {
                            nextSceneId: 'archive_registry_success',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        'archive_check_registry_attempted': true,
                                        'archive_check_registry_success': true
                                    }
                                },
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_archive_property_ledger',
                                        name: 'Archive Property Ledger',
                                        description: 'Ledger entries tie Bankhaus Krebs shell payments to a condemned rail warehouse lot.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'archive_registry_fail',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        'archive_check_registry_attempted': true
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    id: 'archive_check_stamps',
                    nextSceneId: 'archive_stamps_result',
                    type: 'inquiry',
                    condition: (flags) => !flags['archive_check_stamps_attempted'],
                    skillCheck: {
                        id: 'chk_case1_archive_perception_stamps',
                        voiceId: 'perception',
                        difficulty: 9,
                        onSuccess: {
                            nextSceneId: 'archive_stamps_success',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        'archive_check_stamps_attempted': true,
                                        'archive_check_stamps_success': true,
                                        'warehouse_shift_window_known': true
                                    }
                                },
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_archive_shift_log',
                                        name: 'Night Shift Ledger Copy',
                                        description: 'Inspection stamps reveal the warehouse guard rotation and a recurring blind spot after midnight.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'archive_stamps_fail',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        'archive_check_stamps_attempted': true,
                                        'warehouse_shift_window_uncertain': true
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    id: 'archive_check_customs',
                    nextSceneId: 'archive_customs_result',
                    type: 'inquiry',
                    condition: (flags) => !flags['archive_check_customs_attempted'],
                    skillCheck: {
                        id: 'chk_case1_archive_tradition_charter',
                        voiceId: 'tradition',
                        difficulty: 11,
                        onSuccess: {
                            nextSceneId: 'archive_customs_success',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        'archive_check_customs_attempted': true,
                                        'archive_check_customs_success': true
                                    }
                                },
                                {
                                    type: 'grant_evidence',
                                    payload: {
                                        id: 'ev_archive_municipal_charter',
                                        name: 'Municipal Charter Addendum',
                                        description: 'A wartime ordinance grants emergency warehouse access through a mayoral counter-sign route.',
                                        packId: 'fbg1905'
                                    }
                                }
                            ]
                        },
                        onFail: {
                            nextSceneId: 'archive_customs_fail',
                            actions: [
                                {
                                    type: 'add_flag',
                                    payload: {
                                        'archive_check_customs_attempted': true
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    id: 'archive_compile_dossier',
                    nextSceneId: 'archive_dossier_resolution',
                    type: 'action',
                    condition: (flags) => hasCompletedAllArchiveChecks(flags)
                }
            ]
        },
        'archive_registry_success': {
            id: 'archive_registry_success',
            characterId: 'inspector',
            nextSceneId: 'archive_research_hub'
        },
        'archive_registry_fail': {
            id: 'archive_registry_fail',
            characterId: 'inspector',
            nextSceneId: 'archive_research_hub'
        },
        'archive_stamps_success': {
            id: 'archive_stamps_success',
            characterId: 'inspector',
            nextSceneId: 'archive_research_hub'
        },
        'archive_stamps_fail': {
            id: 'archive_stamps_fail',
            characterId: 'inspector',
            nextSceneId: 'archive_research_hub'
        },
        'archive_customs_success': {
            id: 'archive_customs_success',
            characterId: 'inspector',
            nextSceneId: 'archive_research_hub'
        },
        'archive_customs_fail': {
            id: 'archive_customs_fail',
            characterId: 'inspector',
            nextSceneId: 'archive_research_hub'
        },
        'archive_dossier_resolution': {
            id: 'archive_dossier_resolution',
            characterId: 'inspector',
            choices: [
                {
                    id: 'archive_resolution_strong',
                    nextSceneId: 'archive_resolution_strong_outcome',
                    condition: (flags) => hasStrongArchivePacket(flags)
                },
                {
                    id: 'archive_resolution_partial',
                    nextSceneId: 'archive_resolution_partial_outcome',
                    condition: (flags) => !hasStrongArchivePacket(flags)
                }
            ]
        },
        'archive_resolution_strong_outcome': {
            id: 'archive_resolution_strong_outcome',
            characterId: 'librarian',
            nextSceneId: 'END',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'case01', stage: 'leads_done' } },
                { type: 'unlock_point', payload: 'loc_freiburg_warehouse' },
                {
                    type: 'add_flag',
                    payload: {
                        'archive_casefile_complete': true,
                        'archive_warrant_run_complete': true,
                        'warrant_ready': true,
                        'archive_access_limited': false,
                        'all_leads_resolved': true,
                        'finale_unlocked': true
                    }
                }
            ]
        },
        'archive_resolution_partial_outcome': {
            id: 'archive_resolution_partial_outcome',
            characterId: 'librarian',
            nextSceneId: 'END',
            onEnter: [
                { type: 'set_quest_stage', payload: { questId: 'case01', stage: 'leads_done' } },
                { type: 'unlock_point', payload: 'loc_freiburg_warehouse' },
                {
                    type: 'add_flag',
                    payload: {
                        'archive_casefile_complete': true,
                        'archive_warrant_run_complete': true,
                        'warrant_ready': false,
                        'archive_access_limited': true,
                        'all_leads_resolved': true,
                        'finale_unlocked': true
                    }
                }
            ]
        }
    }
};

export default CASE1_ARCHIVE_LOGIC;
