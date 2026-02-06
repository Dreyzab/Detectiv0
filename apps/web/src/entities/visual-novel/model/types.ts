import type { VoiceId } from '../../../features/detective/lib/parliament';
import type { Evidence } from '../../../features/detective/dossier/store';

// Re-export from shared for backwards compatibility
export type { CharacterId, VNCharacter } from '@repo/shared/data/characters';
import type { CharacterId } from '@repo/shared/data/characters';

/**
 * Dialogue History Entry for scrollable backlog (Rogue Trader style)
 */
export interface DialogueEntry {
    id: string;
    characterId?: CharacterId;
    characterName?: string;
    text: string;
    choiceMade?: string; // Text of selected choice (dimmed in history)
    timestamp: number;
}

/**
 * Discriminated union for VN actions - type-safe payload handling
 */
export type VNAction =
    | { type: 'grant_evidence'; payload: Evidence }
    | { type: 'unlock_point'; payload: string }
    | { type: 'add_flag'; payload: Record<string, boolean> }
    | { type: 'add_heat'; payload: number }
    | { type: 'modify_relationship'; payload: { characterId: CharacterId; amount: number } }
    | { type: 'set_character_status'; payload: { characterId: CharacterId; status: string } }
    | { type: 'set_stat'; payload: { id: string; value: number } }
    | { type: 'start_battle'; payload: { scenarioId: string; deckType: string } };

export interface VNSkillCheck {
    id: string; // Unique Check ID (e.g., 'chk_bank_logic_safe')
    voiceId: VoiceId; // 'logic' | 'empathy' ...
    difficulty: number; // Target number (e.g., 10)

    // Actions to execute on outcome (instead of just jumping scenes)
    onSuccess?: {
        nextSceneId?: string;
        actions?: VNAction[];
    };
    onFail?: {
        nextSceneId?: string; // Optional: stay on same node if just 'red locked'
        actions?: VNAction[]; // e.g., Add Heat, Lock Choice
    };

    isPassive?: boolean; // If true, performed automatically on entering scene
    passiveText?: string; // Text shown on success (Mind Palace)
    passiveFailText?: string; // Text shown on failure (optional)
}

export interface VNChoice {
    id: string;
    text: string;
    nextSceneId: string;
    type?: 'action' | 'inquiry' | 'flavor'; // Visual distinction
    // Actions to trigger when selected
    actions?: VNAction[];
    // Conditions to show this choice
    condition?: (flags: Record<string, boolean>) => boolean;

    // RPG Skill Check
    skillCheck?: VNSkillCheck;
}

export interface VNScene {
    id: string;
    backgroundUrl?: string; // Optional, overrides scenario default
    characterId?: CharacterId; // Who is speaking
    text: string;
    choices?: VNChoice[];
    nextSceneId?: string; // If no choices, auto-advance to this
    onEnter?: VNAction[];

    // RPG: Passive Skill Checks resolved on entry
    passiveChecks?: VNSkillCheck[];
}

export interface VNScenario {
    id: string;
    title: string;
    defaultBackgroundUrl: string;
    musicUrl?: string; // Ambient track
    scenes: Record<string, VNScene>;
    initialSceneId: string;
    mode?: 'overlay' | 'fullscreen';
}

// --- Localization Architecture (Option A+) ---

export type SceneId = string;
export type ChoiceId = string;

export interface VNSceneLogic {
    id: SceneId;
    characterId?: CharacterId;
    backgroundUrl?: string; // Overrides default
    nextSceneId?: string; // Auto-advance

    choices?: {
        id: ChoiceId;
        nextSceneId?: string;
        type?: 'action' | 'inquiry' | 'flavor'; // Added here too
        actions?: VNAction[];
        condition?: (flags: Record<string, boolean>) => boolean;
        skillCheck?: VNSkillCheck;
    }[];

    onEnter?: VNAction[];

    // RPG: Passive Skill Checks resolved on entry
    passiveChecks?: VNSkillCheck[];
}

export interface VNScenarioLogic {
    id: string;
    title: string; // Internal title or fallback
    defaultBackgroundUrl: string;
    musicUrl?: string;
    initialSceneId: string;
    mode?: 'overlay' | 'fullscreen';
    scenes: Record<SceneId, VNSceneLogic>;
}

export interface VNContentPack {
    locale: string; // 'en' | 'de' | 'ru'
    scenes: Record<SceneId, {
        text: string;
        choices?: Record<ChoiceId, string>;
    }>;
}
