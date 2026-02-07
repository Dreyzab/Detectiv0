export type VoiceGroup = 'intellect' | 'psyche' | 'social' | 'physical' | 'shadow' | 'spirit';

export type VoiceId =
    | 'logic' | 'perception' | 'encyclopedia'
    | 'intuition' | 'empathy' | 'imagination'
    | 'authority' | 'charisma' | 'volition'
    | 'endurance' | 'agility' | 'senses'
    | 'stealth' | 'deception' | 'intrusion'
    | 'occultism' | 'tradition' | 'gambling';

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
        color: '#2563eb',
        voices: ['logic', 'perception', 'encyclopedia']
    },
    psyche: {
        id: 'psyche',
        label: 'Душа (Интуиция)',
        description: 'Внутреннее чутье и понимание человеческой природы.',
        color: '#9333ea',
        voices: ['intuition', 'empathy', 'imagination']
    },
    social: {
        id: 'social',
        label: 'Характер (Социум)',
        description: 'Умение взаимодействовать с людьми и доминировать.',
        color: '#dc2626',
        voices: ['authority', 'charisma', 'volition']
    },
    physical: {
        id: 'physical',
        label: 'Тело (Действие)',
        description: 'Физическая подготовка и практические навыки.',
        color: '#16a34a',
        voices: ['endurance', 'agility', 'senses']
    },
    shadow: {
        id: 'shadow',
        label: 'Тень (Скрытность)',
        description: 'Искусство обмана и незаметных действий.',
        color: '#4b5563',
        voices: ['stealth', 'deception', 'intrusion']
    },
    spirit: {
        id: 'spirit',
        label: 'Дух (Лор)',
        description: 'Связь с историей, традициями и мистическим.',
        color: '#d97706',
        voices: ['occultism', 'tradition', 'gambling']
    }
};

export const VOICES: Record<VoiceId, VoiceMetadata> = {
    // Intellect
    logic: { id: 'logic', name: 'Logic (Логика)', group: 'intellect', description: 'Выстраивание фактов.' },
    perception: { id: 'perception', name: 'Perception (Внимание)', group: 'intellect', description: 'Поиск улик.' },
    encyclopedia: { id: 'encyclopedia', name: 'Encyclopedia (Знание)', group: 'intellect', description: 'История и лор.' },
    // Psyche
    intuition: { id: 'intuition', name: 'Intuition (Чутье)', group: 'psyche', description: 'Шестое чувство.' },
    empathy: { id: 'empathy', name: 'Empathy (Эмпатия)', group: 'psyche', description: 'Чтение эмоций.' },
    imagination: { id: 'imagination', name: 'Imagination (Образ)', group: 'psyche', description: 'Реконструкция.' },
    // Social
    authority: { id: 'authority', name: 'Authority (Власть)', group: 'social', description: 'Доминирование.' },
    charisma: { id: 'charisma', name: 'Charisma (Шарм)', group: 'social', description: 'Обаяние и лесть.' },
    volition: { id: 'volition', name: 'Volition (Воля)', group: 'social', description: 'Самоконтроль и устойчивость.' },
    // Physical
    endurance: { id: 'endurance', name: 'Endurance (Стойкость)', group: 'physical', description: 'Боль и усталость.' },
    agility: { id: 'agility', name: 'Agility (Ловкость)', group: 'physical', description: 'Реакция.' },
    senses: { id: 'senses', name: 'Senses (Чувства)', group: 'physical', description: 'Тактильный и обонятельный анализ.' },
    // Shadow
    stealth: { id: 'stealth', name: 'Stealth (Скрытность)', group: 'shadow', description: 'Незаметность.' },
    deception: { id: 'deception', name: 'Deception (Обман)', group: 'shadow', description: 'Актерство.' },
    intrusion: { id: 'intrusion', name: 'Intrusion (Взлом)', group: 'shadow', description: 'Замки и двери.' },
    // Spirit
    occultism: { id: 'occultism', name: 'Occultism (Мистика)', group: 'spirit', description: 'Тайные знания.' },
    tradition: { id: 'tradition', name: 'Tradition (Традиция)', group: 'spirit', description: 'Устои общества.' },
    gambling: { id: 'gambling', name: 'Gambling (Азарт)', group: 'spirit', description: 'Риск и удача.' }
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
