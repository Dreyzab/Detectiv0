import { describe, it, expect, beforeEach } from 'vitest';
import { useTensionStore } from '../tensionStore';

/** Reset store before each test */
beforeEach(() => {
    useTensionStore.setState({
        tension: 0,
        progress: 0,
        targetCharacterId: null,
        scenarioId: null,
        topicId: null,
        lockoutSceneId: null,
        lockedOut: false,
        lockoutKeys: new Set<string>(),
        influencePoints: 0,
        completed: false,
    });
});

describe('useTensionStore', () => {
    describe('startInterrogation', () => {
        it('sets target character and scenario', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01', topicId: 'bank_robbery' });
            const state = useTensionStore.getState();
            expect(state.targetCharacterId).toBe('clerk');
            expect(state.scenarioId).toBe('case01');
            expect(state.topicId).toBe('bank_robbery');
            expect(state.tension).toBe(0);
            expect(state.progress).toBe(0);
            expect(state.lockedOut).toBe(false);
        });

        it('marks as locked out if topic was previously locked', () => {
            // First, lock out on this topic
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01', topicId: 'topic_a' });
            // Force lockout by exceeding tension
            for (let i = 0; i < 10; i++) {
                useTensionStore.getState().applyTensionDelta(15);
            }
            expect(useTensionStore.getState().lockedOut).toBe(true);

            // End and restart same topic
            useTensionStore.getState().endInterrogation();
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01', topicId: 'topic_a' });
            expect(useTensionStore.getState().lockedOut).toBe(true);
        });
    });

    describe('applyTensionDelta', () => {
        it('increases tension within bounds', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(30);
            expect(useTensionStore.getState().tension).toBe(30);
        });

        it('clamps tension at 0', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(-50);
            expect(useTensionStore.getState().tension).toBe(0);
        });

        it('triggers lockout when threshold reached', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(100);
            expect(useTensionStore.getState().lockedOut).toBe(true);
            expect(useTensionStore.getState().tension).toBe(100);
        });

        it('does nothing when already locked out', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(100);
            useTensionStore.getState().applyTensionDelta(-30); // Should be ignored
            expect(useTensionStore.getState().tension).toBe(100);
        });

        it('does nothing when no active interrogation', () => {
            useTensionStore.getState().applyTensionDelta(50);
            expect(useTensionStore.getState().tension).toBe(0);
        });
    });

    describe('tickProgress', () => {
        const clerkVoices = { empathy: 6 };

        it('increments progress when in sweet spot', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(30); // clerk sweet spot: 20-45 (15-50 with empathy 6)
            const result = useTensionStore.getState().tickProgress(clerkVoices);
            expect(result.ticked).toBe(true);
            expect(useTensionStore.getState().progress).toBe(1);
        });

        it('does not tick when outside sweet spot', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(80); // Above sweet spot
            const result = useTensionStore.getState().tickProgress(clerkVoices);
            expect(result.ticked).toBe(false);
            expect(useTensionStore.getState().progress).toBe(0);
        });

        it('awards IP and completes when progress reaches required', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(30); // In sweet spot

            // Clerk needs 3 ticks
            useTensionStore.getState().tickProgress(clerkVoices);
            useTensionStore.getState().tickProgress(clerkVoices);
            const result = useTensionStore.getState().tickProgress(clerkVoices);

            expect(result.completed).toBe(true);
            expect(useTensionStore.getState().influencePoints).toBe(1);
            expect(useTensionStore.getState().completed).toBe(true);
        });
    });

    describe('endInterrogation', () => {
        it('clears session state but preserves lockoutKeys and IP', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01' });
            useTensionStore.getState().applyTensionDelta(30);

            // Manually add IP
            useTensionStore.getState().addInfluencePoints(2);

            useTensionStore.getState().endInterrogation();
            const state = useTensionStore.getState();

            expect(state.targetCharacterId).toBeNull();
            expect(state.tension).toBe(0);
            expect(state.progress).toBe(0);
            expect(state.influencePoints).toBe(2); // Preserved
        });
    });

    describe('influencePoints', () => {
        it('adds influence points', () => {
            useTensionStore.getState().addInfluencePoints(3);
            expect(useTensionStore.getState().influencePoints).toBe(3);
        });

        it('spends influence points', () => {
            useTensionStore.getState().addInfluencePoints(2);
            const success = useTensionStore.getState().spendInfluencePoint();
            expect(success).toBe(true);
            expect(useTensionStore.getState().influencePoints).toBe(1);
        });

        it('cannot spend when zero', () => {
            const success = useTensionStore.getState().spendInfluencePoint();
            expect(success).toBe(false);
        });
    });

    describe('isLockedOut', () => {
        it('returns false for unlocked topics', () => {
            expect(useTensionStore.getState().isLockedOut('case01', 'clerk', 'topic_a')).toBe(false);
        });

        it('returns true after lockout on that specific topic', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01', topicId: 'topic_a' });
            useTensionStore.getState().applyTensionDelta(100);
            expect(useTensionStore.getState().isLockedOut('case01', 'clerk', 'topic_a')).toBe(true);
        });

        it('different topic is not locked out', () => {
            useTensionStore.getState().startInterrogation({ characterId: 'clerk', scenarioId: 'case01', topicId: 'topic_a' });
            useTensionStore.getState().applyTensionDelta(100);
            expect(useTensionStore.getState().isLockedOut('case01', 'clerk', 'topic_b')).toBe(false);
        });
    });
});
