import { describe, expect, it } from 'vitest';
import { DEFAULT_PACK_ID } from '@repo/shared/data/pack-meta';
import type { BattleScenario } from '@repo/shared/data/battle';
import { resolveBattleReturn } from './returnFlow';

const makeScenario = (partial: Partial<BattleScenario>): BattleScenario => ({
    id: 'test_battle',
    title: 'Test Battle',
    opponentId: 'opponent_test',
    opponentName: 'Test Opponent',
    opponentResolve: 10,
    playerStartingResolve: 10,
    playerActionPoints: 3,
    cardsPerTurn: 2,
    opponentDeck: [],
    ...partial
});

describe('resolveBattleReturn', () => {
    it('resumes VN on win when returnScenarioId + resumeSceneId are present', () => {
        const scenario = makeScenario({
            onWin: {
                resumeSceneId: 'casino_fallout',
                actions: [{ type: 'add_flag', payload: { SON_DUEL_DONE: true } }]
            }
        });

        const result = resolveBattleReturn({
            scenario,
            turnPhase: 'victory',
            returnScenarioId: 'sandbox_banker_casino',
            returnPackId: 'ka1905'
        });

        expect(result.mapRoute).toBe('/city/ka1905/map');
        expect(result.fallbackPackId).toBe('ka1905');
        expect(result.actions).toEqual([{ type: 'add_flag', payload: { SON_DUEL_DONE: true } }]);
        expect(result.resume).toEqual({
            scenarioId: 'sandbox_banker_casino',
            sceneId: 'casino_fallout',
            route: '/city/ka1905/vn/sandbox_banker_casino'
        });
    });

    it('uses defeat branch and falls back to map when no resumeSceneId', () => {
        const scenario = makeScenario({
            onLose: {
                actions: [{ type: 'add_flag', payload: { SON_DUEL_DONE: true } }]
            }
        });

        const result = resolveBattleReturn({
            scenario,
            turnPhase: 'defeat',
            returnScenarioId: 'sandbox_banker_casino',
            returnPackId: 'ka1905'
        });

        expect(result.mapRoute).toBe('/city/ka1905/map');
        expect(result.actions).toEqual([{ type: 'add_flag', payload: { SON_DUEL_DONE: true } }]);
        expect(result.resume).toBeNull();
    });

    it('builds non-pack routes when returnPackId is missing', () => {
        const scenario = makeScenario({
            onWin: {
                resumeSceneId: 'casino_fallout'
            }
        });

        const result = resolveBattleReturn({
            scenario,
            turnPhase: 'victory',
            returnScenarioId: 'sandbox_banker_casino',
            returnPackId: null
        });

        expect(result.mapRoute).toBe('/map');
        expect(result.fallbackPackId).toBe(DEFAULT_PACK_ID);
        expect(result.resume).toEqual({
            scenarioId: 'sandbox_banker_casino',
            sceneId: 'casino_fallout',
            route: '/vn/sandbox_banker_casino'
        });
    });

    it('returns map fallback when scenario is missing', () => {
        const result = resolveBattleReturn({
            scenario: null,
            turnPhase: 'victory',
            returnScenarioId: null,
            returnPackId: null
        });

        expect(result.mapRoute).toBe('/map');
        expect(result.fallbackPackId).toBe(DEFAULT_PACK_ID);
        expect(result.actions).toEqual([]);
        expect(result.resume).toBeNull();
    });
});

