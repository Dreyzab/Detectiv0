
import { describe, it, expect } from 'bun:test';
import { PointStateEnum } from '@repo/shared/lib/detective_map_types';

describe('Simple Import Test', () => {
    it('Should import enum from shared', () => {
        expect(PointStateEnum.LOCKED).toBe('locked');
    });
});
