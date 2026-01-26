import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { PointStateEnum as DetectivePointState } from '@repo/shared'

export type DossierEntryType = 'profile' | 'location' | 'intel' | 'clue'

export interface DossierEntry {
  id: string
  type: DossierEntryType
  title: string
  description: string
  image?: string
  unlockedAt: number
  isRead: boolean
}

export interface EvidenceItem {
  id: string
  label: string
  description: string
  icon?: string
  source: string // Where it was found
  timestamp: number
}

interface DossierState {
  entries: DossierEntry[]
  evidence: EvidenceItem[]
  pointStates: Record<string, DetectivePointState> // Map of point ID to state
  flags: Record<string, boolean> // Investigation progress flags
  detectiveName: string | null
  isOpen: boolean

  // Actions
  setDetectiveName: (name: string) => void
  addEntry: (entry: Omit<DossierEntry, 'unlockedAt' | 'isRead'>) => void
  addEvidence: (item: Omit<EvidenceItem, 'timestamp'>) => void
  setPointState: (pointId: string, state: DetectivePointState) => void
  unlockPoint: (pointId: string) => void // Legacy/Convenience: sets to 'discovered' if not already higher
  setFlag: (flag: string, value: boolean) => void
  addFlags: (flags: Record<string, boolean | number>) => void
  markAsRead: (entryId: string) => void
  toggleOpen: () => void
  setOpen: (isOpen: boolean) => void

  // Reset for new case or debug
  resetDossier: () => void
}

type DossierDataState = Pick<
  DossierState,
  'entries' | 'evidence' | 'pointStates' | 'flags' | 'detectiveName' | 'isOpen'
>

const initialState: DossierDataState = {
  entries: [],
  evidence: [],
  pointStates: {
    'bureau_office': 'discovered' as DetectivePointState,
    'hauptbahnhof': 'discovered' as DetectivePointState,
    // Others are locked by default in code logic if not present, but valid to be explicit
    'munsterplatz_bank': 'locked' as DetectivePointState,
    'ganter_brauerei': 'locked' as DetectivePointState,
    'rathaus_archiv': 'locked' as DetectivePointState,
    'basler_hof': 'locked' as DetectivePointState,
    'stuhlinger_warehouse': 'locked' as DetectivePointState
  },
  flags: {},
  detectiveName: null,
  isOpen: false
}

export const useDossierStore = create<DossierState>()(
  persist(
    (set: any) => ({
      ...initialState,

      addEntry: (entry: Omit<DossierEntry, 'unlockedAt' | 'isRead'>) => set((state: DossierState) => {
        if (state.entries.some((e: DossierEntry) => e.id === entry.id)) return {}
        return {
          entries: [
            { ...entry, unlockedAt: Date.now(), isRead: false },
            ...state.entries
          ]
        }
      }),

      addEvidence: (item: Omit<EvidenceItem, 'timestamp'>) => set((state: DossierState) => {
        if (state.evidence.some((e: EvidenceItem) => e.id === item.id)) return {}
        return {
          evidence: [
            { ...item, timestamp: Date.now() },
            ...state.evidence
          ]
        }
      }),

      setPointState: (pointId: string, pointState: DetectivePointState) => set((state: DossierState) => ({
        pointStates: { ...state.pointStates, [pointId]: pointState }
      })),

      unlockPoint: (pointId: string) => set((state: DossierState) => {
        // Only set to discovered if it's currently locked or undefined.
        // Don't downgrade 'active' or 'cleared'.
        const current = state.pointStates[pointId]
        if (current && current !== 'locked') return {}
        return {
          pointStates: { ...state.pointStates, [pointId]: 'discovered' as DetectivePointState }
        }
      }),

      setFlag: (flag: string, value: boolean) => set((state: DossierState) => ({
        flags: { ...state.flags, [flag]: !!value } // Ensure boolean if treating as flag
      })),

      addFlags: (flags: Record<string, boolean | number>) => set((state: DossierState) => ({
        flags: { ...state.flags, ...Object.fromEntries(Object.entries(flags).map(([k, v]) => [k, !!v])) }
      })),

      setDetectiveName: (name: string) => set({ detectiveName: name }),

      markAsRead: (entryId: string) => set((state: DossierState) => ({
        entries: state.entries.map((e: DossierEntry) =>
          e.id === entryId ? { ...e, isRead: true } : e
        )
      })),

      toggleOpen: () => set((state: DossierState) => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen: boolean) => set({ isOpen }),

      resetDossier: () => set({ ...initialState })
    }),
    {
      name: 'detective-dossier', // storage key
      storage: createJSONStorage(() => localStorage),
      // Don't persist UI state like 'isOpen' if preferred, but here we persist everything for simplicity
      // partialize: (state) => ({ ...state, isOpen: false }), 
    }
  )
)
