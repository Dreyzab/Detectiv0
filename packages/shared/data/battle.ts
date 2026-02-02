/**
 * =====================================================
 * BATTLE SYSTEM DATA SCHEMA
 * Card-based dialogue battles (Griftlands-inspired)
 * 6 Attribute Groups × Cards
 * =====================================================
 */

// Minimal VNAction type for battle return flow (full type in web app)
export type BattleReturnAction =
    | { type: 'add_flag'; payload: Record<string, boolean> }
    | { type: 'modify_relationship'; payload: { characterId: string; amount: number } }
    | { type: 'grant_evidence'; payload: { id: string; name: string; description: string } };

// ================== ATTRIBUTE GROUPS ==================

/**
 * 6 Attribute Groups for battle cards
 * Matches parliament.ts structure
 */
export type AttributeGroup =
    | 'intellect'   // 🔵 Analysis, logic, deduction
    | 'psyche'      // 🟣 Intuition, empathy, imagination
    | 'social'      // 🔴 Authority, charisma, composure
    | 'physical'    // 🟢 Endurance, agility, forensics
    | 'shadow'      // ⚫ Stealth, deception, intrusion
    | 'spirit';     // 🟠 Occultism, tradition, poetics

export const ATTRIBUTE_GROUP_COLORS: Record<AttributeGroup, string> = {
    intellect: '#3498db',
    psyche: '#9b59b6',
    social: '#e74c3c',
    physical: '#2ecc71',
    shadow: '#2c3e50',
    spirit: '#e67e22'
};

export const ATTRIBUTE_GROUP_ICONS: Record<AttributeGroup, string> = {
    intellect: '🔵',
    psyche: '🟣',
    social: '🔴',
    physical: '🟢',
    shadow: '⚫',
    spirit: '🟠'
};

// ================== CARD EFFECTS ==================

export type EffectTarget = 'self' | 'opponent';

export type EffectType =
    | 'damage'          // Reduce opponent's resolve
    | 'block'           // Add temporary block (absorbs damage)
    | 'heal'            // Restore own resolve
    | 'draw'            // Draw additional cards
    | 'discard'         // Force opponent to discard
    | 'buff_resolve'    // Increase max resolve
    | 'debuff_resolve'  // Decrease opponent's max resolve
    | 'gain_ap';        // Gain extra action points

export interface CardEffect {
    type: EffectType;
    value: number;
    target: EffectTarget;
    /** Optional: voice ID that scales this effect */
    voiceScaling?: string;
    /** Scaling multiplier per voice level (default 0.1) */
    scalePerLevel?: number;
}

// ================== CARD DEFINITION ==================

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface CardDefinition {
    id: string;
    name: string;
    nameRu?: string;
    description: string;
    descriptionRu?: string;

    /** Action points cost to play */
    cost: number;

    /** Which attribute group this card belongs to */
    group: AttributeGroup;

    /** Effects when played */
    effects: CardEffect[];

    /** Rarity affects upgrade costs and drop rates */
    rarity: CardRarity;

    /** Tags for filtering/synergy */
    tags?: string[];

    /** Upgrade path: ID of upgraded version */
    upgradesTo?: string;

    /** Art URL */
    artUrl?: string;
}

// ================== TURN PHASES ==================

export type TurnPhase =
    | 'player_start'    // Beginning of player turn (draw, reset AP)
    | 'player_action'   // Player can play cards
    | 'opponent_turn'   // Opponent is acting
    | 'resolution'      // Effects resolving
    | 'victory'         // Player won
    | 'defeat';         // Player lost

// ================== VISUAL EVENTS ==================

export interface VisualEvent {
    id: string;
    type: 'damage' | 'block' | 'heal' | 'buff';
    value: number | string;
    target: 'player' | 'opponent';
}

// ================== BATTLE ENTITIES ==================

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
    nextMoveId?: string;
    deck: string[];
}

// ================== BATTLE SCENARIO ==================

export interface BattleScenario {
    id: string;

    /** Display name */
    title: string;
    titleRu?: string;

    /** Difficulty label */
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Boss';

    /** Opponent info */
    opponentId: string;
    opponentName: string;
    opponentNameRu?: string;
    opponentPortrait?: string;
    opponentAvatar?: string;

    /** Starting values */
    opponentResolve: number;
    playerStartingResolve: number;
    playerActionPoints: number;
    cardsPerTurn: number;

    /** Opponent's deck (card IDs) */
    opponentDeck: string[];

    /** Player's starting deck (card IDs) - optional override */
    playerStartingDeck?: string[];

    /** Return flow after battle */
    onWin?: {
        resumeSceneId?: string;
        actions?: BattleReturnAction[];
    };
    onLose?: {
        resumeSceneId?: string;
        actions?: BattleReturnAction[];
    };

    /** Background for battle screen */
    backgroundUrl?: string;

    /** Music track */
    musicUrl?: string;
}

// ================== STARTER CARDS (15 cards) ==================

export const STARTER_CARDS: CardDefinition[] = [
    // 🔵 INTELLECT (3 cards)
    {
        id: 'card_logical_argument',
        name: 'Logical Argument',
        nameRu: 'Логический аргумент',
        description: 'Present cold, hard facts. Deal 4 damage.',
        descriptionRu: 'Изложите холодные, неопровержимые факты. Нанесите 4 урона.',
        cost: 1,
        group: 'intellect',
        effects: [{ type: 'damage', value: 4, target: 'opponent' }],
        rarity: 'common'
    },
    {
        id: 'card_analyze_weakness',
        name: 'Analyze Weakness',
        nameRu: 'Анализ слабости',
        description: 'Study your opponent. Deal 2 damage and draw 1 card.',
        descriptionRu: 'Изучите оппонента. Нанесите 2 урона и возьмите 1 карту.',
        cost: 2,
        group: 'intellect',
        effects: [
            { type: 'damage', value: 2, target: 'opponent' },
            { type: 'draw', value: 1, target: 'self' }
        ],
        rarity: 'uncommon'
    },
    {
        id: 'card_deduction',
        name: 'Brilliant Deduction',
        nameRu: 'Блестящая дедукция',
        description: 'Your logic is undeniable. Deal 8 damage.',
        descriptionRu: 'Ваша логика неопровержима. Нанесите 8 урона.',
        cost: 3,
        group: 'intellect',
        effects: [{ type: 'damage', value: 8, target: 'opponent', voiceScaling: 'logic' }],
        rarity: 'rare'
    },

    // 🟣 PSYCHE (3 cards)
    {
        id: 'card_empathic_appeal',
        name: 'Empathic Appeal',
        nameRu: 'Эмпатический призыв',
        description: 'Connect emotionally. Heal 3 resolve.',
        descriptionRu: 'Эмоциональная связь. Восстановите 3 решимости.',
        cost: 1,
        group: 'psyche',
        effects: [{ type: 'heal', value: 3, target: 'self' }],
        rarity: 'common'
    },
    {
        id: 'card_gut_feeling',
        name: 'Gut Feeling',
        nameRu: 'Внутреннее чутьё',
        description: 'Trust your instincts. Gain 4 block.',
        descriptionRu: 'Доверьтесь инстинктам. Получите 4 блока.',
        cost: 1,
        group: 'psyche',
        effects: [{ type: 'block', value: 4, target: 'self' }],
        rarity: 'common'
    },
    {
        id: 'card_read_intent',
        name: 'Read Intent',
        nameRu: 'Чтение намерений',
        description: 'Anticipate their move. Gain 6 block and draw 1 card.',
        descriptionRu: 'Предугадайте их ход. Получите 6 блока и возьмите 1 карту.',
        cost: 2,
        group: 'psyche',
        effects: [
            { type: 'block', value: 6, target: 'self' },
            { type: 'draw', value: 1, target: 'self' }
        ],
        rarity: 'uncommon'
    },

    // 🔴 SOCIAL (3 cards)
    {
        id: 'card_assertive_stance',
        name: 'Assertive Stance',
        nameRu: 'Напористая позиция',
        description: 'Command respect. Deal 3 damage, gain 2 block.',
        descriptionRu: 'Требуйте уважения. Нанесите 3 урона, получите 2 блока.',
        cost: 1,
        group: 'social',
        effects: [
            { type: 'damage', value: 3, target: 'opponent' },
            { type: 'block', value: 2, target: 'self' }
        ],
        rarity: 'common'
    },
    {
        id: 'card_silver_tongue',
        name: 'Silver Tongue',
        nameRu: 'Серебряный язык',
        description: 'Charm your way through. Deal 5 damage.',
        descriptionRu: 'Очаруйте собеседника. Нанесите 5 урона.',
        cost: 2,
        group: 'social',
        effects: [{ type: 'damage', value: 5, target: 'opponent', voiceScaling: 'charisma' }],
        rarity: 'uncommon'
    },
    {
        id: 'card_commanding_presence',
        name: 'Commanding Presence',
        nameRu: 'Властное присутствие',
        description: 'Dominate the conversation. Deal 6 damage, gain 3 block.',
        descriptionRu: 'Доминируйте в разговоре. Нанесите 6 урона, получите 3 блока.',
        cost: 3,
        group: 'social',
        effects: [
            { type: 'damage', value: 6, target: 'opponent', voiceScaling: 'authority' },
            { type: 'block', value: 3, target: 'self' }
        ],
        rarity: 'rare'
    },

    // 🟢 PHYSICAL (2 cards)
    {
        id: 'card_steady_nerves',
        name: 'Steady Nerves',
        nameRu: 'Стальные нервы',
        description: 'Stay calm under pressure. Gain 5 block.',
        descriptionRu: 'Сохраняйте спокойствие. Получите 5 блока.',
        cost: 1,
        group: 'physical',
        effects: [{ type: 'block', value: 5, target: 'self' }],
        rarity: 'common'
    },
    {
        id: 'card_relentless',
        name: 'Relentless',
        nameRu: 'Неумолимый',
        description: 'Push through exhaustion. Deal 4 damage, gain 1 AP.',
        descriptionRu: 'Преодолейте усталость. Нанесите 4 урона, получите 1 ОД.',
        cost: 2,
        group: 'physical',
        effects: [
            { type: 'damage', value: 4, target: 'opponent' },
            { type: 'gain_ap', value: 1, target: 'self' }
        ],
        rarity: 'uncommon'
    },

    // ⚫ SHADOW (2 cards)
    {
        id: 'card_misdirection',
        name: 'Misdirection',
        nameRu: 'Отвлечение внимания',
        description: 'Keep them guessing. Opponent discards 1 card.',
        descriptionRu: 'Держите их в неведении. Оппонент сбрасывает 1 карту.',
        cost: 1,
        group: 'shadow',
        effects: [{ type: 'discard', value: 1, target: 'opponent' }],
        rarity: 'common'
    },
    {
        id: 'card_veiled_threat',
        name: 'Veiled Threat',
        nameRu: 'Скрытая угроза',
        description: 'Imply consequences. Deal 6 damage.',
        descriptionRu: 'Намекните на последствия. Нанесите 6 урона.',
        cost: 2,
        group: 'shadow',
        effects: [{ type: 'damage', value: 6, target: 'opponent', voiceScaling: 'deception' }],
        rarity: 'uncommon'
    },

    // 🟠 SPIRIT (2 cards)
    {
        id: 'card_appeal_to_tradition',
        name: 'Appeal to Tradition',
        nameRu: 'Призыв к традиции',
        description: 'Invoke shared values. Heal 2 and gain 3 block.',
        descriptionRu: 'Воззовите к общим ценностям. Восстановите 2 и получите 3 блока.',
        cost: 1,
        group: 'spirit',
        effects: [
            { type: 'heal', value: 2, target: 'self' },
            { type: 'block', value: 3, target: 'self' }
        ],
        rarity: 'common'
    },
    {
        id: 'card_poetic_strike',
        name: 'Poetic Strike',
        nameRu: 'Поэтический удар',
        description: 'Words as weapons. Deal 7 damage.',
        descriptionRu: 'Слова как оружие. Нанесите 7 урона.',
        cost: 2,
        group: 'spirit',
        effects: [{ type: 'damage', value: 7, target: 'opponent', voiceScaling: 'poetics' }],
        rarity: 'uncommon'
    }
];

// ================== CARD REGISTRY ==================

export const CARD_REGISTRY: Record<string, CardDefinition> = Object.fromEntries(
    STARTER_CARDS.map(card => [card.id, card])
);

export function getCardById(id: string): CardDefinition | undefined {
    return CARD_REGISTRY[id];
}

export function getCardsByGroup(group: AttributeGroup): CardDefinition[] {
    return STARTER_CARDS.filter(card => card.group === group);
}

// ================== TEST SCENARIOS ==================

export const TEST_BATTLE_SCENARIOS: BattleScenario[] = [
    {
        id: 'detective_skirmish',
        title: 'Casual Interrogation',
        titleRu: 'Непринуждённый допрос',
        difficulty: 'Easy',
        opponentId: 'npc_suspicious_merchant',
        opponentName: 'Suspicious Merchant',
        opponentNameRu: 'Подозрительный торговец',
        opponentAvatar: '/images/detective/npc_merchant.png',
        opponentResolve: 20,
        playerStartingResolve: 25,
        playerActionPoints: 3,
        cardsPerTurn: 2,
        opponentDeck: [
            'card_logical_argument',
            'card_logical_argument',
            'card_empathic_appeal',
            'card_gut_feeling',
            'card_assertive_stance',
            'card_steady_nerves',
            'card_misdirection'
        ]
    },
    {
        id: 'detective_boss_krebs',
        title: 'Confrontation with Krebs',
        titleRu: 'Противостояние с Кребсом',
        difficulty: 'Boss',
        opponentId: 'npc_krebs',
        opponentName: 'Heinrich Krebs',
        opponentNameRu: 'Генрих Кребс',
        opponentAvatar: '/images/detective/npc_krebs.png',
        opponentResolve: 35,
        playerStartingResolve: 30,
        playerActionPoints: 3,
        cardsPerTurn: 2,
        opponentDeck: [
            'card_commanding_presence',
            'card_silver_tongue',
            'card_veiled_threat',
            'card_deduction',
            'card_assertive_stance',
            'card_assertive_stance',
            'card_gut_feeling',
            'card_relentless'
        ],
        onWin: {
            resumeSceneId: 'case1_warehouse_victory'
        },
        onLose: {
            resumeSceneId: 'case1_warehouse_defeat'
        }
    }
];

// Alias for convenience
export const BATTLE_SCENARIOS = TEST_BATTLE_SCENARIOS;

export const BATTLE_SCENARIO_REGISTRY: Record<string, BattleScenario> = Object.fromEntries(
    TEST_BATTLE_SCENARIOS.map(s => [s.id, s])
);

export function getBattleScenarioById(id: string): BattleScenario | undefined {
    return BATTLE_SCENARIO_REGISTRY[id];
}
