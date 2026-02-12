import { getRegionByPackId, type RegionId } from './regions';

export interface PackMeta {
    packId: string;
    label: string;
    regionId: RegionId;
    tooltipSetId: string;
    defaultCaseId: string;
    mapStyle?: string;
}

export const DEFAULT_PACK_ID = 'fbg1905';
export const DEFAULT_MAPBOX_STYLE = 'mapbox://styles/inoti/cmktqmmks002s01pa3f3gfpll';

export const PACK_META: Record<string, PackMeta> = {
    fbg1905: {
        packId: 'fbg1905',
        label: 'Freiburg 1905',
        regionId: getRegionByPackId('fbg1905').id,
        tooltipSetId: 'fbg1905',
        defaultCaseId: 'case_01_bank',
        mapStyle: DEFAULT_MAPBOX_STYLE
    },
    ka1905: {
        packId: 'ka1905',
        label: 'Karlsruhe 1905',
        regionId: getRegionByPackId('ka1905').id,
        tooltipSetId: 'ka1905',
        defaultCaseId: 'sandbox_karlsruhe'
    }
};

export const getPackMeta = (packId?: string): PackMeta =>
    PACK_META[packId ?? DEFAULT_PACK_ID] ?? PACK_META[DEFAULT_PACK_ID];
