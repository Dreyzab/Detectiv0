export const QUEST_STAGES = {
    case01: [
        'not_started',
        'briefing',
        'bank_investigation',
        'leads_open',
        'leads_done',
        'finale',
        'resolved'
    ],
    // ── Karlsruhe Sandbox ──────────────────────────────────
    sandbox_karlsruhe: [
        'not_started',
        'intro',
        'exploring',
        'guild_unlocked',
        'completed'
    ],
    sandbox_banker: [
        'not_started',
        'client_met',
        'investigating',
        'duel',
        'resolved'
    ],
    sandbox_dog: [
        'not_started',
        'client_met',
        'searching',
        'found',
        'resolved'
    ],
    sandbox_ghost: [
        'not_started',
        'client_met',
        'investigating',
        'evidence_collected',
        'guild_visit',
        'accusation',
        'resolved'
    ]
} as const;

export type QuestId = keyof typeof QUEST_STAGES;
export type QuestStage<Q extends QuestId> = (typeof QUEST_STAGES)[Q][number];
export type AnyQuestStage = {
    [Q in QuestId]: QuestStage<Q>;
}[QuestId];

export const isQuestId = (questId: string): questId is QuestId => questId in QUEST_STAGES;

export const getQuestStageSequence = (questId: string): readonly string[] | null => {
    if (!isQuestId(questId)) {
        return null;
    }
    return QUEST_STAGES[questId];
};

export const getQuestStageIndex = (questId: string, stage: string): number => {
    const sequence = getQuestStageSequence(questId);
    if (!sequence) {
        return -1;
    }
    return sequence.indexOf(stage);
};

export const isQuestAtStage = (
    questId: string,
    currentStage: string | undefined,
    targetStage: string
): boolean => {
    if (!currentStage) {
        return false;
    }
    return getQuestStageIndex(questId, currentStage) >= 0 && currentStage === targetStage;
};

export const isQuestPastStage = (
    questId: string,
    currentStage: string | undefined,
    targetStage: string
): boolean => {
    if (!currentStage) {
        return false;
    }

    const currentIndex = getQuestStageIndex(questId, currentStage);
    const targetIndex = getQuestStageIndex(questId, targetStage);
    return currentIndex >= 0 && targetIndex >= 0 && currentIndex >= targetIndex;
};
