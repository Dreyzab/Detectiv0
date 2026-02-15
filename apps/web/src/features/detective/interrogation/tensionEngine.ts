/**
 * Tension Engine — Pure functions for interrogation mechanics.
 * No side effects, easily testable.
 */
import type { InterrogationProfile } from '@repo/shared/data/characters';
import type { VoiceId } from '@repo/shared/data/parliament';

const DEFAULT_LOCKOUT_THRESHOLD = 100;
const VULNERABLE_VOICE_EXPANSION = 5;
const VULNERABLE_VOICE_THRESHOLD = 5;
const RESISTANT_VOICE_CONTRACTION = 5;
const RESISTANT_VOICE_THRESHOLD = 5;

export type SweetSpotVisibility = 'hidden' | 'partial' | 'full';

export interface EffectiveSweetSpot {
    min: number;
    max: number;
}

/**
 * Compute the effective sweet spot, adjusted by player's vulnerable voice level.
 * High `vulnerableVoice` expands the range by ±VULNERABLE_VOICE_EXPANSION.
 */
export function computeEffectiveSweetSpot(
    profile: InterrogationProfile,
    playerVoices: Partial<Record<VoiceId, number>>
): EffectiveSweetSpot {
    let min = profile.sweetSpotMin;
    let max = profile.sweetSpotMax;

    if (profile.vulnerableVoice) {
        const level = playerVoices[profile.vulnerableVoice] ?? 0;
        if (level >= VULNERABLE_VOICE_THRESHOLD) {
            min = Math.max(0, min - VULNERABLE_VOICE_EXPANSION);
            max = Math.min(100, max + VULNERABLE_VOICE_EXPANSION);
        }
    }

    if (profile.resistantVoice) {
        const level = playerVoices[profile.resistantVoice] ?? 0;
        if (level < RESISTANT_VOICE_THRESHOLD) {
            min = Math.min(100, min + RESISTANT_VOICE_CONTRACTION);
            max = Math.max(0, max - RESISTANT_VOICE_CONTRACTION);
        }
    }

    if (min > max) {
        const pivot = Math.max(0, Math.min(100, Math.round((min + max) / 2)));
        return { min: pivot, max: pivot };
    }

    return { min, max };
}

/**
 * Check if current tension falls within the effective sweet spot.
 */
export function isInSweetSpot(
    tension: number,
    profile: InterrogationProfile,
    playerVoices: Partial<Record<VoiceId, number>>
): boolean {
    const spot = computeEffectiveSweetSpot(profile, playerVoices);
    return tension >= spot.min && tension <= spot.max;
}

/**
 * Check if tension exceeds the lockout threshold.
 */
export function shouldLockout(tension: number, threshold?: number): boolean {
    return tension >= (threshold ?? DEFAULT_LOCKOUT_THRESHOLD);
}

/**
 * Compute progress tick: 1 if in sweet spot, 0 otherwise.
 */
export function computeProgressTick(
    tension: number,
    profile: InterrogationProfile,
    playerVoices: Partial<Record<VoiceId, number>>
): number {
    return isInSweetSpot(tension, profile, playerVoices) ? 1 : 0;
}

/**
 * Determine sweet-spot visibility based on player's perception level.
 * - < 3: hidden (player acts blind)
 * - 3–5: partial (approximate zone hint)
 * - > 5: full (exact boundaries shown)
 */
export function getSweetSpotVisibility(playerPerception: number): SweetSpotVisibility {
    if (playerPerception > 5) return 'full';
    if (playerPerception >= 3) return 'partial';
    return 'hidden';
}

/**
 * Clamp a tension value to [0, 100].
 */
export function clampTension(value: number): number {
    return Math.max(0, Math.min(100, value));
}
