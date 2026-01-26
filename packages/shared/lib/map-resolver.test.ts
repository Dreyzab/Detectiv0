
import { describe, it, expect } from 'bun:test';
import { checkCondition, resolveAvailableInteractions, type ResolutionContext } from './map-resolver'; // Relative path
import type { MapPointBinding } from '../data/map'; // Relative path

describe('Map Resolver Logic', () => {

    const mockCtx: ResolutionContext = {
        flags: { 'case_started': true, 'has_talked': false },
        inventory: { 'key_card': 1 },
        pointStates: { 'p1': 'discovered' }
    };

    it('resolves simple flag conditions', () => {
        expect(checkCondition({ type: 'flag_is', flagId: 'case_started', value: true }, mockCtx)).toBe(true);
        expect(checkCondition({ type: 'flag_is', flagId: 'has_talked', value: true }, mockCtx)).toBe(false);
    });

    it('resolves logic_and correctly', () => {
        const cond = {
            type: 'logic_and' as const,
            conditions: [
                { type: 'flag_is' as const, flagId: 'case_started', value: true },
                { type: 'item_count' as const, itemId: 'key_card', min: 1 }
            ]
        };
        expect(checkCondition(cond, mockCtx)).toBe(true);
    });

    it('sorts interactions by priority', () => {
        const bindings: MapPointBinding[] = [
            { id: 'b1', trigger: 'marker_click', priority: 1, actions: [] },
            { id: 'b2', trigger: 'marker_click', priority: 10, actions: [] },
            { id: 'b3', trigger: 'marker_click', priority: 5, actions: [] },
        ];

        const result = resolveAvailableInteractions(bindings, 'marker_click', mockCtx);
        expect(result[0]?.binding.id).toBe('b2');
        expect(result[1]?.binding.id).toBe('b3');
        expect(result[2]?.binding.id).toBe('b1');
    });

    it('filters unavailable interactions', () => {
        const bindings: MapPointBinding[] = [
            {
                id: 'b1',
                trigger: 'marker_click',
                conditions: [{ type: 'flag_is', flagId: 'missing_flag', value: true }],
                actions: []
            },
        ];

        const result = resolveAvailableInteractions(bindings, 'marker_click', mockCtx);
        expect(result[0]?.isAvailable).toBe(false);
    });
});
