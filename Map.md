# Карта GW4: Полный Runtime Guide

Дата актуальности: 2026-02-09
Статус: canonical guide для map runtime (`server -> web -> VN/quests/dossier`)

## 1) Цель документа

Этот документ фиксирует, как работает карта в проекте сейчас, какие контракты считаются каноническими, как безопасно вносить изменения, и как проверять, что flow не сломан.

Runtime-цепочка:
`/map + /engine (server)` -> `MapView + QR scanner (web)` -> `map-actions` -> `VN / quests / dossier / world-engine`.

## 2) Канонические источники истины

### 2.1 По точкам карты и сидированию

- Runtime source of truth: `apps/server/src/scripts/data/case_01_points.ts`
- Сидирование в БД: `apps/server/src/scripts/seed-map.ts`
- SQL bootstrap/sync: `supabase_seed.sql`

### 2.2 По контрактам map

- Shared validators/types: `packages/shared/lib/map-validators.ts`
- Public map contracts: `packages/contracts/map.ts`

### 2.3 По case/pack идентификаторам

- Канонический кейс: `case_01_bank`
- Канонический pack: `fbg1905`
- Источники case/thread: `apps/web/src/features/detective/data/cases.ts`

### 2.4 По VN сценариям

- VN registry собирается из `*.logic.ts`: `apps/web/src/entities/visual-novel/scenarios/registry.ts`
- Для `start_vn` валидны только `scenarioId`, существующие в logic registry
- `start_battle` использует battle-сценарии (не VN registry), см. `packages/shared/data/battle.ts`

## 3) Архитектура исполнения

## 3.1 Сервер: `map` модуль

Файл: `apps/server/src/modules/map.ts`

Ключевые задачи:
- отдать видимые точки и user states (`GET /map/points`)
- резолвить QR/event code (`POST /map/resolve-code`)
- применять unlock state для point и возвращать `actions[]`

Важные гарантии:
- QR резолв ищет только `active=true` точки
- event actions валидируются через `MapActionSchema`
- state точки обновляется монотонно (без downgrade)
- наружу не утекают stack/details, только безопасный `error` и `traceId`

## 3.2 Сервер: `engine` модуль

Файл: `apps/server/src/modules/engine.ts`

Ключевая связка с картой:
- `GET /engine/world` теперь возвращает `currentLocationId`
- `currentLocationId` вычисляется сервером по последней `completed` travel-session
- fallback: `loc_hbf`

Это устраняет client-only desync позиции игрока после reload.

## 3.3 Клиент: карта и сканер

- Карта: `apps/web/src/widgets/map/map-view/MapView.tsx`
- Потоки на карте: `apps/web/src/widgets/map/map-view/ThreadLayer.tsx`
- QR scanner page: `apps/web/src/pages/QRScannerPage.tsx`
- API client: `apps/web/src/shared/api/client.ts`

Ключевые правила:
- карта всегда запрашивается с `packId: 'fbg1905'`
- `caseId` берется из runtime active case (`worldCaseId`)
- fallback state маркера: `point.defaultState ?? 'locked'` (а не hardcoded discovered)
- scanner использует `POST /map/resolve-code` с body `{ code }`

## 3.4 Применение map actions

- Handler: `apps/web/src/features/detective/lib/map-action-handler.ts`
- Quest transitions: `apps/web/src/features/quests/engine.ts`

Каноника:
- quest `add_flag(...)` транслируется в `set_flag`
- map-handler должен уметь исполнять actionы без silent no-op для runtime-critical веток
- `start_battle` и `teleport` подключены (не заглушки)

## 4) API контракты

## 4.1 `GET /map/points`

Query:
- `packId?: string`
- `caseId?: string`

Response (`MapPointsResponse`):
- `points: MapPoint[]`
- `userStates: Record<string, PointStateEnum>`
- `error?: string`
- `traceId?: string`

Важно:
- `details` и `stack` в public response не используются

## 4.2 `POST /map/resolve-code`

Request:
- body: `{ code: string }` (`ResolveCodeRequest`)

Response (union):
- success event:
  - `{ success: true, type: 'event', actions: MapAction[] }`
- success map-point:
  - `{ success: true, type: 'map_point', pointId: string, actions: MapAction[] }`
- fail:
  - `{ success: false, error: string }`

Поведение:
- пустой `code` -> `400`
- неизвестный или inactive QR -> `404 Invalid Code`
- невалидная event конфигурация -> `500 Invalid event configuration`
- внутренняя ошибка -> `500 Internal Server Error (traceId: ...)`

## 4.3 Deprecated compatibility

- `GET /map/resolve-code/:code` сохранен как временный alias
- новый код должен использовать только `POST /map/resolve-code`

## 5) Модель состояния точки

State-модель:
- `locked -> discovered -> visited -> completed`

Правило:
- переходы только монотонные
- повторный scan не должен откатывать `visited/completed` в `discovered`

Практика:
- сервер вычисляет next state через приоритеты, а не blind upsert

## 6) Семантика map actions (runtime map pipeline)

Канонический action union: `packages/shared/lib/map-validators.ts` (`MapActionSchema`)

Используемые в map runtime типы:
- `start_vn`
- `unlock_point`
- `grant_evidence`
- `add_flags`
- `set_flag`
- `start_battle`
- `set_quest_stage`
- `set_active_case`
- `unlock_entry`
- `teleport`
- `open_trade`
- `show_toast`

Важно:
- legacy action-ветки, не покрытые `MapActionSchema`, не должны быть частью map runtime
- VN runtime имеет свой action union (`add_flag` и др.), это отдельный pipeline

## 7) Data integrity правила

## 7.1 Категории map point

При сидировании должны маппиться в canonical категории:
- `npc -> NPC`
- `crime -> CRIME_SCENE`
- `support -> NPC`
- `bureau -> QUEST`
- `interest -> INTEREST`
- `transport -> TRAVEL`

Файл: `apps/server/src/scripts/seed-map.ts`

## 7.2 Ссылочная целостность сценариев

Правила:
- каждый `start_vn.scenarioId` из `case_01_points.ts` и `supabase_seed.sql` должен существовать в `*.logic.ts` registry
- каждый `unlock_point.pointId` должен ссылаться на существующий map point id
- `point.image` должен существовать в `apps/web/public/images/detective` или иметь корректный fallback

## 7.3 Legacy контент

Неиспользуемые runtime legacy-сцены переводятся в `.legacy.txt`, не в `.ts/.md`.

В этом цикле архивированы:
- `.../main/02_bank/case1_bank.legacy.txt`
- `.../main/04_warehouse/case1_warehouse.legacy.txt`
- `.../leads/pub/case1_pub.legacy.txt`

## 8) E2E сценарии, которые обязаны проходить

## 8.1 QR/event резолв

1. `POST /map/resolve-code` не открывает inactive points
2. `POST /map/resolve-code` не даунгрейдит state точки
3. невалидные `event_codes.actions` отклоняются
4. ошибки наружу без stack/details

## 8.2 Карта и состояние

1. `MapView` корректно отображает `locked/discovered/visited/completed`
2. `defaultState` учитывается как fallback
3. фильтрация по `packId/caseId` не подмешивает чужие точки

## 8.3 Quest -> map-actions

1. transition actions не должны пропадать в unknown action warning
2. `add_flag(...)` в quest DSL должен применяться как `set_flag`

## 8.4 Контент

1. все `start_vn` из seeds резолвятся в registry
2. все `unlock_point` цели существуют
3. все `point.image` существуют или fallback-ятся

## 9) Команды проверки

Минимальный прогон:

```bash
bun test apps/server/test/modules/map.test.ts apps/server/test/modules/engine.test.ts
bun x tsc -p apps/server/tsconfig.json --noEmit
bun x tsc -p apps/web/tsconfig.json --noEmit --noUnusedLocals false --noUnusedParameters false
```

Проверка ссылок `start_vn`:

```bash
rg -n "scenarioId" apps/server/src/scripts/data/case_01_points.ts supabase_seed.sql
```

Проверка `unlock_point`:

```bash
rg -n "unlock_point|pointId" apps/server/src/scripts/data/case_01_points.ts supabase_seed.sql
```

Проверка ассетов:

```bash
Get-ChildItem apps/web/public/images/detective -File
```

## 10) Troubleshooting

## 10.1 `Invalid Code` при корректном QR

Проверь:
- `map_points.active = true`
- совпадает ли `qr_code`
- правильный `packId/caseId` контекст на фронте

## 10.2 `Invalid event configuration`

Проверь:
- `event_codes.actions` валидны по `MapActionSchema`
- нет legacy action object, который не проходит валидацию

## 10.3 Рассинхрон позиции игрока

Проверь:
- `GET /engine/world` возвращает `currentLocationId`
- после travel completion в `travel_sessions` есть запись со `status='completed'`
- web store гидратится из server snapshot, а не держит stale local state

## 10.4 Ошибки 500 без деталей

Это ожидаемо по security policy.
Для диагностики:
- взять `traceId` из ответа
- найти соответствующий лог сервера `[Map][traceId] ...`

## 11) Правила изменений (чтобы не словить регресс)

1. При изменении `MapActionSchema` синхронно обновлять:
   - `apps/server/src/modules/map.ts`
   - `apps/web/src/features/detective/lib/map-action-handler.ts`
   - места генерации actions в quests/seeds/event codes
2. При изменении runtime roster seeds обновлять:
   - `case_01_points.ts`
   - `seed-map.ts`
   - `supabase_seed.sql` (или явно маркировать legacy bootstrap)
3. При изменении поведения карты на сервере проверять фронт:
   - `MapView` (`packId/caseId/defaultState`)
   - scanner API method (`POST` vs alias)
4. Любой change в case-id делать сквозным:
   - cases data
   - thread layer filter
   - map query caseId
   - engine/world hydrate case context

## 12) Быстрый чеклист релиза map

- [ ] `/map/resolve-code` POST проходит happy-path и negative-path
- [ ] GET alias работает (до удаления)
- [ ] нет stack/details в публичном ответе
- [ ] inactive QR points не активируются
- [ ] state точки монотонный
- [ ] `MapView` использует `point.defaultState ?? 'locked'`
- [ ] `packId='fbg1905'`, `caseId='case_01_bank'` в runtime flow
- [ ] quest transitions применяют map actions без no-op
- [ ] `currentLocationId` приходит из `/engine/world`
- [ ] все `start_vn`/`unlock_point`/`image` ссылки валидны
