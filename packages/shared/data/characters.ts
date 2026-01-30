/**
 * Character Registry — Single Source of Truth
 * Used by Visual Novel engine for speaker identification
 */

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
    // P2: Future Characters
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
    | 'unknown';

export interface VNCharacter {
    id: CharacterId;
    name: string;
    avatarUrl?: string;
    color?: string;
    role?: 'protagonist' | 'antagonist' | 'companion' | 'npc';
    age?: number;
    origin?: string;
    description?: string;
    tags?: string[];
}

export const CHARACTERS: Record<CharacterId, VNCharacter> = {
    // Legacy ID: inspector -> The Detective (Player)
    inspector: {
        id: 'inspector',
        name: 'Arthur Vance',
        color: '#d4c5a3',
        role: 'protagonist',
        age: 32,
        origin: 'Berlin',
        description: 'A war veteran seeking a quiet life, pulled back into the darkness.',
        avatarUrl: '/images/characters/inspector.png'
    },
    // P0: Fleshed Out Existing
    gendarm: {
        id: 'gendarm',
        name: 'Fritz Müller',
        color: '#3b82f6',
        role: 'npc',
        age: 35,
        origin: 'Freiburg',
        description: 'One of 73 officers for all of Freiburg. Follows orders without question. Not evil, just limited.',
        avatarUrl: '/images/characters/gendarm.png',
        tags: ['police', 'obstacle']
    },
    worker: {
        id: 'worker',
        name: 'Hans Bauer',
        color: '#16a34a',
        role: 'npc',
        age: 42,
        origin: 'Stühlinger',
        description: 'Construction worker from the Haus Kapferer renovation. Knows about the scaffolding access.',
        avatarUrl: '/images/characters/worker.png',
        tags: ['witness', 'labor']
    },
    socialist: {
        id: 'socialist',
        name: 'Karl Brenner',
        color: '#dc2626',
        role: 'npc',
        age: 40,
        origin: 'Stühlinger',
        description: 'Union organizer. Writes for Volkswacht. Blamed for every crime by conservatives.',
        avatarUrl: '/images/characters/socialist.png',
        tags: ['suspect', 'informant', 'red_herring']
    },
    mayor: {
        id: 'mayor',
        name: 'Otto Winterer II',
        color: '#9333ea',
        role: 'npc',
        age: 58,
        origin: 'Freiburg (Zentrumspartei)',
        description: 'Victoria\'s father. Trying to hold the city together. Wants the robbery solved quietly.',
        avatarUrl: '/images/characters/mayor.png',
        tags: ['politician', 'obstructor']
    },

    // Core Characters (Fully Defined)
    bank_manager: {
        id: 'bank_manager',
        name: 'Heinrich Galdermann',
        color: '#ef4444',
        role: 'antagonist',
        age: 55,
        origin: 'Freiburg',
        description: 'The town\'s financial pillar. Ruthless, calculative, and dangerously polite.',
        avatarUrl: '/images/characters/bank_manager.png',
        tags: ['banker', 'antagonist']
    },
    clerk: {
        id: 'clerk',
        name: 'Ernst Vogel',
        color: '#6b7280',
        role: 'npc',
        age: 28,
        origin: 'Freiburg',
        description: 'Junior clerk at Bankhaus Krebs. Nervous, meticulous. Was on night duty during the robbery. Knows more than he dares to say.',
        avatarUrl: '/images/characters/clerk.png',
        tags: ['witness', 'bank', 'scared']
    },
    assistant: {
        id: 'assistant',
        name: 'Victoria Sterling',
        color: '#8b5cf6',
        role: 'companion',
        age: 27,
        origin: 'Local (Mayor\'s Daughter)',
        description: 'Sharp-tongued, aristocratic, and determined to solve her husband\'s murder.',
        avatarUrl: '/images/characters/assistant.png',
        tags: ['companion', 'detective']
    },
    operator: {
        id: 'operator',
        name: 'Lotte Fischer',
        color: '#f59e0b',
        role: 'companion',
        age: 24,
        origin: 'Freiburg',
        description: 'The Police Commissioner\'s daughter and switchboard operator. The eyes and ears of the city.',
        avatarUrl: '/images/characters/operator.png',
        tags: ['companion', 'information']
    },

    // P1: New Core Characters
    coroner: {
        id: 'coroner',
        name: 'Dr. Ernst Schiller',
        color: '#64748b',
        role: 'npc',
        age: 48,
        origin: 'Prussia (War Veteran)',
        description: 'Former military surgeon. Prefers the dead — they don\'t scream. Master of Bertillonage.',
        avatarUrl: '/images/characters/coroner.png',
        tags: ['forensics', 'ally']
    },
    journalist: {
        id: 'journalist',
        name: 'Anna Mahler',
        color: '#ec4899',
        role: 'npc',
        age: 30,
        origin: 'Vienna → Freiburg',
        description: 'Cynical reporter for Freiburger Zeitung. Knows everyone\'s dirt. Trades scoops for secrets.',
        avatarUrl: '/images/characters/journalist.png',
        tags: ['information', 'wildcard']
    },

    // P2: Future Characters (Stubs)
    dancer: {
        id: 'dancer',
        name: 'Marlene Vogt',
        color: '#f472b6',
        role: 'npc',
        age: 26,
        description: 'Cabaret star from Schneckenvorstadt. Sees who meets whom in the dark.',
        tags: ['nightlife', 'witness']
    },

    professor: {
        id: 'professor',
        name: 'Prof. Heinrich Kiliani',
        color: '#0ea5e9',
        role: 'npc',
        age: 55,
        origin: 'University of Freiburg',
        description: 'Medical chemist. Expert on poisons, sugars, and explosives. Can analyze nitroglycerin residue.',
        tags: ['forensics', 'academic']
    },
    student: {
        id: 'student',
        name: 'Friedrich von Holtz',
        color: '#a855f7',
        role: 'npc',
        age: 23,
        origin: 'Corps Suevia',
        description: 'Privileged Corps student with gambling debts. Recently participated in a Mensur duel.',
        tags: ['suspect', 'corps']
    },
    cleaner: {
        id: 'cleaner',
        name: 'Old Gustav',
        color: '#78716c',
        role: 'npc',
        age: 60,
        origin: 'Freiburg (Altstadt)',
        description: 'Bächleputzer. Cleans the city water channels from dawn. Sees everything. People ignore him.',
        tags: ['witness', 'invisible']
    },

    // Service NPCs
    apothecary: {
        id: 'apothecary',
        name: 'Herr Adalbert Weiss',
        color: '#22c55e',
        role: 'npc',
        age: 52,
        origin: 'Altstadt',
        description: 'Runs the Löwen-Apotheke near the Münster. Sells remedies... and discreetly, other things.',
        avatarUrl: '/images/characters/apothecary.png',
        tags: ['merchant', 'medicine', 'poison']
    },
    blacksmith: {
        id: 'blacksmith',
        name: 'Ignaz Hammer',
        color: '#78350f',
        role: 'npc',
        age: 45,
        origin: 'Stühlinger',
        description: 'Master smith and locksmith. Can fix anything. Knows every lock in Freiburg.',
        avatarUrl: '/images/characters/blacksmith.png',
        tags: ['merchant', 'tools', 'repair']
    },
    tailor: {
        id: 'tailor',
        name: 'Herr Leopold Fein',
        color: '#7c3aed',
        role: 'npc',
        age: 48,
        origin: 'Vienna → Freiburg',
        description: 'Jewish tailor. Creates disguises for theater... or other purposes. Discretion guaranteed.',
        avatarUrl: '/images/characters/tailor.png',
        tags: ['merchant', 'clothing', 'disguise']
    },
    innkeeper: {
        id: 'innkeeper',
        name: 'Frau Helga Brandt',
        color: '#ca8a04',
        role: 'npc',
        age: 55,
        origin: 'Schneckenvorstadt',
        description: 'Runs Zum Goldenen Hirschen. Hears every rumor. Rents rooms, no questions asked.',
        avatarUrl: '/images/characters/innkeeper.png',
        tags: ['merchant', 'information', 'lodging']
    },
    pawnbroker: {
        id: 'pawnbroker',
        name: 'Moritz Silber',
        color: '#71717a',
        role: 'npc',
        age: 60,
        origin: 'Schneckenvorstadt',
        description: 'Runs a pawnshop. Buys anything, sells everything. Knows the value of secrets.',
        avatarUrl: '/images/characters/pawnbroker.png',
        tags: ['merchant', 'fence', 'evidence']
    },
    priest: {
        id: 'priest',
        name: 'Pater Johannes Kreuzer',
        color: '#1d4ed8',
        role: 'npc',
        age: 65,
        origin: 'Münsterplatz',
        description: 'Catholic priest at the Freiburg Münster. Hears confessions. Knows sins.',
        avatarUrl: '/images/characters/priest.png',
        tags: ['information', 'sanctuary', 'church']
    },
    librarian: {
        id: 'librarian',
        name: 'Dr. Margarethe Voss',
        color: '#0891b2',
        role: 'npc',
        age: 42,
        origin: 'University of Freiburg',
        description: 'Spinster librarian. Has access to restricted archives. Loves puzzles and mysteries.',
        avatarUrl: '/images/characters/librarian.png',
        tags: ['research', 'archives', 'academic']
    },
    stationmaster: {
        id: 'stationmaster',
        name: 'Herr Wilhelm Gleisner',
        color: '#334155',
        role: 'npc',
        age: 50,
        origin: 'Hauptbahnhof',
        description: 'Controls the Freiburg Hauptbahnhof. Knows who comes and goes. Höllentalbahn runs on his schedule.',
        avatarUrl: '/images/characters/stationmaster.png',
        tags: ['transport', 'information', 'travel']
    },

    // Antagonists & Villains
    boss: {
        id: 'boss',
        name: 'Bruno Kessler',
        color: '#1e293b',
        role: 'antagonist',
        age: 50,
        origin: 'Schneckenvorstadt (Underworld)',
        description: '"Der Schatten". The undisputed king of the Freiburg black market. Ruthless, pragmatic, and invisible.',
        avatarUrl: '/images/characters/boss.png',
        tags: ['underworld', 'antagonist', 'crime_lord']
    },
    enforcer: {
        id: 'enforcer',
        name: 'Viktor "Die Kralle" Brandt',
        color: '#b91c1c', // dark red
        role: 'antagonist',
        age: 38,
        origin: 'Alsace (Ex-Legionnaire)',
        description: 'Kessler\'s right hand. A scarred brute with a twisted code of honor. Prefers a knife to a gun.',
        avatarUrl: '/images/characters/enforcer.png',
        tags: ['muscle', 'violence', 'loyal']
    },
    smuggler: {
        id: 'smuggler',
        name: '"Der Fuchs" (Hans Lehmann)',
        color: '#d97706', // amber
        role: 'antagonist',
        age: 29,
        origin: 'Höllentalbahn',
        description: 'Charming, slippery, and runs the saccharin smuggling route. Impossible to catch, easy to bribe.',
        avatarUrl: '/images/characters/smuggler.png',
        tags: ['contraband', 'transport', 'charming']
    },
    corrupt_cop: {
        id: 'corrupt_cop',
        name: 'Kommissar Dietrich Richter',
        color: '#1e1b4b', // deeply dark blue
        role: 'antagonist',
        age: 52,
        origin: 'Police HQ',
        description: 'A decorated officer who sold his soul piece by piece. Uses the law to protect the lawless.',
        tags: ['police', 'corrupt', 'authority']
    },
    forger: {
        id: 'forger',
        name: '"Herr Tinte" (Friedrich Schwarz)',
        color: '#4c1d95', // violet
        role: 'npc', // Not purely antagonist, utilitarian
        age: 62,
        origin: 'Attic in Stühlinger',
        description: 'An artist who failed at life but succeeded at lies. Can create any document, for a price.',
        tags: ['criminal', 'utility', 'documents']
    },
    femme_fatale: {
        id: 'femme_fatale',
        name: 'Elise von Schwarzwald',
        color: '#be123c', // rose red
        role: 'antagonist',
        age: 28,
        origin: 'Unknown',
        description: 'A chameleon. Today a countess, tomorrow a beggar. She wants chaos, and perhaps, revenge.',
        tags: ['manipulator', 'spy', 'double_agent']
    },
    mastermind: {
        id: 'mastermind',
        name: '???',
        color: '#000000',
        role: 'antagonist',
        description: 'The puppeteer pulling the strings. Only a shadow on the wall.',
        tags: ['unknown', 'boss', 'secret']
    },

    unknown: { id: 'unknown', name: '???', color: '#a8a29e' },
};

export const getCharacter = (id: CharacterId): VNCharacter => CHARACTERS[id];
