import type { VoiceId } from '../lib/parliament';

export interface MindPalaceState {
    activeVoice: VoiceId | null;
    text: string | null;
    isVisible: boolean;
}

export interface VoiceOrbProps {
    voiceId: VoiceId;
    size?: 'sm' | 'md' | 'lg';
    state?: 'idle' | 'speaking' | 'listening';
    className?: string;
}

export interface ThoughtCloudProps {
    text: string;
    voiceId: VoiceId;
    isVisible: boolean;
    onComplete?: () => void;
}
