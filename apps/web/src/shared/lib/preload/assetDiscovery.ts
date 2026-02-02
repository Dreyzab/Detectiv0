/**
 * Asset Discovery - Extract asset URLs from VN scenarios
 * 
 * Provides utilities to scan VNScenario/VNScene objects and
 * return deduplicated lists of assets for preloading.
 */

import type { VNScenario } from '@/entities/visual-novel/model/types';

export interface DiscoveredAssets {
    backgrounds: string[];
    audio: string[];
}

/**
 * Extract all preloadable assets from a complete scenario
 */
export function extractScenarioAssets(scenario: VNScenario): DiscoveredAssets {
    const backgrounds = new Set<string>();
    const audio = new Set<string>();

    // Default background
    if (scenario.defaultBackgroundUrl) {
        backgrounds.add(scenario.defaultBackgroundUrl);
    }

    // Background music
    if (scenario.musicUrl) {
        audio.add(scenario.musicUrl);
    }

    // Iterate all scenes
    Object.values(scenario.scenes).forEach(scene => {
        if (scene.backgroundUrl) {
            backgrounds.add(scene.backgroundUrl);
        }
    });

    return {
        backgrounds: Array.from(backgrounds),
        audio: Array.from(audio)
    };
}

/**
 * Extract assets for a specific scene and its possible next scenes
 * Useful for preloading "ahead" during gameplay
 */
export function extractSceneAssets(
    scenario: VNScenario,
    currentSceneId: string,
    options: { includeNextScenes?: boolean } = {}
): DiscoveredAssets {
    const { includeNextScenes = true } = options;
    const backgrounds = new Set<string>();
    const audio = new Set<string>();

    const currentScene = scenario.scenes[currentSceneId];
    if (!currentScene) {
        return { backgrounds: [], audio: [] };
    }

    // Current scene background
    if (currentScene.backgroundUrl) {
        backgrounds.add(currentScene.backgroundUrl);
    }

    if (includeNextScenes) {
        // Collect all possible next scene IDs
        const nextSceneIds = new Set<string>();

        // Auto-advance
        if (currentScene.nextSceneId && currentScene.nextSceneId !== 'END') {
            nextSceneIds.add(currentScene.nextSceneId);
        }

        // Choice destinations
        currentScene.choices?.forEach(choice => {
            if (choice.nextSceneId && choice.nextSceneId !== 'END') {
                nextSceneIds.add(choice.nextSceneId);
            }
            // Also check skillCheck outcomes
            if (choice.skillCheck) {
                if (choice.skillCheck.onSuccess?.nextSceneId &&
                    choice.skillCheck.onSuccess.nextSceneId !== 'END') {
                    nextSceneIds.add(choice.skillCheck.onSuccess.nextSceneId);
                }
                if (choice.skillCheck.onFail?.nextSceneId &&
                    choice.skillCheck.onFail.nextSceneId !== 'END') {
                    nextSceneIds.add(choice.skillCheck.onFail.nextSceneId);
                }
            }
        });

        // Extract backgrounds from next scenes
        nextSceneIds.forEach(sceneId => {
            const nextScene = scenario.scenes[sceneId];
            if (nextScene?.backgroundUrl) {
                backgrounds.add(nextScene.backgroundUrl);
            }
        });
    }

    return {
        backgrounds: Array.from(backgrounds),
        audio: Array.from(audio)
    };
}

/**
 * Convert discovered assets to preload-ready format
 */
export function toPreloadQueue(
    assets: DiscoveredAssets
): Array<{ url: string; type: 'image' | 'audio' }> {
    return [
        ...assets.backgrounds.map(url => ({ url, type: 'image' as const })),
        ...assets.audio.map(url => ({ url, type: 'audio' as const }))
    ];
}
