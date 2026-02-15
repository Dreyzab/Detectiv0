/**
 * Tension Store — Session-only zustand store for interrogation state.
 * NOT persisted. Resets on page reload.
 */
import { create } from 'zustand';
import type { CharacterId, InterrogationProfile } from '@repo/shared/data/characters';
import { CHARACTERS } from '@repo/shared/data/characters';
import type { VoiceId } from '@repo/shared/data/parliament';
import {
    clampTension,
    computeProgressTick,
    shouldLockout,
} from './tensionEngine';
import { useDossierStore } from '../dossier/store';

export interface TensionApplyResult {
    lockedOut: boolean;
    justLockedOut: boolean;
}

interface TensionState {
    tension: number;
    progress: number;
    targetCharacterId: CharacterId | null;
    scenarioId: string | null;
    topicId: string | null;
    lockoutSceneId: string | null;
    lockedOut: boolean;
    lockoutKeys: Set<string>;
    influencePoints: number;
    completed: boolean;

    startInterrogation: (params: {
        characterId: CharacterId;
        scenarioId: string;
        topicId?: string;
        lockoutSceneId?: string;
    }) => void;
    applyTensionDelta: (delta: number) => TensionApplyResult;
    tickProgress: (playerVoices: Partial<Record<VoiceId, number>>) => { ticked: boolean; completed: boolean };
    endInterrogation: () => void;
    addInfluencePoints: (amount: number) => void;
    spendInfluencePoint: (secretEntryId?: string) => boolean;
    isLockedOut: (scenarioId: string, characterId: CharacterId, topicId?: string) => boolean;
    getInterrogationProfile: () => InterrogationProfile | null;
}

function buildLockoutKey(scenarioId: string, characterId: string, topicId?: string): string {
    return `${scenarioId}:${characterId}:${topicId ?? '_'}`;
}

function getProfile(characterId: CharacterId): InterrogationProfile | null {
    const char = CHARACTERS[characterId];
    if (!char) return null;
    if ('interrogation' in char && char.interrogation) {
        return char.interrogation;
    }
    return null;
}

export const useTensionStore = create<TensionState>()((set, get) => ({
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

    startInterrogation: ({ characterId, scenarioId, topicId, lockoutSceneId }) => {
        const profile = getProfile(characterId);
        if (!profile) {
            return;
        }

        const lockoutKey = buildLockoutKey(scenarioId, characterId, topicId);
        const isAlreadyLocked = get().lockoutKeys.has(lockoutKey);

        set({
            tension: 0,
            progress: 0,
            targetCharacterId: characterId,
            scenarioId,
            topicId: topicId ?? null,
            lockoutSceneId: lockoutSceneId ?? null,
            lockedOut: isAlreadyLocked,
            completed: false,
        });
    },

    applyTensionDelta: (delta) => {
        const state = get();
        if (!state.targetCharacterId || state.lockedOut || state.completed) {
            return { lockedOut: state.lockedOut, justLockedOut: false };
        }

        const profile = getProfile(state.targetCharacterId);
        const threshold = profile?.lockoutThreshold ?? 100;
        const newTension = clampTension(state.tension + delta);

        if (shouldLockout(newTension, threshold)) {
            const lockoutKey = buildLockoutKey(
                state.scenarioId!,
                state.targetCharacterId,
                state.topicId ?? undefined
            );
            set((s) => ({
                tension: newTension,
                lockedOut: true,
                lockoutKeys: new Set([...s.lockoutKeys, lockoutKey]),
            }));
            return { lockedOut: true, justLockedOut: true };
        }

        set({ tension: newTension });
        return { lockedOut: false, justLockedOut: false };
    },

    tickProgress: (playerVoices) => {
        const state = get();
        if (!state.targetCharacterId || state.lockedOut || state.completed) {
            return { ticked: false, completed: false };
        }

        const profile = getProfile(state.targetCharacterId);
        if (!profile) return { ticked: false, completed: false };

        const tick = computeProgressTick(state.tension, profile, playerVoices);
        if (tick === 0) return { ticked: false, completed: false };

        const newProgress = state.progress + tick;
        const isComplete = newProgress >= profile.progressRequired;

        if (isComplete) {
            set((s) => ({
                progress: newProgress,
                completed: true,
                influencePoints: s.influencePoints + 1,
            }));
            return { ticked: true, completed: true };
        }

        set({ progress: newProgress });
        return { ticked: true, completed: false };
    },

    endInterrogation: () => {
        set({
            tension: 0,
            progress: 0,
            targetCharacterId: null,
            scenarioId: null,
            topicId: null,
            lockoutSceneId: null,
            lockedOut: false,
            completed: false,
        });
    },

    addInfluencePoints: (amount) => {
        set((s) => ({ influencePoints: s.influencePoints + amount }));
    },

    spendInfluencePoint: (secretEntryId) => {
        const state = get();
        if (state.influencePoints <= 0) return false;
        if (secretEntryId) {
            useDossierStore.getState().unlockEntry(secretEntryId);
        }
        set((s) => ({ influencePoints: s.influencePoints - 1 }));
        return true;
    },

    isLockedOut: (scenarioId, characterId, topicId) => {
        const key = buildLockoutKey(scenarioId, characterId, topicId);
        return get().lockoutKeys.has(key);
    },

    getInterrogationProfile: () => {
        const { targetCharacterId } = get();
        if (!targetCharacterId) return null;
        return getProfile(targetCharacterId);
    },
}));
