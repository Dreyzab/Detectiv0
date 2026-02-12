import type { QuestLogic } from './types';

/**
 * Meta-quest: Karlsruhe Sandbox
 * Tracks overall sandbox progression across 3 sub-quests.
 */
export const SANDBOX_META_LOGIC: QuestLogic = {
    id: 'sandbox_karlsruhe',
    initialStage: 'not_started',
    objectives: [
        {
            id: 'obj_start_sandbox',
            condition: { type: 'flag', flag: 'ka_sandbox_started', value: true }
        },
        {
            id: 'obj_complete_banker',
            condition: { type: 'flag', flag: 'BANKER_CASE_DONE', value: true }
        },
        {
            id: 'obj_complete_ghost',
            condition: { type: 'flag', flag: 'GHOST_CASE_DONE', value: true }
        }
    ],
    stageTransitions: [
        {
            from: 'not_started',
            to: 'intro',
            requiredFlags: ['ka_sandbox_started']
        },
        {
            from: 'intro',
            to: 'exploring',
            requiredFlags: ['ka_intro_complete']
        },
        {
            from: 'exploring',
            to: 'guild_unlocked',
            requiredFlags: ['GUILD_VISITED']
        },
        {
            from: 'guild_unlocked',
            to: 'completed',
            requiredFlags: ['BANKER_CASE_DONE', 'GHOST_CASE_DONE']
        }
    ],
    completionCondition: {
        type: 'flag',
        flag: 'ka_sandbox_completed',
        value: true
    },
    rewards: {
        xp: 100,
        traits: ['sandbox_graduate']
    }
};
