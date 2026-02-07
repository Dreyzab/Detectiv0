# Grezwanderer 4 — Журнал обновлений (Changelog)

Все значимые изменения и этапы разработки проекта фиксируются здесь.

---

## [07.02.2026] — UI Localization Refactoring (react-i18next)

### Changed
- **UI Localization migrated to `react-i18next`**:
  - Installed core packages: `react-i18next`, `i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`.
  - Created JSON namespace files: `apps/web/public/locales/{en,de,ru}/{common,detective,quests}.json`.
  - Configured i18n runtime: `apps/web/src/shared/lib/i18n.ts`.
  - Migrated components: `Dossier`, `CharacterPage`, `QRScannerPage`, `OnboardingModal`, `QuestLog`, `ProfileView` — replaced all `ui.xxx` with `t('key')`.
  - Added `LanguageSwitcher` with flag icons to Navbar for EN/DE/RU toggle.
- **Validation**: TypeScript checks passed — `bun x tsc -p apps/web/tsconfig.app.json --noEmit`.

---

## [07.02.2026] — Phase 2: Dossier Psyche Profile + Secrets/Evolution UX

### Added
- **Dossier-facing Psyche Profile** in Character Page:
  - new `Psyche` tab with Thought Cabinet, faction alignment signals, knowledge registry, evolution tracks, and field-check reliability summary.
  - dynamic dossier background reacts to current alignment profile.
  - File: `apps/web/src/pages/CharacterPage/CharacterPage.tsx`
- **Deterministic profile derivation layer**:
  - added `buildPsycheProfile(...)` to derive UX state from flags, factions, quest stages, relationships, and check history.
  - File: `apps/web/src/pages/CharacterPage/psycheProfile.ts`
- **Unit tests for psyche derivation**:
  - unlock logic for knowledge entries, alignment resolution, and evolution progression.
  - File: `apps/web/src/pages/CharacterPage/psycheProfile.test.ts`

### Changed
- **Phase 2 checklist closure**:
  - `Surface secrets/evolution progression in dossier-facing UX` marked complete in sprint tracking and design notes.
- **Main documentation synchronized**:
  - updated high-level status in `README.md` and architecture notes in `ARCHITECTURE.md`.
  - updated economy/design notes in:
    - `obsidian/Detectiv/00_Map_Room/Sprint_Current.md`
    - `obsidian/Detectiv/20_Game_Design/90_Game_Loops/Loop_Economy.md`
    - `obsidian/Detectiv/20_Game_Design/Systems/Inventory_Merchant.md`

### Validation
- `bun test apps/web/src/pages/CharacterPage/psycheProfile.test.ts`
- `bun x tsc -p apps/web/tsconfig.app.json --noEmit`

## [07.02.2026] — Phase 2: Merchant Variants + Economy Loop Wiring

### Added
- **Merchant variants in shared registry**:
  - added `apothecary_shop`, `tailor_shop`, `pub_keeper`, and gated `the_fence`.
  - each merchant now links to character role (`characterId`) and location anchor (`locationId`).
  - File: `packages/shared/data/items.ts`
- **Access and economy helpers**:
  - added merchant access evaluation (`flags` / `faction reputation`) and per-merchant pricing multipliers.
  - added pricing helpers for buy/sell calculations.
  - File: `packages/shared/data/items.ts`
- **Trade action wiring from map interactions**:
  - `open_trade` now opens merchant modal via shared UI store.
  - trade bindings added to `loc_apothecary`, `loc_tailor`, `loc_pub`, `loc_workers_pub`.
  - Files:
    - `apps/web/src/features/merchant/model/store.ts`
    - `apps/web/src/features/detective/lib/map-action-handler.ts`
    - `apps/web/src/widgets/map/map-view/MapView.tsx`
    - `apps/server/src/scripts/data/case_01_points.ts`
    - `supabase_seed.sql`

### Changed
- **Merchant modal behavior**:
  - now uses merchant-specific stock, access rules, role notes, and economy multipliers.
  - blocks transactions when access requirements are not met (for example, `the_fence` without underworld trust).
  - File: `apps/web/src/features/merchant/ui/MerchantModal.tsx`
- **Inventory item effects**:
  - added support for `add_voice_level` effect type for consumables tied to social/recovery gameplay.
  - File: `apps/web/src/entities/inventory/model/store.ts`

### Validation
- `bun test apps/server/test/modules/engine.test.ts`
- `bun test packages/shared/data/items.test.ts`
- `bun x tsc -p apps/web/tsconfig.app.json --noEmit`
- `bun x tsc -p apps/server/tsconfig.json --noEmit`

---

## [07.02.2026] — Phase 2: Route Graph Expansion + District Rules

### Added
- **Expanded travel graph in engine seed**:
  - `city_routes` now includes bidirectional links for core (`loc_hbf`, `loc_freiburg_bank`, `loc_freiburg_archive`),
    leads (`loc_tailor`, `loc_apothecary`, `loc_pub`), and industrial routes (`loc_freiburg_warehouse`, `loc_workers_pub`).
  - route metadata now carries district transition context (`fromDistrict`, `toDistrict`, `nightRequiresPermit`).
  - File: `supabase_seed.sql`
- **District rule docs in Obsidian**:
  - added route network note and district rule specification.
  - Files:
    - `obsidian/Detectiv/00_Map_Room/Route_Network_Case01.md`
    - `obsidian/Detectiv/00_Map_Room/District_Rules.md`

### Changed
- **Location ID normalization completed in SQL seed**:
  - map points, event code `unlock_point`, objectives, and routes now consistently use `loc_*` IDs.
  - removed residual `p_*` drift from engine seed data.
- **Engine location availability now district-aware**:
  - added soft-gate district policy for night access in `stuhlinger`.
  - bank night rule remains active and has priority.
  - Files:
    - `apps/server/src/modules/engine.ts`
    - `apps/server/test/modules/engine.test.ts`

### Validation
- `bun test apps/server/test/modules/engine.test.ts`
- Obsidian AGENTS checks:
  - duplicate markdown basenames
  - duplicate frontmatter `id`
  - Parliament MOC/voice/canonical integrity

---

## [07.02.2026] — Phase 2: Quest Stages + Timeline Popover (Macro/Micro Flow Split)

### Added
- **Quest stage canonical model**:
  - added shared stage registry and progression helpers (`QUEST_STAGES`, stage index checks).
  - File: `packages/shared/data/quests.ts`
- **Quest-stage aware runtime contracts**:
  - VN condition context now includes `questStages`, `isQuestAtStage`, `isQuestPastStage`.
  - VN actions support `set_quest_stage`.
  - Map condition DSL supports `quest_stage` and `quest_past_stage`.
  - Map action DSL supports `set_quest_stage`.
- **Stage Timeline UI**:
  - Quest Journal and Quest Log now display `prev/current/next` stage chips.
  - Stage chips now use an interactive popover (hover/focus/click) instead of native `title`.
  - Popover shows transition rationale (localized hint + technical flags/actions metadata).

### Changed
- **Responsibility split finalized**:
  - `Quest Stage` = macro progression gate (global narrative flow).
  - `Flags` = micro-world state and intra-stage branching.
- **Quest data upgraded**:
  - quest logic now supports `stageTransitions` metadata.
  - quest content now supports localized `stages` and `transitions` labels.
  - objectives can be stage-scoped (`objective.stage`) and UI filters by active stage.
- **Map objective highlighting**:
  - active map target selection now respects objective stage visibility.

### Validation
- `bun x tsc -p apps/web/tsconfig.app.json --noEmit`
- `bun x tsc -p packages/shared/tsconfig.json --noEmit`
- `bun test apps/web/src/entities/visual-novel/model/__tests__/engine.test.ts`
- `bun test packages/shared/lib/map-resolver.test.ts`

---

## [07.02.2026] — Mirror Protocol: Phase 1 Complete, Phase 2 Kickoff

### ✅ Phase 1 completed (Technical Debt Cleanup)
- **VN runtime contract stabilized**:
  - scene `preconditions` now enforced at runtime,
  - passive checks now preserve and display fail/success text correctly,
  - `onEnter` side effects are applied with re-entry protection.
- **Logic/content merge fixed**:
  - VN runtime merge now keeps logic-only fields (`preconditions`, `passiveChecks`, `onEnter`) instead of dropping them.
- **Canonical data alignment completed**:
  - legacy voice IDs migrated to canonical Parliament roster IDs,
  - shared item registry introduced and wired into inventory/merchant flow,
  - map/location identifiers normalized to a single runtime convention.
- **Type-level hardening**:
  - key IDs covered by shared TypeScript types to reduce runtime mismatches and typo regressions.

### 🎯 Phase 2 started (Content & Systems Expansion)
- Consumable effects system (real gameplay impact from inventory actions).
- Quest stage integration into VN and world progression.
- Expansion of route network and district-level world logic.
- Merchant specialization linked to character archetypes/roles.
- Secrets/evolution progression surfaces in dossier-facing UX.

---

## [07.02.2026] — Narrative + Gameplay Protocols (Story/Mechanics Governance)

### Added
- **`Narrative_Gameplay_Protocol`**: canonical operating contract for node-based story+gameplay authoring.
  - File: `obsidian/Detectiv/99_System/Narrative_Gameplay_Protocol.md`
  - Defines mandatory node contract (`Trigger Source -> Preconditions -> Designer View -> Mechanics View -> State Delta -> Transitions -> Validation`), skill-check rules, recovery rules, state-delta categories, and chain governance.
- **`Narrative_Gameplay_Checklist`**: execution checklist for pre-implementation and pre-merge validation.
  - File: `obsidian/Detectiv/99_System/Narrative_Gameplay_Checklist.md`
  - Covers node completeness, branch safety, narrative quality gates, gameplay quality gates, and code-sync checks.

### Changed
- **`Template_Gameplay_Story_Node`** extended to enforce protocol fields:
  - added `Preconditions`, `loop/*` tag, dramatic function, node type, detailed skill-check block, categorized state delta, recovery transition, and checklist pass block.
  - File: `obsidian/Detectiv/99_System/Templates/Template_Gameplay_Story_Node.md`
- **`Gameplay_Story_Board`** now links protocol + checklist as governance and requires both consistency checklists for active chains.
  - File: `obsidian/Detectiv/00_Map_Room/Gameplay_Story_Board.md`
- **`Scenario_Board`** now references both narrative consistency and narrative-gameplay checklist for flow-node work.
  - File: `obsidian/Detectiv/00_Map_Room/Scenario_Board.md`
- **`00_Start_Here`** developer zone now links protocol and checklist for daily entry use.
  - File: `obsidian/Detectiv/00_Map_Room/00_Start_Here.md`
- **`AGENTS.md`** updated with mandatory narrative+gameplay protocol section for AI edits.
  - File: `AGENTS.md`

---

## [07.02.2026] — Gameplay + Story Authoring Method (Node-Based)

### Added
- **`Gameplay_Story_Board`**: unified board for combined gameplay and narrative flow design.
  - File: `obsidian/Detectiv/00_Map_Room/Gameplay_Story_Board.md`
- **`Template_Gameplay_Story_Node`**: template for dual-view flow nodes (designer + implementation).
  - File: `obsidian/Detectiv/99_System/Templates/Template_Gameplay_Story_Node.md`
- **Start-chain production nodes**:
  - `node_start_game_new_investigation`
  - `node_intro_char_creation`
  - `node_telegram_gate_after_creation`
  - `node_case1_alt_briefing_entry`
  - `node_intro_journalist_origin`
  - Files: `obsidian/Detectiv/10_Narrative/Scenes/node_*.md`
  - Includes UI triggers, code anchors, state deltas, transition mapping, and branch conflict note for telegram handoff.

### Changed
- **Scenario navigation**:
  - `Scenario_Board.md` now links to `Gameplay_Story_Board`.
  - `00_Start_Here.md` now links to `Gameplay_Story_Board` in Narrative and Events.
- **Character creation stat mapping**:
  - `intro_char_creation.logic.ts` now uses canonical voice ids (`charisma`, `perception`, `empathy`) instead of legacy ids.
- **Canonical onboarding continuation**:
  - Removed duplicate Telegram continuation from `HomePage`.
  - Canonical path after `intro_char_creation`: `VisualNovelPage` telegram gate -> `/vn/detective_case1_alt_briefing`.
- **Map point id alignment for start chain**:
  - `munsterplatz_bank` unified to `p_bank` in alt briefing unlock and thread/debug references.

### Extended Node Chain
- Added full production chain for `Case1 Alt Briefing -> Map -> First Lead`:
  - `node_map_action_bank_crime_scene`
  - `node_case1_bank_investigation`
  - `node_case1_first_lead_selection`
  - `node_case1_lead_tailor` (recommended first lead)
- Updated `node_telegram_gate_after_creation` to mark `intro_journalist` as legacy optional flow.

---

## [07.02.2026] — Parliament Roster Rework (Canonical 18 Voices)

### Изменено
- **Parliament canonical roster** приведен к новому составу из 18 голосов:
  - Brain: Logic, Perception, Encyclopedia
  - Soul: Intuition, Empathy, Imagination
  - Character: Authority, Charisma, Volition
  - Body: Endurance, Agility, Senses
  - Shadow: Stealth, Deception, Intrusion
  - Spirit: Occultism, Tradition, Gambling
- **`packages/shared/data/parliament.ts`** синхронизирован с новым roster (`volition/senses/gambling` вместо `composure/forensics/poetics`).
- **VN skill checks и тексты** обновлены под новые `voiceId` в сценариях (tourist, student, apothecary, victoria_poetry, case1_finale).
- **Store defaults** обновлены в `dossier` и `inventory`.
- **Tooltip registry** и map-point voice hints обновлены (`forensics` -> `senses`).
- **Battle data** обновлен `voiceScaling` для spirit-карты (`poetics` -> `gambling`).

### Obsidian
- `MOC_Parliament` переписан под утвержденный состав (6x3).
- В `Voices/` оставлены только 18 активных `Voice_*.md`.
- Вне канона переведены в архивный формат `.legacy.txt` (`Composure`, `Forensics`, `Poetics`, `Rhetoric`, `Suggestion`, `Shivers`).
- `Victoria_Sterling.md` обновлен (`Voice: Senses`).

### Governance
- `AGENTS.md` обновлен: добавлен фиксированный канон 18 голосов и обязательные проверки консистентности Parliament перед/после правок.

---

## [07.02.2026] — Obsidian Game Design Structure (Hybrid A + C)

### Добавлено
- **Hybrid структура в `20_Game_Design`**:
  - Тематические домены (Option C): `01_Mind`, `02_Investigation`, `03_Interaction`, `04_World`.
  - Циклическая аналитика (Option A): `90_Game_Loops` с отдельными loop notes.
- **Новые MOC-узлы**:
  - `MOC_Game_Design` — центральный хаб геймдизайна.
  - `MOC_Game_Loops` — доска для баланса по циклам.
- **Skill Influence mapping**:
  - Добавлена `01_Mind/Skill_Impact_Map.md` для отслеживания связей навыков с системами и циклами (пример: `Logic -> Investigation/Social/Conflict`).

### Изменено
- **`00_Map_Room/00_Start_Here.md`**: Добавлены ссылки на новую гибридную структуру.
- **`00_Map_Room/System_Design_Board.md`**: Добавлены переходы на Hub/Loops/Skill Impact Map и правило привязки новых механик к домену + циклу.
- **`20_Game_Design/READ_ME.md`**: Переписан как инструкция по Hybrid A+C организации.
- **`00_Map_Room/00_Start_Here.md`**: Добавлена ссылка на `AI_Obsidian_Operating_Manual`.

### Документация
- **`99_System/AI_Obsidian_Operating_Manual.md`**: Новый регламент для ИИ-работы с Obsidian (разница Graph View vs файловая модель ИИ, правила уникальности basename, path-based wikilinks, протокол дедупликации и команды валидации).

---

## [07.02.2026] — Inventory & Merchant System (The Fence)

### Добавлено
- **Inventory System ("Detective's Archive")**: Полноценный интерфейс инвентаря (`/inventory`) в стиле архивного дела.
    - **Visuals**: Предметы отображаются как "улики", прикрепленные скрепками к бумаге. Framer Motion анимации при наведении.
    - **Item Detail Overlay**: Просмотр деталей предмета с визуализацией "полароидного снимка" и действиями (Use/Discard).
    - **Store Update**: `useInventoryStore` теперь поддерживает полноценную структуру `InventorySlot` (предмет, кол-во, метаданные) и валюту (Reichsmarks).
- **Merchant System ("The Fence")**: Механика торговли скупщика краденого.
    - **Split-View Interface**: Двойная сетка (Склад торговца / Инвентарь игрока) в одном модальном окне.
    - **Transaction Logic**: Покупка и продажа предметов с динамическим расчетом стоимости (продажа за 50% цены).
    - **Atmosphere**: Темная тема "Backroom" с силуэтом информатора и диалоговым пузырём.
- **Routing**: Добавлен маршрут `/inventory` в `App.tsx`.

### Технические детали
- **Zustand Persistence**: Версия хранилища `gw4-inventory-storage` поднята до v2 (авто-миграция).
- **Components**: Реализованы переиспользуемые `ItemCard` и `InventoryGrid`, работающие в обоих контекстах (Inventory/Merchant).
- **Design Tokens**: Использование палитры `stone-50`...`stone-900` и шрифтов `Abril Fatface` / `Courier Prime` для соответствия нуарной эстетике.

---
## [05.02.2026] — Phase 2: Mind Palace (Parliament Overlay)

### Добавлено
- **Mind Palace Overlay**: Система пассивных проверок навыков, интегрированная в VN-движок.
    - **`usePassiveChecks` hook**: Обрабатывает `scene.passiveChecks[]` при входе в сцену. Использует `processedSceneIdRef` для предотвращения повторных бросков. Записывает результаты через `recordCheckResult`. Автоматическое скрытие через 6 секунд.
    - **`VoiceOrb`**: Анимированный орб с цветом группы голоса (framer-motion, пульсация + glow).
    - **`ThoughtCloud`**: Стилизованная карточка текста (Art Deco, border-left accent по цвету голоса, fade-in/exit анимации).
    - **`MindPalaceOverlay`**: Контейнер, читающий состояние VN store и рендерящий VoiceOrb + ThoughtCloud при успешной пассивной проверке.
- **Расширение типов VN**: В `VNSkillCheck` добавлены поля `isPassive`, `passiveText`, `passiveFailText`. В `VNScene` и `VNSceneLogic` добавлено `passiveChecks?: VNSkillCheck[]`.
- **Тестовые данные**: В `case1_alt_briefing.logic.ts` добавлены две пассивные проверки:
    - Logic (difficulty 2) — гарантированный успех.
    - Empathy (difficulty 99) — гарантированный провал.

### Интеграция
- **MobileVNLayout** (fullscreen): Mind Palace на `z-[125]` (между header и dialogue panel).
- **VisualNovelOverlay** (map overlay): Mind Palace на `z-[210]` (выше VN панели, ниже toast).

### Структура файлов
```
apps/web/src/features/detective/mind-palace/
├── MindPalaceOverlay.tsx   # Контейнер overlay
├── VoiceOrb.tsx            # Визуал голоса (цвет, анимация)
├── ThoughtCloud.tsx        # Текст вмешательства
├── usePassiveChecks.ts     # Хук обработки passive checks
└── types.ts                # Локальные типы (VoiceOrbProps, ThoughtCloudProps)
```

---

## [05.02.2026] — Phase 1.5: Smart Migration (Hardlinks → DB + Eden Treaty)

### Добавлено
- **`event_codes` таблица**: Новая таблица в Supabase для хранения QR/ручных кодов (CASE01_BRIEFING_01 и т.д.).
    - Schema: `code` (PK), `actions` (JSONB), `active` (boolean), `description`.
    - Drizzle migration: `0001_lovely_slapstick.sql`.
    - Seed: 6 записей (5 сюжетных + 1 тестовый).
- **`GET /map/resolve-code/:code`**: Новый серверный эндпоинт. Сначала проверяет `event_codes` (stateless), затем `map_points` по QR-коду (stateful unlock). Возвращает типизированные `MapAction[]`.
- **Eden Treaty клиент**: `apps/web/src/shared/api/client.ts` — типизированный клиент API через `@elysiajs/eden`.
- **Playwright**: Конфигурация (`playwright.config.ts`), smoke test (`e2e/smoke.spec.ts`), скрипт `test:e2e` в `package.json`.

### Изменено
- **`useMapPoints.ts`**: Переведён на Eden Treaty (`api.map.points.get()`). Удалена ручная типизация `MapPointsResponse`. Удалена логика merge с hardlinks (96 → 56 строк).
- **`QRScannerPage.tsx`**: Переведён на Eden Treaty (`api.map['resolve-code']`). Импортирует `MapAction` из shared types.
- **`supabase_seed.sql`**: Добавлены INSERT для `event_codes`. Данные приведены к соответствию Zod-схеме (`evidenceId` вместо объекта, `flags` как массив строк).
- **`map.ts` (server)**: Удалён legacy `activate-qr`. Добавлен response schema с Elysia `t.Object()`. Actions кастуются через `as MapAction[]`.

### Удалено
- **`hardlinks.ts`**: Полностью удалён. Данные разделены на:
    - Map bindings (встроены в `map_points.bindings` в seed).
    - Event codes (новая таблица `event_codes`).

### Рефакторинг
- **Parliament consolidation**: Единый источник в `packages/shared/data/parliament.ts`. Старая версия сохранена как `parliament_legacy.ts.bak`. Все импорты ведут к одному файлу (напрямую или через re-export).

---

## [04.02.2026] — Database Migration to Supabase (PostgreSQL)

### Added
- **Supabase Integration**: Local SQLite migrated to a hosted Supabase project.
- **PgBouncer Support**: Configured `DATABASE_URL` with transaction pooling (port 6543) for stability.
- **SQL Seeding**: Created manual SQL seed for map points and quests to bypass local connection issues.

### Changed
- **Drizzle Schema**: Updated table definitions for Postgres compatibility (e.g. `user_map_point_user_states`).
- **Seed Scripts**: `seed-map.ts` and `seed-quests.ts` updated to use Postgres-specific syntax (`.values()`).

### Fixed
- **Env Config**: Removed invalid characters from `.env` connection strings.
- **SSL Issues**: Enabled `rejectUnauthorized: false` for reliable connections from local environment.

---

## [01.02.2026] - Dialogue Duels Migration (FSD + Immer)

### Added
- **Immer Integration**: Store rewritten with `produce()` for immutable state updates.
- **VisualEvent System**: Floating text animations for damage, heal, block, buff.
- **Web Audio API Sounds**: Procedural synth sounds (no external audio files):
    - **Damage**: Low-frequency thud
    - **Block**: Mechanical click
    - **Heal**: Warm D3 swell
    - **Buff**: High shimmer slide
- **Drag-to-Play**: Cards can be dragged to play zone (top 60% of screen).
- **Enemy Intent**: Bubble showing opponent's next card and effect.
- **FSD UI Components**:
    - `entities/battle/ui/Card.tsx` — Card with group colors and effect icons
    - `entities/battle/ui/UnitStatus.tsx` — Avatar, resolve bar, block badge
    - `entities/battle/ui/FloatingText.tsx` — Animated numbers with sound

### Changed
- **BattleScenario**: Added `difficulty`, `opponentAvatar`, `playerStartingDeck` fields.
- **Turn Flow**: `cardsPerTurn` reduced to 2 for better pacing.
- **Store Types**: Added `TurnPhase`, `VisualEvent`, `PlayerEntity`, `OpponentEntity`.

### Technical
- **Dependencies**: Added `immer@11.1.3`
- **Barrel Exports**: Updated `entities/battle/index.ts` with UI components

---

## [01.02.2026] - VN Flow & FSD UI Refactor

### Added
- FSD relocation of VN UI: `TypedText` -> `shared/ui`, `SpeakerBadge` -> `entities/character/ui`, `VisualNovelOverlay` + `MobileVNLayout` -> `widgets/visual-novel`.

### Changed
- Fullscreen VN starts only from MapPoint interactions (`start_vn` -> `/vn/:id`).
- Fullscreen VN exits to `/map` to create a hard break between scenes.

### Fixed
- Removed overlay auto-navigation that caused scenario chaining.
- Fixed a `MapView` zustand selector causing infinite update depth.

## [01.02.2026] — Dialogue Battle System ⚔️

### Добавлено
- **Карточная боевая система**: Вербальные дуэли в стиле Griftlands для противостояния NPC.
    - **15 стартовых карт** по 6 атрибутным группам:
        - 🔵 Intellect: Logical Argument, Analyze Weakness, Brilliant Deduction
        - 🟣 Psyche: Empathic Appeal, Gut Feeling, Read Intent
        - 🔴 Social: Assertive Stance, Silver Tongue, Commanding Presence
        - 🟢 Physical: Steady Nerves, Relentless
        - ⚫ Shadow: Misdirection, Veiled Threat
        - 🟠 Spirit: Appeal to Tradition, Poetic Strike
    - **Resolve System**: Аналог HP — снижайте решимость оппонента аргументами.
    - **Эффекты карт**: Damage, Block, Heal, Draw, Gain AP.
    - **Action Points**: 3 AP за ход, карты стоят 1-3 AP.
    - **Simple AI**: Оппонент автоматически разыгрывает карты каждый ход.
- **Battle Store (Zustand)**: Полноценное управление состоянием боя (руки, колоды, сброс, ходы).
- **Deck Utilities**: Утилиты shuffle, draw, discard для работы с колодами.
- **Battle Page UI**: Темная тема с ResolveBar, CardHand (цвета по группам), AP pips, BattleLog.
- **2 тестовых сценария**: `detective_skirmish` (Merchant) и `detective_boss_krebs` (Krebs).
- **Routing**: Маршрут `/battle` с интеграцией в VN flow.

### Изменено
- **Type Fix**: Исправлено `battleId` → `scenarioId` в `map-validators.ts`.
- **VN Navigation**: `VisualNovelOverlay` и `VisualNovelPage` теперь переходят на `/battle`.

### Технические детали
- **Schema**: `packages/shared/data/battle.ts` — CardDefinition, BattleScenario, эффекты.
- **Store**: `apps/web/src/entities/battle/model/store.ts` — Zustand с логикой ходов и AI.
- **UI**: `apps/web/src/pages/BattlePage/` — компонент и CSS.

---

## [01.02.2026] — UI Pro Max: Glassmorphism & Parallax

### Добавлено
- **Virtual Window (Gyroscope)**: Реализован эффект "виртуального окна" для мобильных устройств.
    - Фон (Background) панорамируется при наклоне устройства (DeviceOrientation API).
    - Калибровка плавности через Lerp (Linear Interpolation).
    - Интеграция с iOS Permissions API (запрос доступа к датчикам).
- **Cinematic Reveal**: Система автоматического скрытия интерфейса (HUD) при смене сцены.
    - Текстовое окно плавно уезжает вниз, открывая полный арт локации.
    - Возврат интерфейса по клику в любую часть экрана.
- **Glassmorphism UI (Mobile)**: Полный визуальный редизайн мобильного интерфейса новеллы (`MobileVNLayout`).
    - **Asymmetrical Layout**: Асимметричные стеклянные панели с размытием (Backdrop Blur).
    - **Connected Speaker Badge**: Плавающий бейдж говорящего, "привязанный" к текстовому блоку декоративной линией.
    - **Inline Choices**: Варианты ответов интегрированы прямо в поток диалога (как список), а не отдельными кнопками.
- **Micro-Animations**:
    - **Typing Indicator**: Анимированный курсор "Continue" при завершении печати.
    - **Choice Reveal**: Каскадное появление вариантов ответа (`staggerChildren`).

### Технические детали
- **Refactoring**: Очистка дублирующего кода в `MobileVNLayout.tsx` и `useGyroParallax.ts`.
- **Performance**: Использование `will-change-transform` для фона и `requestAnimationFrame` для гироскопа.

### Изменено
- **Scenario Architecture (Case Bundles)**: Полная реструктуризация папки сценариев (`scenarios/detective`).
    - **Case 01 Bundle**: Все файлы Дела №1 сгруппированы в `case_01_bank` с подпапками `main/` (сюжет) и `leads/` (ветки расследования).
    - **Side Quests**: Побочные квесты вынесены в `side_quests/` (Lotte, Victoria, Inspector).
    - **Clean Exports**: Внедрены `index.ts` файлы для модульного экспорта сценариев.

---

## [31.01.2026] — Parliament Keyword System Fix & Expansion

### Исправлено
- **Keyword Visibility**: Исправлен Z-Index конфликт (`ParliamentKeywordCard`), из-за которого карточки с описанием скрывались под основным интерфейсом новеллы. Теперь они корректно отображаются поверх (`z-[300]`).
- **Overlay Integration**: В `VisualNovelOverlay` добавлена поддержка интерактивных ключевых слов. Теперь клик по `[[keyword]]` в режиме карты открывает ту же карточку парламента, что и в полноэкранном режиме.

### Добавлено
- **Action System Plan**: Разработан концепт (`PLAN-mechanics.md`) для будущей системы "Action Keywords", где клик по тексту сможет триггерить игровые события (телепортация, получение предметов), а не только показывать лор.

---

## [29.01.2026] — "The Open City" & Narrative Polish

### Добавлено
- **Case 1 Complete Implementation**: Полностью завершена сценарная ветка "Bankhaus Krebs".
    - **Interludes**: Реализованы промежуточные сцены A (Victoria Street Event) и B (Lotte Phone Call) с полной озвученной (текстово) драмой.
    - **Hybrid Finale**: Финал с двумя радикально разными ветками: "Political Provocation" (разоблачение коррупции) и "Syndicate War" (перестрелка).
    - **Personal Quest**: Внедрен квест Виктории "The Golden Cage" (сопровождение в паб), открывающийся через интерлюдию.
- **Audio System**:
    - **SoundManager**: Процедурный генератор звука на Web Audio API.
    - **Typewriter FX**: Каждый символ в диалоге теперь издает уникальный механический щелчок (без внешних mp3 файлов).
    - **Ambient Support**: Плавный кроссфейд фоновой музыки при смене сцен.
- **Interactive Feedback**:
    - **Toast Notifications**: Стильные уведомления (Art Deco) при сборе улик и добавлении заметок.
    - **Animated Tokens**: Улики и инсайты теперь пульсируют при наведении и анимированы (Framer Motion).
- **Aesthetic Overhaul (Detective's Desk)**:
    - **Color Palette**: Переход на теплую схему "Warm Black / Gold / Amber" (#d4c5a3, #1c1917, #b45309).
    - **Typography**: Интеграция шрифтов **Playfair Display** (Dialogue/Headers) и **Courier Prime** (Clues/Reports).

### Изменено
- **Logic<>Gameplay Sync**: Сбор улик в тексте (`[[id|text]]`) теперь автоматически устанавливает игровые флаги, открывая новые ветки диалогов.
- **Registry Update**: Все новые сценарии (Interludes, Finale, Quests) зарегистрированы и привязаны к точкам карты.

### Технические детали
- **Type Definitions**: Обновлены типы `VNScenario` для поддержки `musicUrl`.
- **Refactoring**: Очистка `VisualNovelOverlay` от хардкодных цветов в пользу CSS-переменных темы.

---

## [28.01.2026] — Hybrid Quest System & Developer Tools

### Добавлено
- **Hybrid Quest Engine**: Реализована гибридная система квестов, сочетающая линейные акты (Acts/Cases) с нелинейным графом расследования.
    - **Schema**: Добавлены таблицы `quests` и `user_quests`.
    - **QuestStore**: Клиентское управление состоянием квестов и целей.
    - **QuestLog Interface**: Новый оверлей-виджет (справа сверху) для отображения активных целей.
    - **Engine Hook**: `useQuestEngine` автоматически отслеживает флаги в `DossierStore` и обновляет прогресс квестов.
- **Developer Dashboard 2.0**: Значительное расширение функционала `/developer`.
    - **Quests Tab**: Просмотр реестра квестов, состояния игрока, принудительный запуск и завершение квестов.
    - **Interactive Debuggers**:
        - **Flags Manager**: Добавление кастомных флагов, переключение (toggle) значений и удаление.
        - **Stats Editor**: Полный контроль над 18 голосами (Parliament) через +/- кнопки.
        - **Traits Manager**: Добавление перков вручную.
    - **System Actions**: Кнопки для выдачи опыта и полного сброса прогресса (Factory Reset).
    - **Visualization**: Визуализация текущего XP навыков и доступных Dev Points.
- **Quest System Improvements**:
    - **Quest Reset**: Добавлена кнопка "Reset Quests" в панели разработчика для точечного сброса квестов без удаления всего прогресса.
    - **Bug Fixes**: Восстановлена целостность `DossierStore` и исправлены синтаксические ошибки в сборке.
- **Hybrid Progression System (v2.0)**:
    - **Usage-Based Logic**: Каждая проверка навыка (Logic, Empathy и т.д.) дает XP этому навыку.
        - Успех: +20 XP.
        - Провал: +10 XP (Learning from failure).
    - **Classic Leveling**: Общий XP персонажа (за квесты) повышает "Character Rank".
    - **Development Points**: Каждый уровень ранга дает 1 Dev Point для ручного повышения любого навыка.
    - **Character Page**: Полностью обновлен UI. Добавлены прогресс-бары навыков, отображение ранга и интерфейс траты очков.
- **Progression System**:
    - В `DossierStore` добавлены `xp`, `level` и `traits`.
    - Реализована логика `grantXp` с простым левелингом (1 уровень за 1000 XP).

### Изменено
- **UI Integration**: `App.tsx` теперь включает `QuestLog` и инициализирует `QuestEngine`.
- **Refactoring**: Очистка неиспользуемых импортов в сторах.

---

## [28.01.2026] — Database Migration (Map Points v2)

### Добавлено
- **Schema Extension**: В таблицу `map_points` добавлены поля `description`, `category` (канонические типы: `CRIME_SCENE | NPC | QUEST | EVENT | ACTIVITY | INTEREST | TRAVEL`), `image` (прямой путь к ассету).
- **Seed Script v2**: Обновлён `seed-map.ts` для вставки изображений как отдельного поля (не JSON).
- **Category Mapping**: `DetectiveMapPin.tsx` поддерживает как новые канонические категории, так и legacy типы (обратная совместимость).

### Удалено
- **Legacy Points**: Удалён файл `packages/shared/data/points.ts` (хардкодные точки).
- **Feature Flag**: Удалён `ENABLE_LEGACY_MAP_POINTS` — данные теперь только из БД.
- **Hybrid Merge**: Из `useMapPoints.ts` удалена логика слияния legacy + server данных.

- **Client Code**: `useMapPoints.ts` сокращён с 85 до 40 строк (только API fetch).
- **Resolver**: `resolveAvailableInteractions` теперь корректно парсит `bindings` как JSON-строку из БД.

### Character Page & Parliament Refactor
- **Character Page**: Реализована страница персонажа (`/character`) в стиле Art Deco / "Detective's Desk".
    - Отображение 18 голосов, сгруппированных по 6 категориям (Intellect, Psyche, Social, Physical, Shadow, Spirit).
    - Визуализация уровня и опыта.
    - Биография и заглушка для портрета.
- **Parliament System**: Полный рефакторинг фронтенда под систему 18 голосов.
    - `DossierStore` теперь отслеживает статистику всех 18 навыков.
    - Обновлены типы в `parliament.ts` (re-export из `@repo/shared`).
    - Иконки: Сгенерированы 5 базовых иконок Art Deco для групп навыков.
- **Build Fixes**:
    - Исправлен `MapPointSchema` (добавлено поле `image`).
    - Устранены ошибки импорта модулей в `CaseCard` и `DetectiveMapPin`.

### Архитектура данных (на момент 04.02)
| Домен | Источник | Статус |
|-------|----------|--------|
| Map Points | Supabase (`map_points`) | ✅ Мигрировано |
| User Progress | Supabase (`user_map_point_user_states`) | ✅ Мигрировано |
| Hardlinks | `hardlinks.ts` | ✅ Мигрировано (05.02 → `event_codes` + `map_points.bindings`) |
| Cases | `cases.ts` | ⏳ Фаза 3 |
| Deductions | `deductions.ts` | ⏳ Фаза 3 |

---

## [27.01.2026] — Localization 2.0 & Unified Navbar

### Добавлено
- **Localization Engine 2.0**: Архитектурное разделение логики сценария (`Logic`) и текстового контента (`Content`).
    - Поддержка нескольких языков: **English (EN)**, **Deutsch (DE)**, **Русский (RU)**.
    - Система `mergeScenario`: Динамическая сборка сцен с автоматическим фоллбэком на английский при отсутствии перевода.
    - Улучшенный токенизатор: Безопасный парсинг интерактивных ссылок `[[улика|текст]]` через посимвольный обход.
- **Premium Navbar (The Detective's Desk)**: Новая централизованная панель управления в нижней части экрана.
    - Дизайн: Стиль **Art Deco / Liquid Glass** с использованием золотой отделки (#CA8A04), текстур дерева и эффекта размытия.
    - **Integrated HUD**: В Navbar перенесены функции выбора активного расследования (Investigation) и переключения языка.
    - **Global Navigation**: Прямое управление видимостью Досье (Dossier) и навигация по разделам.
- **Dossier Visibility Control**: Добавлено состояние `isDossierOpen` в `DossierStore`, позволяющее управлять журналом из любой части системы.

### Изменено
- **Cleanup**: Удалены устаревшие плавающие компоненты `MapHUD` и `LocaleSelector`.
- **Imports Optimization**: Очищен `MapView.tsx` от неиспользуемых импортов и легаси-логики управления UI.
- **Parliament Registry**: В `parliament.ts` добавлены метаданные групп голосов (Rational, Emotional, Mystical) для корректного отображения уровней в Досье.

### Технические детали
- **i18n Schema**: Внедрена строгая типизация для языковых пакетов, гарантирующая наличие всех ключей для сценариев.
- **Z-Index Refactoring**: Пересмотрена иерархия слоев: Navbar (300) > Overlay (200) > Fullscreen (180) > Dossier (150) > Map.

---


## [27.01.2026] — Detective Notebook & Dual-Mode Engine

### Добавлено
- **Detective Notebook Mechanic**: Интерактивная система заметок. Специальный синтаксис `[[текст]]` (Заметка) и `[[id|текст]]` (Улика) в текстах новеллы позволяет игроку кликом сохранять данные в Досье.
- **Dual-Mode VN Engine**: Движок визуальной новеллы теперь поддерживает два режима отображения:
    - **Overlay**: Текстовое окно поверх карты (исследование локаций).
    - **Fullscreen**: Полноэкранный кинематографичный режим для важных сюжетных развязок (Finale).
- **Notebook Widget**: Новый UI-компонент (виджет) для быстрого доступа к собранным заметкам и уликам прямо из интерфейса карты.
- **Case #1 Content Complete**: Полностью реализованы сценарии Дела №1 "Bankhaus Krebs":
    - *Bank Scene*: Осмотр места преступления (Overlay).
    - *Lab Analysis*: Анализ улик в университете (Overlay).
    - *Finale*: Финальная дедукция и конфронтация (Fullscreen).

### Изменено
- **TypedText Parser**: Реализован компонент `TypedText` с эффектом печатной машинки и парсингом интерактивных токенов.
- **Strict Typing**: Внедрена строгая типизация для `VoiceId` (Internal Parliament) и сценариев в `registry.ts`.
- **Dossier Upgrade**: `DossierStore` теперь поддерживает дедупликацию заметок и строгую типизацию типов записей (`note` vs `clue`).

### Технические детали
- **Unit Tests**: Написаны тесты для парсера `TypedText` (Vitest/JSDOM).
- **Registry Pattern**: Все сценарии теперь регистрируются в централизованном `SCENARIO_REGISTRY` для удобства управления.

---

### Добавлено
- **Database Schema**: Таблицы `map_points` (хранение точек) и `user_map_point_states` (прогресс игрока) в SQLite.
- **Seeding Script**: Скрипт `seed-map.ts` для миграции хардкодных данных в БД.
- **MapPointCard**: Новый UI-компонент карточки точки с поддержкой множественных действий (Actions).
- **ThreadLayer 2.0**: Слой нитей теперь полностью управляется данными (data-driven), реагирует на отфильтрованный список точек.

### Изменено
- **Refactoring**: Полное удаление легаси-кода `DETECTIVE_POINTS` из клиентской части.
- **Cleanup**: Удален флаг `ENABLE_LEGACY_MAP_POINTS` и гибридная логика слияния.
- **Performance**: Оптимизация рендеринга слоев карты (убраны лишние проверки состояний).

### Технические детали
- **Validation**: Zod-схемы для JSON-биндингов (Triggers, Conditions, Actions) гарантируют целостность данных в БД.
- **Idempotency**: API активации точек проверяет текущее состояние во избежание повторных срабатываний.

---

## [27.01.2026] — RPG Mechanics & Skill Checks

### Добавлено
- **Dice Logic Core**: Реализована утилита `dice.ts` для обработки проверок навыков (d20 roll + skill level vs Difficulty).
- **Store Upgrade**: `DossierStore` теперь хранит `voiceStats` (уровни навыков) и `checkStates` (история проверок: passed/failed/locked).
- **Skill Check Schema**: Расширен интерфейс `VNChoice` объектом `skillCheck`, определяющим сложность, тип голоса (Logic, Perception и т.д.) и последствия (onSuccess/onFail).
- **Interactive UI**: `VisualNovelOverlay` теперь визуализирует сложность проверок и обрабатывает броски кубиков, перенаправляя игрока по веткам успеха или провала.
- **Content Integration**: В сценарий Case #1 (Bank Vault) добавлены первые проверки (Logic: взлом замка, Perception: поиск улик) с уникальными текстовыми исходами.

### Технические детали
- **Shared Lib**: Логика кубиков вынесена в `packages/shared/lib/dice.ts` для переиспользования.
- **State Management**: Централизованное управление характеристиками через Zustand, без дублирования.
- **Schema Validation**: Строгая типизация всех исходов проверок (действия + навигация).

### Planning (Architecture)
- **MapPoint Engine 2.0**: Разработан детальный план (`docs/PLAN-map-point-types.md`) перехода на унифицированную систему точек.
  - **Single Source**: Отказ от разделения на hardcoded точки и динамические.
  - **Bindings DSL**: Внедрение системы "Триггер -> Условие -> Действие" (JSON-serializable).
  - **Lifecycle**: Четкие состояния `locked` -> `discovered` -> `visited` -> `completed`.

---

## [26.01.2026] — Фокус на Detective Mode

### Удалено
- **Survival Mode**: Полное удаление режима выживания и всех упоминаний о нём для фокусировки на детективном геймплее.
- **Инвентарь выживания**: Из `useInventoryStore` удалены поля и логика, специфичные для режима выживания.

### Изменено
- **Главная страница**: Редизайн с упором на единственную доступную кампанию "Freiburg 1905".
- **Сканер (Hardlinks)**: Теперь работает исключительно в детективном режиме, интерфейс стилизован под архивную тематику.
- **Карта**: Упрощена логика рендеринга, удалены проверки переключения режимов.

---

## [26.01.2026] — Стабилизация и визуальное обновление (Detective Mode)

### Добавлено
- **Унифицированный запуск**: Добавлен скрипт `bun run dev`, запускающий Web и Server параллельно.
- **Система Онбординга (Telegram)**: Тематическое введение в стиле телеграммы 1905 года для Detective Mode.
- **Фоновая загрузка карты**: Mapbox инициализируется в фоне под блюром во время онбординга.
- **Персистентность имени**: Inspector Name сохраняется в `useInventoryStore` (localStorage).
- **Архитектурная документация**: Создан `ARCHITECTURE.md` с описанием слоев FSD и механик.
- **Visual Novel Engine**: Легковесный движок (`entities/visual-novel`) с поддержкой выборов и действий.
- **Case #1 "Bankhaus Krebs"**: Реализован полный сюжетный цикл (5 сценариев: Briefing → Bank → Pub → Archive → Warehouse).
- **Интерактивные выборы**: Ответы в диалогах теперь открывают точки на карте и выдают улики.
- **Автоматизация (Plop.js + Husky)**: Генераторы для FSD и пре-коммит хуки для проверки кода.

### Исправлено
- **Контекстный UI Досье**: Компонент `Dossier` перенесен внутрь `MapView`.
- **Accessibility & UX**: Исправлены а11y-лейблы и увеличены области клика (Fitts' Law) в телеграмме.
- **Module Resolution**: Фикс импортов `react-map-gl/mapbox` и `verbatimModuleSyntax`.
- **Layout Logic**: Исправлена высота карты (`100%`) и навигация при отказе от дела.

### Технические детали
- Обновлен `useInventoryStore` (state: `playerName`).
- Валидация через `ux_audit.py`, `accessibility_checker.py` и `lint_runner.py`.



---
### Архитектурный план (Next Steps)
- **MapPoint Engine 2.0**: Переход на единую систему точек (MapPoint + Binding + Conditions DSL).
- **Navigation**: Интеграция реальной навигации по дорогам (Infrastructure-aware proxy).
- **Narrative Threads**: Визуализация связей между уликами на карте.
- **Server Authority**: Подготовка к полной синхронизации прогресса расследований.

---

## [26.01.2026] — Asset Suite & Visual Consistency

### Добавлено
- **Detective Asset Suite**: Набор из 11+ тематических ассетов в `public/images/detective` (архивные фото, маркеры-печати, штампы "Erledigt").
- **Circular Map Pins**: В `DetectiveMapPin.tsx` реализована логика отображения фото-локаций в круглых рамках с золотым свечением.
- **Generic Markers**: Система иконок для типов точек (Crime: Seal, Support: Anvil, Info: Inkblot).

### Изменено
- **Filename Normalization**: Все сгенерированные ассеты переименованы в чистый формат (без timestamp) для соответствия коду.
- **Tooltip Styling**: Тултипы меток на карте приведены к общему стилю (темный фон, Serif шрифт, увеличенный трекинг).

### Технические детали
- Реализован приоритет `point.image` над дефолтными иконками в `DetectiveMapPin`.
- Улучшена обработка состояний (unlocked/investigated/discovered) через CSS-фильтры (sepia/grayscale).


---

## [26.01.2026] — Внутренний Парламент (Internal Parliament)

### Добавлено
- **Система 18 голосов**: Реализована полная структура «Внутреннего парламента» (6 групп по 3 голоса) согласно `Обзор.md`.
- **Метаданные Голосов**: Создана база данных голосов (`parliament.ts`) с уникальными цветами, девизами и типами (Интеллект, Психика и др.).
- **Прогрессия навыков**: В `useInventoryStore` добавлена персистентная система уровней для каждого из 18 голосов.
- **Интерактивный Досье**: Новая вкладка **"Voices"** в компоненте `Dossier` для визуализации прокачки навыков сыщика.

### Изменено
- **Динамический CaseCard**: Теперь карточки на карте отображают комментарии от любых из 18 голосов, используя их тематические цвета.
- **Миграция данных**: Все существующие игровые точки переведены со старой системы (Rationalist/Romantic) на новые ID голосов (`logic`, `empathy`).

### Технические детали
- Добавлен `parliament.ts` в корень и в `features/detective/lib` для синхронизации логики.
- Исправлены ошибки типизации и отсутствующие зависимости (`zustand` в корне).
- Реализована динамическая фильтрация и рендеринг голосов в UI на основе метаданных.

---
---

## [26.01.2026] — Глубокое погружение и Технический долг

### Добавлено
- **Оперативное досье (Lore)**: Создан `Сюжет.md` — подробный стратегический анализ Фрайбурга 1905 года. Включает психогеографию районов (Шнекенфорштадт, Штюлингер), анализ банковского сектора и академическую экспертизу (тесты Уленгута, химия Килиани).
- **Сценарная интеграция**: Подготовка базы для «Сахариновой войны» и связей с контрабандой в Шварцвальде.

### Исправлено (Infrastructure)
- **ESLint Fix**: Исправлена конфигурация `lint-staged` для поддержки Flat Config в монорепозитории.
- **Type Safety**: Массовое удаление `any` в ключевых компонентах (`VisualNovelOverlay`, `CaseCard`, `MapView`) и переход на строгую типизацию `Evidence` и `MapAction`.
- **Pure Hooks**: Исправлены ошибки чистоты в `DetectiveMarker` (использование `Date.now()` в render и зависимости `useEffect`).
- **Commit Workflow**: Убран `tsc --noEmit` из `lint-staged` для ускорения коммитов и исправления конфликта флагов.

### Технические детали
- Обновлен корневой `package.json` (eslint paths).
- Все изменения успешно запушены в `master`.

---
---

## [26.01.2026] — Механика Дедукции и Криминалистика

### Добавлено
- **Deduction Board (Доска расследования)**: Новый UI-компонент в Досье, имитирующий рабочий стол детектива (пробковая доска). Позволяет визуально связывать улики нитями.
- **Deduction Engine**: Логика комбинации улик (`combineEvidence`). Поддержка рецептов: `Улика А + Улика Б = Результат` (открытие точки, флага или мини-игры).
- **Chemical Analysis (Мини-игра)**: Интерактивная модальная сцена «Лаборатория Килиани». Механика титрования (добавление капель реагента) для анализа веществ.
- **Assets**: Сгенерированы и интегрированы уникальные ассеты: фон доски, бутыль с реагентом, визуализация химической реакции.

### Технические детали
- **Zustand Store**: Расширен `DossierState` для хранения `unlockedDeductions`.
- **Optimization**: Ассеты оптимизированы и добавлены в `public/images/detective`.
- **Refactor**: Убраны циклические зависимости в `store.ts` через динамический импорт реестра дедукций.

---
*Следующий этап: Развитие системы навыков и интеграция Внутреннего Парламента в механики дедукции.*


## [2026-02-06] - Outdated Tests Block Closed (Map Integration)

### Added
- Controlled integration contour for map API: `createMapModule(repository?)` + explicit `MapRepository` contract.
- Deterministic integration suite `apps/server/test/modules/map.test.ts` without `skip` and without external DB dependency.

### Changed
- `apps/server/src/modules/map.ts` split into route logic and repository adapter (`createDrizzleMapRepository`).
- `/map/resolve-code/:code` response schema updated so `actions` preserve full payload (`t.Array(t.Any())`).

### Verified
- `bun test apps/server/test/modules/map.test.ts` - 4/4 passed.
- `bun test apps/server/test/simple.test.ts` - 1/1 passed.
- `bun test packages/shared/lib/map-resolver.test.ts` - 4/4 passed.
- `bun x tsc -p apps/server/tsconfig.json --noEmit` - passed.

### Docs
- Updated `README.md` and `ARCHITECTURE.md` to describe controlled map test contour and validation commands.

## [07.02.2026] - Detective Engine Foundation + Web Integration

### Added
- New server module `apps/server/src/modules/engine.ts` with endpoints:
  - `GET /engine/world`
  - `POST /engine/time/tick`
  - `POST /engine/travel/start`
  - `POST /engine/travel/complete/:sessionId`
  - `POST /engine/case/advance`
  - `POST /engine/progress/apply`
  - `POST /engine/evidence/discover`
- New shared/contracts engine types:
  - `packages/shared/lib/detective_engine_types.ts`
  - `packages/contracts/engine.ts`
- New DB schema/migration foundation for world simulation and progression:
  - `world_clocks`, `city_routes`, `travel_sessions`, `cases`, `case_objectives`,
    `user_case_progress`, `player_progression`, `voice_progression`, `factions`,
    `user_faction_reputation`, `user_character_relations`, `evidence_catalog`,
    `user_evidence`, `domain_event_log`.

### Changed
- `supabase_seed.sql` extended with Engine Foundation seed:
  - case `case_01_bank`, objectives, factions, routes, contradiction-ready evidence.
- Web API client upgraded to typed GET/POST engine calls:
  - `apps/web/src/shared/api/client.ts`.
- New world state store on frontend:
  - `apps/web/src/features/detective/engine/store.ts`.
- Server identity resolution moved from fixed user to auth-aware strategy:
  - `apps/server/src/lib/user-id.ts` (`auth -> headers -> fallback`).
- Engine, map, and detective modules now ensure db user existence before writes:
  - `apps/server/src/db/user-utils.ts`.
- `MapView` now runs real travel/time/location-availability loop before scene execution.
- `MapView` objective selection is now dynamic by stable location identity (`locationId`) instead of hardcoded point mapping.
- `CaseCard` now shows world phase/tick/location and alternative approaches (`lockpick`, `bribe`, `warrant`) when location is blocked.
- `map-action-handler` extended for action types: `add_flags`, `unlock_entry`, `set_active_case`.

### Fixed
- Night bank flow now has playable branch from UI through `/engine/case/advance`.
- Travel completion updates world clock and location context consistently in frontend store.

### Validation
- `bun x tsc -p apps/web/tsconfig.app.json --noEmit`
- `bun x tsc -p apps/server/tsconfig.json --noEmit`
- `bun x tsc -p packages/contracts/tsconfig.json --noEmit`
- `bun test apps/server/test/modules/engine.test.ts`
- `bun test apps/server/test/modules/map.test.ts`
- Added checks:
  - world snapshot objective serialization by case (`engine.test.ts`).
  - header-based user context for map state resolution (`map.test.ts`).

### Notes
- `demo_user` remains only as a fallback identity for local/dev flows when auth/header context is absent.
- `point -> objective` routing is now location-driven and no longer hardcoded.
- Fog of war is tracked as a next layer on top of stable location progression (visibility/discovery/resolution states).

## [07.02.2026] - Documentation + Obsidian Alignment

### Updated docs
- `README.md`:
  - Synced Detective Engine status with auth-aware user context and location-driven objective routing.
  - Added explicit Obsidian operational links (framework, sprint board, investigation/fog systems).
- `ARCHITECTURE.md`:
  - Synced known constraints with real runtime behavior.
  - Added stable `locationId` model and fog-of-war design notes.
  - Added direct links to core Obsidian control notes.
- `update.md`:
  - Added this alignment entry to lock current docs state.

### Updated Obsidian vault (`obsidian/Detectiv`)
- `99_System/Creator_Framework.md`:
  - Added spatial identity rule (`loc_*` stable anchor, `map_point` as interaction layer).
  - Added fog-of-war writing rule and link to dedicated system note.
- `20_Game_Design/Systems/Sys_FogOfWar.md`:
  - Added dedicated system note for reveal states (`unknown/visible/explored/resolved`) and reveal channels.
- `20_Game_Design/READ_ME.md`:
  - Added `Sys_FogOfWar` to current key systems list.
- `00_Map_Room/` notes aligned with current sprint focus (engine progression, stable IDs, location-first linking).
