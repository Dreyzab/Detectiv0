import { useNavigate } from 'react-router-dom';
import { useInventoryStore } from '@/entities/inventory/model/store';
import { useQuestStore } from '@/features/quests/store';
import { MapView } from '@/widgets/map/map-view/MapView';
import { Dossier } from '@/features/detective/dossier/Dossier';
import { OnboardingModal } from '@/features/detective/onboarding/OnboardingModal';

/**
 * Detective Map Page
 * Composes the MapView widget with detective-specific overlays:
 * - Dossier panel
 * - Onboarding modal for new players
 */
export const DetectiveMapPage = () => {
    const navigate = useNavigate();
    const playerName = useInventoryStore((state) => state.playerName);
    const setPlayerName = useInventoryStore((state) => state.setPlayerName);
    const setQuestStage = useQuestStore((state) => state.setQuestStage);

    return (
        <>
            {!playerName && (
                <OnboardingModal
                    onComplete={(name) => {
                        setPlayerName(name);
                        // Trigger opening scene by advancing quest
                        setQuestStage('case01', 'briefing');
                    }}
                    onCancel={() => navigate('/')}
                />
            )}
            <Dossier />
            <MapView />
        </>
    );
};
