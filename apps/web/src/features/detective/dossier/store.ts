import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PointStateEnum } from '@repo/shared';
import type { VoiceId } from '../lib/parliament';
import { RPG_CONFIG, getXpToNextVoiceLevel } from '@repo/shared/lib/rpg-config';

import { DEDUCTION_REGISTRY } from '../lib/deductions';

export interface DossierEntry {
    id: string; // Hash(sceneId + text) for notes, or clue_id for clues
    type: 'note' | 'clue' | 'fact' | 'profile' | 'document' | 'intel';
    title: string;
    content: string;
    isLocked: boolean;
    packId: string;
    timestamp: number;
    refId?: string;
}

export interface Evidence {
    id: string;
    name: string;
    description: string;
    icon?: string;
    packId: string;
}

const INITIAL_VOICE_STATS: Record<VoiceId, number> = {
    // Intellect
    logic: 1, perception: 1, encyclopedia: 1,
    // Psyche
    intuition: 1, empathy: 1, imagination: 1,
    // Social
    authority: 1, charisma: 1, composure: 1,
    // Physical
    endurance: 1, agility: 1, forensics: 1,
    // Shadow
    stealth: 1, deception: 1, intrusion: 1,
    // Spirit
    occultism: 1, tradition: 1, poetics: 1
};

const INITIAL_VOICE_XP: Record<VoiceId, number> = {
    logic: 0, perception: 0, encyclopedia: 0,
    intuition: 0, empathy: 0, imagination: 0,
    authority: 0, charisma: 0, composure: 0,
    endurance: 0, agility: 0, forensics: 0,
    stealth: 0, deception: 0, intrusion: 0,
    occultism: 0, tradition: 0, poetics: 0
};

export interface DetectiveState {
    entries: DossierEntry[];
    evidence: Evidence[];
    unlockedDeductions: string[];

    // Engine State
    pointStates: Record<string, PointStateEnum>;
    flags: Record<string, boolean>;
    activeCaseId: string | null;
    isDossierOpen: boolean;
    checkStates: Record<string, 'passed' | 'failed' | 'locked'>;

    // RPG Stats
    xp: number;
    level: number;
    devPoints: number; // [NEW] Manual skill points
    traits: string[];

    voiceStats: Record<VoiceId, number>; // Level 1-20
    voiceXp: Record<VoiceId, number>;    // [NEW] Current XP for each voice

    // Actions
    addEntry: (entry: Omit<DossierEntry, 'timestamp'>) => 'added' | 'duplicate';
    unlockEntry: (id: string) => void;
    addEvidence: (item: Evidence) => void;
    combineEvidence: (id1: string, id2: string) => import('../lib/deductions').DeductionResult | null;

    // Progression Actions
    grantXp: (amount: number) => void;
    gainVoiceXp: (id: VoiceId, amount: number) => void; // [NEW] Usage based
    spendDevPoint: (id: VoiceId) => void;               // [NEW] Manual boost
    addTrait: (trait: string) => void;

    // Engine actions
    setPointState: (pointId: string, state: PointStateEnum) => void;
    setFlag: (flag: string, value: boolean) => void;
    addFlags: (flags: Record<string, boolean>) => void;

    // RPG Actions
    setVoiceLevel: (id: VoiceId, level: number) => void;
    recordCheckResult: (checkId: string, result: 'passed' | 'failed' | 'locked') => void;

    setActiveCase: (caseId: string | null) => void;
    toggleDossier: (open?: boolean) => void;
    resetDossier: () => void;
}

export const useDossierStore = create<DetectiveState>()(
    persist(
        (set, get) => ({
            entries: [],
            evidence: [],
            unlockedDeductions: [],
            pointStates: {},
            flags: {},
            activeCaseId: null,
            isDossierOpen: false,

            // Progression Defaults
            xp: 0,
            level: 1,
            devPoints: 0, // [NEW]
            traits: [],

            // Voice Stats & XP
            voiceStats: { ...INITIAL_VOICE_STATS },
            voiceXp: { ...INITIAL_VOICE_XP },
            checkStates: {},

            addEntry: (entry) => {
                const state = get();
                if (state.entries.some((e) => e.id === entry.id)) {
                    return 'duplicate';
                }

                set((state) => ({
                    entries: [...state.entries, { ...entry, timestamp: Date.now() }]
                }));
                return 'added';
            },

            grantXp: (amount) => set(state => {
                const newXp = state.xp + amount;
                // Simple leveling: Level = 1 + floor(xp / 1000)
                const newLevel = 1 + Math.floor(newXp / 1000);

                let devPointsGained = 0;
                if (newLevel > state.level) {
                    console.log(`🎉 Character Level Up! ${state.level} -> ${newLevel}`);
                    // Grant Dev Points for each level gained
                    const levelsGained = newLevel - state.level;
                    devPointsGained = levelsGained * RPG_CONFIG.DEV_POINTS_PER_LEVEL;
                }
                return {
                    xp: newXp,
                    level: newLevel,
                    devPoints: state.devPoints + devPointsGained
                };
            }),

            gainVoiceXp: (id, amount) => set(state => {
                const currentLevel = state.voiceStats[id] || 0;
                const currentXp = state.voiceXp[id] || 0;

                if (currentLevel >= RPG_CONFIG.MAX_VOICE_LEVEL) {
                    return {}; // Cap reached
                }

                let newXp = currentXp + amount;
                let newLevel = currentLevel;

                // Recursive Level Up Check
                let needed = getXpToNextVoiceLevel(newLevel);
                while (newXp >= needed && newLevel < RPG_CONFIG.MAX_VOICE_LEVEL) {
                    newXp -= needed;
                    newLevel++;
                    console.log(`🧠 Voice Level Up! ${id}: ${currentLevel} -> ${newLevel}`);
                    needed = getXpToNextVoiceLevel(newLevel);
                }

                return {
                    voiceStats: { ...state.voiceStats, [id]: newLevel },
                    voiceXp: { ...state.voiceXp, [id]: newXp }
                };
            }),

            spendDevPoint: (id) => set(state => {
                if (state.devPoints <= 0) return {};
                const currentLevel = state.voiceStats[id] || 0;
                if (currentLevel >= RPG_CONFIG.MAX_VOICE_LEVEL) return {};

                return {
                    devPoints: state.devPoints - 1,
                    voiceStats: { ...state.voiceStats, [id]: currentLevel + 1 }
                };
            }),

            addTrait: (trait) => set(state => {
                if (state.traits.includes(trait)) return state;
                return { traits: [...state.traits, trait] };
            }),

            unlockEntry: (id) =>
                set((state) => ({
                    entries: state.entries.map((e) =>
                        e.id === id ? { ...e, isLocked: false } : e
                    ),
                })),

            addEvidence: (item) =>
                set((state) => {
                    if (state.evidence.some((e) => e.id === item.id)) return state;
                    return { evidence: [...state.evidence, item] };
                }),

            combineEvidence: (id1, id2) => {
                const state = get();

                // Sort to ensure order independence
                const inputs = [id1, id2].sort();

                // Find matching deduction
                const deduction = Object.values(DEDUCTION_REGISTRY as Record<string, import('../lib/deductions').DeductionRecipe>).find(r =>
                    r.inputs.slice().sort().every((val, index) => val === inputs[index])
                );

                if (!deduction) return null;
                if (state.unlockedDeductions.includes(deduction.id)) return null; // Already deduced

                // Apply effects
                const result = deduction.result;
                set((state) => {
                    const updates: Partial<DetectiveState> = {
                        unlockedDeductions: [...state.unlockedDeductions, deduction.id]
                    };

                    if (result.type === 'add_flag') {
                        updates.flags = { ...state.flags, [result.id]: true };
                    } else if (result.type === 'unlock_point') {
                        updates.pointStates = { ...state.pointStates, [result.id]: 'discovered' };
                    }

                    return updates;
                });

                return result;
            },

            setActiveCase: (caseId) => set({ activeCaseId: caseId }),

            toggleDossier: (open) => set((state) => ({
                isDossierOpen: open !== undefined ? open : !state.isDossierOpen
            })),

            setPointState: (pointId, pointState) =>
                set((state) => ({
                    pointStates: { ...state.pointStates, [pointId]: pointState },
                })),

            setFlag: (flag, value) =>
                set((state) => ({
                    flags: { ...state.flags, [flag]: value },
                })),

            addFlags: (newFlags) =>
                set((state) => ({
                    flags: { ...state.flags, ...newFlags }
                })),

            setVoiceLevel: (id, level) => set((state) => ({
                voiceStats: { ...state.voiceStats, [id]: level }
            })),

            recordCheckResult: (checkId, result) => set((state) => ({
                checkStates: { ...state.checkStates, [checkId]: result }
            })),

            resetDossier: () =>
                set({
                    entries: [],
                    evidence: [],
                    unlockedDeductions: [],
                    pointStates: {},
                    flags: {},
                    checkStates: {},

                    // Progression Reset
                    xp: 0,
                    level: 1,
                    devPoints: 0,
                    traits: [],

                    // Reset voices
                    voiceStats: { ...INITIAL_VOICE_STATS },
                    voiceXp: { ...INITIAL_VOICE_XP },
                    activeCaseId: null,
                    isDossierOpen: false
                }),
        }),
        {
            name: 'gw4-detective-dossier',
        }
    )
);
