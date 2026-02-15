/**
 * Character Registry — Single Source of Truth
 * Used by Visual Novel engine for speaker identification
 */

import type { VoiceId } from './parliament';


export type CharacterId =
    | 'inspector'
    | 'gendarm'
    | 'bank_manager'
    | 'clerk'
    | 'worker'
    | 'socialist'
    | 'mayor'
    | 'assistant'
    | 'operator'
    // P1: New Characters
    | 'coroner'
    | 'journalist'
    | 'clara_altenburg'

    // P2: Future Characters
    | 'professor'
    | 'student'
    | 'cleaner'
    | 'dancer'
    // Service NPCs
    | 'apothecary'
    | 'blacksmith'
    | 'tailor'
    | 'innkeeper'
    | 'pawnbroker'
    | 'priest'
    | 'librarian'
    | 'stationmaster'
    // Antagonists
    | 'boss'
    | 'enforcer'
    | 'smuggler'
    | 'corrupt_cop'
    | 'forger'
    | 'femme_fatale'
    | 'mastermind'
    | 'corps_student'
    | 'saccharin_maud'
    | 'narrator'
    | 'paperboy'
    | 'faction_underground'
    | 'unknown';

export type CharacterTier = 'major' | 'functional' | 'generic';

interface BaseCharacter {
    id: CharacterId;
    name: string;
    tier: CharacterTier;
    avatarUrl?: string; // Optional for all, but major/functional usually have one
    color?: string;     // UI color for dialogue name
    age?: number;
    origin?: string;
    description?: string;
    tags?: string[];
}

/**
 * Interrogation profile — per-NPC tension parameters.
 * Sweet spot = optimal tension range where progress ticks.
 */
export interface InterrogationProfile {
    sweetSpotMin: number;        // e.g. 35
    sweetSpotMax: number;        // e.g. 65
    vulnerableVoice?: VoiceId;   // high player stat widens sweet spot
    resistantVoice?: VoiceId;    // low player handling narrows sweet spot
    lockoutThreshold?: number;   // default 100
    progressRequired: number;    // ticks needed for Interrogation Point
}

// Tier 1: Major Characters (Protagonists, Companions, Main Villains)
// Fully realized individuals with stats (Voices) and potential evolution.
export type DetectiveOrigin = 'veteran' | 'journalist' | 'academic' | 'noble';

export interface MajorCharacter extends BaseCharacter {
    tier: 'major';
    role: 'protagonist' | 'antagonist' | 'companion' | 'key_npc';
    voiceStats?: Partial<Record<string, number>>; // 1-20 scale (Logic, Empathy, etc.)
    secrets?: string[]; // Hidden info unlocked via Dossier
    interrogation?: InterrogationProfile;
    evolution?: {
        stage: string; // e.g., 'cynic' | 'idealist'
        possibleStages: string[];
    };
}

export interface DetectiveCharacter extends MajorCharacter {
    role: 'protagonist';
    possibleOrigins: DetectiveOrigin[];
    originStats: Record<DetectiveOrigin, Partial<Record<string, number>>>;
}

// Tier 2: Functional Characters (Merchants, Quest Givers)
// Defined by their role in the city and service they provide.
export interface FunctionalCharacter extends BaseCharacter {
    tier: 'functional';
    role: 'merchant' | 'service' | 'witness';
    locationId?: string; // Map point where they can usually be found
    serviceType?: string; // e.g., 'shop', 'info', 'craft'
    interrogation?: InterrogationProfile;
}

// Tier 3: Generic Characters (The Crowd)
// Archetypes sharing assets.
export interface GenericCharacter extends BaseCharacter {
    tier: 'generic';
    role: 'npc' | 'mob' | 'obstacle';
    archetypeId: string; // e.g. 'police_officer', 'worker_railway'
}

export type VNCharacter = DetectiveCharacter | MajorCharacter | FunctionalCharacter | GenericCharacter;

export const CHARACTERS: Record<CharacterId, VNCharacter> = {
    // ----------------------------------------------------
    // TIER 1: MAJOR CHARACTERS
    // ----------------------------------------------------
    inspector: {
        id: 'inspector',
        tier: 'major',
        name: 'Arthur Vance',
        color: '#d4c5a3',
        role: 'protagonist',
        possibleOrigins: ['veteran', 'journalist', 'academic', 'noble'],
        originStats: {
            veteran: { endurance: 4, authority: 3, perception: 2 },
            journalist: { shivers: 4, rhetoric: 3, empathy: 2 },
            academic: { logic: 4, encyclopaedia: 3, volition: 2 },
            noble: { suggestion: 4, volition: 3, drama: 2 }
        },
        age: 32,
        origin: 'Berlin',
        description: 'A private investigator operating in the grey zones of Freiburg. Hired to solve the bank robbery.',
        avatarUrl: '/images/characters/inspector.webp',
        // Base stats (before origin modifiers)
        voiceStats: { logic: 2, volition: 2, empathy: 2 }
    },
    assistant: {
        id: 'assistant',
        tier: 'major',
        name: 'Victoria Sterling',
        color: '#8b5cf6',
        role: 'companion',
        age: 23,
        origin: 'University of Freiburg',
        description: '"The Woman in the Iron Lab Coat". A chemistry student driven by the mysterious death of her fiancé. Combines scientific genius with buried rage.',
        avatarUrl: '/images/characters/assistant.webp',
        tags: ['companion', 'senses', 'chemistry', 'vengeful'],
        voiceStats: { logic: 6, senses: 8, authority: 4 },
        secrets: [
            'Fiancé was murdered over a Saccharin synthesis formula',
            'Has access to restricted University lab chemicals',
            'Is secretly auditing medical faculty autopsy lectures'
        ],
        evolution: {
            stage: 'vengeful_widow',
            possibleStages: ['vengeful_widow', 'cold_case_expert', 'vigilante']
        }
    },
    operator: {
        id: 'operator',
        tier: 'major',
        name: 'Lotte Fischer',
        color: '#f59e0b',
        role: 'companion',
        age: 24,
        origin: 'Freiburg (Police HQ)',
        description: '"The Spider in the Wire". Uses her position as switchboard operator to trade secrets and protect her family.',
        avatarUrl: '/images/characters/operator.webp',
        tags: ['companion', 'information', 'broker'],
        voiceStats: { encyclopaedia: 6, perception: 5, suggestion: 4 },
        secrets: [
            'Records police and city official conversations',
            'Paying off brother\'s gambling debts to Kessler',
            'Knows the true status of the Mayor\'s secret accounts'
        ]
    },
    bank_manager: {
        id: 'bank_manager',
        tier: 'major',
        name: 'Heinrich Galdermann',
        color: '#ef4444',
        role: 'antagonist',
        age: 55,
        origin: 'Freiburg',
        description: '"The Architect of Greed". A portly pillar of society hiding a massive embezzlement scheme.',
        avatarUrl: '/images/characters/bank_manager.webp',
        tags: ['client', 'antagonist', 'corrupt'],
        voiceStats: { authority: 8, logic: 6, rhetoric: 7 },
        secrets: [
            'The vault was empty before the robbery',
            'Embezzled funds to build the Stadttheater',
            'Terrified of the Journalist Anna Mahler'
        ],
        interrogation: {
            sweetSpotMin: 50,
            sweetSpotMax: 75,
            vulnerableVoice: 'logic',
            resistantVoice: 'authority',
            progressRequired: 5
        }
    },
    boss: {
        id: 'boss',
        tier: 'major',
        name: 'Bruno Kessler',
        color: '#1e293b',
        role: 'antagonist',
        age: 50,
        origin: 'Schneckenvorstadt (Brewery Tunnels)',
        description: '"The King of the Tunnels". Controls the illicit Saccharin trade. Desperate for social legitimacy.',
        avatarUrl: '/images/characters/boss.webp',
        tags: ['underworld', 'antagonist', 'crime_lord'],
        secrets: [
            'Wants to buy his way into the City Council',
            'Robbery is actually bad for his business',
            'Saccharin is smuggled via Höllentalbahn'
        ]
    },
    mayor: {
        id: 'mayor',
        tier: 'major',
        name: 'Otto Winterer II',
        color: '#9333ea',
        role: 'key_npc',
        age: 58,
        origin: 'Freiburg (Zentrumspartei)',
        description: 'Victoria\'s father. Trying to hold the city together. Wants the robbery solved quietly.',
        avatarUrl: '/images/characters/mayor.webp',
        tags: ['politician', 'obstructor']
    },
    corrupt_cop: {
        id: 'corrupt_cop',
        tier: 'major',
        name: 'Kommissar Dietrich Richter',
        color: '#1e1b4b',
        role: 'antagonist',
        age: 52,
        origin: 'Police HQ',
        description: 'A decorated officer who sold his soul piece by piece. Uses the law to protect the lawless.',
        tags: ['police', 'corrupt', 'authority']
    },
    femme_fatale: {
        id: 'femme_fatale',
        tier: 'major',
        name: 'Elise von Schwarzwald',
        color: '#be123c',
        role: 'antagonist',
        age: 28,
        description: 'A chameleon. Today a countess, tomorrow a beggar. She wants chaos, and perhaps, revenge.',
        tags: ['manipulator', 'spy']
    },
    mastermind: {
        id: 'mastermind',
        tier: 'major',
        name: '???',
        color: '#000000',
        role: 'antagonist',
        description: 'The puppeteer pulling the strings. Only a shadow on the wall.',
        tags: ['unknown', 'boss', 'secret']
    },

    // ----------------------------------------------------
    // TIER 2: FUNCTIONAL CHARACTERS (MERCHANTS / SERVICES)
    // ----------------------------------------------------
    clerk: {
        id: 'clerk',
        tier: 'functional',
        name: 'Ernst Vogel',
        color: '#6b7280',
        role: 'witness',
        age: 28,
        origin: 'Freiburg',
        description: 'Junior clerk at Bankhaus Krebs. Nervous, meticulous. Was on night duty during the robbery. Knows more than he dares to say.',
        avatarUrl: '/images/characters/clerk.webp',
        tags: ['witness', 'bank', 'scared'],
        locationId: 'bank_krebs',
        interrogation: {
            sweetSpotMin: 20,
            sweetSpotMax: 45,
            vulnerableVoice: 'empathy',
            resistantVoice: 'authority',
            progressRequired: 3
        }
    },
    coroner: {
        id: 'coroner',
        tier: 'functional',
        name: 'Dr. Ernst Schiller',
        color: '#64748b',
        role: 'service',
        age: 48,
        origin: 'Prussia (War Veteran)',
        description: 'Former military surgeon obsessed with Bertillonage. Dismisses fingerprints as "French nonsense". Hates Victoria Sterling.',
        avatarUrl: '/images/characters/coroner.webp',
        tags: ['senses', 'bertillonage', 'obstructionist'],
        serviceType: 'autopsy'
    },
    journalist: {
        id: 'journalist',
        tier: 'functional',
        name: 'Anna Mahler',
        color: '#ec4899',
        role: 'service',
        age: 30,
        origin: 'Vienna → Freiburg',
        description: 'Cynical reporter seeking the "Big Scoop". Wants to expose the hypocrisy of the Freiburg elite.',
        avatarUrl: '/images/characters/journalist.webp',
        tags: ['information', 'wildcard', 'press'],
        serviceType: 'information_broker'
    },
    clara_altenburg: {
        id: 'clara_altenburg',
        tier: 'major',
        name: 'Clara von Altenburg',
        color: '#b8860b', // Dark golden brown
        role: 'companion',
        age: 26,
        origin: 'Freiburg (Bürgermeisterfamilie)',
        description: 'Tochter des Bürgermeisters, verwitwete Medizinstudentin. Eine scharfe Beobachterin mit Faszination für Kriminologie, angetrieben vom ungelösten Tod ihres Mannes.',
        avatarUrl: '/images/characters/clara_altenburg.webp',
        tags: ['companion', 'criminology', 'medicine', 'widow', 'nobility'],
        voiceStats: { empathy: 6, perception: 7, logic: 5, tradition: 4 },
        secrets: [
            'Ihr Mann starb unter mysteriösen Umständen',
            'Sie hat Zugang zu den privaten Akten ihres Vaters',
            'Studiert heimlich Forensik an der Universität'
        ],
        evolution: {
            stage: 'determined_widow',
            possibleStages: ['determined_widow', 'trusted_partner', 'romantic_interest']
        }
    },

    apothecary: {
        id: 'apothecary',
        tier: 'functional',
        name: 'Herr Adalbert Weiss',
        color: '#22c55e',
        role: 'merchant',
        age: 52,
        origin: 'Altstadt',
        description: 'Runs the Löwen-Apotheke. Nervous fence for chemical goods (ether/alcohol) used by smugglers.',
        avatarUrl: '/images/characters/apothecary.webp',
        tags: ['merchant', 'medicine', 'fence', 'scared'],
        locationId: 'loewen_apotheke',
        serviceType: 'pharmacy'
    },
    blacksmith: {
        id: 'blacksmith',
        tier: 'functional',
        name: 'Ignaz Hammer',
        color: '#78350f',
        role: 'merchant',
        age: 45,
        origin: 'Stühlinger',
        description: 'Industrial mechanic ("Schlosser"). Works on locomotive parts. Can pick any lock and fix any machine.',
        avatarUrl: '/images/characters/blacksmith.webp',
        tags: ['merchant', 'mechanic', 'locksmith'],
        serviceType: 'locksmith'
    },
    tailor: {
        id: 'tailor',
        tier: 'functional',
        name: 'Herr Leopold Fein',
        color: '#7c3aed',
        role: 'merchant',
        age: 48,
        origin: 'Vienna → Freiburg',
        description: 'Jewish tailor. Creates disguises for theater... or other purposes. Discretion guaranteed.',
        avatarUrl: '/images/characters/tailor.webp',
        tags: ['merchant', 'clothing', 'disguise'],
        serviceType: 'tailor'
    },
    innkeeper: {
        id: 'innkeeper',
        tier: 'functional',
        name: 'Frau Helga Brandt',
        color: '#ca8a04',
        role: 'merchant',
        age: 55,
        origin: 'Schneckenvorstadt',
        description: 'Runs Zum Goldenen Hirschen. Hears every rumor. Rents rooms, no questions asked.',
        avatarUrl: '/images/characters/innkeeper.webp',
        tags: ['merchant', 'information', 'lodging'],
        serviceType: 'inn'
    },
    pawnbroker: {
        id: 'pawnbroker',
        tier: 'functional',
        name: 'Moritz Silber',
        color: '#71717a',
        role: 'merchant',
        age: 60,
        origin: 'Schneckenvorstadt',
        description: 'Runs a pawnshop. Buys anything, sells everything. Knows the value of secrets.',
        avatarUrl: '/images/characters/pawnbroker.webp',
        tags: ['merchant', 'fence', 'evidence'],
        serviceType: 'pawnshop'
    },
    priest: {
        id: 'priest',
        tier: 'functional',
        name: 'Pater Johannes Kreuzer',
        color: '#1d4ed8',
        role: 'service',
        age: 65,
        origin: 'Münsterplatz',
        description: 'Catholic priest at the Freiburg Münster. Hears confessions. Knows sins.',
        avatarUrl: '/images/characters/priest.webp',
        tags: ['information', 'sanctuary', 'church'],
        serviceType: 'confessional'
    },
    librarian: {
        id: 'librarian',
        tier: 'functional',
        name: 'Dr. Margarethe Voss',
        color: '#0891b2',
        role: 'service',
        age: 42,
        origin: 'University of Freiburg',
        description: 'Spinster librarian. Has access to restricted archives. Loves puzzles and mysteries.',
        avatarUrl: '/images/characters/librarian.webp',
        tags: ['research', 'archives', 'academic'],
        serviceType: 'archives'
    },
    stationmaster: {
        id: 'stationmaster',
        tier: 'functional',
        name: 'Herr Wilhelm Gleisner',
        color: '#334155',
        role: 'service',
        age: 50,
        origin: 'Hauptbahnhof',
        description: 'Controls the Freiburg Hauptbahnhof. Knows who comes and goes. Höllentalbahn runs on his schedule.',
        avatarUrl: '/images/characters/stationmaster.webp',
        tags: ['transport', 'information', 'travel'],
        serviceType: 'transport'
    },
    enforcer: {
        id: 'enforcer',
        tier: 'functional',
        name: 'Viktor "Die Kralle" Brandt',
        color: '#b91c1c',
        role: 'service', // Functional in the sense of being a 'boss battle' or 'guard'
        age: 38,
        origin: 'Alsace (Ex-Legionnaire)',
        description: 'Kessler\'s right hand. A scarred brute with a twisted code of honor. Prefers a knife to a gun.',
        avatarUrl: '/images/characters/enforcer.webp',
        tags: ['muscle', 'violence', 'loyal'],
        serviceType: 'mercenary' // Stretch, but fits structure
    },
    smuggler: {
        id: 'smuggler',
        tier: 'functional',
        name: '"Der Fuchs" (Hans Lehmann)',
        color: '#d97706',
        role: 'merchant',
        age: 29,
        origin: 'Höllentalbahn',
        description: 'Charming, slippery, and runs the saccharin smuggling route. Impossible to catch, easy to bribe.',
        avatarUrl: '/images/characters/smuggler.webp',
        tags: ['contraband', 'transport', 'charming'],
        serviceType: 'smuggler'
    },
    forger: {
        id: 'forger',
        tier: 'functional',
        name: '"Herr Tinte" (Friedrich Schwarz)',
        color: '#4c1d95',
        role: 'service',
        age: 62,
        origin: 'Attic in Stühlinger',
        description: 'An artist who failed at life but succeeded at lies. Can create any document, for a price.',
        tags: ['criminal', 'utility', 'documents'],
        serviceType: 'forgery'
    },
    professor: {
        id: 'professor',
        tier: 'functional',
        name: 'Prof. Heinrich Kiliani',
        color: '#0ea5e9',
        role: 'service',
        age: 55,
        origin: 'University of Freiburg',
        description: 'Medical chemist. Expert on poisons, sugars, and explosives. Can analyze nitroglycerin residue.',
        tags: ['senses', 'academic'],
        serviceType: 'expert_analysis'
    },

    // ----------------------------------------------------
    // TIER 3: GENERIC CHARACTERS (ARCHETYPES / MOBS)
    // ----------------------------------------------------
    gendarm: {
        id: 'gendarm',
        tier: 'generic',
        name: 'Fritz Müller',
        color: '#3b82f6',
        role: 'npc',
        age: 35,
        origin: 'Freiburg',
        description: 'Schutzmann in a Pickelhaube helmet. Represents the visible arm of the law. Follows orders without question.',
        avatarUrl: '/images/characters/gendarm.webp',
        tags: ['police', 'obstacle'],
        archetypeId: 'schutzmann_01'
    },
    worker: {
        id: 'worker',
        tier: 'generic',
        name: 'Hans Bauer',
        color: '#16a34a',
        role: 'npc',
        age: 42,
        origin: 'Stühlinger',
        description: 'Construction worker from the Haus Kapferer renovation. Knows the scaffolding access.',
        avatarUrl: '/images/characters/worker.webp',
        tags: ['witness', 'labor'],
        archetypeId: 'worker_01'
    },
    socialist: {
        id: 'socialist',
        tier: 'generic',
        name: 'Karl Brenner',
        color: '#dc2626',
        role: 'npc',
        age: 40,
        origin: 'Stühlinger',
        description: 'Union organizer. Writes for Volkswacht. Blamed for every crime by conservatives.',
        avatarUrl: '/images/characters/socialist.webp',
        tags: ['suspect', 'informant', 'red_herring'],
        archetypeId: 'socialist_agitator'
    },
    student: {
        id: 'student',
        tier: 'generic',
        name: 'Friedrich von Holtz',
        color: '#a855f7',
        role: 'npc',
        age: 23,
        origin: 'Corps Suevia',
        description: 'Privileged Corps student with gambling debts. Recently participated in a Mensur duel.',
        tags: ['suspect', 'corps'],
        archetypeId: 'student_corps'
    },
    cleaner: {
        id: 'cleaner',
        tier: 'generic',
        name: 'Old Gustav',
        color: '#78716c',
        role: 'npc',
        age: 60,
        origin: 'Freiburg (Bächle)',
        description: 'Bächleputzer. Finds everything the city washes away. Valuable source of discarded evidence.',
        tags: ['witness', 'invisible', 'evidence_retrieval'],
        archetypeId: 'baechle_cleaner'
    },
    corps_student: {
        id: 'corps_student',
        tier: 'generic',
        name: 'Friedrich',
        color: '#facc15',
        role: 'npc',
        age: 21,
        origin: 'Corps Suevia',
        description: 'Arrogant student in a yellow cap. Demands duels and blocks paths of "commoners".',
        tags: ['obstacle', 'elite'],
        archetypeId: 'corps_student_01'
    },
    saccharin_maud: {
        id: 'saccharin_maud',
        tier: 'generic',
        name: 'Saccharin-Maud',
        color: '#d1d5db',
        role: 'npc',
        age: 40,
        origin: 'Underworld',
        description: 'Underworld courier with bulky skirts hiding contraband powder.',
        tags: ['smuggler', 'informant'],
        archetypeId: 'saccharin_courier'
    },
    dancer: {
        id: 'dancer',
        tier: 'generic',
        name: 'Marlene Vogt',
        color: '#f472b6',
        role: 'npc',
        age: 26,
        description: 'Cabaret star from Schneckenvorstadt. Sees who meets whom in the dark.',
        tags: ['nightlife', 'witness'],
        archetypeId: 'cabaret_dancer'
    },
    unknown: {
        id: 'unknown',
        tier: 'generic',
        name: '???',
        color: '#a8a29e',
        role: 'npc',
        archetypeId: 'mystery_figure'
    },
    narrator: {
        id: 'narrator',
        tier: 'generic',
        name: 'Narrator',
        color: '#a8a29e',
        role: 'npc',
        archetypeId: 'narrator_voice'
    },
    paperboy: {
        id: 'paperboy',
        tier: 'generic',
        name: 'Newsboy',
        color: '#d4d4d8',
        role: 'npc',
        description: 'A sharp-eyed kid selling papers.',
        archetypeId: 'paperboy_01'
    },
    faction_underground: {
        id: 'faction_underground',
        tier: 'functional',
        name: 'The Underground',
        color: '#dc2626',
        role: 'service',
        description: 'The revolutionary current beneath the city.',
        tags: ['faction']
    }
};

export const getCharacter = (id: CharacterId): VNCharacter => CHARACTERS[id];

export const getCharactersByTier = (tier: CharacterTier): VNCharacter[] => {
    return Object.values(CHARACTERS).filter(char => char.tier === tier);
};
