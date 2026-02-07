import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PointStateEnum } from '@repo/shared';
import type { VoiceId } from '../lib/parliament';
import { RPG_CONFIG, getXpToNextVoiceLevel } from '@repo/shared/lib/rpg-config';
import type { DossierSnapshot, DossierCheckState, DossierEntrySnapshot, DossierEvidenceSnapshot } from '@repo/contracts';
import { api } from '../../../shared/api/client';

import { DEDUCTION_REGISTRY } from '../lib/deductions';

export type DossierEntry = DossierEntrySnapshot;

export type Evidence = DossierEvidenceSnapshot;

const INITIAL_VOICE_STATS: Record<VoiceId, number> = {
    logic: 1, perception: 1, encyclopedia: 1,
    intuition: 1, empathy: 1, imagination: 1,
    authority: 1, charisma: 1, volition: 1,
    endurance: 1, agility: 1, senses: 1,
    stealth: 1, deception: 1, intrusion: 1,
    occultism: 1, tradition: 1, gambling: 1
};

const INITIAL_VOICE_XP: Record<VoiceId, number> = {
    logic: 0, perception: 0, encyclopedia: 0,
    intuition: 0, empathy: 0, imagination: 0,
    authority: 0, charisma: 0, volition: 0,
    endurance: 0, agility: 0, senses: 0,
    stealth: 0, deception: 0, intrusion: 0,
    occultism: 0, tradition: 0, gambling: 0
};

const createDefaultSnapshot = (): DossierSnapshot => ({
    entries: [],
    evidence: [],
    unlockedDeductions: [],
    pointStates: {},
    flags: {},
    activeCaseId: null,
    checkStates: {},
    xp: 0,
    level: 1,
    devPoints: 0,
    traits: [],
    voiceStats: { ...INITIAL_VOICE_STATS },
    voiceXp: { ...INITIAL_VOICE_XP }
});

const DOSSIER_ENTRY_TYPES = new Set<DossierEntry['type']>(['note', 'clue', 'fact', 'profile', 'document', 'intel']);
const CHECK_STATES = new Set<DossierCheckState>(['passed', 'failed', 'locked']);
const POINT_STATES = new Set<PointStateEnum>(['locked', 'discovered', 'visited', 'completed']);

const sanitizeStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    const unique = new Set<string>();
    value.forEach((entry) => {
        if (typeof entry !== 'string') return;
        const trimmed = entry.trim();
        if (trimmed.length === 0) return;
        unique.add(trimmed);
    });
    return Array.from(unique);
};

const sanitizeFlags = (value: unknown): Record<string, boolean> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }
    const result: Record<string, boolean> = {};
    Object.entries(value).forEach(([key, entry]) => {
        if (typeof entry === 'boolean') {
            result[key] = entry;
        }
    });
    return result;
};

const sanitizePointStates = (value: unknown): Record<string, PointStateEnum> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const result: Record<string, PointStateEnum> = {};
    Object.entries(value).forEach(([pointId, pointState]) => {
        if (typeof pointState !== 'string') return;
        if (!POINT_STATES.has(pointState as PointStateEnum)) return;
        result[pointId] = pointState as PointStateEnum;
    });
    return result;
};

const sanitizeCheckStates = (value: unknown): Record<string, DossierCheckState> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    const result: Record<string, DossierCheckState> = {};
    Object.entries(value).forEach(([checkId, checkState]) => {
        if (typeof checkState !== 'string') return;
        if (!CHECK_STATES.has(checkState as DossierCheckState)) return;
        result[checkId] = checkState as DossierCheckState;
    });
    return result;
};

const sanitizeVoiceMap = (value: unknown, fallbackMap: Record<VoiceId, number>): Record<VoiceId, number> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { ...fallbackMap };
    }

    const source = value as Record<string, unknown>;
    const result = { ...fallbackMap };
    (Object.keys(fallbackMap) as VoiceId[]).forEach((voiceId) => {
        const current = source[voiceId];
        if (typeof current === 'number' && Number.isFinite(current)) {
            result[voiceId] = Math.max(0, Math.floor(current));
        }
    });
    return result;
};

const sanitizeEntries = (value: unknown): DossierEntry[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): DossierEntry | null => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                return null;
            }

            const raw = entry as Record<string, unknown>;
            if (typeof raw.id !== 'string' || typeof raw.title !== 'string' || typeof raw.content !== 'string') {
                return null;
            }

            const type = typeof raw.type === 'string' && DOSSIER_ENTRY_TYPES.has(raw.type as DossierEntry['type'])
                ? raw.type as DossierEntry['type']
                : 'note';

            return {
                id: raw.id,
                type,
                title: raw.title,
                content: raw.content,
                isLocked: Boolean(raw.isLocked),
                packId: typeof raw.packId === 'string' ? raw.packId : '',
                timestamp: typeof raw.timestamp === 'number' && Number.isFinite(raw.timestamp)
                    ? Math.max(0, Math.floor(raw.timestamp))
                    : Date.now(),
                refId: typeof raw.refId === 'string' && raw.refId.trim().length > 0 ? raw.refId : undefined
            };
        })
        .filter((entry): entry is DossierEntry => entry !== null);
};

const sanitizeEvidence = (value: unknown): Evidence[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((entry): Evidence | null => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                return null;
            }
            const raw = entry as Record<string, unknown>;
            if (typeof raw.id !== 'string' || typeof raw.name !== 'string' || typeof raw.description !== 'string') {
                return null;
            }

            return {
                id: raw.id,
                name: raw.name,
                description: raw.description,
                icon: typeof raw.icon === 'string' ? raw.icon : undefined,
                packId: typeof raw.packId === 'string' ? raw.packId : ''
            };
        })
        .filter((entry): entry is Evidence => entry !== null);
};

const normalizeSnapshot = (snapshot: DossierSnapshot | undefined | null): DossierSnapshot => {
    const base = createDefaultSnapshot();
    if (!snapshot) {
        return base;
    }

    return {
        entries: sanitizeEntries(snapshot.entries),
        evidence: sanitizeEvidence(snapshot.evidence),
        unlockedDeductions: sanitizeStringArray(snapshot.unlockedDeductions),
        pointStates: sanitizePointStates(snapshot.pointStates),
        flags: sanitizeFlags(snapshot.flags),
        activeCaseId: typeof snapshot.activeCaseId === 'string' && snapshot.activeCaseId.trim().length > 0
            ? snapshot.activeCaseId
            : null,
        checkStates: sanitizeCheckStates(snapshot.checkStates),
        xp: typeof snapshot.xp === 'number' && Number.isFinite(snapshot.xp) ? Math.max(0, Math.floor(snapshot.xp)) : 0,
        level: typeof snapshot.level === 'number' && Number.isFinite(snapshot.level) ? Math.max(1, Math.floor(snapshot.level)) : 1,
        devPoints: typeof snapshot.devPoints === 'number' && Number.isFinite(snapshot.devPoints)
            ? Math.max(0, Math.floor(snapshot.devPoints))
            : 0,
        traits: sanitizeStringArray(snapshot.traits),
        voiceStats: sanitizeVoiceMap(snapshot.voiceStats, INITIAL_VOICE_STATS),
        voiceXp: sanitizeVoiceMap(snapshot.voiceXp, INITIAL_VOICE_XP)
    };
};

let dossierSyncTimer: ReturnType<typeof setTimeout> | null = null;

export interface DetectiveState {
    entries: DossierEntry[];
    evidence: Evidence[];
    unlockedDeductions: string[];

    pointStates: Record<string, PointStateEnum>;
    flags: Record<string, boolean>;
    activeCaseId: string | null;
    isDossierOpen: boolean;
    checkStates: Record<string, DossierCheckState>;

    xp: number;
    level: number;
    devPoints: number;
    traits: string[];

    voiceStats: Record<VoiceId, number>;
    voiceXp: Record<VoiceId, number>;

    addEntry: (entry: Omit<DossierEntry, 'timestamp'>) => 'added' | 'duplicate';
    unlockEntry: (id: string) => void;
    addEvidence: (item: Evidence) => void;
    combineEvidence: (id1: string, id2: string) => import('../lib/deductions').DeductionResult | null;

    grantXp: (amount: number) => void;
    gainVoiceXp: (id: VoiceId, amount: number) => void;
    spendDevPoint: (id: VoiceId) => void;
    addTrait: (trait: string) => void;

    setPointState: (pointId: string, state: PointStateEnum) => void;
    setFlag: (flag: string, value: boolean) => void;
    addFlags: (flags: Record<string, boolean>) => void;

    setVoiceLevel: (id: VoiceId, level: number) => void;
    recordCheckResult: (checkId: string, result: DossierCheckState) => void;

    setActiveCase: (caseId: string | null) => void;
    toggleDossier: (open?: boolean) => void;
    resetDossier: () => void;

    isServerHydrated: boolean;
    isSyncing: boolean;
    syncError: string | null;
    hydrateFromServer: () => Promise<void>;
    syncToServer: () => Promise<void>;
}

export const useDossierStore = create<DetectiveState>()(
    persist(
        (set, get) => {
            const queueSync = () => {
                const state = get();
                if (!state.isServerHydrated) {
                    return;
                }

                if (dossierSyncTimer) {
                    clearTimeout(dossierSyncTimer);
                }

                dossierSyncTimer = setTimeout(() => {
                    dossierSyncTimer = null;
                    if (get().isSyncing) {
                        queueSync();
                        return;
                    }
                    void get().syncToServer();
                }, 300);
            };

            const toSnapshot = (state: DetectiveState): DossierSnapshot => ({
                entries: state.entries,
                evidence: state.evidence,
                unlockedDeductions: state.unlockedDeductions,
                pointStates: state.pointStates,
                flags: state.flags,
                activeCaseId: state.activeCaseId,
                checkStates: state.checkStates,
                xp: state.xp,
                level: state.level,
                devPoints: state.devPoints,
                traits: state.traits,
                voiceStats: state.voiceStats,
                voiceXp: state.voiceXp
            });

            const hasLocalProgress = (state: DetectiveState): boolean => {
                if (state.entries.length > 0 || state.evidence.length > 0 || state.unlockedDeductions.length > 0) return true;
                if (Object.keys(state.pointStates).length > 0 || Object.keys(state.flags).length > 0 || Object.keys(state.checkStates).length > 0) return true;
                if (state.activeCaseId !== null) return true;
                if (state.xp > 0 || state.level > 1 || state.devPoints > 0 || state.traits.length > 0) return true;
                return (Object.keys(INITIAL_VOICE_STATS) as VoiceId[]).some((id) =>
                    state.voiceStats[id] !== INITIAL_VOICE_STATS[id] || state.voiceXp[id] !== INITIAL_VOICE_XP[id]
                );
            };

            return {
                entries: [],
                evidence: [],
                unlockedDeductions: [],
                pointStates: {},
                flags: {},
                activeCaseId: null,
                isDossierOpen: false,
                checkStates: {},

                xp: 0,
                level: 1,
                devPoints: 0,
                traits: [],

                voiceStats: { ...INITIAL_VOICE_STATS },
                voiceXp: { ...INITIAL_VOICE_XP },

                isServerHydrated: false,
                isSyncing: false,
                syncError: null,

                addEntry: (entry) => {
                    const state = get();
                    if (state.entries.some((e) => e.id === entry.id)) {
                        return 'duplicate';
                    }

                    set((prevState) => ({
                        entries: [...prevState.entries, { ...entry, timestamp: Date.now() }]
                    }));
                    queueSync();
                    return 'added';
                },

                grantXp: (amount) => {
                    set(state => {
                        const newXp = state.xp + amount;
                        const newLevel = 1 + Math.floor(newXp / 1000);

                        let devPointsGained = 0;
                        if (newLevel > state.level) {
                            const levelsGained = newLevel - state.level;
                            devPointsGained = levelsGained * RPG_CONFIG.DEV_POINTS_PER_LEVEL;
                        }
                        return {
                            xp: newXp,
                            level: newLevel,
                            devPoints: state.devPoints + devPointsGained
                        };
                    });
                    queueSync();
                },

                gainVoiceXp: (id, amount) => {
                    let changed = false;
                    set(state => {
                        const currentLevel = state.voiceStats[id] || 0;
                        const currentXp = state.voiceXp[id] || 0;

                        if (currentLevel >= RPG_CONFIG.MAX_VOICE_LEVEL) {
                            return {};
                        }

                        let newXp = currentXp + amount;
                        let newLevel = currentLevel;

                        let needed = getXpToNextVoiceLevel(newLevel);
                        while (newXp >= needed && newLevel < RPG_CONFIG.MAX_VOICE_LEVEL) {
                            newXp -= needed;
                            newLevel++;
                            needed = getXpToNextVoiceLevel(newLevel);
                        }

                        changed = true;
                        return {
                            voiceStats: { ...state.voiceStats, [id]: newLevel },
                            voiceXp: { ...state.voiceXp, [id]: newXp }
                        };
                    });
                    if (changed) {
                        queueSync();
                    }
                },

                spendDevPoint: (id) => {
                    let changed = false;
                    set(state => {
                        if (state.devPoints <= 0) return {};
                        const currentLevel = state.voiceStats[id] || 0;
                        if (currentLevel >= RPG_CONFIG.MAX_VOICE_LEVEL) return {};

                        changed = true;
                        return {
                            devPoints: state.devPoints - 1,
                            voiceStats: { ...state.voiceStats, [id]: currentLevel + 1 }
                        };
                    });

                    if (changed) {
                        queueSync();
                    }
                },

                addTrait: (trait) => {
                    let changed = false;
                    set(state => {
                        if (state.traits.includes(trait)) return state;
                        changed = true;
                        return { traits: [...state.traits, trait] };
                    });
                    if (changed) {
                        queueSync();
                    }
                },

                unlockEntry: (id) => {
                    let changed = false;
                    set(state => ({
                        entries: state.entries.map((e) => {
                            if (e.id === id && e.isLocked) {
                                changed = true;
                                return { ...e, isLocked: false };
                            }
                            return e;
                        })
                    }));

                    if (changed) {
                        queueSync();
                    }
                },

                addEvidence: (item) => {
                    let changed = false;
                    set(state => {
                        if (state.evidence.some((e) => e.id === item.id)) return state;
                        changed = true;
                        return { evidence: [...state.evidence, item] };
                    });
                    if (changed) {
                        queueSync();
                    }
                },

                combineEvidence: (id1, id2) => {
                    const state = get();
                    const inputs = [id1, id2].sort();

                    const deduction = Object.values(DEDUCTION_REGISTRY as Record<string, import('../lib/deductions').DeductionRecipe>).find(r =>
                        r.inputs.slice().sort().every((val, index) => val === inputs[index])
                    );

                    if (!deduction) return null;
                    if (state.unlockedDeductions.includes(deduction.id)) return null;

                    const result = deduction.result;
                    set((prevState) => {
                        const updates: Partial<DetectiveState> = {
                            unlockedDeductions: [...prevState.unlockedDeductions, deduction.id]
                        };

                        if (result.type === 'add_flag') {
                            updates.flags = { ...prevState.flags, [result.id]: true };
                        } else if (result.type === 'unlock_point') {
                            updates.pointStates = { ...prevState.pointStates, [result.id]: 'discovered' };
                        }

                        return updates;
                    });

                    queueSync();
                    return result;
                },

                setActiveCase: (caseId) => {
                    const current = get().activeCaseId;
                    if (current === caseId) {
                        return;
                    }
                    set({ activeCaseId: caseId });
                    queueSync();
                },

                toggleDossier: (open) => set((state) => ({
                    isDossierOpen: open !== undefined ? open : !state.isDossierOpen
                })),

                setPointState: (pointId, pointState) => {
                    const current = get().pointStates[pointId];
                    if (current === pointState) {
                        return;
                    }

                    set((state) => ({
                        pointStates: { ...state.pointStates, [pointId]: pointState },
                    }));
                    queueSync();
                },

                setFlag: (flag, value) => {
                    const current = get().flags[flag];
                    if (current === value) {
                        return;
                    }

                    set((state) => ({
                        flags: { ...state.flags, [flag]: value },
                    }));
                    queueSync();
                },

                addFlags: (newFlags) => {
                    if (Object.keys(newFlags).length === 0) {
                        return;
                    }
                    set((state) => ({
                        flags: { ...state.flags, ...newFlags }
                    }));
                    queueSync();
                },

                setVoiceLevel: (id, level) => {
                    const normalized = Math.max(0, Math.floor(level));
                    if (get().voiceStats[id] === normalized) {
                        return;
                    }

                    set((state) => ({
                        voiceStats: { ...state.voiceStats, [id]: normalized }
                    }));
                    queueSync();
                },

                recordCheckResult: (checkId, result) => {
                    if (get().checkStates[checkId] === result) {
                        return;
                    }

                    set((state) => ({
                        checkStates: { ...state.checkStates, [checkId]: result }
                    }));
                    queueSync();
                },

                resetDossier: () => {
                    set({
                        entries: [],
                        evidence: [],
                        unlockedDeductions: [],
                        pointStates: {},
                        flags: {},
                        checkStates: {},
                        xp: 0,
                        level: 1,
                        devPoints: 0,
                        traits: [],
                        voiceStats: { ...INITIAL_VOICE_STATS },
                        voiceXp: { ...INITIAL_VOICE_XP },
                        activeCaseId: null,
                        isDossierOpen: false
                    });
                    queueSync();
                },

                hydrateFromServer: async () => {
                    const current = get();
                    if (current.isServerHydrated || current.isSyncing) {
                        return;
                    }

                    set({ isSyncing: true, syncError: null });
                    const { data, error } = await api.dossier.snapshot.get();
                    if (error || !data?.success || !data.snapshot) {
                        set({
                            isSyncing: false,
                            isServerHydrated: true,
                            syncError: error?.message ?? data?.error ?? 'Failed to hydrate dossier from server'
                        });
                        return;
                    }

                    const serverSnapshot = normalizeSnapshot(data.snapshot);
                    const localState = get();
                    const useLocalAsSource =
                        serverSnapshot.entries.length === 0 &&
                        serverSnapshot.evidence.length === 0 &&
                        Object.keys(serverSnapshot.flags).length === 0 &&
                        Object.keys(serverSnapshot.pointStates).length === 0 &&
                        localState.isServerHydrated === false &&
                        hasLocalProgress(localState);

                    if (useLocalAsSource) {
                        set({
                            isSyncing: false,
                            isServerHydrated: true,
                            syncError: null
                        });
                        queueSync();
                        return;
                    }

                    set({
                        entries: serverSnapshot.entries,
                        evidence: serverSnapshot.evidence,
                        unlockedDeductions: serverSnapshot.unlockedDeductions,
                        pointStates: serverSnapshot.pointStates,
                        flags: serverSnapshot.flags,
                        activeCaseId: serverSnapshot.activeCaseId,
                        checkStates: serverSnapshot.checkStates,
                        xp: serverSnapshot.xp,
                        level: serverSnapshot.level,
                        devPoints: serverSnapshot.devPoints,
                        traits: serverSnapshot.traits,
                        voiceStats: sanitizeVoiceMap(serverSnapshot.voiceStats, INITIAL_VOICE_STATS),
                        voiceXp: sanitizeVoiceMap(serverSnapshot.voiceXp, INITIAL_VOICE_XP),
                        isSyncing: false,
                        isServerHydrated: true,
                        syncError: null
                    });
                },

                syncToServer: async () => {
                    const state = get();
                    if (!state.isServerHydrated) {
                        return;
                    }

                    set({ isSyncing: true, syncError: null });
                    const { data, error } = await api.dossier.snapshot.post({
                        body: {
                            snapshot: normalizeSnapshot(toSnapshot(get()))
                        }
                    });

                    if (error || !data?.success || !data.snapshot) {
                        set({
                            isSyncing: false,
                            syncError: error?.message ?? data?.error ?? 'Failed to sync dossier to server'
                        });
                        return;
                    }

                    const synced = normalizeSnapshot(data.snapshot);
                    set({
                        entries: synced.entries,
                        evidence: synced.evidence,
                        unlockedDeductions: synced.unlockedDeductions,
                        pointStates: synced.pointStates,
                        flags: synced.flags,
                        activeCaseId: synced.activeCaseId,
                        checkStates: synced.checkStates,
                        xp: synced.xp,
                        level: synced.level,
                        devPoints: synced.devPoints,
                        traits: synced.traits,
                        voiceStats: sanitizeVoiceMap(synced.voiceStats, INITIAL_VOICE_STATS),
                        voiceXp: sanitizeVoiceMap(synced.voiceXp, INITIAL_VOICE_XP),
                        isSyncing: false,
                        syncError: null
                    });
                }
            };
        },
        {
            name: 'gw4-detective-dossier',
            version: 2,
            migrate: (persistedState) => {
                const cast = persistedState as Partial<DetectiveState> | undefined;
                const snapshot = normalizeSnapshot(cast ? {
                    entries: cast.entries,
                    evidence: cast.evidence,
                    unlockedDeductions: cast.unlockedDeductions,
                    pointStates: cast.pointStates,
                    flags: cast.flags,
                    activeCaseId: cast.activeCaseId,
                    checkStates: cast.checkStates,
                    xp: cast.xp,
                    level: cast.level,
                    devPoints: cast.devPoints,
                    traits: cast.traits,
                    voiceStats: cast.voiceStats,
                    voiceXp: cast.voiceXp
                } as DossierSnapshot : null);

                return {
                    ...cast,
                    ...snapshot,
                    isServerHydrated: false,
                    isSyncing: false,
                    syncError: null
                };
            }
        }
    )
);
