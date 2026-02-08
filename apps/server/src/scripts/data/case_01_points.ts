import type { MapPoint, MapPointCategory } from '@repo/shared';

// DetectivePoint extends MapPoint with detective-specific extensions
// 'type' is an alias for 'category' for backward compatibility
type DetectivePoint = Omit<MapPoint, 'category'> & {
    type: MapPointCategory | 'crime' | 'interest' | 'bureau' | 'support' | 'npc';
    image?: string;
    voices?: Partial<Record<string, string>>;
};

export const CASE_01_POINTS: Record<string, DetectivePoint> = {
    // --- CENTRAL DISTRICT ---
    'loc_hbf': {
        id: 'loc_hbf',
        title: 'Hauptbahnhof',
        description: 'The steam and steel gateway to Freiburg. Travelers from Basel and Strasbourg arrive here.',
        lat: 47.997791,
        lng: 7.842609,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'hbf_intro_once',
                trigger: 'marker_click',
                label: 'Arrive in Freiburg',
                priority: 30,
                conditions: [
                    { type: 'flag_is', flagId: 'arrived_at_hbf', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_hbf_arrival' }]
            }
        ],
        image: '/images/detective/loc_hauptbahnhof.png',
        voices: { logic: "Trains arriving on time. A system in motion." }
    },
    'loc_freiburg_bank': {
        id: 'loc_freiburg_bank',
        title: 'Bankhaus J.A. Krebs',
        description: 'The prestigious bank on Münsterplatz. Currently undergoing renovation by Architect Billing.',
        lat: 47.995574,
        lng: 7.852296,
        type: 'crime',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'bank_qr_gate',
                trigger: 'marker_click',
                label: 'Scan Entry Gate',
                priority: 30,
                conditions: [{ type: 'flag_is', flagId: 'qr_scanned_bank', value: false }],
                actions: [
                    { type: 'add_flags', flags: ['near_bank'] },
                    { type: 'start_vn', scenarioId: 'detective_case1_qr_scan_bank' }
                ]
            },
            {
                id: 'bank_enter_primary',
                trigger: 'marker_click',
                label: 'Primary Objective: Investigate the Bank',
                priority: 30,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'qr_scanned_bank', value: true },
                        { type: 'flag_is', flagId: 'priority_bank_first', value: true }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }]
            },
            {
                id: 'bank_enter_secondary',
                trigger: 'marker_click',
                label: 'Secondary Objective: Investigate the Bank',
                priority: 20,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'qr_scanned_bank', value: true },
                        { type: 'flag_is', flagId: 'priority_mayor_first', value: true }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }]
            },
            {
                id: 'bank_enter_fallback',
                trigger: 'marker_click',
                label: 'Investigate Crime Scene',
                priority: 15,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'qr_scanned_bank', value: true },
                        {
                            type: 'logic_not',
                            condition: { type: 'flag_is', flagId: 'priority_bank_first', value: true }
                        },
                        {
                            type: 'logic_not',
                            condition: { type: 'flag_is', flagId: 'priority_mayor_first', value: true }
                        }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }]
            },
            {
                id: 'bank_qr',
                trigger: 'qr_scan',
                label: 'Direct QR Entry',
                priority: 40,
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_bank_scene' }]
            }
        ],
        image: '/images/detective/loc_bankhaus.png',
        voices: { empathy: "The panic of the clerk still lingers in the air." }
    },
    'loc_munster': {
        id: 'loc_munster',
        title: 'Freiburg Münster',
        description: 'The towering gothic cathedral. Its spire dominates the skyline.',
        lat: 47.995500,
        lng: 7.852900,
        type: 'interest',
        packId: 'fbg1905',
        bindings: [],
        image: '/images/detective/loc_munster.png'
    },
    'loc_freiburg_archive': {
        id: 'loc_freiburg_archive',
        title: 'New Town Hall',
        description: 'Administrative center containing the City Archives.',
        lat: 47.996090,
        lng: 7.849500,
        type: 'bureau',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'archive_enter_primary',
                trigger: 'marker_click',
                label: 'Primary Objective: Build Archive Dossier',
                priority: 35,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'archive_casefile_complete', value: false },
                        { type: 'flag_is', flagId: 'tailor_lead_complete', value: true },
                        { type: 'flag_is', flagId: 'apothecary_lead_complete', value: true },
                        { type: 'flag_is', flagId: 'pub_lead_complete', value: true }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_archive_search' }]
            },
            {
                id: 'archive_enter_followup',
                trigger: 'marker_click',
                label: 'Consult Archives',
                priority: 24,
                conditions: [{ type: 'flag_is', flagId: 'archive_casefile_complete', value: false }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_archive_search' }]
            },
            {
                id: 'archive_review',
                trigger: 'marker_click',
                label: 'Review Archive Findings',
                priority: 14,
                conditions: [{ type: 'flag_is', flagId: 'archive_casefile_complete', value: true }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_archive_search' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.png'
    },
    'loc_rathaus': {
        id: 'loc_rathaus',
        title: 'Rathaus',
        description: 'The City Hall of Freiburg. Seat of power and location of Mayor Thoma\'s office.',
        lat: 47.99629692434917,
        lng: 7.8492596695028,
        type: 'bureau',
        packId: 'fbg1905',
        bindings: [
            {
                id: 'rathaus_intro_primary',
                trigger: 'marker_click',
                label: 'Primary Objective: Meet Mayor Thoma',
                priority: 32,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'clara_introduced', value: false },
                        { type: 'flag_is', flagId: 'priority_mayor_first', value: true }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_alt_briefing' }]
            },
            {
                id: 'rathaus_intro_secondary',
                trigger: 'marker_click',
                label: 'Secondary Objective: Meet Mayor Thoma',
                priority: 24,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'clara_introduced', value: false },
                        { type: 'flag_is', flagId: 'priority_bank_first', value: true }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_alt_briefing' }]
            },
            {
                id: 'rathaus_intro_fallback',
                trigger: 'marker_click',
                label: 'Visit Mayor Thoma',
                priority: 20,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'clara_introduced', value: false },
                        {
                            type: 'logic_not',
                            condition: { type: 'flag_is', flagId: 'priority_bank_first', value: true }
                        },
                        {
                            type: 'logic_not',
                            condition: { type: 'flag_is', flagId: 'priority_mayor_first', value: true }
                        }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_alt_briefing' }]
            },
            {
                id: 'rathaus_followup_primary',
                trigger: 'marker_click',
                label: 'Primary Objective: Rathaus Follow-up',
                priority: 22,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'clara_introduced', value: true },
                        { type: 'flag_is', flagId: 'priority_mayor_first', value: true },
                        { type: 'flag_is', flagId: 'mayor_followup_completed', value: false }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_mayor_followup' }]
            },
            {
                id: 'rathaus_followup_secondary',
                trigger: 'marker_click',
                label: 'Secondary Objective: Rathaus Follow-up',
                priority: 18,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'clara_introduced', value: true },
                        { type: 'flag_is', flagId: 'priority_bank_first', value: true },
                        { type: 'flag_is', flagId: 'mayor_followup_completed', value: false }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_mayor_followup' }]
            },
            {
                id: 'rathaus_followup_fallback',
                trigger: 'marker_click',
                label: 'Rathaus Follow-up',
                priority: 14,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'clara_introduced', value: true },
                        { type: 'flag_is', flagId: 'mayor_followup_completed', value: false },
                        {
                            type: 'logic_not',
                            condition: { type: 'flag_is', flagId: 'priority_bank_first', value: true }
                        },
                        {
                            type: 'logic_not',
                            condition: { type: 'flag_is', flagId: 'priority_mayor_first', value: true }
                        }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'detective_case1_mayor_followup' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.png',
        voices: { authority: "The heavy oak doors and stone corridors speak of centuries of local rule." }
    },

    // --- UNIVERSITY QUARTER ---
    'loc_uni_chem': {
        id: 'loc_uni_chem',
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
    'loc_uni_med': {
        id: 'loc_uni_med',
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
    'loc_student_house': {
        id: 'loc_student_house',
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
    'loc_pub_deutsche': {
        id: 'loc_pub_deutsche',
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
    'loc_red_light': {
        id: 'loc_red_light',
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
    'loc_freiburg_warehouse': {
        id: 'loc_freiburg_warehouse',
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
                conditions: [{ type: 'flag_is', flagId: 'archive_casefile_complete', value: true }],
                actions: [{ type: 'start_vn', scenarioId: 'case1_finale' }]
            }
        ],
        image: '/images/detective/loc_stuhlinger_warehouse.png'
    },
    'loc_workers_pub': {
        id: 'loc_workers_pub',
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
            },
            {
                id: 'workers_fence_trade',
                trigger: 'marker_click',
                label: 'Trade with The Fence',
                priority: 9,
                actions: [{ type: 'open_trade', shopId: 'the_fence' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.png'
    },

    // --- FILLERS ---
    'loc_martinstor': {
        id: 'loc_martinstor',
        title: 'Martinstor',
        lat: 47.993600, lng: 7.849000,
        type: 'interest', packId: 'fbg1905', bindings: [],
        description: 'Ancient city gate.',
        image: '/images/detective/loc_munster.png'
    },
    'loc_schwabentor': {
        id: 'loc_schwabentor',
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
            },
            {
                id: 'tailor_trade',
                trigger: 'marker_click',
                label: 'Order Tailoring',
                priority: 9,
                actions: [{ type: 'open_trade', shopId: 'tailor_shop' }]
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
            },
            {
                id: 'apothecary_trade',
                trigger: 'marker_click',
                label: 'Buy Remedies',
                priority: 9,
                actions: [{ type: 'open_trade', shopId: 'apothecary_shop' }]
            }
        ],
        image: '/images/detective/loc_apothecary.png',
        voices: { senses: "The scent of herbs and chemicals. A careful inventory." }
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
            },
            {
                id: 'pub_trade',
                trigger: 'marker_click',
                label: 'Order Food and Rumors',
                priority: 9,
                actions: [{ type: 'open_trade', shopId: 'pub_keeper' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.png',
        voices: { charisma: "Rough crowd. They won't talk to just anyone." }
    },

    // ─────────────────────────────────────────────────────────────
    // INTERLUDES (Unlocked sequentially)
    // ─────────────────────────────────────────────────────────────
    'loc_street_event': {
        id: 'loc_street_event',
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
    'loc_telephone': {
        id: 'loc_telephone',
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
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'lotte_interlude_complete', value: false },
                        {
                            type: 'logic_or',
                            conditions: [
                                {
                                    type: 'logic_and',
                                    conditions: [
                                        { type: 'flag_is', flagId: 'tailor_lead_complete', value: true },
                                        { type: 'flag_is', flagId: 'apothecary_lead_complete', value: true }
                                    ]
                                },
                                {
                                    type: 'logic_and',
                                    conditions: [
                                        { type: 'flag_is', flagId: 'tailor_lead_complete', value: true },
                                        { type: 'flag_is', flagId: 'pub_lead_complete', value: true }
                                    ]
                                },
                                {
                                    type: 'logic_and',
                                    conditions: [
                                        { type: 'flag_is', flagId: 'apothecary_lead_complete', value: true },
                                        { type: 'flag_is', flagId: 'pub_lead_complete', value: true }
                                    ]
                                }
                            ]
                        }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'interlude_lotte_warning' }]
            },
            {
                id: 'trigger_lotte_side_quest',
                trigger: 'marker_click',
                label: 'Meet Lotte at the Switchboard',
                priority: 90,
                conditions: [{
                    type: 'logic_and',
                    conditions: [
                        { type: 'flag_is', flagId: 'lotte_interlude_complete', value: true },
                        { type: 'flag_is', flagId: 'lotte_quest_available', value: true },
                        { type: 'flag_is', flagId: 'lotte_quest_complete', value: false }
                    ]
                }],
                actions: [{ type: 'start_vn', scenarioId: 'quest_lotte_wires' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.png'
    }
};
