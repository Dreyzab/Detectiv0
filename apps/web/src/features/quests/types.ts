
import type { Locale } from '@repo/shared/locales/types';

// Strict localized text using defined Locales
export type LocalizedText = Partial<Record<Locale, string>>;

// --- LOGIC TYPES ---
// These define the structure and mechanics of the quest, independent of language.

export interface QuestCondition {
    type: 'flag' | 'logic_and' | 'logic_or';
    flag?: string;
    value?: boolean;
    conditions?: QuestCondition[];
}

export interface QuestObjectiveLogic {
    id: string; // "visit_bank"
    condition: QuestCondition;
    targetPointId?: string;
}

export interface QuestLogic {
    id: string;
    objectives: QuestObjectiveLogic[];
    completionCondition?: QuestCondition;
    rewards: {
        xp: number;
        traits?: string[];
    };
}

// --- CONTENT TYPES ---
// These define the text displayed to the user.

export interface QuestObjectiveContent {
    text: string;
}

export interface QuestContent {
    title: string;
    description: string;
    objectives: Record<string, string>; // key: objectiveId, value: text
}

// --- RUNTIME TYPES ---
// The merged result used by the UI and Store.

export interface QuestObjective extends QuestObjectiveLogic {
    text: LocalizedText;
}

export interface Quest extends Omit<QuestLogic, 'objectives'> {
    title: LocalizedText;
    description: LocalizedText;
    objectives: QuestObjective[];
}
