
export type AttributeGroup = 'intellect' | 'psyche' | 'social' | 'physical' | 'shadow' | 'spirit';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type EffectType = 'damage' | 'block' | 'heal' | 'draw' | 'gain_ap' | 'discard';

export interface CardEffect {
  type: EffectType;
  value: number;
  target?: 'self' | 'opponent';
  voiceScaling?: string; // Placeholder for future voice integration
  scalePerLevel?: number;
}

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  group: AttributeGroup;
  effects: CardEffect[];
  rarity: CardRarity;
  tags?: string[];
  image?: string;
}

export interface BattleEntity {
  id: string;
  name: string;
  avatar: string;
  currentResolve: number;
  maxResolve: number;
  block: number;
}

export interface PlayerEntity extends BattleEntity {
  currentAP: number;
  maxAP: number;
  hand: CardDefinition[];
  deck: CardDefinition[];
  discardPile: CardDefinition[];
}

export interface OpponentEntity extends BattleEntity {
  nextMoveId?: string; // ID of the card they will play next
  deck: string[]; // List of Card IDs
}

export interface BattleScenario {
  id: string;
  title: string;
  difficulty: string;
  opponentId: string;
  opponentName: string;
  opponentAvatar: string;
  opponentResolve: number;
  opponentDeck: string[];
  playerStartingResolve: number;
  playerActionPoints: number;
  playerStartingDeck: string[];
}

export type TurnPhase = 'player_start' | 'player_action' | 'opponent_turn' | 'resolution' | 'victory' | 'defeat';

export interface VisualEvent {
  id: string;
  type: 'damage' | 'block' | 'heal' | 'buff';
  value: number | string;
  target: 'player' | 'opponent';
}
