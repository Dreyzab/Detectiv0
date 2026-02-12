import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventoryStore } from '@/entities/inventory/model/store';
import { useQuestStore } from '@/features/quests/store';
import { MapView } from '@/widgets/map/map-view/MapView';
import { Dossier } from '@/features/detective/dossier/Dossier';
import { OnboardingModal } from '@/features/detective/onboarding/OnboardingModal';
import { PACK_META, getPackMeta } from '@repo/shared/data/pack-meta';
import { useRegionStore } from '@/features/region/model/store';

/**
 * Detective Map Page
 * Composes the MapView widget with detective-specific overlays:
 * - Dossier panel
 * - Onboarding modal for new players
 */
export const DetectiveMapPage = () => {
    const { packId: routePackId } = useParams<{ packId?: string }>();
    const navigate = useNavigate();
    const playerName = useInventoryStore((state) => state.playerName);
    const setPlayerName = useInventoryStore((state) => state.setPlayerName);
    const setQuestStage = useQuestStore((state) => state.setQuestStage);
    const activeRegionId = useRegionStore((state) => state.activeRegionId);
    const setActiveRegion = useRegionStore((state) => state.setActiveRegion);

    useEffect(() => {
        if (!routePackId) {
            return;
        }

        const isKnownPack = Object.prototype.hasOwnProperty.call(PACK_META, routePackId);
        if (!isKnownPack) {
            navigate('/', { replace: true });
            return;
        }

        const routePackMeta = getPackMeta(routePackId);
        setActiveRegion(routePackMeta.regionId, 'route');
    }, [routePackId, navigate, setActiveRegion]);

    useEffect(() => {
        if (routePackId) {
            return;
        }

        if (!activeRegionId) {
            navigate('/', { replace: true });
        }
    }, [routePackId, activeRegionId, navigate]);

    return (
        <>
            {!playerName && (
                <OnboardingModal
                    onComplete={(name) => {
                        setPlayerName(name);
                        // Trigger opening scene by advancing quest
                        if (activeRegionId !== 'karlsruhe_default') {
                            setQuestStage('case01', 'briefing');
                        }
                    }}
                    onCancel={() => navigate('/')}
                />
            )}
            <Dossier />
            <MapView />
        </>
    );
};
