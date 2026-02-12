import type { QuestLogic } from './types';

/**
 * Sub-quest: Haunted Estate ("Estate with a Ghost")
 * Mechanic Focus: Text-based Location Investigation + Evidence Combining (Mind Palace)
 * Flow: Agency → Estate → Guild → Estate (accusation)
 * 
 * Contains the dual deduction path:
 *   - TRUE TRAIL: ev_cold_draft + ev_ectoplasm_residue → supernatural (130 XP)
 *   - FALSE TRAIL: ev_hidden_passage + ev_servant_testimony → contrabandist (80 XP, partner corrects)
 */
export const SANDBOX_GHOST_LOGIC: QuestLogic = {
    id: 'sandbox_ghost',
    initialStage: 'not_started',
    objectives: [
        {
            id: 'obj_meet_estate_client',
            condition: { type: 'flag', flag: 'GHOST_CLIENT_MET', value: true }
        },
        {
            id: 'obj_investigate_estate',
            condition: { type: 'flag', flag: 'ESTATE_INVESTIGATED', value: true }
        },
        {
            id: 'obj_visit_guild',
            condition: { type: 'flag', flag: 'GUILD_VISITED', value: true }
        },
        {
            id: 'obj_make_accusation',
            condition: { type: 'flag', flag: 'GHOST_ACCUSED', value: true }
        }
    ],
    stageTransitions: [
        {
            from: 'not_started',
            to: 'client_met',
            requiredFlags: ['GHOST_CLIENT_MET']
        },
        {
            from: 'client_met',
            to: 'investigating',
            requiredFlags: ['ESTATE_INVESTIGATED']
        },
        {
            from: 'investigating',
            to: 'evidence_collected',
            requiredFlags: ['GHOST_HAS_2_CLUES']
        },
        {
            from: 'evidence_collected',
            to: 'guild_visit',
            requiredFlags: ['GUILD_VISITED']
        },
        {
            from: 'guild_visit',
            to: 'accusation',
            requiredFlags: ['GHOST_DEDUCTION_MADE']
        },
        {
            from: 'accusation',
            to: 'resolved',
            requiredFlags: ['GHOST_ACCUSED'],
            triggerActions: [
                'add_flag(GHOST_CASE_DONE)'
            ]
        }
    ],
    completionCondition: {
        type: 'flag',
        flag: 'GHOST_CASE_DONE',
        value: true
    },
    rewards: {
        xp: 80
    }
};
