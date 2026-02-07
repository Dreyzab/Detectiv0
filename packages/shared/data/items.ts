import type { CharacterId } from './characters';
import type { VoiceId } from './parliament';
import { isQuestAtStage, isQuestPastStage } from './quests';

export type ItemType = 'clue' | 'consumable' | 'key_item' | 'resource' | 'weapon';

export interface ItemEffectGrantXp {
    type: 'grant_xp';
    amount: number;
}

export interface ItemEffectAddFlag {
    type: 'add_flag';
    flagId: string;
    value?: boolean;
}

export interface ItemEffectAddVoiceLevel {
    type: 'add_voice_level';
    voiceId: VoiceId;
    amount: number;
}

export type ItemEffect = ItemEffectGrantXp | ItemEffectAddFlag | ItemEffectAddVoiceLevel;

export interface ItemDefinition {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    icon: string;
    value: number;
    stackable?: boolean;
    maxStack?: number;
    effects?: ItemEffect[];
}

export interface ItemStackDefinition {
    itemId: string;
    quantity: number;
}

export interface MerchantAccessRequirements {
    requiredFlagsAll?: string[];
    unlockByAnyFlag?: string[];
    unlockByAnyFactionReputation?: Record<string, number>;
    unlockHint?: string;
}

export interface MerchantEconomyProfile {
    buyMultiplier: number;
    sellMultiplier: number;
}

export interface MerchantDefinition {
    id: string;
    name: string;
    characterId: CharacterId;
    locationId?: string;
    stock: ItemStackDefinition[];
    stageStockRules?: MerchantStageStockRule[];
    access?: MerchantAccessRequirements;
    economy: MerchantEconomyProfile;
    roleNote?: string;
    economyLoopNote?: string;
}

export interface MerchantAccessContext {
    flags?: Record<string, boolean>;
    factionReputation?: Record<string, number>;
}

export interface MerchantAccessResult {
    unlocked: boolean;
    reason?: string;
}

export type MerchantStageStockRuleMatch = 'at_stage' | 'at_or_past_stage';
export type MerchantStageStockRuleMode = 'append' | 'replace';

export interface MerchantStageStockRule {
    questId: string;
    stage: string;
    stock: ItemStackDefinition[];
    match?: MerchantStageStockRuleMatch;
    mode?: MerchantStageStockRuleMode;
}

const DEFAULT_ECONOMY: MerchantEconomyProfile = {
    buyMultiplier: 1,
    sellMultiplier: 0.5
};

export const ITEM_REGISTRY: Record<string, ItemDefinition> = {
    key: {
        id: 'key',
        name: 'Rusty Key',
        description: 'Opens an old basement lock.',
        type: 'key_item',
        icon: 'KEY',
        value: 0
    },
    coin: {
        id: 'coin',
        name: 'Strange Coin',
        description: 'An old coin with unknown symbols.',
        type: 'clue',
        icon: 'COIN',
        value: 50
    },
    cig: {
        id: 'cig',
        name: 'Half-smoked Cigarette',
        description: 'Found at the scene. Brand: "Gitanes".',
        type: 'clue',
        icon: 'CIG',
        value: 0
    },
    bread: {
        id: 'bread',
        name: 'Stale Bread',
        description: 'Better than nothing.',
        type: 'consumable',
        icon: 'BREAD',
        value: 2,
        stackable: true,
        maxStack: 99,
        effects: [{ type: 'grant_xp', amount: 5 }]
    },
    lockpick: {
        id: 'lockpick',
        name: 'Lockpick Set',
        description: 'Essential for quiet entry.',
        type: 'resource',
        icon: 'LOCKPICK',
        value: 80
    },
    map_fragment: {
        id: 'map_fragment',
        name: 'Torn Map Fragment',
        description: 'Shows a hidden tunnel.',
        type: 'clue',
        icon: 'MAP',
        value: 200
    },
    whiskey: {
        id: 'whiskey',
        name: 'Cheap Whiskey',
        description: 'Good for bribes or loose tongues.',
        type: 'consumable',
        icon: 'WHISKEY',
        value: 30,
        effects: [{ type: 'add_flag', flagId: 'used_whiskey', value: true }]
    },
    bandage: {
        id: 'bandage',
        name: 'Sterile Bandage',
        description: 'Stops bleeding and steadies your hand.',
        type: 'consumable',
        icon: 'BANDAGE',
        value: 18,
        stackable: true,
        maxStack: 20,
        effects: [
            { type: 'add_flag', flagId: 'used_bandage', value: true },
            { type: 'grant_xp', amount: 3 }
        ]
    },
    tonic: {
        id: 'tonic',
        name: 'Restorative Tonic',
        description: 'Bitter medicine. Clears fatigue for a while.',
        type: 'consumable',
        icon: 'TONIC',
        value: 42,
        effects: [
            { type: 'add_voice_level', voiceId: 'endurance', amount: 1 },
            { type: 'add_flag', flagId: 'used_tonic', value: true }
        ]
    },
    focus_draught: {
        id: 'focus_draught',
        name: 'Focus Draught',
        description: 'A sharp herbal mix that heightens sensory focus.',
        type: 'consumable',
        icon: 'DRAUGHT',
        value: 55,
        effects: [
            { type: 'add_voice_level', voiceId: 'senses', amount: 1 },
            { type: 'grant_xp', amount: 6 }
        ]
    },
    starched_collar: {
        id: 'starched_collar',
        name: 'Starched Collar',
        description: 'Crisp tailoring that adds visible social leverage.',
        type: 'consumable',
        icon: 'COLLAR',
        value: 65,
        effects: [
            { type: 'add_voice_level', voiceId: 'charisma', amount: 1 },
            { type: 'add_voice_level', voiceId: 'authority', amount: 1 }
        ]
    },
    tailored_gloves: {
        id: 'tailored_gloves',
        name: 'Tailored Gloves',
        description: 'Discreetly reinforced gloves for controlled handling.',
        type: 'resource',
        icon: 'GLOVES',
        value: 90
    },
    hot_stew: {
        id: 'hot_stew',
        name: 'Hot Stew',
        description: 'Simple pub food that gets you back on your feet.',
        type: 'consumable',
        icon: 'STEW',
        value: 12,
        effects: [
            { type: 'add_flag', flagId: 'ate_hot_stew', value: true },
            { type: 'grant_xp', amount: 4 }
        ]
    },
    rumor_note: {
        id: 'rumor_note',
        name: 'Rumor Note',
        description: 'A scrawled lead from a drunk witness.',
        type: 'clue',
        icon: 'NOTE',
        value: 90
    },
    district_pass: {
        id: 'district_pass',
        name: 'District Pass',
        description: 'Stamped pass that smooths movement in controlled areas.',
        type: 'key_item',
        icon: 'PASS',
        value: 150,
        effects: [{ type: 'add_flag', flagId: 'district_pass', value: true }]
    },
    forged_pass: {
        id: 'forged_pass',
        name: 'Forged Transit Pass',
        description: 'Expensive and risky. Better than waiting at checkpoints.',
        type: 'resource',
        icon: 'FORGED',
        value: 170
    }
};

export const STARTER_ITEM_STACKS: ItemStackDefinition[] = [
    { itemId: 'key', quantity: 1 },
    { itemId: 'coin', quantity: 1 },
    { itemId: 'cig', quantity: 1 },
    { itemId: 'bread', quantity: 3 }
];

export const STARTER_MONEY = 140;

export const MERCHANTS: Record<string, MerchantDefinition> = {
    the_fence: {
        id: 'the_fence',
        name: 'The Fence',
        characterId: 'pawnbroker',
        locationId: 'loc_workers_pub',
        stock: [
            { itemId: 'lockpick', quantity: 5 },
            { itemId: 'whiskey', quantity: 3 }
        ],
        stageStockRules: [
            {
                questId: 'case01',
                stage: 'leads_open',
                match: 'at_or_past_stage',
                stock: [
                    { itemId: 'forged_pass', quantity: 2 },
                    { itemId: 'map_fragment', quantity: 1 }
                ]
            }
        ],
        access: {
            unlockByAnyFlag: ['underworld_contact'],
            unlockByAnyFactionReputation: { fct_underworld: 2 },
            unlockHint: 'Earn underworld trust: set underworld_contact or reach +2 Tunnel Syndicate reputation.'
        },
        economy: {
            buyMultiplier: 1.15,
            sellMultiplier: 0.65
        },
        roleNote: 'Underworld broker for contraband and sensitive evidence.',
        economyLoopNote: 'Sell high-value clues, buy infiltration tools, push into riskier routes.'
    },
    apothecary_shop: {
        id: 'apothecary_shop',
        name: 'Loewen-Apotheke',
        characterId: 'apothecary',
        locationId: 'loc_apothecary',
        stock: [
            { itemId: 'bandage', quantity: 8 },
            { itemId: 'tonic', quantity: 6 }
        ],
        stageStockRules: [
            {
                questId: 'case01',
                stage: 'leads_open',
                match: 'at_or_past_stage',
                stock: [{ itemId: 'focus_draught', quantity: 4 }]
            }
        ],
        economy: {
            buyMultiplier: 1.05,
            sellMultiplier: 0.45
        },
        roleNote: 'Medical supplier focused on sustain and recovery consumables.',
        economyLoopNote: 'Converts cash into stability to maintain long investigation chains.'
    },
    tailor_shop: {
        id: 'tailor_shop',
        name: 'Fein Tailoring',
        characterId: 'tailor',
        locationId: 'loc_tailor',
        stock: [
            { itemId: 'starched_collar', quantity: 5 },
            { itemId: 'tailored_gloves', quantity: 4 }
        ],
        stageStockRules: [
            {
                questId: 'case01',
                stage: 'bank_investigation',
                match: 'at_or_past_stage',
                stock: [{ itemId: 'district_pass', quantity: 2 }]
            }
        ],
        economy: {
            buyMultiplier: 1.2,
            sellMultiplier: 0.5
        },
        roleNote: 'Social leverage and disguise-adjacent tools for pressure dialogues.',
        economyLoopNote: 'Trade money for social edges that open high-value branch outcomes.'
    },
    pub_keeper: {
        id: 'pub_keeper',
        name: 'Zum Schlappen Barkeep',
        characterId: 'innkeeper',
        locationId: 'loc_pub',
        stock: [
            { itemId: 'hot_stew', quantity: 10 },
            { itemId: 'whiskey', quantity: 6 }
        ],
        stageStockRules: [
            {
                questId: 'case01',
                stage: 'leads_open',
                match: 'at_or_past_stage',
                stock: [{ itemId: 'rumor_note', quantity: 3 }]
            }
        ],
        economy: {
            buyMultiplier: 1,
            sellMultiplier: 0.35
        },
        roleNote: 'Low-cost sustain plus information-style trade goods.',
        economyLoopNote: 'Cheap consumables keep momentum; rumor buys convert money into route intel.'
    }
};

export const getItemDefinition = (itemId: string): ItemDefinition | null => ITEM_REGISTRY[itemId] ?? null;

export const getMerchantDefinition = (merchantId: string): MerchantDefinition => {
    const fallback = MERCHANTS['the_fence'];
    if (!fallback) {
        throw new Error('Merchant registry misconfigured: missing the_fence');
    }
    return MERCHANTS[merchantId] ?? fallback;
};

export const getMerchantAccessResult = (
    merchant: MerchantDefinition,
    context: MerchantAccessContext
): MerchantAccessResult => {
    const flags = context.flags ?? {};
    const factionReputation = context.factionReputation ?? {};
    const access = merchant.access;

    if (!access) {
        return { unlocked: true };
    }

    const requiredFlagsAll = access.requiredFlagsAll ?? [];
    if (requiredFlagsAll.length > 0 && !requiredFlagsAll.every((flagId) => Boolean(flags[flagId]))) {
        return {
            unlocked: false,
            reason: access.unlockHint ?? 'Missing required contact flags.'
        };
    }

    const anyFlagRules = access.unlockByAnyFlag ?? [];
    const anyRepRules = access.unlockByAnyFactionReputation ?? {};
    const hasAnyGate = anyFlagRules.length > 0 || Object.keys(anyRepRules).length > 0;

    if (!hasAnyGate) {
        return { unlocked: true };
    }

    const byFlag = anyFlagRules.some((flagId) => Boolean(flags[flagId]));
    const byReputation = Object.entries(anyRepRules).some(([factionId, minValue]) => {
        const current = factionReputation[factionId] ?? 0;
        return current >= minValue;
    });

    if (byFlag || byReputation) {
        return { unlocked: true };
    }

    return {
        unlocked: false,
        reason: access.unlockHint ?? 'Build reputation or obtain an introduction first.'
    };
};

const resolveEconomy = (merchant: MerchantDefinition): MerchantEconomyProfile => ({
    buyMultiplier: merchant.economy?.buyMultiplier ?? DEFAULT_ECONOMY.buyMultiplier,
    sellMultiplier: merchant.economy?.sellMultiplier ?? DEFAULT_ECONOMY.sellMultiplier
});

const mergeStocks = (base: ItemStackDefinition[], patch: ItemStackDefinition[]): ItemStackDefinition[] => {
    const merged = new Map<string, number>();
    for (const entry of base) {
        merged.set(entry.itemId, (merged.get(entry.itemId) ?? 0) + entry.quantity);
    }
    for (const entry of patch) {
        merged.set(entry.itemId, (merged.get(entry.itemId) ?? 0) + entry.quantity);
    }
    return Array.from(merged.entries())
        .filter(([, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => ({ itemId, quantity }));
};

const isStageRuleMatched = (rule: MerchantStageStockRule, questStages: Record<string, string>): boolean => {
    const currentStage = questStages[rule.questId];
    if (!currentStage) {
        return false;
    }

    if (rule.match === 'at_stage') {
        return isQuestAtStage(rule.questId, currentStage, rule.stage);
    }

    return isQuestPastStage(rule.questId, currentStage, rule.stage);
};

export const getMerchantStock = (
    merchant: MerchantDefinition,
    questStages: Record<string, string> = {}
): ItemStackDefinition[] => {
    let resolvedStock = merchant.stock.map((entry) => ({ ...entry }));
    const rules = merchant.stageStockRules ?? [];

    for (const rule of rules) {
        if (!isStageRuleMatched(rule, questStages)) {
            continue;
        }

        if (rule.mode === 'replace') {
            resolvedStock = rule.stock.map((entry) => ({ ...entry }));
            continue;
        }

        resolvedStock = mergeStocks(resolvedStock, rule.stock);
    }

    return resolvedStock;
};

export const getMerchantBuyPrice = (merchant: MerchantDefinition, baseValue: number): number => {
    const economy = resolveEconomy(merchant);
    return Math.max(1, Math.round(baseValue * economy.buyMultiplier));
};

export const getMerchantSellPrice = (merchant: MerchantDefinition, baseValue: number): number => {
    const economy = resolveEconomy(merchant);
    return Math.max(0, Math.floor(baseValue * economy.sellMultiplier));
};
