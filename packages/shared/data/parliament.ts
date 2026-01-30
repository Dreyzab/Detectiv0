
export type VoiceGroup = 'intellect' | 'psyche' | 'social' | 'physical' | 'shadow' | 'spirit';

export type VoiceId =
    | 'logic' | 'perception' | 'encyclopedia'
    | 'intuition' | 'empathy' | 'imagination'
    | 'authority' | 'charisma' | 'composure'
    | 'endurance' | 'agility' | 'forensics'
    | 'stealth' | 'deception' | 'intrusion'
    | 'occultism' | 'tradition' | 'poetics';

export interface VoiceMetadata {
    id: VoiceId;
    name: string;
    description: string;
    group: VoiceGroup;
}

export interface VoiceGroupMetadata {
    id: VoiceGroup;
    label: string;
    description?: string;
    icon?: string;
    voices: VoiceId[];
    color?: string;
}

export const GROUP_ORDER: VoiceGroup[] = ['intellect', 'psyche', 'social', 'physical', 'shadow', 'spirit'];

export const VOICE_GROUPS: Record<VoiceGroup, VoiceGroupMetadata> = {
    intellect: {
        id: 'intellect',
        label: 'Мозг (Аналитика)',
        description: 'Способность анализировать факты и делать выводы.',
        color: '#2563eb', // Blue
        voices: ['logic', 'perception', 'encyclopedia']
    },
    psyche: {
        id: 'psyche',
        label: 'Душа (Интуиция)',
        description: 'Внутреннее чутье и понимание человеческой природы.',
        color: '#9333ea', // Purple
        voices: ['intuition', 'empathy', 'imagination']
    },
    social: {
        id: 'social',
        label: 'Характер (Социум)',
        description: 'Умение взаимодействовать с людьми и доминировать.',
        color: '#dc2626', // Red
        voices: ['authority', 'charisma', 'composure']
    },
    physical: {
        id: 'physical',
        label: 'Тело (Действие)',
        description: 'Физическая подготовка и практические навыки.',
        color: '#16a34a', // Green
        voices: ['endurance', 'agility', 'forensics']
    },
    shadow: {
        id: 'shadow',
        label: 'Тень (Скрытость)',
        description: 'Искусство обмана и незаметных действий.',
        color: '#4b5563', // Gray
        voices: ['stealth', 'deception', 'intrusion']
    },
    spirit: {
        id: 'spirit',
        label: 'Дух (Лор)',
        description: 'Связь с историей, традициями и оккультным.',
        color: '#d97706', // Amber
        voices: ['occultism', 'tradition', 'poetics']
    }
};

export const VOICES: Record<VoiceId, VoiceMetadata> = {
    // Intellect
    logic: { id: 'logic', name: 'Логика', group: 'intellect', description: 'Выстраивание цепочек выводов.' },
    perception: { id: 'perception', name: 'Внимательность', group: 'intellect', description: 'Поиск мелких деталей.' },
    encyclopedia: { id: 'encyclopedia', name: 'Энциклопедия', group: 'intellect', description: 'Знание истории и фактов.' },
    // Psyche
    intuition: { id: 'intuition', name: 'Интуиция', group: 'psyche', description: 'Шестое чувство.' },
    empathy: { id: 'empathy', name: 'Эмпатия', group: 'psyche', description: 'Понимание эмоций других.' },
    imagination: { id: 'imagination', name: 'Воображение', group: 'psyche', description: 'Синтез целого из частей.' },
    // Social
    authority: { id: 'authority', name: 'Авторитет', group: 'social', description: 'Умение настоять на своем.' },
    charisma: { id: 'charisma', name: 'Обаяние', group: 'social', description: 'Шарм и дипломатия.' },
    composure: { id: 'composure', name: 'Хладнокровие', group: 'social', description: 'Выдержка в стрессе.' },
    // Physical
    endurance: { id: 'endurance', name: 'Выносливость', group: 'physical', description: 'Физическая крепость.' },
    agility: { id: 'agility', name: 'Ловкость', group: 'physical', description: 'Быстрота реакции.' },
    forensics: { id: 'forensics', name: 'Криминалистика', group: 'physical', description: 'Работа с уликами и инструментами.' },
    // Shadow
    stealth: { id: 'stealth', name: 'Скрытность', group: 'shadow', description: 'Действие без лишнего шума.' },
    deception: { id: 'deception', name: 'Обман', group: 'shadow', description: 'Искусство лжи и актерства.' },
    intrusion: { id: 'intrusion', name: 'Проникновение', group: 'shadow', description: 'Взлом и преодоление преград.' },
    // Spirit
    occultism: { id: 'occultism', name: 'Оккультизм', group: 'spirit', description: 'Знание мистики и секретов.' },
    tradition: { id: 'tradition', name: 'Традиция', group: 'spirit', description: 'Связь с корнями и порядком.' },
    poetics: { id: 'poetics', name: 'Поэтика', group: 'spirit', description: 'Чувство прекрасного и высокого.' }
};

export const VOICE_ORDER: VoiceId[] = (Object.keys(VOICES) as VoiceId[]);

// Helpers
export const getVoiceGroup = (voiceId: VoiceId): VoiceGroup => VOICES[voiceId].group;
export const getVoicesByGroup = (groupId: VoiceGroup): VoiceId[] => VOICE_GROUPS[groupId].voices;
export const assertVoiceId = (id: string): id is VoiceId => id in VOICES;

/**
 * Get the color associated with a voice's group.
 * Used for skill check UI badges.
 */
export const getVoiceColor = (voiceId: VoiceId): string => {
    const group = VOICES[voiceId].group;
    return VOICE_GROUPS[group].color || '#d4c5a3';
};
