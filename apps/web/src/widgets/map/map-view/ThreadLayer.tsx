
import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useDossierStore } from '@/features/detective/dossier/store';
import { DETECTIVE_POINTS } from '@/features/detective/points';
import { NARRATIVE_THREADS } from '@/features/detective/data/cases';
import { checkCondition } from '@repo/shared';
import type { FeatureCollection } from 'geojson';

export const ThreadLayer = () => {
    const { activeCaseId, flags, pointStates } = useDossierStore();

    const threadData = useMemo<FeatureCollection>(() => {
        if (!activeCaseId) return { type: 'FeatureCollection', features: [] };

        const relevantThreads = NARRATIVE_THREADS.filter(t => t.caseId === activeCaseId);

        // Mock inventory for now, since it's required by ResolutionContext
        const inventory = {};

        const features = relevantThreads.filter(thread => {
            // 1. Check condition (visibility)
            if (thread.condition && !checkCondition(thread.condition, { flags, pointStates, inventory })) {
                return false;
            }
            // 2. Check endpoints exist
            const from = DETECTIVE_POINTS[thread.sourcePointId];
            const to = DETECTIVE_POINTS[thread.targetPointId];
            return from && to;
        }).map(thread => {
            const from = DETECTIVE_POINTS[thread.sourcePointId];
            const to = DETECTIVE_POINTS[thread.targetPointId];

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
    }, [activeCaseId, flags, pointStates]);

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
