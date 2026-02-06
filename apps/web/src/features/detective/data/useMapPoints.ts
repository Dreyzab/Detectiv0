import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDossierStore } from '../dossier/store';
import { logger } from '@repo/shared';
// import { resolveHardlink } from '../hardlinks'; // REMOVED: Legacy
import { api } from '@/shared/api/client';

export const useMapPoints = (packId?: string) => {
    const { pointStates } = useDossierStore(); // Local override/optimistic state

    const { data, isLoading, error } = useQuery({
        queryKey: ['map-points', packId],
        queryFn: async () => {
            // Eden Treaty call
            const { data, error } = await api.map.points.get({
                query: packId ? { packId } : undefined
            });

            if (error) {
                console.warn("Failed to fetch map points", error);
                return { points: [], userStates: {} };
            }

            return data;
        },
        enabled: true,
        staleTime: 5 * 60 * 1000,      // 5 minutes
        gcTime: 30 * 60 * 1000,        // 30 minutes
        refetchOnWindowFocus: false
    });

    // Merge States: Local Store (Optimistic) > Server State
    // User states come typed from Eden now
    const mergedStates = useMemo(() => ({
        ...data?.userStates,
        ...pointStates
    }), [data?.userStates, pointStates]);

    // Legacy Hardlink Merge Logic REMOVED.
    // Bindings now come directly from the DB via Eden.
    const enrichedPoints = data?.points || [];

    if (enrichedPoints.length > 0) {
        logger.debug("Map Points Loaded via Eden", {
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
