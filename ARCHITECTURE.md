# Project Architecture — Grezwanderer 4

## 🏗 High-Level Overview

Grezwanderer 4 is a multi-modal gaming platform built with a **Modular Monorepo** approach. It combines Visual Novel (VN) storytelling, Map-based exploration, and RPG combat mechanics.

The project is structured according to **Feature-Sliced Design (FSD)** principles on the frontend and a **Module-based** architecture on the backend.

---

## 📂 Directory Structure

### `apps/web` (Frontend: React + Vite)
Follows FSD (Feature-Sliced Design):
- **app/**: Global setup (providers, styles, entry point).
- **pages/**: Application screens (HomePage, MapPage, QRScanner, CharacterPage).
- **widgets/**: Composition layer (MapView, Dossier, CombatHUD).
- **features/**: User-facing capabilities (Detective Mode, Layer Toggles, Movement).
- **entities/**: Business logic and stores (User, Inventory, VisualNovel, Quest).
- **shared/**: Reusable UI components and pure logic (UI Kit, Mapbox Libs, i18n).

### `apps/server` (Backend: ElysiaJS + Bun + Supabase/PostgreSQL)
- **db/**: Drizzle schema (`schema.ts` — `map_points`, `event_codes`, `quests`, `detective_saves`, etc.) and migrations.
- **modules/**: API endpoints:
  - `map.ts`: `GET /map/points` (DB-backed), `GET /map/resolve-code/:code` (event codes + QR).
  - `detective.ts`: Save/load system.
  - `health.ts`, `admin.ts`.
- **drizzle/**: Generated SQL migrations (`0000_*.sql`, `0001_*.sql`).

### `packages/shared`
- **data/**: Consolidated game data — `parliament.ts` (18 voices, single source of truth), `characters.ts`, `battle.ts`, `constants.ts`.
- **lib/**: Shared logic — `map-validators.ts` (Zod schemas for MapAction, Bindings), `dice.ts` (D20 skill checks), `rpg-config.ts`, `detective_map_types.ts`.
- **locales/**: i18n dictionaries (`en.ts`, `ru.ts`).

---

## 🕵️ Detective Mode Architecture
## Game Modes
Currently the project focuses on **Detective Mode** (Freiburg 1905).
-   **Detective Mode**: Narrative-heavy exploration of historical settings.
- **Content Pack**: Data specific to a case (e.g., *Freiburg 1905*). Includes POIs (Points of Interest), Scenario scripts (VN), Evidence data, and region-specific assets.

### Key Data Flows
1. **The Investigation Loop**:
   `Map Point (DB) → Binding Trigger → VN Scenario → Evidence/Flag Unlock → Progression`.
2. **QR/Event Code Resolution**:
   `QR Scan / Manual Code → GET /map/resolve-code/:code → Server checks event_codes (stateless) → then map_points QR (stateful unlock) → Returns typed MapAction[]`.
3. **Mind Palace (Passive Checks)**:
   `Scene Enter → passiveChecks[] evaluated → performSkillCheck(voiceLevel, difficulty) → Success: VoiceOrb + ThoughtCloud overlay → Auto-dismiss 6s`.
4. **Persistence**:
   Uses Zustand `persist` middleware with localStorage for offline-first investigation progress (Dossier Store, 5 persisted stores).
5. **Visual Effects**:
   Dynamic CSS filters (`sepia`, `contrast`) paired with high-resolution grain/paper textures to create historical immersion.

### Data Architecture (v3 — Post-Migration)

| Domain | Source | Status |
|--------|--------|--------|
| **Map Points** | Supabase (`map_points`) with JSON `bindings` | ✅ Migrated |
| **Event Codes** | Supabase (`event_codes`) — QR/manual codes | ✅ Migrated |
| **User Progress** | Supabase (`user_map_point_user_states`) | ✅ Migrated |
| **Quests** | Supabase (`quests`, `user_quests`) | ✅ Migrated |
| **Parliament** | `packages/shared/data/parliament.ts` (consolidated) | ✅ Single Source |
| **Characters** | `packages/shared/data/characters.ts` | Static |
| **Battle Cards** | `packages/shared/data/battle.ts` | Static |
| **Cases/Chapters** | `features/detective/data/cases.ts` | ⏳ Phase 3 → DB |
| **Deductions** | `features/detective/lib/deductions.ts` | ⏳ Phase 3 → DB |

> **Note**: `hardlinks.ts` has been **deleted**. Its data was split into `map_points.bindings` (location actions) and `event_codes` table (QR/manual codes).

---

## 🔄 State Management

- **Global UI/Game State**: Zustand (5 persisted stores: `inventory`, `dossier`, `quest`, `vn`, `character`).
- **Server Sync**: Eden Treaty client (`apps/web/src/shared/api/client.ts`) with typed API calls. Used in `useMapPoints` and `QRScannerPage`.
- **Server State Cache**: React Query (`@tanstack/react-query`, staleTime 5min) wrapping Eden Treaty calls.
- **Persistence**: LocalStorage keys: `gw4-inventory-storage`, `gw4-detective-dossier`, `gw4-quest-store`, `gw4-vn-store`, `character-storage`.

## 🧠 Mind Palace Architecture

The Mind Palace is a passive skill check system integrated into the VN engine.

### Components (`features/detective/mind-palace/`)
- **`usePassiveChecks(scene)`**: Hook that evaluates `scene.passiveChecks[]` on scene entry. Uses `processedSceneIdRef` to prevent re-rolls. Records results via `recordCheckResult`. Auto-dismisses after 6s.
- **`MindPalaceOverlay`**: Container reading VN store state, rendering VoiceOrb + ThoughtCloud when a passive check succeeds.
- **`VoiceOrb`**: Animated circle with group color (`getVoiceColor`), pulsating glow via framer-motion.
- **`ThoughtCloud`**: Art Deco styled text card with voice name header, fade-in animation.

### Integration
- **MobileVNLayout** (fullscreen): `z-[125]` — between cinematic header and dialogue panel.
- **VisualNovelOverlay** (map overlay): `z-[210]` — above VN panel, below toast notifications.

### Data Schema
```typescript
// In VNScene / VNSceneLogic:
passiveChecks?: VNSkillCheck[];

// VNSkillCheck extended fields:
isPassive?: boolean;
passiveText?: string;       // Shown on success
passiveFailText?: string;   // Optional, for future use
```

---

## 🗺 Mapbox Integration

- **Engine**: Mapbox v8.
- **Custom Styling**: In-house historical styles via Mapbox Studio.
- **Optimization**:
    - **Pathfinding**: Cached navigation requests to reduce API calls.
    - **Interpolation**: Client-side coordinate calculation for smooth marker movement without React re-renders.

---

## 🛠 Automation & Quality

- **Plop.js**: Scaffolding for FSD layers (`bun run generate`).
- **Husky + lint-staged**: Pre-commit hooks for linting and type checking.
- **Playwright E2E**: Config at root, smoke test in `e2e/smoke.spec.ts`. Run: `bun run test:e2e`.
- **Drizzle Migrations**: `bun drizzle-kit generate` for schema changes. Migrations in `apps/server/drizzle/`.
- **Master Scripts**: `.agent/scripts/checklist.py` for comprehensive project audits.
