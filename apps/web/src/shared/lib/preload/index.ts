/**
 * Preload System - Barrel Exports
 * 
 * Background asset preloading for VN scenarios
 */

export { preloadManager, type PreloadStatus, type AssetType, type PreloadPriority } from './PreloadManager';
export { extractScenarioAssets, extractSceneAssets, toPreloadQueue, type DiscoveredAssets } from './assetDiscovery';
export { usePreloadStatus, useIsScenarioReady } from './usePreloadStatus';
