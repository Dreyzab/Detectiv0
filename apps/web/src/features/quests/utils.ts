
import type { Locale } from '@repo/shared/locales/types';
import { LocaleSchema } from '@repo/shared/locales/types';
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

    (Object.keys(content) as Locale[]).forEach(loc => {
        if (content[loc]) {
            titleMap[loc] = content[loc]!.title;
            descMap[loc] = content[loc]!.description;
        }
    });

    return {
        ...logic,
        title: titleMap,
        description: descMap,
        objectives: mergedObjectives
    };
};
