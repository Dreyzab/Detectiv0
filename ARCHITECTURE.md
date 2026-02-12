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
- **shared/**: Reusable UI components and pure logic (UI Kit, Mapbox Libs, i18n, react-i18next).

### `apps/server` (Backend: ElysiaJS + Bun + Supabase/PostgreSQL)
- **db/**: Drizzle schema (`schema.ts` — `map_points`, `event_codes`, `quests`, `detective_saves`, etc.) and migrations.
- **modules/**: API endpoints:
  - `map.ts`: `GET /map/points` (DB-backed, `packId/caseId/regionId`), `POST /map/resolve-code` (primary QR/event entry), `GET /map/resolve-code/:code` (legacy compatibility).
  - `detective.ts`: Save/load system.
  - `inventory.ts`: `GET/POST /inventory/snapshot` for persisted inventory snapshots.
  - `quests.ts`: `GET/POST /quests/snapshot` for persisted quest-state snapshots.
  - `dossier.ts`: `GET/POST /dossier/snapshot` for persisted detective dossier snapshots.
  - `health.ts`, `admin.ts`, `engine.ts`.
- **drizzle/**: Generated SQL migrations (`0000_*.sql`, `0001_*.sql`).

### `packages/shared`
- **data/**: Consolidated game data — `parliament.ts` (18 voices, single source of truth), `characters.ts`, `battle.ts`, `constants.ts`.
- **lib/**: Shared logic — `map-validators.ts` (Zod schemas for MapAction, Bindings), `dice.ts` (D20 skill checks), `rpg-config.ts`, `detective_map_types.ts`.
- **locales/**: Legacy i18n dictionaries (`en.ts`, `ru.ts`).
  > **Note**: UI локализация мигрирована на `react-i18next` с JSON namespace файлами в `apps/web/public/locales/{lang}/{namespace}.json`. Компоненты используют `useTranslation` хук. `LanguageSwitcher` в Navbar.

---

## 🕵️ Detective Mode Architecture
## Game Modes
Currently the project focuses on **Detective Mode**.
-   **Detective Mode**: Narrative-heavy exploration of historical settings.
- **Content Pack**: Data specific to a city/case context (for example, `fbg1905`, `ka1905`). Includes POIs, VN scenarios, tooltip set, region settings, and pack-specific defaults.

### Multi-City Runtime (Option A, C-ready)
- Active city context is explicit and persisted via `apps/web/src/features/region/model/store.ts`:
  - `activeRegionId: RegionId | null`
  - persist key: `gw4-region-storage`
- Canonical region metadata is shared in `packages/shared/data/regions.ts`:
  - `FREIBURG_1905` -> `fbg1905`
  - `karlsruhe_default` -> `ka1905`
  - default radius: `DEFAULT_REGION_RADIUS_KM = 10`
- City/pack metadata remains centralized in `packages/shared/data/pack-meta.ts` (`PACK_META`, `DEFAULT_PACK_ID`, `getPackMeta`).
- Frontend routing is city-aware:
  - `/city/:packId/map`
  - `/city/:packId/vn/:scenarioId`
  - `/map` acts as a compatibility route and redirects to `/` if `activeRegionId` is not set.
- `/city/:packId/map` synchronizes `activeRegion` from route `packId` (source: `route`) to keep URL/store aligned.
- Contract remains backward-compatible: if `regionId` is omitted in map query, backend keeps legacy behavior without distance filtering.

### QR Entry Architecture (Option A+)
- Dedicated QR entry route:
  - `/entry/:packId`
- Dispatcher page:
  - `apps/web/src/pages/EntryPage.tsx`
  - known `fbg1905` -> redirect to `/`
  - known `ka1905` -> render Karlsruhe onboarding
  - unknown pack -> redirect to `/`
- Karlsruhe onboarding page:
  - `apps/web/src/pages/KarlsruheEntryPage.tsx`
  - step 1: language selection (`useVNStore.setLocale`)
  - step 2: origin selection (mutually exclusive `ka_origin_*` flags)
  - step 3: start and redirect to `/city/ka1905/map`
- State and persistence:
  - language in `useVNStore.locale`
  - onboarding and origin state in dossier flags (`ka_onboarding_complete`, `ka_origin_*`)
  - uses existing persisted + server-synced dossier infrastructure
- Guard behavior:
  - waits for dossier hydration before route decision
  - skips onboarding when `ka_onboarding_complete` already exists
- Implementation hardening:
  - selected origin in Karlsruhe onboarding uses derived state (`selectedOrigin ?? initialOrigin`) instead of effect-driven sync to avoid cascading renders.

### Key Data Flows
1. **The Investigation Loop**:
   `Map Point (DB) → Binding Trigger → VN Scenario → Evidence/Flag Unlock → Progression`.
2. **QR/Event Code Resolution**:
   `QR Scan / Manual Code → POST /map/resolve-code → Server checks event_codes (stateless) → then map_points QR (stateful unlock) → Returns typed MapAction[]`.
   Gateway codes may execute chained actions such as `set_region → set_active_case → start_vn`.
3. **Mind Palace (Passive Checks)**:
   `Scene Enter → passiveChecks[] evaluated → performSkillCheck(voiceLevel, difficulty) → Success: VoiceOrb + ThoughtCloud overlay → Auto-dismiss 6s`.
4. **Persistence**:
   Uses Zustand `persist` middleware with localStorage for offline-first investigation progress (Dossier + region-aware stores, 6 persisted stores).
5. **Visual Effects**:
   Dynamic CSS filters (`sepia`, `contrast`) paired with high-resolution grain/paper textures to create historical immersion.

### Data Architecture (v3 — Post-Migration)

| Domain | Source | Status |
|--------|--------|--------|
| **Map Points** | Supabase (`map_points`) with JSON `bindings` | ✅ Migrated |
| **Event Codes** | Supabase (`event_codes`) — QR/manual codes | ✅ Migrated |
| **User Progress** | Supabase (`user_map_point_states`) | ✅ Migrated |
| **Quests** | Supabase (`quests`, `user_quests`) | ✅ Migrated |
| **Parliament** | `packages/shared/data/parliament.ts` (consolidated) | ✅ Single Source |
| **Characters** | `packages/shared/data/characters.ts` | Static |
| **Battle Cards** | `packages/shared/data/battle.ts` | Static |
| **Cases/Chapters** | `features/detective/data/cases.ts` | ⏳ Phase 3 → DB |
| **Deductions** | `features/detective/lib/deductions.ts` | ⏳ Phase 3 → DB |

> **Note**: `hardlinks.ts` has been **deleted**. Its data was split into `map_points.bindings` (location actions) and `event_codes` table (QR/manual codes).

---

## 🔄 State Management

- **Global UI/Game State**: Zustand (6 persisted stores: `inventory` (Slots + Money), `dossier`, `quest`, `vn`, `character`, `region`).
- **Server Sync**: Contract-driven API client (`apps/web/src/shared/api/client.ts`) with typed API calls. Used in map, engine, and inventory snapshot flows.
- **Server State Cache**: React Query (`@tanstack/react-query`, staleTime 5min) wrapping contract-driven API calls.
- **Persistence**: LocalStorage keys: `gw4-inventory-storage`, `gw4-detective-dossier`, `gw4-quest-store`, `gw4-vn-store`, `character-storage`, `gw4-region-storage`.
- **Inventory persistence model**: local snapshot in Zustand + backend snapshot in `user_inventory_snapshots` via `/inventory/snapshot`.
- **Quest persistence model**: local snapshot in Zustand + backend snapshot in `user_quests` via `/quests/snapshot`.
- **Dossier persistence model**: local snapshot in Zustand + backend snapshot in `user_dossier_snapshots` via `/dossier/snapshot`.

## Dossier Psyche Profile Architecture

- `CharacterPage` now derives a dedicated psyche layer from multiple stores:
  - `useDossierStore`: flags, check history, traits.
  - `useWorldEngineStore`: faction reputation vectors.
  - `useQuestStore`: quest stage positions.
  - `useCharacterStore`: relationship pressure values.
- Derivation logic is isolated in `apps/web/src/pages/CharacterPage/psycheProfile.ts` (`buildPsycheProfile`) for deterministic rendering and testability.
- Player-facing outputs:
  - alignment + faction signals,
  - unlocked/locked knowledge entries (secrets),
  - evolution tracks (case + companion arcs),
  - field-check reliability summary.

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

## 2026-02-06 - Controlled Map Integration Contour

### Map module testability
- `apps/server/src/modules/map.ts` now exports `createMapModule(repository?: MapRepository)` and `createDrizzleMapRepository()`.
- Route logic is decoupled from Drizzle queries via `MapRepository`, so integration tests can run against deterministic in-memory data.

### Covered integration behavior
- `GET /map/points`: visibility filtering by `scope`, `retention_policy`, `active`, active case (`caseId`), and optional region radius filtering (`regionId`).
- `GET /map/points` returns `400` for unknown `regionId` and for `packId`/`regionId` conflicts.
- `POST /map/resolve-code` (and legacy `GET /map/resolve-code/:code`): event-code resolution path (`event_codes`) and QR map-point path with lifecycle upsert.
- Unknown codes return `404` with a stable error payload.

### Validation commands
- `bun test apps/server/test/modules/map.test.ts`
- `bun test apps/server/test/simple.test.ts`
- `bun test packages/shared/lib/map-resolver.test.ts`
- `bun x tsc -p apps/server/tsconfig.json --noEmit`

## 🧠 Knowledge Base & Narrative Source of Truth

Проект использует гибридную документацию:
1.  **Code (Implementation)**: `apps/` & `packages/` — истина в последней инстанции для механик и формул.
2.  **Obsidian Vault (Narrative & Intent)**: `obsidian/Detectiv` — истина для Сюжета, Лoра, Персонажей и Геймдизайн-документации.
    *   **Structure**: Neural Network style (Zettelkasten).
    *   **Pillars**: Deduction, Contradiction, Investigation (см. `Manifesto_Detective_Philosophy.md`).
    *   **Git Policy**: Папка `obsidian/` исключена из репозитория (Gitignored) для безопасности черновых наработок.
    *   **Core control notes**:
        - `obsidian/Detectiv/99_System/Creator_Framework.md`
        - `obsidian/Detectiv/20_Game_Design/Systems/Sys_Investigation.md`
        - `obsidian/Detectiv/20_Game_Design/Systems/Sys_FogOfWar.md`
        - `obsidian/Detectiv/00_Map_Room/00_Start_Here.md`
        - `obsidian/Detectiv/00_Map_Room/Sprint_Current.md`


## Detective Engine v1 (2026-02-07)

### New backend module: `engine.ts`
- The backend now contains a dedicated world-simulation module: `apps/server/src/modules/engine.ts`.
- Engine API surface:
  - `GET /engine/world`
  - `POST /engine/time/tick`
  - `POST /engine/travel/start`
  - `POST /engine/travel/complete/:sessionId`
  - `POST /engine/case/advance`
  - `POST /engine/progress/apply`
  - `POST /engine/evidence/discover`

### Engine storage model
- Engine persistence is implemented in Postgres via Drizzle schema:
  `world_clocks`, `city_routes`, `travel_sessions`, `cases`, `case_objectives`,
  `user_case_progress`, `player_progression`, `voice_progression`, `factions`,
  `user_faction_reputation`, `user_character_relations`, `evidence_catalog`,
  `user_evidence`, `domain_event_log`.
- This introduces event-log capable architecture for replay/debug/audit in later phases.

### Runtime flow (current vertical slice)
1. Web map requests world snapshot via `GET /engine/world`.
2. On point interaction, frontend starts travel (`/engine/travel/start`) and completes travel (`/engine/travel/complete/:sessionId`).
3. Engine advances time ticks and returns location availability.
4. If location is blocked (night bank rule or district rule), UI presents alternative approaches.
5. Alternative approach calls `/engine/case/advance` and updates faction reputation/world state.
6. On success, scenario action (`start_vn`) continues as normal.

### Frontend integration layer
- `apps/web/src/shared/api/client.ts` now includes typed `engine` methods.
- `apps/web/src/features/detective/engine/store.ts` is the new client-side world state adapter (Zustand).
- `MapView` and `CaseCard` consume this store for phase/tick/travel/availability UX.

### Known architectural constraints
- Identity is resolved per request (`auth.userId` first, then `x-user-id`/`x-demo-user-id`, then `demo_user` fallback).
- Objective routing is dynamic and location-driven (`case_objectives.location_id` + stable location id from map point data).
- VN event stream -> engine progression/evidence sync is partially integrated and will be expanded.

### Location identity model (stable world anchor)
- `locationId` is a stable world anchor (bank, city hall, pharmacy) and should rarely change.
- `map_point.id` is an interaction node and may evolve with content iteration.
- Frontend uses `point.data.locationId` as canonical location key (fallback to `point.id`) so objective linkage survives point refactors.

### Fog of war (design note)
- Fog state should be owned by location progression, not by single scene completion.
- A location can be visible but not explored, explored but not resolved, or fully resolved.
- Reveal can happen via travel, intelligence beats, evidence, or faction contacts.

## Mirror Protocol Delivery Status (2026-02-07)

### Phase 1 complete (Foundation hardening)
- VN runtime contract is enforced end-to-end: scene preconditions, passive checks, and `onEnter` execution are preserved and applied.
- Localization/runtime merge now retains logic-only fields required by gameplay execution.
- Canonical Parliament voice identifiers are normalized in shared/runtime data.
- Shared item registry is introduced as the canonical item source for inventory/merchant systems.
- Location identity conventions are normalized to prevent map unlock and binding drift.

### Phase 2 complete (Content and systems expansion, current scope)
- ✅ Consumable effect execution in inventory flow.
- ✅ Quest-stage gates in narrative progression (VN + map runtime contexts).
- Expand travel route graph and district-level world rules. ✅ Implemented for Case 01 base network and district soft gate.
- ✅ Merchant variants connected to character system roles and location trade actions.
- ✅ Secrets/evolution progression surfaced in dossier-facing UX (`CharacterPage` -> `Psyche Profile`).

### Phase 3 started (Polish + Persistence, first slice)
- Added server-side inventory snapshot persistence (`/inventory/snapshot`) with Drizzle-backed `user_inventory_snapshots` table.
- Added typed contracts in `packages/contracts/inventory.ts` and client wiring in `apps/web/src/shared/api/client.ts`.
- Inventory store now hydrates from server and syncs item/money mutations back to backend.
- Inventory hydration is triggered at app boot (`App.tsx`) so map/merchant gameplay persists without visiting Inventory page.
- Added additive migration `apps/server/drizzle/0004_lovely_mastermind.sql` for rollout safety.
- Added server-side quest snapshot persistence (`/quests/snapshot`) with normalized stage/objective payloads.
- Quest store now hydrates/syncs server state and `useQuestEngine` gates default quest bootstrap behind hydration.
- Added additive migration `apps/server/drizzle/0005_shiny_plazm.sql` for `user_quests.stage` and `user_quests.completed_objective_ids`.
- Added server-side dossier snapshot persistence (`/dossier/snapshot`) with sanitized flags/evidence/check-state payloads.
- Dossier store now hydrates/syncs server state with debounced write-back for gameplay mutations.
- Added additive migration `apps/server/drizzle/0006_magenta_satana.sql` for `user_dossier_snapshots`.

## One-Shot Scenario Guardrail (2026-02-10)

- One-shot completion flags are centralized in:
  - `apps/web/src/entities/visual-novel/lib/oneShotScenarios.ts`
- This removed duplicated logic from multiple entry points and aligned behavior for:
  - homepage resume flow
  - map-triggered VN launches
  - fullscreen VN route boot
  - overlay VN runtime checks
- Result:
  - one-shot scenarios are skipped consistently after completion, regardless of where they are triggered.

## Karlsruhe Sandbox Infrastructure (2026-02-10)

### Overview
Tutorial sandbox (`ka1905`) introducing core detective mechanics across 3 mini-cases: card duels, evidence combining, and NPC navigation. 12 map points, 4 quest logic files, 4 evidence items, 2 deduction recipes, 1 battle scenario, 1 VN intro scenario (3 locales).

### Data Layer

| Component | Files | Count |
|-----------|-------|-------|
| Quest Stages | `packages/shared/data/quests.ts` | 4 IDs |
| Map Points | `apps/server/src/scripts/data/sandbox_ka_points.ts` | 12 points |
| Point Lifecycle | `apps/server/src/scripts/data/sandbox_ka_lifecycle.ts` | 3 visibility rules |
| Quest Logic | `apps/web/src/features/quests/sandbox_*.logic.ts` | 4 files |
| Evidence | `apps/web/src/features/detective/registries.ts` | 4 items |
| Deductions | `apps/web/src/features/detective/lib/deductions.ts` | 2 recipes |
| Battle | `packages/shared/data/battle.ts` → `sandbox_son_duel` | 1 scenario |
| VN Intro | `apps/web/src/entities/visual-novel/scenarios/detective/sandbox/` | logic + DE/EN/RU |
| Tooltips | `apps/web/src/features/detective/lib/tooltipRegistry.ts` → `ka1905` | 5 keywords |

### Quest Architecture
- **sandbox_karlsruhe** (meta): 4 stages, gated by sub-quest completion
- **sandbox_banker**: 4 stages, linear → card duel at casino
- **sandbox_dog**: 4 stages, optional breadcrumb chain (NPC → NPC → NPC → dog)
- **sandbox_ghost**: 6 stages, dual deduction path (true/false trail), guild master tutorial

### Deduction System (Ghost Case)
- **True Trail**: `ev_cold_draft` + `ev_ectoplasm_residue` → supernatural verdict
- **False Trail**: `ev_hidden_passage` + `ev_servant_testimony` → contrabandist verdict
- Both paths advance the quest but produce different narrative outcomes

### Obsidian Integration
- 12 location notes in `obsidian/Detectiv/00_Map_Room/loc_ka_*.md`
- 4 quest notes in `obsidian/Detectiv/00_Map_Room/qst_sandbox_*.md`
- `MOC_Locations` and `MOC_Quests` updated with Karlsruhe sections
- Flow graph in `obsidian/StoryDetective/40_GameViewer/Sandbox_KA/Sandbox_KA_Flow.md`

### Status
- ✅ Data infrastructure complete (quests, points, evidence, deductions, battle, tooltips)
- ✅ VN intro scenario (logic + 3 locales)
- ⏳ Remaining VN scenarios per case (banker_client, ghost_investigate, etc.)
- ⏳ Quest registration in runtime merge (`data.ts`)
- ⏳ Server seed script integration (`seed-map.ts`)

## Karlsruhe Sandbox Runtime Slice (2026-02-11)

### Runtime contracts now in use
- **Pack default case contract**:
  - `packages/shared/data/pack-meta.ts`
  - `ka1905.defaultCaseId = 'sandbox_karlsruhe'`.
- **Battle routing contract**:
  - `/battle?scenarioId=...&returnScenarioId=...&returnPackId=...`
  - return logic in `BattlePage` applies scenario outcome actions and uses `resumeSceneId` for VN continuation.
- **VN battle action wiring**:
  - `VisualNovelPage` and `VisualNovelOverlay` forward active scenario and pack context into battle query params.
- **Map return contract**:
  - VN and battle returns are pack-aware (`/city/:packId/map`) with `/map` fallback.

### Karlsruhe map/runtime integration
- `apps/server/src/scripts/seed-map.ts` now composes two point sets:
  - `CASE_01_POINTS`
  - `SANDBOX_KA_POINTS`
- Pack-specific lifecycle resolution:
  - Freiburg flow uses `resolvePointLifecycle`.
  - Karlsruhe flow uses `resolveSandboxPointLifecycle`.
- Sandbox map points route banker progression through VN entries:
  - bank -> `sandbox_banker_client`
  - son house -> `sandbox_banker_son_house`
  - tavern -> `sandbox_banker_tavern`
  - casino -> `sandbox_banker_casino`

### Scenario architecture status
- New sandbox VN scenarios are runtime-registered through existing dynamic registry (`import.meta.glob` + default exports):
  - banker: `sandbox_banker_client`, `sandbox_banker_son_house`, `sandbox_banker_tavern`, `sandbox_banker_casino`
  - compatibility stubs: `sandbox_dog_mayor`, `sandbox_ghost_investigate`, `sandbox_ghost_guild`, `sandbox_ghost_conclude`
- `sandbox_son_duel` now resumes to `casino_fallout` on both win and loss.

### Progress status
- **Implemented in runtime**: `01_Banker` full vertical slice.
- **Compatibility only**: `02_Dog` and `03_Ghost` (stubbed but non-breaking).

## Unified Home + Region Zoning v1 (2026-02-12)

### Implemented scope
- Home page now works in region-driven mode:
  - no region selected -> city chooser + scanner CTA
  - selected region -> region-themed card + pack-aware continue routing
- Region bootstrap is centralized in `apps/web/src/widgets/GameRuntime.tsx`:
  - infer KA from `sandbox_*` active case
  - infer FR from legacy progress
  - keep `null` for fresh users until explicit selection/scan

### Map/query contract
- `MapPointsQuery` now accepts `regionId?: string` (`packages/contracts/map.ts`).
- Frontend map hook uses `buildMapPointsQuery` and includes `regionId` in React Query key:
  - `['map-points', packId, caseId, regionId]`
- Server applies region filter as an explicit post-visibility step:
  - lifecycle visibility filtering first
  - then optional haversine radius filter (`distance <= 10km`)

### QR gateway pipeline
- `MapActionSchema` supports `set_region`.
- Scanner and map actions execute through a unified action handler:
  - `set_region` updates region store, sets default case, and navigates to `/city/:packId/map`
- Gateway event codes are seeded via:
  - `apps/server/src/scripts/seed-event-codes.ts`
  - script: `bun run --filter server seed:event-codes`

### Engine alignment
- `apps/server/src/modules/engine.ts` now resolves default location per active case (`DEFAULT_LOCATION_BY_CASE`) to prevent cross-city default spawn on first map load.
