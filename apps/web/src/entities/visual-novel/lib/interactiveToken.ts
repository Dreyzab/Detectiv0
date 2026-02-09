import type { TextToken } from '@/shared/ui/TypedText/TypedText';

type TooltipLookup = (key: string) => unknown;

const normalizeNotebookToken = (tokenText: string): string => tokenText
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '');

export const buildNotebookEntryId = (scenarioId: string, sceneId: string, tokenText: string): string => {
    const normalizedToken = normalizeNotebookToken(tokenText);
    return `${scenarioId}_${sceneId}_${normalizedToken || 'entry'}`;
};

export const resolveTooltipKeyword = (
    token: Pick<TextToken, 'text' | 'payload'>,
    getTooltipContent: TooltipLookup
): string | null => {
    const textKey = token.text.trim();
    if (textKey && getTooltipContent(textKey)) {
        return textKey;
    }

    const payloadKey = token.payload?.trim();
    if (payloadKey && getTooltipContent(payloadKey)) {
        return payloadKey;
    }

    return null;
};

