import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDossierStore } from '../dossier/store';
import { logger, MapPointSchema, PointStateSchema, type MapPoint, type PointStateEnum } from '@repo/shared';
// import { resolveHardlink } from '../hardlinks'; // REMOVED: Legacy
import { api } from '@/shared/api/client';

const parseJsonLike = (value: unknown): unknown => {
    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const normalizeMapPoint = (rawPoint: unknown): MapPoint | null => {
    if (!rawPoint || typeof rawPoint !== 'object') {
        return null;
    }

    const point = rawPoint as Record<string, unknown>;
    const bindings = parseJsonLike(point.bindings);
    const data = parseJsonLike(point.data);

    const parsed = MapPointSchema.safeParse({
        id: point.id,
        title: point.title,
        category: point.category,
        lat: point.lat,
        lng: point.lng,
        description: typeof point.description === 'string' ? point.description : undefined,
        image: typeof point.image === 'string' ? point.image : undefined,
        packId: point.packId,
        scope: typeof point.scope === 'string' ? point.scope : undefined,
        caseId: typeof point.caseId === 'string' ? point.caseId : undefined,
        retentionPolicy: typeof point.retentionPolicy === 'string' ? point.retentionPolicy : undefined,
        defaultState: typeof point.defaultState === 'string' ? point.defaultState : undefined,
        active: typeof point.active === 'boolean' ? point.active : undefined,
        bindings: Array.isArray(bindings) ? bindings : [],
        iconOverride: typeof point.iconOverride === 'string' ? point.iconOverride : undefined,
        isHiddenInitially: typeof point.isHiddenInitially === 'boolean' ? point.isHiddenInitially : undefined,
        data: data && typeof data === 'object' && !Array.isArray(data) ? data : undefined
    });

    if (parsed.success) {
        return parsed.data;
    }

    // DB may contain legacy/unknown categories; keep point usable via safe fallback.
    const withFallbackCategory = MapPointSchema.safeParse({
        id: point.id,
        title: point.title,
        category: 'INTEREST',
        lat: point.lat,
        lng: point.lng,
        description: typeof point.description === 'string' ? point.description : undefined,
        image: typeof point.image === 'string' ? point.image : undefined,
        packId: point.packId,
        scope: typeof point.scope === 'string' ? point.scope : undefined,
        caseId: typeof point.caseId === 'string' ? point.caseId : undefined,
        retentionPolicy: typeof point.retentionPolicy === 'string' ? point.retentionPolicy : undefined,
        defaultState: typeof point.defaultState === 'string' ? point.defaultState : undefined,
        active: typeof point.active === 'boolean' ? point.active : undefined,
        bindings: Array.isArray(bindings) ? bindings : [],
        iconOverride: typeof point.iconOverride === 'string' ? point.iconOverride : undefined,
        isHiddenInitially: typeof point.isHiddenInitially === 'boolean' ? point.isHiddenInitially : undefined,
        data: data && typeof data === 'object' && !Array.isArray(data) ? data : undefined
    });

    if (withFallbackCategory.success) {
        logger.warn(`Unknown point category for '${String(point.id)}'; fallback to INTEREST`);
        return withFallbackCategory.data;
    }

    logger.warn(`Skipping invalid map point '${String(point.id)}'`);
    return null;
};

const normalizeUserStates = (rawStates: unknown): Record<string, PointStateEnum> => {
    if (!rawStates || typeof rawStates !== 'object') {
        return {};
    }

    const normalized: Record<string, PointStateEnum> = {};
    for (const [pointId, state] of Object.entries(rawStates as Record<string, unknown>)) {
        const parsedState = PointStateSchema.safeParse(state);
        if (parsedState.success) {
            normalized[pointId] = parsedState.data;
        }
    }

    return normalized;
};

export interface UseMapPointsParams {
    packId?: string;
    caseId?: string;
}

export const useMapPoints = ({ packId, caseId }: UseMapPointsParams = {}) => {
    const { pointStates } = useDossierStore(); // Local override/optimistic state

    const { data, isLoading, error } = useQuery({
        queryKey: ['map-points', packId, caseId],
        queryFn: async () => {
            // Contract-based API call
            const query = {
                packId,
                caseId: caseId ?? undefined
            };

            const { data, error } = await api.map.points.get({
                query
            });

            if (error) {
                console.warn("Failed to fetch map points", error);
                return { points: [], userStates: {} };
            }

            return data ?? { points: [], userStates: {} };
        },
        enabled: true,
        staleTime: 5 * 60 * 1000,      // 5 minutes
        gcTime: 30 * 60 * 1000,        // 30 minutes
        refetchOnWindowFocus: false
    });

    // Merge States: Local Store (Optimistic) > Server State
    // User states come typed from Eden now
    const serverStates = useMemo(
        () => normalizeUserStates(data?.userStates),
        [data?.userStates]
    );

    const mergedStates = useMemo<Record<string, PointStateEnum>>(() => ({
        ...serverStates,
        ...pointStates
    }), [serverStates, pointStates]);

    // Legacy Hardlink Merge Logic REMOVED.
    // Bindings now come directly from the DB via Eden.
    const rawPoints = Array.isArray(data?.points) ? data.points : [];
    const enrichedPoints = rawPoints
        .map(normalizeMapPoint)
        .filter((point): point is MapPoint => point !== null);

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
