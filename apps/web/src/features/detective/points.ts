import type { MapPointBinding } from '@repo/shared';
import type { VoiceId } from './lib/parliament';

export type DetectivePointType = 'crime' | 'support' | 'bureau' | 'interest';

export interface DetectivePoint {
    id: string;
    title: string;
    description?: string;
    lat: number;
    lng: number;
    type: DetectivePointType;
    packId: string;
    bindings: MapPointBinding[];
    voices?: Partial<Record<VoiceId, string>>;
    image?: string;
}

export const DETECTIVE_POINTS: Record<string, DetectivePoint> = {
    // Freiburg Central Station
    'hauptbahnhof': {
        id: 'hauptbahnhof',
        title: 'Hauptbahnhof',
        description: 'The main railway gateway. A good place to watch arrivals.',
        lat: 47.997791,
        lng: 7.842609,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'bhf_look',
                label: 'Observe crowd',
                trigger: 'marker_click',
                priority: 10,
                // Changed from add_flags to set_flag based on type definition error
                actions: [{ type: 'set_flag', flagId: 'observer_novice', value: true } as { type: 'set_flag'; flagId: string; value: boolean }]
            }
        ],
        voices: {
            logic: "The schedule is precise. 14:05 train is late by 3 minutes. Inefficiency.",
            empathy: "So many goodbyes... tears soaking into the stone. Can you feel the longing?"
        },
        image: '/images/detective/loc_hauptbahnhof.png'
    },
    // Bankhaus on Münsterplatz
    'munsterplatz_bank': {
        id: 'munsterplatz_bank',
        title: 'Bankhaus J.A. Krebs',
        description: 'The scene of the crime.',
        lat: 47.995574,
        lng: 7.852296,
        type: 'crime',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'bank_investigate',
                label: 'Investigate Crime Scene',
                trigger: 'marker_click',
                priority: 20,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }]
            }
        ],
        voices: {
            logic: "Glass shattered outward. Entry was forced from inside? Unlikely.",
            empathy: "Greed leaves a metallic taste in the air. Or is that just blood?"
        },
        image: '/images/detective/loc_bankhaus.png'
    },
    // Ganter Brewery (Social Hub)
    'ganter_brauerei': {
        id: 'ganter_brauerei',
        title: 'Ganter Brauerei',
        description: 'A popular spot for workers. Rumors flow as freely as the beer.',
        lat: 47.990470,
        lng: 7.863150, // Towards Wiehre/Oberau
        type: 'support',
        packId: 'fbg1905',
        bindings: [],
        voices: {
            logic: "Yeast fermentation is active. CO2 levels high throughout the district.",
            empathy: "Hops and sweat. The honest perfume of the working class."
        },
        image: '/images/detective/loc_ganter_brauerei.png'
    },
    // City Archive (Rathaus)
    'rathaus_archiv': {
        id: 'rathaus_archiv',
        title: 'Stadtarchiv',
        description: 'City records and building plans.',
        lat: 47.996090,
        lng: 7.849500,
        type: 'bureau',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'archiv_enter',
                label: 'Search Archives',
                trigger: 'marker_click',
                priority: 10,
                // @ts-expect-error - condition type needs refinement in shared types
                condition: { type: 'flag_is', flag: 'has_permit', value: true },
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_archive_search' }]
            }
        ],
        voices: {
            logic: "Documentation identifies 43 structural violations in the last decade.",
            empathy: "History sleeps here, waiting for a kiss to wake it up. Or a fire."
        },
        image: '/images/detective/loc_rathaus_archiv.png'
    },
    // Stühlinger Warehouse (Finale)
    'stuhlinger_warehouse': {
        id: 'stuhlinger_warehouse',
        title: 'Old Warehouse',
        description: 'Abandoned storage near the tracks.',
        lat: 48.001000,
        lng: 7.838000, // West of tracks
        type: 'crime',
        packId: 'fbg1905',
        bindings: [],
        image: '/images/detective/loc_stuhlinger_warehouse.png'
    }
};

export const getPointsByPack = (packId: string): DetectivePoint[] => {
    return Object.values(DETECTIVE_POINTS).filter(p => p.packId === packId);
};
