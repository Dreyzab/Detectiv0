export const DEFAULT_REGION_RADIUS_KM = 10;
export const DEFAULT_REGION_ID = 'FREIBURG_1905' as const;

interface RegionMetaBase {
    id: string;
    name: string;
    packId: string;
    geoCenterLat: number;
    geoCenterLng: number;
    zoom: number;
    radiusKm: number;
    vintageStyle?: boolean;
}

export const REGION_META = {
    FREIBURG_1905: {
        id: 'FREIBURG_1905',
        name: 'Freiburg im Breisgau (1905)',
        packId: 'fbg1905',
        geoCenterLat: 47.9959,
        geoCenterLng: 7.8522,
        zoom: 14.5,
        radiusKm: DEFAULT_REGION_RADIUS_KM,
        vintageStyle: true
    },
    karlsruhe_default: {
        id: 'karlsruhe_default',
        name: 'Karlsruhe (Default)',
        packId: 'ka1905',
        geoCenterLat: 49.0069,
        geoCenterLng: 8.4037,
        zoom: 13,
        radiusKm: DEFAULT_REGION_RADIUS_KM
    }
} as const satisfies Record<string, RegionMetaBase>;

export type RegionId = keyof typeof REGION_META;
export type RegionMeta = (typeof REGION_META)[RegionId];

export const isRegionId = (value: string): value is RegionId =>
    Object.prototype.hasOwnProperty.call(REGION_META, value);

export const getRegionMeta = (regionId: RegionId): RegionMeta => REGION_META[regionId];

export const resolveRegionMeta = (regionId?: string | null): RegionMeta | null => {
    if (!regionId || !isRegionId(regionId)) {
        return null;
    }
    return REGION_META[regionId];
};

export const findRegionByPackId = (packId: string): RegionMeta | null =>
    Object.values(REGION_META).find((region) => region.packId === packId) ?? null;

export const getRegionByPackId = (packId?: string): RegionMeta => {
    if (!packId) {
        return REGION_META[DEFAULT_REGION_ID];
    }

    return findRegionByPackId(packId) ?? REGION_META[DEFAULT_REGION_ID];
};
