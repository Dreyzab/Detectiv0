import { useMapPointsStore } from '../data/mapPointsStore';

export const resolveUnlockGroupPointIds = (groupId: string, packId?: string): string[] => {
    const normalizedGroupId = groupId.trim();
    if (!normalizedGroupId) {
        return [];
    }

    const points = useMapPointsStore.getState().getPoints();
    return points
        .filter((point) =>
            point.unlockGroup === normalizedGroupId &&
            (packId ? point.packId === packId : true)
        )
        .map((point) => point.id);
};
