import { create } from 'zustand';
import type { MapPoint } from '@repo/shared';

interface MapPointsStoreState {
    pointsById: Record<string, MapPoint>;
    upsertPoints: (points: MapPoint[]) => void;
    getPoints: () => MapPoint[];
}

export const useMapPointsStore = create<MapPointsStoreState>((set, get) => ({
    pointsById: {},
    upsertPoints: (points) => {
        if (points.length === 0) {
            return;
        }

        set((state) => {
            const next = { ...state.pointsById };
            points.forEach((point) => {
                next[point.id] = point;
            });
            return { pointsById: next };
        });
    },
    getPoints: () => Object.values(get().pointsById)
}));
