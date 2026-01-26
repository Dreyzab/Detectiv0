
export type CharacterId = 'inspector' | 'gendarm' | 'bank_manager' | 'worker' | 'socialist' | 'unknown';

export interface VNCharacter {
    id: CharacterId;
    name: string;
    avatarUrl?: string; // If we have portraits
    color?: string; // Name tag color
}

export interface VNChoice {
    id: string;
    text: string;
    nextSceneId: string;
    // Actions to trigger when selected
    actions?: {
        type: 'grant_evidence' | 'unlock_point' | 'add_flag' | 'add_heat' | 'start_battle';
        payload: unknown;
    }[];
    // Conditions to show this choice
    condition?: (flags: Record<string, boolean>) => boolean;
}

export interface VNScene {
    id: string;
    backgroundUrl?: string; // Optional, overrides scenario default
    characterId?: CharacterId; // Who is speaking
    text: string;
    choices?: VNChoice[];
    nextSceneId?: string; // If no choices, auto-advance to this
    onEnter?: {
        type: 'unlock_point' | 'grant_evidence' | 'set_flag';
        payload: unknown;
    }[];
}

export interface VNScenario {
    id: string;
    title: string;
    defaultBackgroundUrl: string;
    scenes: Record<string, VNScene>;
    initialSceneId: string;
}
