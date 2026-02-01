import type { VNScenarioLogic } from '../../../../model/types';

/**
 * Quest: The Golden Cage (Victoria)
 * 
 * Logic Skeleton:
 * 1. Arrive at Red Cog (with Victoria in disguise).
 * 2. Bouncer Check (Difficulty 10).
 * 3. Inside: The Poetry Reading.
 * 4. Confrontation or Quiet Exit.
 * 5. Reward.
 */

export const QUEST_VICTORIA_POETRY_LOGIC: VNScenarioLogic = {
    id: 'quest_victoria_poetry',
    title: 'Quest: The Golden Cage',
    defaultBackgroundUrl: '/images/scenarios/pub_interior_1905.png',
    initialSceneId: 'arrival',
    mode: 'fullscreen',
    scenes: {
        'arrival': {
            id: 'arrival',
            characterId: 'inspector',
            nextSceneId: 'bouncer_interaction'
        },
        'bouncer_interaction': {
            id: 'bouncer_interaction',
            characterId: 'worker', // Bouncer
            choices: [
                {
                    id: 'bribe_bouncer',
                    nextSceneId: 'entry_success',
                    condition: (flags) => flags['has_bribe_money'], // Hypothetical money check
                    actions: [{ type: 'add_flag', payload: { 'bribed_bouncer': true } }] // Track bribe
                },
                {
                    id: 'charm_bouncer',
                    nextSceneId: 'charm_result',
                    skillCheck: {
                        id: 'chk_vic_charm',
                        voiceId: 'charisma',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'entry_success' },
                        onFail: { nextSceneId: 'entry_fail' }
                    }
                },
                {
                    id: 'authority_bouncer',
                    nextSceneId: 'authority_result',
                    skillCheck: {
                        id: 'chk_vic_auth',
                        voiceId: 'authority',
                        difficulty: 12, // Harder here
                        onSuccess: { nextSceneId: 'entry_success' },
                        onFail: { nextSceneId: 'entry_fail' }
                    }
                }
            ]
        },
        'entry_fail': {
            id: 'entry_fail',
            characterId: 'assistant',
            nextSceneId: 'END_FAIL'
        },
        'entry_success': {
            id: 'entry_success',
            characterId: 'assistant',
            nextSceneId: 'poetry_performance'
        },
        'poetry_performance': {
            id: 'poetry_performance',
            characterId: 'worker',
            nextSceneId: 'poetry_round_1'
        },
        'poetry_round_1': {
            id: 'poetry_round_1',
            characterId: 'worker',
            choices: [
                {
                    id: 'analyze_structure',
                    skillCheck: {
                        id: 'chk_poetry_1_logic',
                        voiceId: 'logic',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'poetry_round_2', actions: [{ type: 'add_flag', payload: { 'poetry_insight_1': true } }] },
                        onFail: { nextSceneId: 'poetry_round_2' }
                    }
                },
                {
                    id: 'feel_rhythm',
                    skillCheck: {
                        id: 'chk_poetry_1_poetics', // Mapped Shivers -> Poetics
                        voiceId: 'poetics',
                        difficulty: 10,
                        onSuccess: { nextSceneId: 'poetry_round_2', actions: [{ type: 'add_flag', payload: { 'poetry_insight_1': true } }] },
                        onFail: { nextSceneId: 'poetry_round_2' }
                    }
                }
            ]
        },
        'poetry_round_2': {
            id: 'poetry_round_2',
            characterId: 'worker',
            choices: [
                {
                    id: 'analyze_metaphor',
                    skillCheck: {
                        id: 'chk_poetry_2_encyclopedia',
                        voiceId: 'encyclopedia', // Identify references
                        difficulty: 11,
                        onSuccess: { nextSceneId: 'poetry_round_3', actions: [{ type: 'add_flag', payload: { 'poetry_insight_2': true } }] },
                        onFail: { nextSceneId: 'poetry_round_3' }
                    }
                },
                {
                    id: 'sense_anger',
                    skillCheck: {
                        id: 'chk_poetry_2_empathy',
                        voiceId: 'empathy',
                        difficulty: 11,
                        onSuccess: { nextSceneId: 'poetry_round_3', actions: [{ type: 'add_flag', payload: { 'poetry_insight_2': true } }] },
                        onFail: { nextSceneId: 'poetry_round_3' }
                    }
                }
            ]
        },
        'poetry_round_3': {
            id: 'poetry_round_3',
            characterId: 'worker',
            choices: [
                {
                    id: 'connect_politics',
                    skillCheck: {
                        id: 'chk_poetry_3_authority', // Mapped Rhetoric -> Authority
                        voiceId: 'authority',
                        difficulty: 12,
                        onSuccess: { nextSceneId: 'victoria_moved', actions: [{ type: 'add_flag', payload: { 'poetry_insight_3': true } }] },
                        onFail: { nextSceneId: 'victoria_moved' }
                    }
                },
                {
                    id: 'absorb_impact',
                    skillCheck: {
                        id: 'chk_poetry_3_composure', // Mapped Volition -> Composure
                        voiceId: 'composure',
                        difficulty: 12,
                        onSuccess: { nextSceneId: 'victoria_moved', actions: [{ type: 'add_flag', payload: { 'poetry_insight_3': true } }] },
                        onFail: { nextSceneId: 'victoria_moved' }
                    }
                }
            ]
        },
        'victoria_moved': {
            id: 'victoria_moved',
            characterId: 'assistant',
            choices: [
                {
                    id: 'share_insight',
                    nextSceneId: 'discuss_meaning',
                    condition: (flags) =>
                        (flags['poetry_insight_1'] ? 1 : 0) +
                        (flags['poetry_insight_2'] ? 1 : 0) +
                        (flags['poetry_insight_3'] ? 1 : 0) >= 2 // Need 2/3 successes
                },
                { id: 'leave_quietly', nextSceneId: 'success_quiet' },
                { id: 'applaud', nextSceneId: 'success_loud' }
            ]
        },
        'discuss_meaning': {
            id: 'discuss_meaning',
            characterId: 'assistant',
            nextSceneId: 'success_quiet', // Loop back to quiet/safe exit but with extra bonding
            onEnter: [
                { type: 'add_flag', payload: { 'victoria_bonded_over_art': true } },
                { type: 'modify_relationship', payload: { characterId: 'assistant', amount: 15 } }
            ]
        },
        'success_quiet': {
            id: 'success_quiet',
            characterId: 'assistant',
            nextSceneId: 'END_SUCCESS',
            onEnter: [
                { type: 'add_flag', payload: { 'victoria_quest_complete': true, 'social_connections_high': true } }
            ]
        },
        'success_loud': {
            id: 'success_loud',
            characterId: 'assistant',
            nextSceneId: 'END_SUCCESS',
            onEnter: [
                { type: 'add_flag', payload: { 'victoria_quest_complete': true, 'social_connections_high': true, 'worker_suspicion': true } }
            ]
        },

        // Endings
        'END_SUCCESS': { id: 'END_SUCCESS', characterId: 'assistant', nextSceneId: 'END' },
        'END_FAIL': { id: 'END_FAIL', characterId: 'assistant', nextSceneId: 'END' }
    }
};

export default QUEST_VICTORIA_POETRY_LOGIC;
