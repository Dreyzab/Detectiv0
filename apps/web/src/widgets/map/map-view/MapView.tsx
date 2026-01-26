
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { NavigationControl, type MapRef, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useInventoryStore } from '@/entities/inventory/model/store';
import { REGIONS } from '@/shared/hexmap/regions';
import { DetectiveModeLayer } from './DetectiveModeLayer';
import { cn } from '@/shared/lib/utils';
import { useDossierStore } from '@/features/detective/dossier/store';
import { DETECTIVE_POINTS, type DetectivePoint } from '@/features/detective/points';
import { Dossier } from '@/features/detective/dossier/Dossier';
import { OnboardingModal } from '@/features/detective/onboarding/OnboardingModal';
import { resolveAvailableInteractions, type AvailableInteraction, type MapPointBinding } from '@repo/shared';
// import { InteractionWindow } from './InteractionWindow'; // Replaced by CaseCard
import { CaseCard } from './CaseCard';
import { DetectiveMapPin } from './DetectiveMapPin';
import { MapHUD } from '@/features/detective/ui/MapHUD';
// import { ThreadLayer } from './ThreadLayer'; // TODO: Update ThreadLayer to new types

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const INITIAL_REGION = REGIONS['FREIBURG_1905'];

export const MapView = () => {
    const mapRef = useRef<MapRef>(null);
    const navigate = useNavigate();
    const playerName = useInventoryStore((state) => state.playerName);
    const setPlayerName = useInventoryStore((state) => state.setPlayerName);
    const pointStates = useDossierStore((state) => state.pointStates);
    const flags = useDossierStore((state) => state.flags);
    // const activeCaseId = useDossierStore((state) => state.activeCaseId);

    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
    const [availableActions, setAvailableActions] = useState<AvailableInteraction[]>([]);

    // TODO: move inventory to a unified context
    const inventory = {};

    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const handlePointClick = (pointId: string) => {
        const point = DETECTIVE_POINTS[pointId];
        if (!point) return;

        // Legacy binding support shim (if points don't have new structure yet)
        const bindings = (point as { bindings?: MapPointBinding[] }).bindings || [];

        const options = resolveAvailableInteractions(
            bindings,
            'marker_click',
            { flags, pointStates, inventory }
        );

        setSelectedPointId(pointId);
        setAvailableActions(options);
    };

    const handleExecuteAction = (binding: MapPointBinding) => {
        console.log('Execute Action:', binding);
        // TODO: Implement execution logic (useMapActionHandler)
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

    const selectedPoint = selectedPointId ? DETECTIVE_POINTS[selectedPointId] : null;

    return (
        <>
            {!playerName && (
                <OnboardingModal
                    onComplete={(name) => setPlayerName(name)}
                    onCancel={() => navigate('/')}
                />
            )}
            {playerName && <Dossier />}
            {playerName && <MapHUD />}
            <div className={mapContainerClasses}>
                <div
                    className="absolute inset-0 pointer-events-none z-50 mix-blend-multiply opacity-15 bg-[#d4c5a3]"
                    style={{
                        backgroundImage: 'url("/images/paper-texture.png")',
                        backgroundSize: '200px'
                    }}
                />

                <div className={cn('absolute inset-0', isVintage && 'sepia-[.3] contrast-[1.05] brightness-95 saturate-[.9]')}>
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
                                {/* <ThreadLayer /> */}
                            </>
                        )}

                        {Object.values(DETECTIVE_POINTS).map((point) => {
                            // Using string literal types 'discovered' | 'locked'
                            const state = pointStates[point.id] ?? 'discovered';

                            // Pass state to pin, handle visibility there logic for hidden points


                            return (
                                <Marker
                                    key={point.id}
                                    longitude={point.lng}
                                    latitude={point.lat}
                                    anchor="center" // Changed to center for pin alignment
                                >
                                    <DetectiveMapPin
                                        point={point}
                                        state={state as 'discovered' | 'locked'}
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
                    point={selectedPoint as DetectivePoint}
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
