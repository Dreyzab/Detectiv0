import { REGION_META } from '@repo/shared/data/regions';

export interface RegionConfig {
    id: string;
    name: string;
    geoCenterLat: number;
    geoCenterLng: number;
    zoom: number;
    vintageStyle?: boolean;
}

export const REGIONS: Record<string, RegionConfig> = Object.values(REGION_META).reduce<Record<string, RegionConfig>>(
    (acc, region) => {
        acc[region.id] = {
            id: region.id,
            name: region.name,
            geoCenterLat: region.geoCenterLat,
            geoCenterLng: region.geoCenterLng,
            zoom: region.zoom,
            vintageStyle: 'vintageStyle' in region ? region.vintageStyle : undefined
        };
        return acc;
    },
    {}
);
