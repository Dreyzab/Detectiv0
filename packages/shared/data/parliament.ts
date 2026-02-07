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
        label: 'Brain (Analytics)',
        description: 'Logical reasoning and sensory processing.',
        color: '#2563eb', // Blue 🔵
        voices: ['logic', 'perception', 'encyclopedia']
    },
    psyche: {
        id: 'psyche',
        label: 'Soul (Intuition)',
        description: 'Emotional connection and subconscious understanding.',
        color: '#9333ea', // Purple 🟣
        voices: ['intuition', 'empathy', 'imagination']
    },
    social: {
        id: 'social',
        label: 'Character (Society)',
        description: 'Social maneuvering and force of personality.',
        color: '#f97316', // Orange 🟠
        voices: ['authority', 'charisma', 'volition']
    },
    physical: {
        id: 'physical',
        label: 'Body (Action)',
        description: 'Physical capability and direct intervention.',
        color: '#ef4444', // Red 🔴
        voices: ['endurance', 'agility', 'senses']
    },
    shadow: {
        id: 'shadow',
        label: 'Shadow (Stealth)',
        description: 'Subterfuge and underworld skills.',
        color: '#1f2937', // Black/Dark Grey ⚫
        voices: ['stealth', 'deception', 'intrusion']
    },
    spirit: {
        id: 'spirit',
        label: 'Spirit (Lore)',
        description: 'Esoteric knowledge and connection to the past.',
        color: '#10b981', // Green 🟢
        voices: ['occultism', 'tradition', 'gambling']
    }
};

export const VOICES: Record<VoiceId, VoiceMetadata> = {
    // Intellect
    logic: { id: 'logic', name: 'Logic (Логика)', group: 'intellect', description: 'Deductive reasoning.' },
    perception: { id: 'perception', name: 'Perception (Внимание)', group: 'intellect', description: 'Noticing details.' },
    encyclopedia: { id: 'encyclopedia', name: 'Encyclopedia (Знание)', group: 'intellect', description: 'Trivia and facts.' },
    // Psyche
    intuition: { id: 'intuition', name: 'Intuition (Чутье)', group: 'psyche', description: 'Gut feelings and warnings.' },
    empathy: { id: 'empathy', name: 'Empathy (Эмпатия)', group: 'psyche', description: 'Reading emotions.' },
    imagination: { id: 'imagination', name: 'Imagination (Образ)', group: 'psyche', description: 'Reconstructing events.' },
    // Social
    authority: { id: 'authority', name: 'Authority (Власть)', group: 'social', description: 'Commanding respect.' },
    charisma: { id: 'charisma', name: 'Charisma (Шарм)', group: 'social', description: 'Charm and persuasion.' },
    volition: { id: 'volition', name: 'Volition (Воля)', group: 'social', description: 'Morale and sanity.' },
    // Physical
    endurance: { id: 'endurance', name: 'Endurance (Стойкость)', group: 'physical', description: 'Pain tolerance.' },
    agility: { id: 'agility', name: 'Agility (Ловкость)', group: 'physical', description: 'Reflexes and movement.' },
    senses: { id: 'senses', name: 'Senses (Чувства)', group: 'physical', description: 'Smell, touch, and physical analysis.' },
    // Shadow
    stealth: { id: 'stealth', name: 'Stealth (Скрытность)', group: 'shadow', description: 'Moving unseen.' },
    deception: { id: 'deception', name: 'Deception (Обман)', group: 'shadow', description: 'Lying and acting.' },
    intrusion: { id: 'intrusion', name: 'Intrusion (Взлом)', group: 'shadow', description: 'Picking locks and breaking in.' },
    // Spirit
    occultism: { id: 'occultism', name: 'Occultism (Мистика)', group: 'spirit', description: 'Supernatural lore.' },
    tradition: { id: 'tradition', name: 'Tradition (Традиция)', group: 'spirit', description: 'History and customs.' },
    gambling: { id: 'gambling', name: 'Gambling (Азарт)', group: 'spirit', description: 'Risk and luck.' }
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
