import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import MapGL, { NavigationControl, type MapRef, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { REGIONS } from '@/shared/hexmap/regions';
import { DetectiveModeLayer } from './DetectiveModeLayer';
import { cn } from '@/shared/lib/utils';
import { useDossierStore } from '@/features/detective/dossier/store';
import { resolveAvailableInteractions, type ResolverOption, type MapPoint, type MapPointBinding, logger, type PointStateEnum } from '@repo/shared';

import { DetectiveMapPin } from './DetectiveMapPin';
import { ThreadLayer } from './ThreadLayer';
import { CaseCard } from './CaseCard';
import { useVNStore } from '@/entities/visual-novel/model/store';
import { getScenarioById } from '@/entities/visual-novel/scenarios/registry';
import { useMapPoints } from '@/features/detective/data/useMapPoints';
import { useQuestStore } from '@/features/quests/store';
import { useNavigate } from 'react-router-dom';
import { useMapActionHandler } from '@/features/detective/lib/map-action-handler';
import { useWorldEngineStore } from '@/features/detective/engine/store';
import { MerchantModal } from '@/features/merchant/ui/MerchantModal';
import { useMerchantUiStore } from '@/features/merchant/model/store';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const INITIAL_REGION = REGIONS['FREIBURG_1905'];

const getStableLocationId = (point: MapPoint): string => {
    const rawLocationId = (point.data as Record<string, unknown> | undefined)?.locationId;
    if (typeof rawLocationId === 'string' && rawLocationId.trim().length > 0) {
        return rawLocationId.trim();
    }
    return point.id;
};

const isOneShotScenarioComplete = (scenarioId: string, flags: Record<string, boolean>): boolean => {
    if (scenarioId === 'detective_case1_hbf_arrival') {
        return Boolean(flags['arrived_at_hbf']);
    }
    if (scenarioId === 'detective_case1_map_first_exploration') {
        return Boolean(flags['case01_map_exploration_intro_done']);
    }
    return false;
};

const LEGACY_LOCATION_MAP: Record<string, string> = {
    'loc_freiburg_bank': 'p_bank',
    'loc_rathaus': 'p_rathaus',
    'loc_hbf': 'p_hbf',
    'loc_munster': 'p_munster',
    'loc_uni_chem': 'p_uni_chem',
    'loc_uni_med': 'p_uni_med',
    'loc_student_house': 'p_student_house',
    'loc_pub_deutsche': 'p_pub_deutsche',
    'loc_red_light': 'p_red_light',
    'loc_freiburg_warehouse': 'p_goods_station',
    'loc_workers_pub': 'p_workers_pub',
    'loc_martinstor': 'p_martinstor',
    'loc_schwabentor': 'p_schwabentor'
};

export const MapView = () => {
    const mapRef = useRef<MapRef>(null);
    const flags = useDossierStore((state) => state.flags);
    const activeCaseId = useDossierStore((state) => state.activeCaseId);
    const worldCaseId = activeCaseId ?? 'case_01_bank';
    const setPointState = useDossierStore((state) => state.setPointState);
    const setFlag = useDossierStore((state) => state.setFlag);
    const startScenario = useVNStore(state => state.startScenario);
    const locale = useVNStore(state => state.locale);
    const navigate = useNavigate();
    const { executeAction } = useMapActionHandler();
    const isMerchantOpen = useMerchantUiStore((state) => state.isOpen);
    const activeMerchantId = useMerchantUiStore((state) => state.merchantId);
    const closeMerchant = useMerchantUiStore((state) => state.closeMerchant);

    const worldClock = useWorldEngineStore((state) => state.worldClock);
    const currentLocationId = useWorldEngineStore((state) => state.currentLocationId);
    const locationAvailability = useWorldEngineStore((state) => state.locationAvailability);
    const objectives = useWorldEngineStore((state) => state.objectives);
    const activeCase = useWorldEngineStore((state) => state.activeCase);
    const lastTravelBeat = useWorldEngineStore((state) => state.lastTravelBeat);
    const isWorldHydrating = useWorldEngineStore((state) => state.isHydrating);
    const isTraveling = useWorldEngineStore((state) => state.isTraveling);
    const worldError = useWorldEngineStore((state) => state.error);
    const hydrateWorld = useWorldEngineStore((state) => state.hydrateWorld);
    const travelToLocation = useWorldEngineStore((state) => state.travelToLocation);
    const advanceCase = useWorldEngineStore((state) => state.advanceCase);

    // Quest Logic
    const quests = useQuestStore(state => state.quests);
    const userQuests = useQuestStore(state => state.userQuests);
    const questStages = useMemo(() => {
        const stages: Record<string, string> = {};
        Object.values(userQuests).forEach((quest) => {
            if (quest.stage) {
                stages[quest.questId] = quest.stage;
            }
        });
        return stages;
    }, [userQuests]);

    // Unified Map Hook
    const { points, pointStates } = useMapPoints({
        caseId: activeCaseId ?? undefined
    });

    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
    const [availableActions, setAvailableActions] = useState<ResolverOption[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const activePointIds = useMemo(() => {
        const ids = new Set<string>();

        // Create lookup for LocationID -> PointID
        const locationLookup = new Map<string, string>();

        // 1. Populate with Legacy Mappings (Manual Overrides)
        Object.entries(LEGACY_LOCATION_MAP).forEach(([locId, pointId]) => {
            locationLookup.set(locId, pointId);
        });

        // 2. Populate with Data-driven Mappings (if available)
        points.forEach(p => {
            locationLookup.set(p.id, p.id);
            const locId = getStableLocationId(p);
            if (locId && locId !== p.id) {
                locationLookup.set(locId, p.id);
            }
        });

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
                const objectiveVisibleInStage = !obj.stage || obj.stage === uq.stage;
                if (!uq.completedObjectiveIds.includes(obj.id) && obj.targetPointId && objectiveVisibleInStage) {
                    // Resolve the target (which might be a locationId) to a pointId
                    const resolvedId = locationLookup.get(obj.targetPointId) ?? obj.targetPointId;

                    logger.debug(`Found active target: ${obj.targetPointId} -> ${resolvedId} (Quest: ${uq.questId}, Obj: ${obj.id})`);

                    // Only add if it maps to a real point we have
                    if (points.some(p => p.id === resolvedId)) {
                        ids.add(resolvedId);
                    } else {
                        logger.warn(`Active target ${obj.targetPointId} resolved to ${resolvedId} but point not found in map data.`);
                    }
                }
            });
        });
        logger.debug("Final Active Point IDs", { ids: Array.from(ids) });
        return ids;
    }, [userQuests, quests, points]);

    useEffect(() => {
        logger.debug("Active Points Updated Effect", { count: activePointIds.size, ids: Array.from(activePointIds) });
    }, [activePointIds]);

    useEffect(() => {
        void hydrateWorld({
            caseId: worldCaseId
        });
    }, [worldCaseId, hydrateWorld]);

    // TODO: move inventory to a unified context
    const inventory = useMemo<Record<string, number>>(() => ({}), []);

    const handlePointClick = useCallback((pointId: string) => {
        const point = points.find(p => p.id === pointId);
        if (!point) return;

        const options = resolveAvailableInteractions(
            point.bindings || [],
            'marker_click',
            { flags, pointStates, inventory, questStages }
        );

        setSelectedPointId(pointId);
        setAvailableActions(options);
    }, [points, flags, pointStates, inventory, questStages]);

    const handleExecuteAction = useCallback(async (binding: MapPointBinding) => {
        console.log('Execute Action:', binding);
        if (!selectedPointId) return;

        const targetPointId = selectedPointId;
        const targetPoint = points.find((point) => point.id === targetPointId);
        const targetLocationId = targetPoint ? getStableLocationId(targetPoint) : targetPointId;
        const knownAvailability = locationAvailability[targetPointId] ?? locationAvailability[targetLocationId];
        if (knownAvailability && !knownAvailability.open) {
            logger.warn(`Location is closed: ${targetPointId}`, {
                reason: knownAvailability.reason,
                alternatives: knownAvailability.alternatives
            });
            return;
        }

        if (currentLocationId !== targetPointId) {
            const travelResult = await travelToLocation({
                toLocationId: targetPointId,
                caseId: worldCaseId
            });

            if (!travelResult) {
                return;
            }

            if (!travelResult.locationAvailability.open) {
                logger.warn(`Location unavailable after travel: ${targetPointId}`, {
                    reason: travelResult.locationAvailability.reason,
                    alternatives: travelResult.locationAvailability.alternatives
                });
                return;
            }
        }

        setPointState(targetPointId, 'visited');
        setFlag(`VISITED_${targetPointId}`, true);

        if (binding.actions) {
            binding.actions.forEach((action) => {
                if (action.type === 'start_vn') {
                    const legacyPayload = (action as { payload?: unknown }).payload;
                    const id = typeof legacyPayload === 'string' ? legacyPayload : action.scenarioId;
                    if (isOneShotScenarioComplete(id, flags)) {
                        logger.debug(`Skipping one-shot VN replay from map: ${id} already complete`);
                        return;
                    }
                    startScenario(id);
                    const scenario = getScenarioById(id, locale);
                    if (scenario?.mode === 'fullscreen') {
                        navigate(`/vn/${scenario.id}`);
                    }
                    return;
                }

                executeAction(action);
            });
        }

        setAvailableActions([]);
        setSelectedPointId(null);
    }, [
        selectedPointId,
        points,
        locationAvailability,
        currentLocationId,
        travelToLocation,
        worldCaseId,
        setPointState,
        setFlag,
        flags,
        startScenario,
        locale,
        navigate,
        executeAction
    ]);

    const handleAlternativeApproach = useCallback(async (approach: 'lockpick' | 'bribe' | 'warrant') => {
        if (!selectedPointId) {
            return;
        }

        const selectedPoint = points.find((point) => point.id === selectedPointId);
        if (!selectedPoint) {
            return;
        }

        const caseId = worldCaseId;
        const targetLocationId = getStableLocationId(selectedPoint);
        const objectivesForLocation = objectives
            .filter((objective) => objective.locationId === targetLocationId)
            .sort((left, right) => left.sortOrder - right.sortOrder);

        const nextObjectiveId = objectivesForLocation.length === 0
            ? null
            : (activeCase?.currentObjectiveId && objectivesForLocation.some((objective) => objective.id === activeCase.currentObjectiveId)
                ? activeCase.currentObjectiveId
                : objectivesForLocation[objectivesForLocation.length - 1]?.id ?? null);

        if (!nextObjectiveId) {
            logger.warn(`No objective found for location: ${caseId}:${targetLocationId}`);
            return;
        }

        const result = await advanceCase({
            caseId,
            nextObjectiveId,
            locationId: targetLocationId,
            approach
        });

        if (!result || !result.success) {
            return;
        }

        const mainBinding = availableActions.find((option) => option.enabled && option.binding.actions.length > 0)?.binding;
        if (mainBinding) {
            await handleExecuteAction(mainBinding);
        }
    }, [selectedPointId, points, worldCaseId, objectives, activeCase, advanceCase, availableActions, handleExecuteAction]);

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
    const selectedPointLocationId = selectedPoint ? getStableLocationId(selectedPoint) : null;
    const selectedAvailability = selectedPoint
        ? (locationAvailability[selectedPoint.id] ?? (selectedPointLocationId ? locationAvailability[selectedPointLocationId] : undefined))
        : undefined;

    return (
        <>

            <div className={mapContainerClasses}>
                <div className="absolute top-4 left-4 z-40 bg-[#1b1510]/90 text-[#e7dac0] border border-[#4a3b2a] px-3 py-2 text-[11px] font-mono uppercase tracking-wide shadow-lg">
                    <div>Phase: {worldClock.phase}</div>
                    <div>Tick: {worldClock.tick}</div>
                    <div>Location: {currentLocationId ?? 'unknown'}</div>
                    {lastTravelBeat && lastTravelBeat.type !== 'none' && (
                        <div>Travel Beat: {lastTravelBeat.type}</div>
                    )}
                    {(isWorldHydrating || isTraveling) && (
                        <div className="text-amber-300">Syncing world...</div>
                    )}
                    {worldError && (
                        <div className="text-red-300 normal-case">{worldError}</div>
                    )}
                </div>

                <div
                    className="absolute inset-0 pointer-events-none z-(--z-map-texture) mix-blend-multiply opacity-15 bg-[#d4c5a3]"
                    style={{
                        backgroundImage: 'url("/images/paper-texture.png")',
                        backgroundSize: '200px'
                    }}
                />

                <div className={cn('absolute inset-0 z-(--z-map-base)', isVintage && 'sepia-[.3] contrast-[1.05] brightness-95 saturate-[.9]')}>
                    <MapGL
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
                            const state = (pointStates[point.id] ?? 'discovered') as PointStateEnum;
                            if (point.isHiddenInitially && state === 'locked') return null;

                            const markerState: 'hidden' | 'discovered' | 'unlocked' | 'investigated' | 'locked' =
                                state === 'locked'
                                    ? 'locked'
                                    : (state === 'visited' || state === 'completed')
                                        ? 'investigated'
                                        : 'discovered';

                            return (
                                <Marker
                                    key={point.id}
                                    longitude={point.lng}
                                    latitude={point.lat}
                                    anchor="center"
                                >
                                    <DetectiveMapPin
                                        point={point}
                                        state={markerState}
                                        isActive={activePointIds.has(point.id)}
                                        onClick={() => handlePointClick(point.id)}
                                    />
                                </Marker>
                            )
                        })}
                    </MapGL>
                </div>
            </div>

            {selectedPoint && (
                <CaseCard
                    point={selectedPoint}
                    actions={availableActions}
                    onExecute={handleExecuteAction}
                    worldClock={worldClock}
                    currentLocationId={currentLocationId}
                    locationAvailability={selectedAvailability}
                    isBusy={isTraveling}
                    onAlternativeApproach={handleAlternativeApproach}
                    onClose={() => {
                        setSelectedPointId(null);
                        setAvailableActions([]);
                    }}
                />
            )}

            <MerchantModal
                isOpen={isMerchantOpen}
                merchantId={activeMerchantId}
                onClose={closeMerchant}
            />
        </>
    );
};
