
import type { Locale } from '@repo/shared/locales/types';
import type { AnyQuestStage } from '@repo/shared/data/quests';

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
    stage?: string;
    targetPointId?: string;
}

export interface QuestStageTransitionLogic {
    from: string;
    to: string;
    requiredFlags?: string[];
    triggerActions?: string[];
}

export interface QuestLogic {
    id: string;
    initialStage?: AnyQuestStage;
    objectives: QuestObjectiveLogic[];
    stageTransitions?: QuestStageTransitionLogic[];
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
    stages?: Record<string, string>; // key: stage id, value: stage label
    transitions?: Record<string, string>; // key: `${from}->${to}`, value: transition hint
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
    stageLabels?: Record<string, LocalizedText>;
    transitionLabels?: Record<string, LocalizedText>;
}
