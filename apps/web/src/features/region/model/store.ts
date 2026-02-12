import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegionId } from '@repo/shared/data/regions';

export type RegionSelectionSource = 'manual' | 'qr' | 'route' | 'inferred';

export interface RegionBootstrapInput {
    activeCaseId: string | null;
    hasLegacyProgress: boolean;
}

export const inferRegionFromProgress = ({ activeCaseId, hasLegacyProgress }: RegionBootstrapInput): RegionId | null => {
    if (activeCaseId?.startsWith('sandbox_')) {
        return 'karlsruhe_default';
    }

    if (hasLegacyProgress) {
        return 'FREIBURG_1905';
    }

    return null;
};

interface RegionState {
    activeRegionId: RegionId | null;
    source: RegionSelectionSource | null;
    setActiveRegion: (regionId: RegionId, source: RegionSelectionSource) => void;
    clearActiveRegion: () => void;
}

export const useRegionStore = create<RegionState>()(
    persist(
        (set) => ({
            activeRegionId: null,
            source: null,
            setActiveRegion: (regionId, source) => set({
                activeRegionId: regionId,
                source
            }),
            clearActiveRegion: () => set({
                activeRegionId: null,
                source: null
            })
        }),
        {
            name: 'gw4-region-storage',
            version: 1
        }
    )
);
