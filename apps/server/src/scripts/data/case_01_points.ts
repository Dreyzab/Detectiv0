import type { MapPoint, MapPointCategory } from '@repo/shared';

// DetectivePoint extends MapPoint with detective-specific extensions
// 'type' is an alias for 'category' for backward compatibility
type DetectivePoint = Omit<MapPoint, 'category'> & {
    type: MapPointCategory | 'crime' | 'interest' | 'bureau' | 'support' | 'npc';
    image?: string;
    voices?: Partial<Record<string, string>>;
};

// Helper to create bindings easily
const vn = (scenarioId: string, label: string) => ({
    id: `vn_${Math.random().toString(36).substr(2, 5)}`,
    trigger: 'marker_click' as const,
    label,
    priority: 10,
    actions: [{ type: 'start_vn' as const, scenarioId }]
});

export const CASE_01_POINTS: Record<string, DetectivePoint> = {
    // --- CENTRAL DISTRICT ---
    'p_hbf': {
        id: 'p_hbf',
        title: 'Hauptbahnhof',
        description: 'The steam and steel gateway to Freiburg. Travelers from Basel and Strasbourg arrive here.',
        lat: 47.997791,
        lng: 7.842609,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [vn('intro_arrival', 'Look around')],
        image: '/images/detective/loc_hauptbahnhof.png',
        voices: { logic: "Trains arriving on time. A system in motion." }
    },
    'p_bank': {
        id: 'p_bank',
        title: 'Bankhaus J.A. Krebs',
        description: 'The prestigious bank on Münsterplatz. Currently undergoing renovation by Architect Billing.',
        lat: 47.995574,
        lng: 7.852296,
        type: 'crime',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'bank_enter',
                trigger: 'marker_click',
                label: 'Investigate Crime Scene',
                priority: 20,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }]
            },
            {
                id: 'bank_qr',
                trigger: 'qr_scan', // Hypothetical physical trigger
                label: 'Scan Evidence',
                priority: 30,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_hidden_clue' }]
            }
        ],
        image: '/images/detective/loc_bankhaus.png',
        voices: { empathy: "The panic of the clerk still lingers in the air." }
    },
    'p_munster': {
        id: 'p_munster',
        title: 'Freiburg Münster',
        description: 'The towering gothic cathedral. Its spire dominates the skyline.',
        lat: 47.995500,
        lng: 7.852900,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [],
        image: '/images/detective/loc_munster.png'
    },
    'p_rathaus': {
        id: 'p_rathaus',
        title: 'New Town Hall',
        description: 'Administrative center containing the City Archives.',
        lat: 47.996090,
        lng: 7.849500,
        type: 'bureau',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'archive_enter',
                trigger: 'marker_click',
                label: 'Consult Archives',
                priority: 10,
                // Critical path: accessible? Maybe gated by knowing about it.
                // Anti-softlock: Always open, but context changes if we have clues.
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_archive_search' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.png'
    },

    // --- UNIVERSITY QUARTER ---
    'p_uni_chem': {
        id: 'p_uni_chem',
        title: 'Kiliani Laboratory',
        description: 'Prof. Kiliani\'s chemistry lab. Smells of sulfur and almonds.',
        lat: 47.994000,
        lng: 7.846000,
        type: 'bureau', // Changed from quest
        packId: 'fbg1905',
        bindings: [
            {
                id: 'chem_analyze',
                trigger: 'marker_click',
                label: 'Request Analysis',
                priority: 10,
                conditions: [{ type: 'flag_is', flagId: 'has_strange_residue', value: true }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_lab_analysis' }]
            }
        ],
        image: '/images/detective/loc_uni.png'
    },
    'p_uni_med': {
        id: 'p_uni_med',
        title: 'Institute of Hygiene',
        description: 'Dr. Uhlenhuth\'s domain. Cutting edge forensic serology.',
        lat: 47.993500,
        lng: 7.847000,
        type: 'bureau', // Changed from quest
        packId: 'fbg1905',
        bindings: [
            {
                id: 'blood_analyze',
                trigger: 'marker_click',
                label: 'Analyze Blood Sample',
                priority: 10,
                conditions: [{ type: 'flag_is', flagId: 'has_blood_sample', value: true }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_blood_analysis' }]
            }
        ],
        image: '/images/detective/loc_uni.png'
    },
    'p_student_house': {
        id: 'p_student_house',
        title: 'Corps Suevia House',
        description: 'Fraternity house. Making noise even at this hour.',
        lat: 47.990000,
        lng: 7.848000,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'corps_visit',
                trigger: 'marker_click',
                label: 'Question Students',
                priority: 10,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_corps_interview' }]
            }
        ],
        image: '/images/detective/loc_student_house.png'
    },

    // --- SCHNECKENVORSTADT ---
    'p_pub_deutsche': {
        id: 'p_pub_deutsche',
        title: 'Zum Deutschen Haus',
        description: 'A labyrinthine inn popular with locals and travelers.',
        lat: 47.992000,
        lng: 7.854000,
        type: 'support',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'pub_gossip',
                trigger: 'marker_click',
                label: 'Listen for Rumors',
                priority: 10,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_pub_gossip' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.png'
    },
    'p_red_light': {
        id: 'p_red_light',
        title: 'Gerberau Canal',
        description: 'The tanners\' quarter. Shadows run deep here.',
        lat: 47.993000,
        lng: 7.851000,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [],
        image: '/images/detective/loc_suburbs.png'
    },

    // --- STÜHLINGER ---
    'p_goods_station': {
        id: 'p_goods_station',
        title: 'Old Warehouse',
        description: 'Güterbahnhof storage. Dark, quiet, and smelling of coal.',
        lat: 48.001000,
        lng: 7.838000,
        type: 'crime',
        packId: 'fbg1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'raid_start',
                trigger: 'marker_click',
                label: 'Inspect Warehouse',
                priority: 100,
                // conditions: [{ type: 'flag_is', flagId: 'knows_warehouse_location', value: true }], // handled by unlock
                actions: [{ type: 'start_vn', scenarioId: 'case1_finale' }]
            }
        ],
        image: '/images/detective/loc_stuhlinger_warehouse.png'
    },
    'p_workers_pub': {
        id: 'p_workers_pub',
        title: 'Tavern "The Red Cog"',
        description: 'Meeting place for editors of the Volkswacht.',
        lat: 47.999000,
        lng: 7.839000,
        type: 'support',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'quest_victoria_entry',
                trigger: 'marker_click',
                label: 'Enter with Victoria',
                priority: 20, // Higher priority than normal talk
                conditions: [{ type: 'flag_is', flagId: 'victoria_quest_active', value: true }],
                actions: [{ type: 'start_vn', scenarioId: 'quest_victoria_poetry' }]
            },
            {
                id: 'socialist_talk',
                trigger: 'marker_click',
                label: 'Talk to Workers',
                priority: 10,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_socialist_talk' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.png'
    },

    // --- FILLERS ---
    'p_martinstor': {
        id: 'p_martinstor',
        title: 'Martinstor',
        lat: 47.993600, lng: 7.849000,
        type: 'interest', packId: 'fbg1905', bindings: [],
        description: 'Ancient city gate.',
        image: '/images/detective/loc_munster.png'
    },
    'p_schwabentor': {
        id: 'p_schwabentor',
        title: 'Schwabentor',
        lat: 47.992800, lng: 7.854500,
        type: 'interest', packId: 'fbg1905', bindings: [],
        description: 'Ancient city gate with the Boy with the Thorn.',
        image: '/images/detective/loc_munster.png'
    },

    // ─────────────────────────────────────────────────────────────
    // INVESTIGATION LEADS (Unlocked after Bank)
    // ─────────────────────────────────────────────────────────────
    'loc_tailor': {
        id: 'loc_tailor',
        title: 'Schneider\'s Workshop',
        description: 'Leopold Fein\'s tailoring shop. Specializes in theatrical costumes and disguises.',
        lat: 47.9935,
        lng: 7.8525,
        type: 'npc',
        packId: 'fbg1905',
        isHiddenInitially: true, // Hidden until unlocked by bank_conclusion
        bindings: [
            {
                id: 'tailor_enter',
                trigger: 'marker_click',
                label: 'Enter Workshop',
                priority: 10,
                actions: [{ type: 'start_vn', scenarioId: 'lead_tailor' }]
            }
        ],
        image: '/images/detective/loc_tailor.png',
        voices: { perception: "Fabric samples everywhere. A man who notices details." }
    },
    'loc_apothecary': {
        id: 'loc_apothecary',
        title: 'Löwen-Apotheke',
        description: 'Adalbert Weiss\'s pharmacy near the Münster. Remedies for any ailment... and other things.',
        lat: 47.9952,
        lng: 7.8535,
        type: 'npc',
        packId: 'fbg1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'apothecary_enter',
                trigger: 'marker_click',
                label: 'Enter Apotheke',
                priority: 10,
                actions: [{ type: 'start_vn', scenarioId: 'lead_apothecary' }]
            }
        ],
        image: '/images/detective/loc_apothecary.png',
        voices: { forensics: "The scent of herbs and chemicals. A careful inventory." }
    },
    'loc_pub': {
        id: 'loc_pub',
        title: 'Gasthaus "Zum Schlappen"',
        description: 'Working-class tavern near Martinstor. Where the Bächleputzer drinks.',
        lat: 47.9938,
        lng: 7.8495,
        type: 'npc',
        packId: 'fbg1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'pub_enter',
                trigger: 'marker_click',
                label: 'Enter Tavern',
                priority: 10,
                actions: [{ type: 'start_vn', scenarioId: 'lead_pub' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.png',
        voices: { charisma: "Rough crowd. They won't talk to just anyone." }
    },

    // ─────────────────────────────────────────────────────────────
    // INTERLUDES (Unlocked sequentially)
    // ─────────────────────────────────────────────────────────────
    'p_street_event': {
        id: 'p_street_event',
        title: 'Street Encounter',
        description: 'A commotion on the street.',
        lat: 47.9945,
        lng: 7.8505,
        type: 'interest',
        packId: 'fbg1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'trigger_interlude_a',
                trigger: 'marker_click',
                label: 'Investigate Commotion',
                priority: 100,
                actions: [{ type: 'start_vn', scenarioId: 'interlude_victoria_street' }]
            }
        ],
        image: '/images/detective/loc_streets.png'
    },
    'p_telephone': {
        id: 'p_telephone',
        title: 'Telegraph Office',
        description: 'A message is waiting for you.',
        lat: 47.9965,
        lng: 7.8485,
        type: 'bureau',
        packId: 'fbg1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'trigger_interlude_b',
                trigger: 'marker_click',
                label: 'Answer Call',
                priority: 100,
                actions: [{ type: 'start_vn', scenarioId: 'interlude_lotte_warning' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.png'
    }
};
