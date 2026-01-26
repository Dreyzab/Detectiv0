export interface RegionConfig {
    id: string;
    name: string;
    geoCenterLat: number;
    geoCenterLng: number;
    zoom: number;
    vintageStyle?: boolean;
}

export const REGIONS: Record<string, RegionConfig> = {
    // Existing/Placeholder
    'karlsruhe_default': {
        id: 'karlsruhe_default',
        name: 'Karlsruhe (Default)',
        geoCenterLat: 49.0069,
        geoCenterLng: 8.4037,
        zoom: 13
    },
    // New Detective Region
    'FREIBURG_1905': {
        id: 'FREIBURG_1905',
        name: 'Freiburg im Breisgau (1905)',
        geoCenterLat: 47.9959, // Münsterplatz center
        geoCenterLng: 7.8522,
        zoom: 14.5,
        vintageStyle: true
    }
};
