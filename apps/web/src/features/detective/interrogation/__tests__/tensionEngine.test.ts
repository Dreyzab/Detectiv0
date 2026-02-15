import { describe, it, expect } from 'vitest';
import {
    computeEffectiveSweetSpot,
    isInSweetSpot,
    shouldLockout,
    computeProgressTick,
    getSweetSpotVisibility,
    clampTension,
} from '../tensionEngine';
import type { InterrogationProfile } from '@repo/shared/data/characters';

const baseProfile: InterrogationProfile = {
    sweetSpotMin: 40,
    sweetSpotMax: 70,
    progressRequired: 5,
};

describe('tensionEngine', () => {
    describe('clampTension', () => {
        it('clamps below 0 to 0', () => {
            expect(clampTension(-10)).toBe(0);
        });
        it('clamps above 100 to 100', () => {
            expect(clampTension(150)).toBe(100);
        });
        it('leaves value in range', () => {
            expect(clampTension(55)).toBe(55);
        });
    });

    describe('computeEffectiveSweetSpot', () => {
        it('returns base range when no vulnerableVoice', () => {
            const spot = computeEffectiveSweetSpot(baseProfile, {});
            expect(spot).toEqual({ min: 40, max: 70 });
        });

        it('returns base range when vulnerableVoice level is below threshold', () => {
            const profile: InterrogationProfile = { ...baseProfile, vulnerableVoice: 'logic' };
            const spot = computeEffectiveSweetSpot(profile, { logic: 3 });
            expect(spot).toEqual({ min: 40, max: 70 });
        });

        it('expands range when vulnerableVoice level meets threshold', () => {
            const profile: InterrogationProfile = { ...baseProfile, vulnerableVoice: 'logic' };
            const spot = computeEffectiveSweetSpot(profile, { logic: 5 });
            expect(spot).toEqual({ min: 35, max: 75 });
        });

        it('narrows range when resistantVoice check is not met', () => {
            const profile: InterrogationProfile = { ...baseProfile, resistantVoice: 'authority' };
            const spot = computeEffectiveSweetSpot(profile, { authority: 2 });
            expect(spot).toEqual({ min: 45, max: 65 });
        });

        it('does not go below 0 or above 100', () => {
            const profile: InterrogationProfile = {
                sweetSpotMin: 2,
                sweetSpotMax: 98,
                vulnerableVoice: 'empathy',
                progressRequired: 3,
            };
            const spot = computeEffectiveSweetSpot(profile, { empathy: 10 });
            expect(spot.min).toBe(0);
            expect(spot.max).toBe(100);
        });
    });

    describe('isInSweetSpot', () => {
        it('returns true at sweet spot min', () => {
            expect(isInSweetSpot(40, baseProfile, {})).toBe(true);
        });
        it('returns true at sweet spot max', () => {
            expect(isInSweetSpot(70, baseProfile, {})).toBe(true);
        });
        it('returns true in the middle', () => {
            expect(isInSweetSpot(55, baseProfile, {})).toBe(true);
        });
        it('returns false below sweet spot', () => {
            expect(isInSweetSpot(39, baseProfile, {})).toBe(false);
        });
        it('returns false above sweet spot', () => {
            expect(isInSweetSpot(71, baseProfile, {})).toBe(false);
        });
    });

    describe('shouldLockout', () => {
        it('returns false below default threshold', () => {
            expect(shouldLockout(99)).toBe(false);
        });
        it('returns true at default threshold', () => {
            expect(shouldLockout(100)).toBe(true);
        });
        it('uses custom threshold', () => {
            expect(shouldLockout(80, 80)).toBe(true);
            expect(shouldLockout(79, 80)).toBe(false);
        });
    });

    describe('computeProgressTick', () => {
        it('returns 1 when in sweet spot', () => {
            expect(computeProgressTick(50, baseProfile, {})).toBe(1);
        });
        it('returns 0 when outside sweet spot', () => {
            expect(computeProgressTick(10, baseProfile, {})).toBe(0);
        });
    });

    describe('getSweetSpotVisibility', () => {
        it('returns hidden when perception < 3', () => {
            expect(getSweetSpotVisibility(0)).toBe('hidden');
            expect(getSweetSpotVisibility(2)).toBe('hidden');
        });
        it('returns partial when perception 3-5', () => {
            expect(getSweetSpotVisibility(3)).toBe('partial');
            expect(getSweetSpotVisibility(5)).toBe('partial');
        });
        it('returns full when perception > 5', () => {
            expect(getSweetSpotVisibility(6)).toBe('full');
            expect(getSweetSpotVisibility(10)).toBe('full');
        });
    });
});
