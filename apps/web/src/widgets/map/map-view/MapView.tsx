
import { useEffect, useRef, useState } from 'react';
import Map, { NavigationControl, type MapRef, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { REGIONS } from '@/shared/hexmap/regions';
import { DetectiveModeLayer } from './DetectiveModeLayer';
import { cn } from '@/shared/lib/utils';
import { useDossierStore } from '@/features/detective/dossier/store';
import { resolveAvailableInteractions, type ResolverOption, type MapPointBinding, logger } from '@repo/shared';

import { DetectiveMapPin } from './DetectiveMapPin';
import { ThreadLayer } from './ThreadLayer';
import { CaseCard } from './CaseCard';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { useMapPoints } from '@/features/detective/data/useMapPoints';
import { useQuestStore } from '@/features/quests/store';
import { useMemo } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const INITIAL_REGION = REGIONS['FREIBURG_1905'];

export const MapView = () => {
    const mapRef = useRef<MapRef>(null);
    const flags = useDossierStore((state) => state.flags);
    const startScenario = useVNStore(state => state.startScenario);

    // Quest Logic
    const quests = useQuestStore(state => state.quests);
    const userQuests = useQuestStore(state => state.userQuests);

    const activePointIds = useMemo(() => {
        const ids = new Set<string>();
        // Debug active quests state
        const activeQuests = Object.values(userQuests).filter(q => q.status === 'active');
        logger.debug("Recalculating Active Points", {
            activeQuestsCount: activeQuests.length,
            questIds: activeQuests.map(q => q.questId)
        });

        Object.values(userQuests).forEach(uq => {
            if (uq.status !== 'active') return;
            const quest = quests[uq.questId];
            if (!quest) {
                logger.warn(`Quest definition missing: ${uq.questId}`);
                return;
            }

            quest.objectives.forEach(obj => {
                // Check if objective is NOT completed and has a target point
                if (!uq.completedObjectiveIds.includes(obj.id) && obj.targetPointId) {
                    logger.debug(`Found active target: ${obj.targetPointId} (Quest: ${uq.questId}, Obj: ${obj.id})`);
                    ids.add(obj.targetPointId);
                }
            });
        });
        logger.debug("Final Active Point IDs", { ids: Array.from(ids) });
        return ids;
    }, [userQuests, quests]);

    useEffect(() => {
        logger.debug("Active Points Updated Effect", { count: activePointIds.size, ids: Array.from(activePointIds) });
    }, [activePointIds]);

    // Unified Map Hook
    const { points, pointStates } = useMapPoints();

    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
    const [availableActions, setAvailableActions] = useState<ResolverOption[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // TODO: move inventory to a unified context
    const inventory = {};

    const handlePointClick = (pointId: string) => {
        const point = points.find(p => p.id === pointId);
        if (!point) return;

        const options = resolveAvailableInteractions(
            point.bindings || [],
            'marker_click',
            { flags, pointStates, inventory }
        );

        setSelectedPointId(pointId);
        setAvailableActions(options);
    };

    const handleExecuteAction = (binding: MapPointBinding) => {
        console.log('Execute Action:', binding);

        if (binding.actions) {
            binding.actions.forEach(action => {
                if (action.type === 'start_vn') {
                    const legacyPayload = (action as { payload?: unknown }).payload;
                    const id = typeof legacyPayload === 'string' ? legacyPayload : action.scenarioId;
                    startScenario(id);
                }
            });
        }

        setAvailableActions([]);
        setSelectedPointId(null);
    };

    const mapContainerClasses = cn(
        "relative w-full h-full transition-all duration-700",
        "sepia-[.3] contrast-[1.05] brightness-95 saturate-[.9]"
    );

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: [INITIAL_REGION.geoCenterLng, INITIAL_REGION.geoCenterLat],
                zoom: INITIAL_REGION.zoom,
                duration: 2000
            });
        }
    }, []);

    const isVintage = INITIAL_REGION.vintageStyle;

    if (!MAPBOX_TOKEN) {
        return <div className="p-10 text-red-500">Error: VITE_MAPBOX_TOKEN is missing in .env</div>;
    }

    const selectedPoint = selectedPointId ? points.find(p => p.id === selectedPointId) : null;

    return (
        <>

            <div className={mapContainerClasses}>
                <div
                    className="absolute inset-0 pointer-events-none z-[var(--z-map-texture)] mix-blend-multiply opacity-15 bg-[#d4c5a3]"
                    style={{
                        backgroundImage: 'url("/images/paper-texture.png")',
                        backgroundSize: '200px'
                    }}
                />

                <div className={cn('absolute inset-0 z-[var(--z-map-base)]', isVintage && 'sepia-[.3] contrast-[1.05] brightness-95 saturate-[.9]')}>
                    <Map
                        ref={mapRef}
                        initialViewState={{
                            longitude: INITIAL_REGION.geoCenterLng,
                            latitude: INITIAL_REGION.geoCenterLat,
                            zoom: INITIAL_REGION.zoom,
                        }}
                        mapStyle="mapbox://styles/inoti/cmktqmmks002s01pa3f3gfpll"
                        mapboxAccessToken={MAPBOX_TOKEN}
                        attributionControl={false}
                        onLoad={() => setIsMapLoaded(true)}
                    >
                        <NavigationControl position="bottom-right" />

                        {isMapLoaded && (
                            <>
                                <DetectiveModeLayer />
                                <ThreadLayer points={points} />
                            </>
                        )}

                        {points.map((point) => {
                            const state = pointStates[point.id] ?? 'discovered';
                            if (point.isHiddenInitially && state === 'locked') return null;

                            return (
                                <Marker
                                    key={point.id}
                                    longitude={point.lng}
                                    latitude={point.lat}
                                    anchor="center"
                                >
                                    <DetectiveMapPin
                                        point={point}
                                        state={state as 'discovered' | 'locked'}
                                        isActive={activePointIds.has(point.id)}
                                        onClick={() => handlePointClick(point.id)}
                                    />
                                </Marker>
                            )
                        })}
                    </Map>
                </div>
            </div>

            {selectedPoint && (
                <CaseCard
                    point={selectedPoint}
                    actions={availableActions}
                    onExecute={handleExecuteAction}
                    onClose={() => {
                        setSelectedPointId(null);
                        setAvailableActions([]);
                    }}
                />
            )}
        </>
    );
};
