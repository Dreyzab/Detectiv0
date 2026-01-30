import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useDossierStore } from '@/features/detective/dossier/store';
import { NARRATIVE_THREADS } from '@/features/detective/data/cases';
import { checkCondition } from '@repo/shared';
import type { FeatureCollection } from 'geojson';
import type { MapPoint } from '@repo/shared';

interface ThreadLayerProps {
    points: MapPoint[];
}

export const ThreadLayer = ({ points }: ThreadLayerProps) => {
    const { activeCaseId, flags, pointStates } = useDossierStore();

    const threadData = useMemo<FeatureCollection>(() => {
        if (!activeCaseId) return { type: 'FeatureCollection', features: [] };

        const relevantThreads = NARRATIVE_THREADS.filter(t => t.caseId === activeCaseId);

        // Mock inventory for now, since it's required by ResolutionContext
        const inventory = {};

        const pointMap = new Map(points.map(p => [p.id, p]));

        const features = relevantThreads.filter(thread => {
            // 1. Check condition (visibility)
            if (thread.condition && !checkCondition(thread.condition, { flags, pointStates, inventory })) {
                return false;
            }
            // 2. Check endpoints exist
            const from = pointMap.get(thread.sourcePointId);
            const to = pointMap.get(thread.targetPointId);
            return from && to;
        }).map(thread => {
            const from = pointMap.get(thread.sourcePointId)!;
            const to = pointMap.get(thread.targetPointId)!;

            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [from.lng, from.lat],
                        [to.lng, to.lat]
                    ]
                },
                properties: {
                    id: thread.id,
                    style: (thread as { style?: string }).style || 'solid'
                }
            };
        });

        return {
            type: 'FeatureCollection',
            features: features as import('geojson').Feature[]
        };
    }, [activeCaseId, flags, pointStates, points]);

    return (
        <Source id="narrative-threads" type="geojson" data={threadData}>
            {/* Solid Lines */}
            <Layer
                id="threads-solid"
                type="line"
                filter={['==', 'style', 'solid']}
                paint={{
                    'line-color': '#d4c5a3',
                    'line-width': 3,
                    'line-opacity': 0.8
                }}
            />
            {/* Dashed Lines */}
            <Layer
                id="threads-dashed"
                type="line"
                filter={['==', 'style', 'dashed']}
                paint={{
                    'line-color': '#d4c5a3',
                    'line-width': 2,
                    'line-opacity': 0.6,
                    'line-dasharray': [2, 2]
                }}
            />
        </Source>
    );
};
