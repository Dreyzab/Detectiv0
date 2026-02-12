import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDossierStore } from '../dossier/store';
import { logger, MapPointSchema, PointStateSchema, type MapPoint, type PointStateEnum } from '@repo/shared';
import type { MapPointsQuery } from '@repo/contracts';
import { useMapPointsStore } from './mapPointsStore';
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
    const dataRecord = data && typeof data === 'object' && !Array.isArray(data)
        ? data as Record<string, unknown>
        : undefined;

    const normalizedInput = {
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
        iconOverride: typeof point.iconOverride === 'string'
            ? point.iconOverride
            : (typeof dataRecord?.iconOverride === 'string' ? dataRecord.iconOverride : undefined),
        isHiddenInitially: typeof point.isHiddenInitially === 'boolean'
            ? point.isHiddenInitially
            : (typeof dataRecord?.isHiddenInitially === 'boolean' ? dataRecord.isHiddenInitially : undefined),
        unlockGroup: typeof point.unlockGroup === 'string'
            ? point.unlockGroup
            : (typeof dataRecord?.unlockGroup === 'string' ? dataRecord.unlockGroup : undefined),
        data: dataRecord
    };

    const parsed = MapPointSchema.safeParse(normalizedInput);

    if (parsed.success) {
        return parsed.data;
    }

    // DB may contain legacy/unknown categories; keep point usable via safe fallback.
    const withFallbackCategory = MapPointSchema.safeParse({
        ...normalizedInput,
        category: 'INTEREST',
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
    regionId?: string;
}

export const buildMapPointsQuery = ({
    packId,
    caseId,
    regionId
}: UseMapPointsParams = {}): MapPointsQuery => ({
    packId,
    caseId: caseId ?? undefined,
    regionId: regionId ?? undefined
});

export const useMapPoints = ({ packId, caseId, regionId }: UseMapPointsParams = {}) => {
    const pointStates = useDossierStore((state) => state.pointStates);
    const upsertMapPoints = useMapPointsStore((state) => state.upsertPoints);

    const { data, isLoading, error } = useQuery({
        queryKey: ['map-points', packId, caseId, regionId],
        queryFn: async () => {
            const { data, error } = await api.map.points.get({
                query: buildMapPointsQuery({
                    packId,
                    caseId,
                    regionId
                })
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
    const enrichedPoints = useMemo(() => {
        const rawPoints = Array.isArray(data?.points) ? data.points : [];
        return rawPoints
            .map(normalizeMapPoint)
            .filter((point): point is MapPoint => point !== null);
    }, [data]);

    useEffect(() => {
        upsertMapPoints(enrichedPoints);

        if (enrichedPoints.length > 0) {
            logger.debug("Map Points Loaded via Eden", {
                count: enrichedPoints.length,
                ids: enrichedPoints.map(p => p.id).join(', ')
            });
        }
    }, [enrichedPoints, upsertMapPoints]);

    return {
        points: enrichedPoints,
        pointStates: mergedStates,
        isLoading,
        error
    };
};
