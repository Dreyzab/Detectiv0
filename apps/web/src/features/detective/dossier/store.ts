import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PointStateEnum } from '@repo/shared';

// Re-export or use shared types where possible
export interface DossierEntry {
    id: string;
    type: 'fact' | 'profile' | 'document' | 'intel';
    title: string;
    content: string;
    isLocked: boolean;
    packId: string;
}

export interface Evidence {
    id: string;
    name: string;
    description: string;
    icon?: string;
    packId: string;
}

export interface DetectiveState {
    entries: DossierEntry[];
    evidence: Evidence[];
    // Core engine state
    pointStates: Record<string, PointStateEnum>;
    flags: Record<string, boolean>;
    activeCaseId: string | null;

    // Actions
    addEntry: (entry: DossierEntry) => void;
    unlockEntry: (id: string) => void;
    addEvidence: (item: Evidence) => void;

    // Engine actions
    setPointState: (pointId: string, state: PointStateEnum) => void;
    setFlag: (flag: string, value: boolean) => void;
    addFlags: (flags: Record<string, boolean>) => void;

    setActiveCase: (caseId: string | null) => void;
    resetDossier: () => void;
}

export const useDossierStore = create<DetectiveState>()(
    persist(
        (set) => ({
            entries: [],
            evidence: [],
            pointStates: {},
            flags: {},
            activeCaseId: null,

            addEntry: (entry) =>
                set((state) => {
                    if (state.entries.some((e) => e.id === entry.id)) return state;
                    return { entries: [...state.entries, entry] };
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

            setActiveCase: (caseId) => set({ activeCaseId: caseId }),

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

            resetDossier: () =>
                set({
                    entries: [],
                    evidence: [],
                    pointStates: {},
                    flags: {},
                    activeCaseId: null,
                }),

        }),
        {
            name: 'gw4-detective-dossier',
        }
    )
);
