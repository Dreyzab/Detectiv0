import { AttributeGroup, CardDefinition, BattleScenario } from './types';

export const CARD_REGISTRY: Record<string, CardDefinition> = {
  // Intellect (Blue)
  'logic_strike': {
    id: 'logic_strike',
    name: 'Logical Argument',
    description: 'Deal 6 Resolve damage.',
    cost: 1,
    group: 'intellect',
    rarity: 'common',
    effects: [{ type: 'damage', value: 6, target: 'opponent' }]
  },
  'deduction': {
    id: 'deduction',
    name: 'Brilliant Deduction',
    description: 'Deal 4 damage. Draw 1 card.',
    cost: 1,
    group: 'intellect',
    rarity: 'uncommon',
    effects: [
      { type: 'damage', value: 4, target: 'opponent' },
      { type: 'draw', value: 1 }
    ]
  },
  
  // Psyche (Purple)
  'empathy': {
    id: 'empathy',
    name: 'Empathic Appeal',
    description: 'Apply 5 Block. Heal 2 Resolve.',
    cost: 1,
    group: 'psyche',
    rarity: 'common',
    effects: [
      { type: 'block', value: 5, target: 'self' },
      { type: 'heal', value: 2, target: 'self' }
    ]
  },
  'mind_read': {
    id: 'mind_read',
    name: 'Read Intent',
    description: 'Deal 3 damage. Gain 1 AP.',
    cost: 0,
    group: 'psyche',
    rarity: 'rare',
    effects: [
      { type: 'damage', value: 3, target: 'opponent' },
      { type: 'gain_ap', value: 1 }
    ]
  },

  // Social (Red)
  'assert': {
    id: 'assert',
    name: 'Assertive Stance',
    description: 'Apply 8 Block.',
    cost: 1,
    group: 'social',
    rarity: 'common',
    effects: [{ type: 'block', value: 8, target: 'self' }]
  },
  'silver_tongue': {
    id: 'silver_tongue',
    name: 'Silver Tongue',
    description: 'Deal 8 damage. Apply 3 Block.',
    cost: 2,
    group: 'social',
    rarity: 'uncommon',
    effects: [
      { type: 'damage', value: 8, target: 'opponent' },
      { type: 'block', value: 3, target: 'self' }
    ]
  },

  // Physical (Green)
  'intimidate': {
    id: 'intimidate',
    name: 'Table Slam',
    description: 'Deal 12 damage.',
    cost: 2,
    group: 'physical',
    rarity: 'uncommon',
    effects: [{ type: 'damage', value: 12, target: 'opponent' }]
  },
  
  // Shadow (Black/Dark)
  'misdirect': {
    id: 'misdirect',
    name: 'Misdirection',
    description: 'Apply 6 Block. Draw 1 card.',
    cost: 1,
    group: 'shadow',
    rarity: 'common',
    effects: [
      { type: 'block', value: 6, target: 'self' },
      { type: 'draw', value: 1 }
    ]
  },

  // Spirit (Orange)
  'tradition': {
    id: 'tradition',
    name: 'Appeal to Tradition',
    description: 'Deal 5 damage. If this kills, heal 5.',
    cost: 1,
    group: 'spirit',
    rarity: 'common',
    effects: [{ type: 'damage', value: 5, target: 'opponent' }]
  }
};

export const STARTING_DECK_IDS = [
  'logic_strike', 'logic_strike', 'logic_strike',
  'assert', 'assert',
  'empathy',
  'misdirect',
  'deduction'
];

export const SCENARIOS: BattleScenario[] = [
  {
    id: 'detective_skirmish',
    title: 'Casual Interrogation',
    difficulty: 'Easy',
    opponentId: 'merchant',
    opponentName: 'Suspicious Merchant',
    opponentAvatar: 'https://picsum.photos/200/200?random=1',
    opponentResolve: 30,
    playerStartingResolve: 30,
    playerActionPoints: 3,
    playerStartingDeck: STARTING_DECK_IDS,
    opponentDeck: ['assert', 'logic_strike', 'misdirect', 'intimidate']
  },
  {
    id: 'boss_krebs',
    title: 'Confrontation with Krebs',
    difficulty: 'Hard',
    opponentId: 'krebs',
    opponentName: 'Heinrich Krebs',
    opponentAvatar: 'https://picsum.photos/200/200?random=2',
    opponentResolve: 50,
    playerStartingResolve: 40,
    playerActionPoints: 3,
    playerStartingDeck: [...STARTING_DECK_IDS, 'silver_tongue', 'mind_read'],
    opponentDeck: ['intimidate', 'silver_tongue', 'logic_strike', 'logic_strike', 'assert']
  }
];

export const GROUP_COLORS: Record<AttributeGroup, string> = {
  intellect: 'border-intellect text-intellect shadow-intellect/50',
  psyche: 'border-psyche text-psyche shadow-psyche/50',
  social: 'border-social text-social shadow-social/50',
  physical: 'border-physical text-physical shadow-physical/50',
  shadow: 'border-shadow text-slate-400 shadow-shadow/50',
  spirit: 'border-spirit text-spirit shadow-spirit/50',
};

export const GROUP_BG_COLORS: Record<AttributeGroup, string> = {
  intellect: 'bg-intellect/10',
  psyche: 'bg-psyche/10',
  social: 'bg-social/10',
  physical: 'bg-physical/10',
  shadow: 'bg-shadow/20',
  spirit: 'bg-spirit/10',
};
