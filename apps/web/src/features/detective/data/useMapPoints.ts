
import { useQuery } from '@tanstack/react-query';
import { useDossierStore } from '../dossier/store';
import type { MapPoint, PointStateEnum } from '@repo/shared';
import { logger } from '@repo/shared';
import { resolveHardlink } from '../hardlinks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface MapPointsResponse {
    points: MapPoint[];
    userStates: Record<string, PointStateEnum>;
}

/**
 * Fetches map points from server database.
 * No legacy merge - all data comes from DB.
 */
export const useMapPoints = (packId?: string) => {
    const { pointStates } = useDossierStore(); // Local override/optimistic state

    const { data, isLoading, error } = useQuery<MapPointsResponse>({
        queryKey: ['map-points', packId],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/map/points${packId ? `?packId=${packId}` : ''}`);
            if (!res.ok) {
                console.warn("Failed to fetch map points");
                return { points: [], userStates: {} };
            }
            return res.json();
        },
        enabled: true
    });

    // Merge States: Local Store (Optimistic) > Server State
    const mergedStates: Record<string, PointStateEnum> = {
        ...data?.userStates,
        ...pointStates
    };

    // Merge Hardlinks (Client-side logic) into Points
    const enrichedPoints = (data?.points || []).map(point => {
        const hardlinks = resolveHardlink(point.id);
        if (hardlinks) {
            // Append a default 'marker_click' binding if one doesn't exist or merge it?
            // For now, we assume if hardlinks exist, we want a 'marker_click' binding to execute them.
            const existingBindings = point.bindings || [];

            // Check if we already have a marker_click binding
            const hasClickBinding = existingBindings.some(b => b.trigger === 'marker_click');

            if (!hasClickBinding) {
                return {
                    ...point,
                    bindings: [
                        ...existingBindings,
                        {
                            id: `auto_${point.id}`,
                            trigger: 'marker_click' as const,
                            label: 'Investigate', // Default label
                            priority: 0,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            actions: hardlinks as any,
                            conditions: [] // Always available unless point is locked, which is handled by renderer
                        }
                    ]
                };
            }
        }
        return point;
    });

    if (enrichedPoints.length > 0) {
        // Debug: Log point IDs to verify matching
        logger.debug("Map Points Loaded", {
            count: enrichedPoints.length,
            ids: enrichedPoints.map(p => p.id).join(', ')
        });
    }

    return {
        points: enrichedPoints,
        pointStates: mergedStates,
        isLoading,
        error
    };
};
