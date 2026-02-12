import { describe, expect, it } from 'vitest';
import { buildMapPointsQuery } from './useMapPoints';

describe('buildMapPointsQuery', () => {
    it('keeps all known filters in query', () => {
        const query = buildMapPointsQuery({
            packId: 'ka1905',
            caseId: 'sandbox_karlsruhe',
            regionId: 'karlsruhe_default'
        });

        expect(query).toEqual({
            packId: 'ka1905',
            caseId: 'sandbox_karlsruhe',
            regionId: 'karlsruhe_default'
        });
    });

    it('normalizes optional values to undefined', () => {
        const query = buildMapPointsQuery({
            packId: 'fbg1905'
        });

        expect(query).toEqual({
            packId: 'fbg1905',
            caseId: undefined,
            regionId: undefined
        });
    });
});
