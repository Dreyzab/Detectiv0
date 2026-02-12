import { useEffect } from 'react';
import { useQuestEngine } from '@/features/quests/engine';
import { useDossierStore } from '@/features/detective/dossier/store';
import { inferRegionFromProgress, useRegionStore } from '@/features/region/model/store';

export const GameRuntime = () => {
    useQuestEngine();

    const activeRegionId = useRegionStore((state) => state.activeRegionId);
    const setActiveRegion = useRegionStore((state) => state.setActiveRegion);
    const activeCaseId = useDossierStore((state) => state.activeCaseId);
    const hasLegacyProgress = useDossierStore((state) => {
        if (state.entries.length > 0 || state.evidence.length > 0 || state.unlockedDeductions.length > 0) {
            return true;
        }
        if (Object.keys(state.pointStates).length > 0 || Object.keys(state.flags).length > 0 || Object.keys(state.checkStates).length > 0) {
            return true;
        }
        if (state.activeCaseId !== null) {
            return true;
        }
        if (state.xp > 0 || state.level > 1 || state.devPoints > 0 || state.traits.length > 0) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        if (activeRegionId) {
            return;
        }

        const inferred = inferRegionFromProgress({
            activeCaseId,
            hasLegacyProgress
        });

        if (inferred) {
            setActiveRegion(inferred, 'inferred');
        }
    }, [activeRegionId, activeCaseId, hasLegacyProgress, setActiveRegion]);

    return null;
};
