import type { MapPoint, MapPointCategory } from '@repo/shared';

/**
 * Karlsruhe Sandbox Map Points (15 locations)
 * Pack: ka1905
 * 
 * GPS coordinates: real Karlsruhe landmarks
 */

type DetectivePoint = Omit<MapPoint, 'category'> & {
    type: MapPointCategory | 'crime' | 'interest' | 'bureau' | 'support' | 'npc';
    image?: string;
    voices?: Partial<Record<string, string>>;
};

export const SANDBOX_KA_POINTS: Record<string, DetectivePoint> = {
    // ── DETECTIVE AGENCY ──────────────────────────────────
    'loc_ka_agency': {
        id: 'loc_ka_agency',
        title: 'Detektei Karlsruhe',
        description: 'Your newly established detective agency in a modest Altstadt office. The brass plate still smells of polish.',
        lat: 49.0092,
        lng: 8.4039,
        type: 'bureau',
        packId: 'ka1905',
        bindings: [
            {
                id: 'ka_agency_intro',
                trigger: 'marker_click',
                label: 'Enter Agency',
                priority: 30,
                conditions: [
                    { type: 'flag_is', flagId: 'ka_sandbox_started', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_intro' }]
            },
            {
                id: 'ka_agency_return',
                trigger: 'marker_click',
                label: 'Review Cases',
                priority: 10,
                conditions: [
                    { type: 'flag_is', flagId: 'ka_sandbox_started', value: true }
                ],
                actions: [{ type: 'show_toast', message: 'Check the map for active cases.', variant: 'info' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.webp'
    },

    // ── BANKER'S SON CASE ─────────────────────────────────
    'loc_ka_bank': {
        id: 'loc_ka_bank',
        title: 'Badische Handelsbank',
        description: 'A stately banking institution on Kaiserstraße. Herr Richter, the director, has requested your help.',
        lat: 49.0094,
        lng: 8.3966,
        type: 'npc',
        packId: 'ka1905',
        isHiddenInitially: true,
        unlockGroup: 'ka_intro_hubs',
        bindings: [
            {
                id: 'ka_bank_client',
                trigger: 'marker_click',
                label: 'Meet Herr Richter',
                priority: 20,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_BANKER', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_banker_client' }]
            }
        ],
        image: '/images/detective/loc_bankhaus.webp'
    },

    'loc_ka_son_house': {
        id: 'loc_ka_son_house',
        title: 'Richter Villa',
        description: 'The Richter family residence. The son Friedrich lives in the east wing.',
        lat: 49.0118,
        lng: 8.3998,
        type: 'npc',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_son_visit',
                trigger: 'marker_click',
                label: 'Investigate Friedrich',
                priority: 20,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_BANKER', value: true },
                    { type: 'flag_is', flagId: 'BANKER_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_banker_son_house' }]
            }
        ],
        image: '/images/detective/loc_student_house.webp'
    },

    'loc_ka_tavern': {
        id: 'loc_ka_tavern',
        title: 'Gasthaus zur Krone',
        description: 'A bustling tavern near the Marktplatz. Friedrich Richter was last seen here.',
        lat: 49.0086,
        lng: 8.4043,
        type: 'npc',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_tavern_gossip',
                trigger: 'marker_click',
                label: 'Ask about Friedrich',
                priority: 20,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_BANKER', value: true },
                    { type: 'flag_is', flagId: 'BANKER_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_banker_tavern' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.webp'
    },

    'loc_ka_casino': {
        id: 'loc_ka_casino',
        title: 'Casino am Schloss',
        description: 'A discreet gambling establishment near the Schloss. Entry by reputation only.',
        lat: 49.0134,
        lng: 8.4044,
        type: 'crime',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_casino_duel',
                trigger: 'marker_click',
                label: 'Confront Friedrich',
                priority: 30,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_BANKER', value: true },
                    { type: 'flag_is', flagId: 'TAVERN_GOSSIP', value: true },
                    { type: 'flag_is', flagId: 'BANKER_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_banker_casino' }]
            }
        ],
        image: '/images/detective/loc_suburbs.webp'
    },

    // ── MAYOR'S DOG CASE ──────────────────────────────────
    'loc_ka_rathaus': {
        id: 'loc_ka_rathaus',
        title: 'Rathaus Karlsruhe',
        description: 'The city hall. Mayor Pfeiffer is embarrassed about a personal matter.',
        lat: 49.0086,
        lng: 8.3978,
        type: 'bureau',
        packId: 'ka1905',
        isHiddenInitially: true,
        unlockGroup: 'ka_intro_hubs',
        bindings: [
            {
                id: 'ka_rathaus_dog',
                trigger: 'marker_click',
                label: 'Meet Mayor Pfeiffer',
                priority: 20,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_MAYOR', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_dog_mayor' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.webp'
    },

    'loc_ka_platz': {
        id: 'loc_ka_platz',
        title: 'Marktplatz',
        description: 'The central market square. Vendors hawk wares among gaslight and cobblestones.',
        lat: 49.0092,
        lng: 8.4037,
        type: 'interest',
        packId: 'ka1905',
        bindings: [
            {
                id: 'ka_platz_dog_sighting',
                trigger: 'marker_click',
                label: 'Ask vendors about the dog',
                priority: 20,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_MAYOR', value: true },
                    { type: 'flag_is', flagId: 'DOG_VENDOR_CLUE', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'set_flag', flagId: 'DOG_VENDOR_CLUE', value: true },
                    { type: 'grant_evidence', evidenceId: 'ev_dog_vendor_tip' },
                    { type: 'unlock_group', groupId: 'ka_dog_open_leads' },
                    {
                        type: 'show_toast',
                        message: 'Vendors saw Bruno circling sausage stands and vanishing into side streets.',
                        variant: 'info'
                    }
                ]
            },
            {
                id: 'ka_platz_dog_repeat',
                trigger: 'marker_click',
                label: 'Re-check vendor chatter',
                priority: 5,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_VENDOR_CLUE', value: true },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    {
                        type: 'show_toast',
                        message: 'The crowd repeats three leads: butcher lane, old stables, and the river docks.',
                        variant: 'info'
                    }
                ]
            }
        ]
    },

    'loc_ka_butcher': {
        id: 'loc_ka_butcher',
        title: 'Metzgerei Kraus',
        description: 'Traditional butcher shop. The smell of smoked sausages is overwhelming.',
        lat: 49.0082,
        lng: 8.4025,
        type: 'npc',
        packId: 'ka1905',
        isHiddenInitially: true,
        unlockGroup: 'ka_dog_open_leads',
        bindings: [
            {
                id: 'ka_butcher_dog',
                trigger: 'marker_click',
                label: 'Question the butcher',
                priority: 20,
                conditions: [
                    { type: 'flag_is', flagId: 'TALKED_MAYOR', value: true },
                    { type: 'flag_is', flagId: 'DOG_VENDOR_CLUE', value: true },
                    { type: 'flag_is', flagId: 'DOG_BUTCHER_CLUE', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_dog_butcher' }]
            }
        ],
        image: '/images/detective/loc_ganter_brauerei.webp'
    },

    'loc_ka_stables': {
        id: 'loc_ka_stables',
        title: 'Alte Stallungen',
        description: 'Old municipal stables with hay lofts and delivery carts.',
        lat: 49.0106,
        lng: 8.3948,
        type: 'interest',
        packId: 'ka1905',
        isHiddenInitially: true,
        unlockGroup: 'ka_dog_open_leads',
        bindings: [
            {
                id: 'ka_stables_false_lead',
                trigger: 'marker_click',
                label: 'Inspect hay carts',
                priority: 16,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_VENDOR_CLUE', value: true },
                    { type: 'flag_is', flagId: 'DOG_FALSE_STABLES_DONE', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'set_flag', flagId: 'DOG_FALSE_STABLES_DONE', value: true },
                    { type: 'grant_evidence', evidenceId: 'ev_dog_hay_fur' },
                    { type: 'unlock_point', pointId: 'loc_ka_service_lane' },
                    {
                        type: 'show_toast',
                        message: 'You find coarse fur in hay bales. A stable hand mentions a heavy dog passing through.',
                        variant: 'warning'
                    }
                ]
            },
            {
                id: 'ka_stables_revisit',
                trigger: 'marker_click',
                label: 'Re-check stables',
                priority: 4,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_FALSE_STABLES_DONE', value: true },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'show_toast', message: 'No fresh canine traces. The stable lead feels stale.', variant: 'info' }
                ]
            }
        ]
    },

    'loc_ka_river_docks': {
        id: 'loc_ka_river_docks',
        title: 'Rheinhafen Docks',
        description: 'Cargo carts, fish barrels, and muddy tracks along the river edge.',
        lat: 49.0049,
        lng: 8.3884,
        type: 'interest',
        packId: 'ka1905',
        isHiddenInitially: true,
        unlockGroup: 'ka_dog_open_leads',
        bindings: [
            {
                id: 'ka_docks_false_lead',
                trigger: 'marker_click',
                label: 'Follow dockside prints',
                priority: 16,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_VENDOR_CLUE', value: true },
                    { type: 'flag_is', flagId: 'DOG_FALSE_DOCKS_DONE', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'set_flag', flagId: 'DOG_FALSE_DOCKS_DONE', value: true },
                    { type: 'grant_evidence', evidenceId: 'ev_dog_river_prints' },
                    { type: 'unlock_point', pointId: 'loc_ka_service_lane' },
                    {
                        type: 'show_toast',
                        message: 'Paw prints run toward the docks, then break near a fish cart.',
                        variant: 'warning'
                    }
                ]
            },
            {
                id: 'ka_docks_revisit',
                trigger: 'marker_click',
                label: 'Re-check riverbank',
                priority: 4,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_FALSE_DOCKS_DONE', value: true },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'show_toast', message: 'The tide erased most traces. Nothing new at the docks.', variant: 'info' }
                ]
            }
        ]
    },

    'loc_ka_service_lane': {
        id: 'loc_ka_service_lane',
        title: 'Service Alley',
        description: 'A narrow alley behind laundries and baker delivery doors.',
        lat: 49.0088,
        lng: 8.4011,
        type: 'interest',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_service_lane_followup',
                trigger: 'marker_click',
                label: 'Cross-check side-lane traces',
                priority: 17,
                conditions: [
                    {
                        type: 'logic_or',
                        conditions: [
                            { type: 'flag_is', flagId: 'DOG_FALSE_STABLES_DONE', value: true },
                            { type: 'flag_is', flagId: 'DOG_FALSE_DOCKS_DONE', value: true }
                        ]
                    },
                    { type: 'flag_is', flagId: 'DOG_FALSE_SERVICE_DONE', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'set_flag', flagId: 'DOG_FALSE_SERVICE_DONE', value: true },
                    { type: 'grant_evidence', evidenceId: 'ev_dog_laundry_thread' },
                    { type: 'unlock_point', pointId: 'loc_ka_bakery' },
                    {
                        type: 'show_toast',
                        message: 'Laundry fibers carry bakery flour. False leads converge back to bakery lane.',
                        variant: 'success'
                    }
                ]
            },
            {
                id: 'ka_service_lane_revisit',
                trigger: 'marker_click',
                label: 'Re-check service alley',
                priority: 4,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_FALSE_SERVICE_DONE', value: true },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [
                    { type: 'show_toast', message: 'Only delivery wagons now. Bruno has moved on.', variant: 'info' }
                ]
            }
        ]
    },

    'loc_ka_bakery': {
        id: 'loc_ka_bakery',
        title: 'Bäckerei Sonnenschein',
        description: 'A beloved bakery. The owner has a soft spot for animals.',
        lat: 49.0075,
        lng: 8.4050,
        type: 'npc',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_bakery_dog',
                trigger: 'marker_click',
                label: 'Follow the trail',
                priority: 20,
                conditions: [
                    {
                        type: 'logic_or',
                        conditions: [
                            { type: 'flag_is', flagId: 'DOG_BUTCHER_CLUE', value: true },
                            { type: 'flag_is', flagId: 'DOG_FALSE_SERVICE_DONE', value: true }
                        ]
                    },
                    { type: 'flag_is', flagId: 'DOG_BAKERY_CLUE', value: false },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_dog_bakery' }]
            }
        ],
        image: '/images/detective/loc_uni.webp'
    },

    'loc_ka_park': {
        id: 'loc_ka_park',
        title: 'Schlossgarten',
        description: 'The palace gardens. Quiet paths and old oaks. A large dog is reportedly napping here.',
        lat: 49.0128,
        lng: 8.4010,
        type: 'interest',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_park_find_dog',
                trigger: 'marker_click',
                label: 'Find Bruno',
                priority: 30,
                conditions: [
                    { type: 'flag_is', flagId: 'DOG_BAKERY_CLUE', value: true },
                    { type: 'flag_is', flagId: 'DOG_CASE_DONE', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_dog_park' }]
            }
        ],
        image: '/images/detective/loc_suburbs.webp'
    },

    // ── HAUNTED ESTATE CASE ───────────────────────────────
    'loc_ka_estate': {
        id: 'loc_ka_estate',
        title: 'Anwesen Schwarzwald',
        description: 'An old estate on the outskirts. Strange occurrences reported. Cold drafts and spectral lights.',
        lat: 49.0145,
        lng: 8.4085,
        type: 'crime',
        packId: 'ka1905',
        isHiddenInitially: true,
        unlockGroup: 'ka_intro_hubs',
        bindings: [
            {
                id: 'ka_estate_investigate',
                trigger: 'marker_click',
                label: 'Investigate the Estate',
                priority: 30,
                conditions: [
                    { type: 'flag_is', flagId: 'GHOST_CLIENT_MET', value: true },
                    { type: 'flag_is', flagId: 'ESTATE_INVESTIGATED', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_ghost_investigate' }]
            },
            {
                id: 'ka_estate_conclude',
                trigger: 'marker_click',
                label: 'Present Conclusions',
                priority: 25,
                conditions: [
                    { type: 'flag_is', flagId: 'ESTATE_INVESTIGATED', value: true },
                    { type: 'flag_is', flagId: 'GHOST_ACCUSED', value: false },
                    { type: 'flag_is', flagId: 'GUILD_VISITED', value: true }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_ghost_conclude' }]
            }
        ],
        image: '/images/detective/loc_stuhlinger_warehouse.webp'
    },

    'loc_ka_guild': {
        id: 'loc_ka_guild',
        title: 'Gilde der Ermittler',
        description: 'The regional Investigators Guild. A seasoned Guild Master offers guidance and advanced techniques.',
        lat: 49.0068,
        lng: 8.3955,
        type: 'bureau',
        packId: 'ka1905',
        isHiddenInitially: true,
        bindings: [
            {
                id: 'ka_guild_first_visit',
                trigger: 'marker_click',
                label: 'Meet the Guild Master',
                priority: 30,
                conditions: [
                    { type: 'flag_is', flagId: 'ESTATE_INVESTIGATED', value: true },
                    { type: 'flag_is', flagId: 'GUILD_VISITED', value: false }
                ],
                actions: [{ type: 'start_vn', scenarioId: 'sandbox_ghost_guild' }]
            }
        ],
        image: '/images/detective/loc_rathaus_archiv.webp'
    }
};
