# PLAN: MapPoint — элементы карты и логика взаимодействия

Цель: привести точки на карте к единой, расширяемой системе для **Detective Mode** и “investigation engine” (мульти-шаговые триггеры, динамическая видимость, нарративные переходы состояний).
План опирается на принципы из [Detectiv.md](../Detectiv.md): **Core vs Pack**, “Hardlink = источник истины” для детектива, отсутствие софтлоков по навыкам и региональную подгрузку точек (`regionId` + радиус) с legacy-fallback.

---

## Термины (коротко)

- **MapPoint** — точка/POI на карте (координаты + визуал + список возможных взаимодействий).
- **LocationId** — идентификатор “физического места”, чтобы связать разные версии точки между эпохами.
- **Binding** — правило “триггер → условия → действия” (аналог `sceneBindings` из `grezwanderer3`, см. [Detectiv.md](../Detectiv.md)).
- **Trigger** — событие (`marker_click`, `qr_scan`, …).
- **Action** — эффект (`start_vn`, `unlock_point`, `grant_item`, …). В идеале — общий union с `HardlinkAction`.
- **Visibility** — видимость (скрыта/видна/подсвечена) и отдельно **Availability** (можно ли сейчас взаимодействовать).
- **PointState** — прогресс игрока по точке (`locked` → `discovered` → `visited` → `completed`).

---

## Phase 0: Socratic Gate (решения до кода)

1. **Источник истины по прогрессу**:
   - Detective: остаёмся offline-first в `Dossier` или переводим на сервер? (Для GW4 приоритет на локальное хранилище с синхронизацией).
2. **Жизненный цикл “одноразовых” точек** (после завершения):
   - `hide` (исчезает), `grey` (остаётся, но неактивна), `convert_to_landmark` (становится “лором”).
3. **Мульти-взаимодействия**:
   - 1 маркер = несколько действий (NPC + Trade + Quest) через меню/BottomSheet, или всегда дробим на разные маркеры?
4. **Discovery & UI**:
   - Иконка/тип видны сразу или раскрываются после `discovered`?
   - Нужны ли фильтры/легенда по слоям?
5. **Mode Divergence (1905 vs Present)**:
   - Моделируем как отдельные `MapPoint` с общим `locationId`, или как `modeOverrides` у одной записи? (В текущей версии — эпохи разделены через Content Packs).
6. **Навигация и “клик по карте”**:
   - В детективе по [Detectiv.md](../Detectiv.md) клик может строить маршрут (с кэшем + fallback на прямую линию).

---

## Phase 1: Список элементов на карте (что именно рисуем)

### 1) Базовые “примитивы” карты
- **Player marker** (свой).
- **Route overlay**: маршрут/линия к цели + fallback (прямая).
- **Zones/Polygons**: районы (`districts`), области событий.
- **POI markers (MapPoints)**: интерактивные маркеры.
- **UI overlays**: подсказка (tooltip), карточка точки (BottomSheet), фильтры/легенда слоёв.

### 2) Категории MapPoints (уровень “что это”, не “что делает”)
Базовые категории (действия задаются `bindings`, см. Phase 2):

- **`INVESTIGATION`** — точки расследования (Detective). Подтипы: `crime | support | bureau | interest`.
- **`QUEST`** — цели/триггеры квестов (start/step/turn-in).
- **`NPC`** — разговор/хаб (один NPC или несколько).
- **`ACTIVITY`** — отдельные механики (мини-игра, осмотр).
- **`TRAVEL`** — переход/быстрый путь/ворота/станция.
- **`LANDMARK`** — лор/ориентир без геймплейной ценности.

---

## Phase 2: Единая схема взаимодействий (bindings вместо одного `interactionType`)

Вместо “одного типа взаимодействия” у точки вводим **список правил**, которые могут запускаться от разных событий.
Это напрямую ложится на детективный цикл: `qr_scan → actions → unlock_point/start_vn/grant_evidence → point появляется на карте`.

### 2.1 Триггеры (Trigger)
- `marker_click` — клик по маркеру.
- `marker_longpress` — контекстное меню.
- `arrive` — завершение маршрута/прибытие в точку.
- `qr_scan` — скан/ввод Hardlink.

### 2.2 Действия (Action)
На основе `HardlinkAction`:
- `start_vn`, `start_battle`
- `unlock_point`, `unlock_entry`
- `grant_evidence`
- `add_flags` / `set_flag`

### 2.3 Условия и резолвинг (Conditions + InteractionResolver)
Ключевая идея: `bindings` и `conditions` должны быть **серилизуемыми данными** (не функциями), чтобы:
- хранить их в Content Pack / БД как JSON,
- при необходимости выполнять резолвинг на сервере так же, как на клиенте.

Минимальные `conditions` (DSL):
- `flag_is_set` / `flag_is_not_set`
- `point_state_is` (по `pointId`)
- `all_of` / `any_of` (комбинаторы)

Алгоритм `InteractionResolver` для `trigger`:
1) фильтруем bindings по `trigger`,
2) фильтруем по `conditions`,
3) сортируем по `priority` (DESC),
4) возвращаем `actions` одного binding (или нескольких, если явно разрешим `collect`),
5) если ничего не найдено — открываем карточку точки с объяснением “пока недоступно”.

### 2.4 PointState (прогресс по точке)
- `locked` → `discovered` (через `unlock_point`, квест, QR…)
- `discovered` → `visited` (через `arrive` или ручное подтверждение)
- `visited` → `completed` (после выполнения ключевого шага)

---

## Phase 3: Правила Detective Mode

Базовая логика из [Detectiv.md](../Detectiv.md):
- Точки не открываются по GPS; открытие через `qr_scan` → `unlock_point`.
- Прогресс в `Dossier` (`pointStates`) + серверные `userStates`; карта рисует точки по lifecycle-правилам и активному региону.
- `marker_click` открывает карточку (title/description/state + действия).
- `arrive` может запускать VN.

---

## Phase 4: Backend & Data (Bun + Drizzle)

> Для GW4 приоритет: локальное хранилище с синхронизацией. Поэтому Phase 4 можно делать в два этапа: **MVP (offline-first)** → **Sync/Server-authority**.

### 4.1 MVP (offline-first): что хранить на клиенте
- `Dossier.pointStates: Record<pointId, PointState>` вместо одного `unlockedPoints[]` (см. [Detectiv.md](../Detectiv.md), там это уже описано как целевая структура).
- (опционально) `Dossier.activeDetectivePackId` и отдельный persist key `gw4-detective-dossier:{packId}`, чтобы паки не смешивались.

### 4.2 Server/Synced: что хранить в БД
- `map_points`: базовые данные (coords, category, title, metadata, packId) + `bindings` (JSON).
- `user_map_point_state`: состояния игрока (`PointState`) и одноразовые флаги (lootedOnce, cooldownUntil, …).

### 4.3 API
- `GET /map/points?packId=...&caseId=...&regionId=...` → точки + state игрока (при `regionId` включается серверный фильтр радиуса).
- `POST /map/resolve-code` → “QR/Event code → actions” (возвращает `MapAction[]`).
- `GET /map/resolve-code/:code` → legacy-совместимый read entrypoint для старых клиентов.
- (опционально) `POST /map/interact` → сервер-авторитетный интеракт (если решим, что клиент не должен сам вычислять actions).

---

## Phase 4.5: Proposed Changes (по репозиторию)

### [Component] `packages/shared`
Определить общие типы/DSL, чтобы client+server говорили на одном языке.

- **[NEW]** `packages/shared/lib/map.ts`
  - `MapPoint` (coords, category, metadata, packId, locationId?)
  - `MapPointBinding` (Trigger → Conditions → Actions + `priority`)
  - `PointState` (`locked | discovered | visited | completed`)
  - `TriggerType` (`marker_click | qr_scan | arrive`)
  - `MapAction` (унифицировать `HardlinkAction` + VN actions)
  - `Condition` DSL (серилизуемая, без функций)
- **[NEW]** `packages/shared/lib/map-resolver.ts` (или рядом)
  - чистая функция резолвинга binding’ов (без сайд-эффектов) → удобно тестировать и/или использовать на сервере

### [Component] `apps/server`
Добавить минимальный Map module (сейчас его нет) + таблицы.

- **[MODIFY]** `apps/server/src/db/schema.ts`
  - `map_points`
  - `user_map_point_state`
- **[NEW]** `apps/server/src/modules/map.ts`
  - `GET /map/points`
  - `POST /map/resolve-code`
  - `GET /map/resolve-code/:code` (legacy)
- **[MODIFY]** `apps/server/src/index.ts`
  - подключить `mapModule`

### [Component] `apps/web`
Перевести текущий detective прототип на unified MapPoint.

- **[NEW]** `apps/web/src/features/map-interactions/lib/interaction-resolver.ts`
  - thin-wrapper над shared resolver (плюс чтение нужного контекста: flags/pointStates)
- **[MODIFY]** `apps/web/src/widgets/map/map-view/MapView.tsx`
  - источник точек: не `DETECTIVE_POINTS`, а unified data (из Pack + `Dossier.pointStates` / или из API)
  - `marker_click` → `InteractionResolver` → `actions` → исполнение
- **[NEW]** `apps/web/src/widgets/map/MapPointCard.tsx`
  - BottomSheet/Tooltip: title/description/state + список доступных действий (если их несколько)
  - стиль “premium” (в проекте уже есть `framer-motion`)

---

## Phase 5: Verification (DoD)

### Manual
- `qr_scan` открывает точку, маркер появляется.
- `marker_click` открывает карточку.
- `arrive` переводит в `visited`.

### Case #1 Flow Test (Freiburg 1905)
1) Открыть `/`, выбрать Freiburg в Home и перейти на `/city/fbg1905/map`.
2) Убедиться, что видна только стартовая точка (или ни одной — если старт делается через hardlink).
3) Просканировать/ввести `GW4_GATE_FR_HBF` (или legacy код кейса при наличии в seed).
4) Проверить: появилась точка банка `munsterplatz_bank`.
5) Клик по банку → карточка показывает “Examine crime scene” / “Start scene”.
6) Выбор действия → запускается VN сцена.
7) По завершении сцены: стиль маркера меняется (`visited`), и/или открываются следующие точки (Pub/Archive) по действиям сценария.

### Automated
- Unit: тест resolver’а (приоритет, условия, “нет подходящих binding’ов”).
  - **[NEW]** `packages/shared/lib/map-resolver.test.ts`
  - запуск: `bun test packages/shared/lib/map-resolver.test.ts`

### Tech
- `bun run --filter web lint`
- `bun x tsc -p apps/web/tsconfig.json --noEmit`
- `bun x tsc -p apps/server/tsconfig.json --noEmit`
