import { beforeEach, describe, expect, it } from 'vitest';
import { inferRegionFromProgress, useRegionStore } from './store';

describe('region store', () => {
    beforeEach(() => {
        useRegionStore.setState({
            activeRegionId: null,
            source: null
        });
    });

    it('sets and clears active region', () => {
        useRegionStore.getState().setActiveRegion('karlsruhe_default', 'manual');
        expect(useRegionStore.getState().activeRegionId).toBe('karlsruhe_default');
        expect(useRegionStore.getState().source).toBe('manual');

        useRegionStore.getState().clearActiveRegion();
        expect(useRegionStore.getState().activeRegionId).toBeNull();
        expect(useRegionStore.getState().source).toBeNull();
    });

    it('updates source when region changes', () => {
        useRegionStore.getState().setActiveRegion('FREIBURG_1905', 'qr');
        expect(useRegionStore.getState().source).toBe('qr');
    });

    it('infers Karlsruhe region for sandbox case', () => {
        const inferred = inferRegionFromProgress({
            activeCaseId: 'sandbox_karlsruhe',
            hasLegacyProgress: false
        });
        expect(inferred).toBe('karlsruhe_default');
    });

    it('infers Freiburg region from legacy progress', () => {
        const inferred = inferRegionFromProgress({
            activeCaseId: null,
            hasLegacyProgress: true
        });
        expect(inferred).toBe('FREIBURG_1905');
    });

    it('keeps region null for clean start', () => {
        const inferred = inferRegionFromProgress({
            activeCaseId: null,
            hasLegacyProgress: false
        });
        expect(inferred).toBeNull();
    });
});
