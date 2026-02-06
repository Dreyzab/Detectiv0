
import { describe, it, expect } from 'bun:test';
import type { PointStateEnum } from '@repo/shared/lib/detective_map_types';

describe('Simple Import Test', () => {
    it('Should keep shared point state types compatible', () => {
        const lockedState: PointStateEnum = 'locked';
        expect(lockedState).toBe('locked');
    });
});
