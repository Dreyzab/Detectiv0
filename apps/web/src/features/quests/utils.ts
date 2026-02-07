
import type { Locale } from '@repo/shared/locales/types';
import { LocaleSchema } from '@repo/shared/locales/types';
import { getQuestStageIndex, getQuestStageSequence } from '@repo/shared/data/quests';
import type { Quest, QuestLogic, QuestContent, LocalizedText, QuestObjective } from './types';

export const asLocale = (lang: string): Locale => {
    const parsed = LocaleSchema.safeParse(lang);
    return parsed.success ? parsed.data : 'en'; // Default fallback
}

export const getLocalizedText = (text: LocalizedText | undefined, locale: string): string => {
    if (!text) return '[MISSING TEXT]';

    const validatedLocale = asLocale(locale);

    // 1. Try requested locale
    if (text[validatedLocale]) {
        return text[validatedLocale]!;
    }

    // 2. Try Fallback (en)
    if (text['en']) {
        return text['en']!;
    }

    // 3. Last resort - grab first available key or warn
    const firstKey = Object.keys(text)[0] as Locale;
    if (firstKey && text[firstKey]) return text[firstKey]!;

    if (import.meta.env.DEV) {
        console.warn(`[QuestLocalization] Missing translation for text object:`, text);
    }

    return '[MISSING TRANS]';
};

export const mergeQuest = (logic: QuestLogic, content: Record<Locale, QuestContent>): Quest => {
    // 1. Validate 'en' content exists (Development Aid)
    if (import.meta.env.DEV && !content['en']) {
        console.warn(`[QuestLocalization] mergedQuest '${logic.id}' is missing English content!`);
    }

    const mergedObjectives: QuestObjective[] = logic.objectives.map(objLogic => {
        const textMap: LocalizedText = {};

        // Collect text for this objective from all provided locales
        (Object.keys(content) as Locale[]).forEach(loc => {
            const locContent = content[loc];
            if (locContent?.objectives[objLogic.id]) {
                textMap[loc] = locContent.objectives[objLogic.id];
            } else if (import.meta.env.DEV && loc === 'en') {
                console.warn(`[QuestLocalization] Quest '${logic.id}' objective '${objLogic.id}' missing EN text.`);
            }
        });

        return {
            ...objLogic,
            text: textMap
        };
    });

    const titleMap: LocalizedText = {};
    const descMap: LocalizedText = {};
    const stageLabels: Record<string, LocalizedText> = {};
    const transitionLabels: Record<string, LocalizedText> = {};

    (Object.keys(content) as Locale[]).forEach(loc => {
        if (content[loc]) {
            titleMap[loc] = content[loc]!.title;
            descMap[loc] = content[loc]!.description;
            Object.entries(content[loc]!.stages ?? {}).forEach(([stageId, label]) => {
                const current = stageLabels[stageId] ?? {};
                current[loc] = label;
                stageLabels[stageId] = current;
            });
            Object.entries(content[loc]!.transitions ?? {}).forEach(([transitionKey, label]) => {
                const current = transitionLabels[transitionKey] ?? {};
                current[loc] = label;
                transitionLabels[transitionKey] = current;
            });
        }
    });

    return {
        ...logic,
        title: titleMap,
        description: descMap,
        objectives: mergedObjectives,
        stageLabels: Object.keys(stageLabels).length > 0 ? stageLabels : undefined,
        transitionLabels: Object.keys(transitionLabels).length > 0 ? transitionLabels : undefined
    };
};

const humanizeStage = (stage: string): string => stage
    .split('_')
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ');

export const getQuestStageLabel = (
    quest: Quest,
    stage: string | undefined,
    locale: string
): string => {
    if (!stage) {
        return '';
    }

    const localized = quest.stageLabels?.[stage];
    if (localized) {
        return getLocalizedText(localized, locale);
    }

    return humanizeStage(stage);
};

export const getObjectivesForStage = (quest: Quest, stage: string | undefined): QuestObjective[] => {
    if (!stage) {
        return quest.objectives;
    }

    const stageObjectives = quest.objectives.filter((objective) =>
        !objective.stage || objective.stage === stage
    );

    if (stageObjectives.length > 0) {
        return stageObjectives;
    }

    return quest.objectives;
};

export interface QuestTimelineEntry {
    stage: string;
    label: string;
    status: 'completed' | 'current' | 'upcoming';
    transitionHint?: string;
}

export const makeQuestTransitionKey = (fromStage: string, toStage: string): string =>
    `${fromStage}->${toStage}`;

export const getQuestStageTransitionHint = (
    quest: Quest,
    fromStage: string | undefined,
    toStage: string,
    locale: string
): string => {
    if (!fromStage) {
        return '';
    }

    const transitionKey = makeQuestTransitionKey(fromStage, toStage);
    const localizedTransition = quest.transitionLabels?.[transitionKey];
    const transitionMeta = quest.stageTransitions?.find(
        (transition) => transition.from === fromStage && transition.to === toStage
    );

    const parts: string[] = [];
    if (localizedTransition) {
        parts.push(getLocalizedText(localizedTransition, locale));
    }

    if (transitionMeta?.requiredFlags && transitionMeta.requiredFlags.length > 0) {
        parts.push(`Flags: ${transitionMeta.requiredFlags.join(', ')}`);
    }

    if (transitionMeta?.triggerActions && transitionMeta.triggerActions.length > 0) {
        parts.push(`Actions: ${transitionMeta.triggerActions.join(', ')}`);
    }

    if (parts.length === 0) {
        return '';
    }

    return parts.join('\n');
};

export const getQuestTimelineWindow = (
    quest: Quest,
    questId: string,
    stage: string | undefined,
    locale: string
): QuestTimelineEntry[] => {
    const sequence = getQuestStageSequence(questId);
    if (!sequence || sequence.length === 0) {
        if (!stage) {
            return [];
        }
        return [
            {
                stage,
                label: getQuestStageLabel(quest, stage, locale),
                status: 'current'
            }
        ];
    }

    const currentIndex = stage ? getQuestStageIndex(questId, stage) : -1;
    const normalizedCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const start = Math.max(0, normalizedCurrentIndex - 1);
    const end = Math.min(sequence.length - 1, normalizedCurrentIndex + 1);

    return sequence.slice(start, end + 1).map((timelineStage, localIndex) => {
        const absoluteIndex = start + localIndex;
        const status: QuestTimelineEntry['status'] =
            absoluteIndex < normalizedCurrentIndex
                ? 'completed'
                : absoluteIndex === normalizedCurrentIndex
                    ? 'current'
                    : 'upcoming';
        const previousStage = absoluteIndex > 0 ? sequence[absoluteIndex - 1] : undefined;

        return {
            stage: timelineStage,
            label: getQuestStageLabel(quest, timelineStage, locale),
            status,
            transitionHint: getQuestStageTransitionHint(quest, previousStage, timelineStage, locale)
        };
    });
};
