import { describe, expect, it } from 'bun:test';
import { validateDeductions, type ValidationInput } from '../validate-deductions';
import type { DeductionRecipe } from '../../apps/web/src/features/detective/lib/deductions';

const makeInput = (recipes: Record<string, DeductionRecipe>, evidenceIds: string[], knownVoices: string[] = ['logic']): ValidationInput => {
    const evidenceRegistry = evidenceIds.reduce((acc, evidenceId) => {
        acc[evidenceId] = { id: evidenceId };
        return acc;
    }, {} as Record<string, { id: string }>);

    return {
        recipes,
        evidenceRegistry,
        knownVoiceIds: new Set(knownVoices)
    };
};

describe('validate-deductions', () => {
    it('returns zero errors for a clean registry', () => {
        const recipes: Record<string, DeductionRecipe> = {
            r1: {
                id: 'r1',
                inputs: ['ev_a', 'ev_b'],
                result: {
                    type: 'add_flag',
                    id: 'flag_ok',
                    label: 'ok',
                    description: 'ok'
                }
            }
        };

        const report = validateDeductions(makeInput(recipes, ['ev_a', 'ev_b']));
        expect(report.errors.length).toBe(0);
    });

    it('reports duplicate inputs as an error', () => {
        const recipes: Record<string, DeductionRecipe> = {
            r1: {
                id: 'r1',
                inputs: ['ev_a', 'ev_b'],
                result: { type: 'add_flag', id: 'f1', label: 'one', description: 'one' }
            },
            r2: {
                id: 'r2',
                inputs: ['ev_b', 'ev_a'],
                result: { type: 'add_flag', id: 'f2', label: 'two', description: 'two' }
            }
        };

        const report = validateDeductions(makeInput(recipes, ['ev_a', 'ev_b']));
        expect(report.errors.some((issue) => issue.code === 'duplicate_inputs')).toBe(true);
    });

    it('reports unknown voice ids as an error', () => {
        const recipes: Record<string, DeductionRecipe> = {
            r1: {
                id: 'r1',
                inputs: ['ev_a', 'ev_b'],
                result: { type: 'add_flag', id: 'f1', label: 'one', description: 'one' },
                requiredVoice: { voiceId: 'logic', minLevel: 1 },
                voiceReactions: [
                    {
                        // @ts-expect-error - intentional invalid value
                        voiceId: 'fake_voice',
                        trigger: 'on_success',
                        text: 'invalid voice'
                    }
                ]
            }
        };

        const report = validateDeductions(makeInput(recipes, ['ev_a', 'ev_b']));
        expect(report.errors.some((issue) => issue.code === 'missing_voice')).toBe(true);
    });

    it('reports cycles without exit routes', () => {
        const recipes: Record<string, DeductionRecipe> = {
            r1: {
                id: 'r1',
                inputs: ['ev_start', 'ev_a'],
                result: {
                    type: 'new_evidence',
                    id: 'ev_b',
                    label: 'b',
                    description: 'b',
                    grantsEvidence: { id: 'ev_b', name: 'b', description: 'b', packId: 'test' }
                }
            },
            r2: {
                id: 'r2',
                inputs: ['ev_b', 'ev_c'],
                result: {
                    type: 'new_evidence',
                    id: 'ev_a',
                    label: 'a',
                    description: 'a',
                    grantsEvidence: { id: 'ev_a', name: 'a', description: 'a', packId: 'test' }
                }
            }
        };

        const report = validateDeductions(makeInput(recipes, ['ev_start', 'ev_c']));
        expect(report.errors.some((issue) => issue.code === 'cycle_without_exit')).toBe(true);
    });
});
