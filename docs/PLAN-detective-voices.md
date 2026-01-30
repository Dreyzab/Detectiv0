# Plan: Detective Mode "Mind Palace" & Voices (RPG Depth)

> **Goal**: Transform the Detective Mode from a linear Visual Novel into a deep RPG experience by implementing the "Parliament of Voices" skill system (Logic, Empathy, Authority, etc.).

---

## Phase 0: Socratic Gate ✅

### Key Questions & Decisions

| # | Вопрос | Решение | Обоснование |
|---|--------|---------|-------------|
| 1 | **Red vs White Checks** | **Red = One-time, White = Retryable** | Red Checks lock upon failure (show "FAILED" permanently). White Checks can be retried after leveling up the voice. |
| 2 | **Critical Rolls (Nat 1/20)** | **Nat 20 = Auto-Success, Nat 1 = Auto-Fail** | Adds drama. Critical success/fail triggers unique text/actions. |
| 3 | **Check Retry Condition** | **White Check unlocks when `voiceLevel >= difficulty - 2`** | Prevents immediate re-roll spam; requires investment. |
| 4 | **Passive Checks** | **Yes, for "insight" moments** | Auto-triggered on scene entry (e.g., Perception notice). Player sees result, no choice. |
| 5 | **Check UI Style** | **Disco Elysium-inspired** (see Design Ref below) | Color-coded by Voice Group, difficulty shown as text (Trivial/Easy/Medium/Hard/Heroic). |
| 6 | **parliament.ts Location** | **Single Source: `@repo/shared/data/parliament.ts`** | Frontend re-exports from shared. Prevents drift. ✅ Already resolved. |

### Design Reference: Skill Check UI

```
┌─────────────────────────────────────────────────────┐
│  [LOGIC - MEDIUM 12]  Analyze the safe mechanism    │  ← Voice color (Blue for Intellect)
│  ─────────────────────────────────────────────────  │
│  Your current level: 6  |  Success chance: ~40%     │  ← Probability hint
│  ◉ Red Check (One Attempt)                          │  ← Lock indicator
└─────────────────────────────────────────────────────┘
```

**Visual Elements**:
- **Voice Color**: Matches group (Intellect=Blue, Psyche=Purple, Social=Gold, Physical=Green, Shadow=Gray, Spirit=Cyan).
- **Difficulty Label**: `Trivial (6) / Easy (8) / Medium (12) / Hard (14) / Heroic (18)`.
- **Lock Icon**: 🔒 for Red Checks (one-time), 🔄 for White Checks (retryable).
- **Result Animation**: Dice roll (d20) appears on screen, result compared to target. Success = green flash + unlock. Fail = red flash + "FAILED" stamp.

---

## 1. Context & Architecture

The project needs to integrate an **RPG Skill System** where:
1.  The player has 18 "Voices" (Skills) with levels.
2.  VN Choices can require Skill Checks (e.g., `[Logic: Medium] Analyze the safe`).
3.  Success/Failure leads to different branches or effects.

**Key Assets**:
- `parliament.ts` (Root): Defines the 18 voices and groups definitively.
- `apps/web/src/features/detective/lib/parliament.ts`: A duplicate definition? We must standardize on one (Use Root `parliament.ts` or sync them).
- `DossierStore`: The central store for Detective Mode state.

## 2. Architecture Updates

### 2.1 Schema Extensions (`entities/visual-novel/model/types.ts`)
Update `VNChoice` to support robust skill checks.

```typescript
import { VoiceId } from '@/features/detective/lib/parliament'; // Ensure correct import

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
    
    isPassive?: boolean; // If true, performed automatically on entering scene? (Future scope)
}

// Update VNChoice
export interface VNChoice {
    // ... functional fields
    skillCheck?: VNSkillCheck;
    condition?: (flags: Record<string, boolean>) => boolean; // Ensure this is usable
}
```

### 2.2 Stats Management (`DossierStore` update)
Instead of a new store, extend `useDossierStore` to manage Voice stats, keeping "One Truth".

```typescript
interface DossierState {
  // ... existing fields
  voiceStats: Record<VoiceId, number>; // Level (1-20)
  checkStates: Record<string, 'passed' | 'failed' | 'locked'>; // Memory of checks
  
  // Actions
  setVoiceLevel: (id: VoiceId, level: number) => void;
  recordCheckResult: (checkId: string, result: 'passed' | 'failed') => void;
}
```

### 2.3 Shared Logic (`packages/shared/lib/dice.ts`)
Extract dice logic to a pure function for testability.
```typescript
export function performSkillCheck(level: number, difficulty: number): { success: boolean, roll: number } {
    const roll = Math.floor(Math.random() * 20) + 1;
    // Critical Success/Fail logic can go here (nat 20 / nat 1)
    return { success: (roll + level) >= difficulty, roll };
}
```

## 3. UI Implementation (`VisualNovelOverlay`)

### 3.1 Choice Rendering
- Render Skill Checks with distinct UI (Color-coded by Voice Group).
- Show probability or simple "Easy/Medium/Hard" label based on (Level vs Difficulty).
- Handle `locked` state if check was failed previously (Red Checks) or allow retry (White Checks - future scope).

### 3.2 Check Handler
On clicking a choice with `skillCheck`:
1.  Check `dossierStore.checkStates[check.id]`.
2.  Get `voiceStats[check.voiceId]`.
3.  Call `performSkillCheck`.
4.  Update `checkStates` and show feedback.
5.  Execute `onSuccess` or `onFail` actions/navigation.

## 4. Task Breakdown

### Phase 1: Core Mechanics & Schema
- [ ] Create `packages/shared/lib/dice.ts` (Dice logic).
- [ ] Update `features/detective/dossier/store.ts` (Add `voiceStats`, `checkStates`).
- [ ] Update `entities/visual-novel/model/types.ts` (Add `VNSkillCheck`).
- [ ] Ensure `parliament.ts` is correctly shared/imported.

### Phase 2: UI & Integration
- [ ] Update `VisualNovelOverlay.tsx`: 
    - [ ] Add `handleSkillCheck` flow.
    - [ ] Visuals for checks (Disco Elysium style).
    - [ ] Feedback animations.

### Phase 3: Content (Vertical Slice)
- [ ] Refactor `case1_bank.ts` to include:
    - [ ] `chk_logic_safe`: Logic check to find hidden compartment.
    - [ ] `chk_auth_clerk`: Authority check to pressure the clerk.
- [ ] Verify persistence (reload page -> check result remembered).

## 5. Verification
- Open Detective Mode -> Bank Scene.
- Verify "Logic" check appears.
- Click it -> Verify Store update + Navigation.
- Verify "Check Choice" is locked/marked after attempt.
