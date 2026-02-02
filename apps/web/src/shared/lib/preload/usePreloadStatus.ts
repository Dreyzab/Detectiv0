/**
 * React hook for consuming preload status
 * Uses useSyncExternalStore for efficient subscription
 */

import { useSyncExternalStore } from 'react';
import { preloadManager, type PreloadStatus } from './PreloadManager';

/**
 * Subscribe to preload status updates for a specific key
 * 
 * @param key - The preload key (e.g., "scenario:detective_case1_briefing")
 * @returns Current preload status
 * 
 * @example
 * const { isReady, loaded, total } = usePreloadStatus('scenario:detective_case1_briefing');
 */
export function usePreloadStatus(key: string): PreloadStatus {
    return useSyncExternalStore(
        (callback) => preloadManager.subscribe(key, callback),
        () => preloadManager.getStatus(key),
        () => preloadManager.getStatus(key) // Server snapshot (same as client for now)
    );
}

/**
 * Check if a scenario is fully preloaded
 * Convenience wrapper for common use case
 */
export function useIsScenarioReady(scenarioId: string): boolean {
    const status = usePreloadStatus(`scenario:${scenarioId}`);
    return status.isReady;
}
