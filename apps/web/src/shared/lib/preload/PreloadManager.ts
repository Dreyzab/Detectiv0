/**
 * PreloadManager - Background asset preloading engine
 * 
 * Features:
 * - Priority queue for asset URLs
 * - requestIdleCallback + setTimeout fallback
 * - Concurrency limiter (default: 3 parallel fetches)
 * - Progress tracking per key (scenario/scene)
 * - Cancellation support
 */

export type AssetType = 'image' | 'audio' | 'video';
export type PreloadPriority = 0 | 1 | 2 | 3;

export interface PreloadStatus {
    total: number;
    loaded: number;
    failed: number;
    isReady: boolean;
    isLoading: boolean;
}

interface QueuedAsset {
    url: string;
    type: AssetType;
    priority: PreloadPriority;
    key: string;
}

interface KeyStatus {
    total: number;
    loaded: number;
    failed: number;
}

// requestIdleCallback polyfill for Safari
const requestIdle =
    typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 1);

const cancelIdle =
    typeof cancelIdleCallback !== 'undefined'
        ? cancelIdleCallback
        : clearTimeout;

class PreloadManager {
    private queue: QueuedAsset[] = [];
    private loading = new Set<string>();
    private loaded = new Set<string>();
    private failed = new Set<string>();
    private keyStatus = new Map<string, KeyStatus>();
    private listeners = new Map<string, Set<() => void>>();
    private cancelledKeys = new Set<string>();

    private readonly MAX_CONCURRENT = 3;
    private idleCallbackId: number | null = null;
    private isProcessing = false;

    /**
     * Enqueue assets for background preloading
     */
    enqueue(
        assets: Array<{ url: string; type: AssetType }>,
        key: string,
        options: { priority?: PreloadPriority } = {}
    ): void {
        const priority = options.priority ?? 2;

        // Initialize key status if new
        if (!this.keyStatus.has(key)) {
            this.keyStatus.set(key, { total: 0, loaded: 0, failed: 0 });
        }

        const status = this.keyStatus.get(key)!;

        assets.forEach(({ url, type }) => {
            // Skip already queued, loading, or loaded
            if (this.loaded.has(url) || this.loading.has(url)) {
                // Already processed, count as loaded for this key
                if (this.loaded.has(url)) {
                    status.total++;
                    status.loaded++;
                }
                return;
            }

            // Check if already in queue
            const existing = this.queue.find(q => q.url === url);
            if (existing) {
                // Upgrade priority if needed
                if (priority < existing.priority) {
                    existing.priority = priority;
                    this.sortQueue();
                }
                return;
            }

            // Add to queue
            this.queue.push({ url, type, priority, key });
            status.total++;
        });

        this.sortQueue();
        this.notifyListeners(key);
        this.scheduleProcessing();
    }

    /**
     * Preload a single VN scenario
     */
    preloadScenario(
        scenarioId: string,
        assets: Array<{ url: string; type: AssetType }>,
        options: { priority?: PreloadPriority } = {}
    ): void {
        const key = `scenario:${scenarioId}`;
        this.enqueue(assets, key, options);
    }

    /**
     * Get current status for a key
     */
    getStatus(key: string): PreloadStatus {
        const status = this.keyStatus.get(key);
        if (!status) {
            return { total: 0, loaded: 0, failed: 0, isReady: true, isLoading: false };
        }

        const isLoading = this.queue.some(q => q.key === key) ||
            [...this.loading].some(url =>
                this.queue.find(q => q.url === url)?.key === key
            );

        return {
            total: status.total,
            loaded: status.loaded,
            failed: status.failed,
            isReady: status.loaded + status.failed >= status.total && status.total > 0,
            isLoading
        };
    }

    /**
     * Subscribe to status changes for a key
     */
    subscribe(key: string, callback: () => void): () => void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key)!.add(callback);

        return () => {
            this.listeners.get(key)?.delete(callback);
        };
    }

    /**
     * Cancel preloading for a specific key
     */
    cancel(key: string): void {
        this.cancelledKeys.add(key);
        this.queue = this.queue.filter(q => q.key !== key);
        this.keyStatus.delete(key);
        this.notifyListeners(key);
    }

    /**
     * Cancel all preloading
     */
    cancelAll(): void {
        if (this.idleCallbackId !== null) {
            cancelIdle(this.idleCallbackId);
            this.idleCallbackId = null;
        }
        this.queue = [];
        this.loading.clear();
        this.keyStatus.clear();
        this.cancelledKeys.clear();
        this.isProcessing = false;
    }

    // --- Private Methods ---

    private sortQueue(): void {
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    private scheduleProcessing(): void {
        if (this.isProcessing || this.queue.length === 0) return;

        this.idleCallbackId = requestIdle(() => {
            this.processQueue();
        }) as unknown as number;
    }

    private async processQueue(): Promise<void> {
        this.isProcessing = true;

        while (this.queue.length > 0 && this.loading.size < this.MAX_CONCURRENT) {
            const asset = this.queue.shift();
            if (!asset) break;

            // Skip if key was cancelled
            if (this.cancelledKeys.has(asset.key)) {
                continue;
            }

            // Skip if already loaded
            if (this.loaded.has(asset.url)) {
                const status = this.keyStatus.get(asset.key);
                if (status) {
                    status.loaded++;
                    this.notifyListeners(asset.key);
                }
                continue;
            }

            this.loading.add(asset.url);
            this.loadAsset(asset);
        }

        this.isProcessing = false;

        // Continue if more in queue
        if (this.queue.length > 0) {
            this.scheduleProcessing();
        }
    }

    private async loadAsset(asset: QueuedAsset): Promise<void> {
        try {
            if (asset.type === 'image') {
                await this.preloadImage(asset.url);
            } else if (asset.type === 'audio') {
                await this.preloadAudio(asset.url);
            }
            // Video can be added later

            this.loaded.add(asset.url);
            const status = this.keyStatus.get(asset.key);
            if (status) {
                status.loaded++;
            }
        } catch (error) {
            console.warn(`[PreloadManager] Failed to load: ${asset.url}`, error);
            this.failed.add(asset.url);
            const status = this.keyStatus.get(asset.key);
            if (status) {
                status.failed++;
            }
        } finally {
            this.loading.delete(asset.url);
            this.notifyListeners(asset.key);

            // Trigger next batch
            if (this.queue.length > 0) {
                this.scheduleProcessing();
            }
        }
    }

    private preloadImage(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Image load failed: ${url}`));
            img.src = url;
        });
    }

    private preloadAudio(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve();
            audio.onerror = () => reject(new Error(`Audio load failed: ${url}`));
            audio.preload = 'auto';
            audio.src = url;
        });
    }

    private notifyListeners(key: string): void {
        const callbacks = this.listeners.get(key);
        if (callbacks) {
            callbacks.forEach(cb => cb());
        }
    }
}

// Singleton export
export const preloadManager = new PreloadManager();
