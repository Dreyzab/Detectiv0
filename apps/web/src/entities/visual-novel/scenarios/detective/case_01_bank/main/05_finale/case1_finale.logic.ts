import type { VNScenarioLogic } from '../../../../../model/types';

/**
 * Case 1 Finale: The Warehouse Setup
 * Trigger: When all 3 leads are complete and leads to loc_freiburg_warehouse.
 * 
 * Skeleton:
 * 1. Deduction Mode: Player chooses interpretation (Political vs Criminal).
 * 2. Warehouse Entry: Context set by choice.
 * 3. Confrontation:
 *    - Political: vs Kommissar Richter.
 *    - Criminal: vs Rival Gang.
 * 4. Outcome: Relationship updates & Title Card.
 */

export const CASE1_FINALE_LOGIC: VNScenarioLogic = {
    id: 'case1_finale',
    title: 'Finale: The Warehouse',
    defaultBackgroundUrl: '/images/scenarios/warehouse_exterior_night.png',
    initialSceneId: 'deduction_start',
    mode: 'fullscreen',
    scenes: {
        // ─────────────────────────────────────────────────────────────
        // 1. DEDUCTION
        // ─────────────────────────────────────────────────────────────
        'deduction_start': {
            id: 'deduction_start',
            characterId: 'inspector',
            nextSceneId: 'deduction_choice',
            // Placeholder: "Everything points to this moment..."
        },
        'deduction_choice': {
            id: 'deduction_choice',
            characterId: 'inspector',
            choices: [
                {
                    id: 'theory_political',
                    nextSceneId: 'path_political_entry',
                    actions: [{ type: 'add_flag', payload: { 'theory_political': true } }]
                },
                {
                    id: 'theory_criminal',
                    nextSceneId: 'path_criminal_entry',
                    actions: [{ type: 'add_flag', payload: { 'theory_criminal': true } }]
                }
            ]
        },

        // ─────────────────────────────────────────────────────────────
        // PATH A: POLITICAL PROVOCATION
        // ─────────────────────────────────────────────────────────────
        'path_political_entry': {
            id: 'path_political_entry',
            characterId: 'inspector',
            nextSceneId: 'political_confrontation'
        },
        'political_confrontation': {
            id: 'political_confrontation',
            characterId: 'corrupt_cop', // Kommissar Richter
            choices: [
                {
                    id: 'expose_corruption',
                    nextSceneId: 'political_victory',
                    skillCheck: {
                        id: 'chk_finale_authority',
                        voiceId: 'authority',
                        difficulty: 12,
                        onSuccess: { nextSceneId: 'political_victory' },
                        onFail: { nextSceneId: 'political_compromise' }
                    }
                }
            ]
        },
        'political_victory': {
            id: 'political_victory',
            characterId: 'assistant', // Victoria reacts
            nextSceneId: 'END_POLITICAL',
            onEnter: [
                { type: 'add_flag', payload: { 'justice_served': true, 'enemy_mayor': true } }
            ]
        },
        'political_compromise': {
            id: 'political_compromise',
            characterId: 'corrupt_cop',
            nextSceneId: 'END_POLITICAL_BAD'
        },

        // ─────────────────────────────────────────────────────────────
        // PATH B: CRIMINAL WAR
        // ─────────────────────────────────────────────────────────────
        'path_criminal_entry': {
            id: 'path_criminal_entry',
            characterId: 'inspector',
            nextSceneId: 'criminal_confrontation'
        },
        'criminal_confrontation': {
            id: 'criminal_confrontation',
            characterId: 'enforcer', // Or rival
            choices: [
                {
                    id: 'stop_violence',
                    nextSceneId: 'criminal_victory',
                    skillCheck: {
                        id: 'chk_finale_composure',
                        voiceId: 'volition',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'criminal_victory' },
                        onFail: { nextSceneId: 'criminal_chaos' }
                    }
                }
            ]
        },
        'criminal_victory': {
            id: 'criminal_victory',
            characterId: 'gendarm', // Police arrive to clean up
            nextSceneId: 'END_CRIMINAL',
            onEnter: [
                { type: 'add_flag', payload: { 'order_restored': true, 'enemy_underworld': true } }
            ]
        },
        'criminal_chaos': {
            id: 'criminal_chaos',
            characterId: 'gendarm',
            nextSceneId: 'END_CRIMINAL_BAD'
        },

        // ─────────────────────────────────────────────────────────────
        // ENDINGS
        // ─────────────────────────────────────────────────────────────
        'END_POLITICAL': { id: 'END_POLITICAL', characterId: 'inspector', nextSceneId: 'credits' },
        'END_POLITICAL_BAD': { id: 'END_POLITICAL_BAD', characterId: 'inspector', nextSceneId: 'credits' },
        'END_CRIMINAL': { id: 'END_CRIMINAL', characterId: 'inspector', nextSceneId: 'credits' },
        'END_CRIMINAL_BAD': { id: 'END_CRIMINAL_BAD', characterId: 'inspector', nextSceneId: 'credits' },
        'credits': { id: 'credits', characterId: 'inspector', nextSceneId: 'END' }
    }
};

export default CASE1_FINALE_LOGIC;


