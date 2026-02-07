# Grezwanderer 4

**Grezwanderer 4** — это современная игровая платформа, сфокусированная на **Detective Mode**. Проект объединяет в себе Visual Novel и картографическое исследование в уникальном историческом сеттинге.

[📜 Журнал обновлений (Changelog)](./update.md) | [Player Journey](./Playerview.md) | [🕵️ Сюжет и Лор](./Сюжет.md) | [🏗 Архитектура](./ARCHITECTURE.md) | [🗺️ Map Engine Specs](./docs/PLAN-map-point-types.md) | [⚖️ Регламент документации](./DOCS_POLICY.md)

## 🚀 Основные возможности (Features)

### 🕵️ Detective Investigation Engine
- **Unified Map System (v2)**: Полностью БД-управляемая система точек (Supabase/PostgreSQL) с категориями (`CRIME_SCENE`, `NPC`, `QUEST` и др.) и прямым хранением изображений.
  - ✅ `map_points`: полностью мигрированы, bindings хранятся как JSON
  - ✅ `event_codes`: QR/ручные коды мигрированы в отдельную таблицу
  - ✅ `hardlinks.ts`: удалён, данные встроены в `map_points.bindings` и `event_codes`
  - ⏳ `cases`, `deductions`: запланированы на Фазу 3 (Content Editor)
- **Eden Treaty (E2E Type Safety)**: Типобезопасные API-вызовы между клиентом и сервером через `@elysiajs/eden`.
- **Narrative Threads**: Визуализация логических связей между уликами прямо на карте.
- **Infrastructure Navigation**: Реалистичное перемещение агента с учетом городской среды (дороги, мосты).

### 📁 Dossier & Evidence
- **Журнал улик**: Сбор и систематизация найденных доказательств.

### 🧠 Внутренний Парламент (Parliament of Voices)
Уникальная ролевая система, где навыки детектива — это голоса в его голове, каждый со своим характером и подходом к решению проблем. Всего 18 голосов, разделенных на 6 групп:

| 🔵 Intellect (Анализ) | 🟣 Psyche (Интуиция) | 🔴 Social (Влияние) | 🟢 Physical (Тело) | ⚫ Shadow (Тень) | 🟠 Spirit (Дух) |
|---|---|---|---|---|---|
| **Logic** (Логика)<br>Выстраивание фактов | **Intuition** (Чутье)<br>Шестое чувство | **Authority** (Власть)<br>Доминирование | **Endurance** (Стойкость)<br>Боль и усталость | **Stealth** (Скрытность)<br>Незаметность | **Occultism** (Мистика)<br>Тайные знания |
| **Perception** (Внимание)<br>Поиск улик | **Empathy** (Эмпатия)<br>Чтение эмоций | **Charisma** (Шарм)<br>Обаяние и лесть | **Agility** (Ловкость)<br>Реакция | **Deception** (Обман)<br>Актерство | **Tradition** (Традиция)<br>Устои общества |
| **Encyclopedia** (Знание)<br>История и лор | **Imagination** (Образ)<br>Реконструкция | **Composure** (Выдержка)<br>Хладнокровие | **Forensics** (Криминалистика)<br>Работа с телами | **Intrusion** (Взлом)<br>Замки и двери | **Poetics** (Поэтика)<br>Чувство высокого |

*Каждый голос может вмешиваться в диалог, давать уникальные подсказки или открывать новые варианты ответов.*

- **Mind Palace Overlay**: Система пассивных проверок навыков. Голоса автоматически вмешиваются при входе в сцену (если проверка пройдена), показывая VoiceOrb с пульсирующей анимацией и ThoughtCloud с подсказкой. Интегрирован в оба режима VN (Overlay и Fullscreen).
- **Skill Check System (RPG)**: Механика проверки навыков (d20 + модификаторы) в диалогах, влияющая на успех расследования. Поддержка активных (на выборах) и пассивных (автоматических) проверок.
- **Картографический движок (Mapbox)**: Реалистичная карта Фрайбурга 1905 года с «туманом войны» и динамическими слоями нитей расследования.
- **Detective Board**: Интерактивная доска дедукции для связи улик и построения версий.
- **Forensics Mini-games**: Криминалистические мини-игры (химический анализ, взлом), базирующиеся на реальных научных методах той эпохи.
- **Audio & SFX Engine**: Процедурная генерация звука (Web Audio API) для эффектов пишущей машинки и интерактивных улик. Поддержка эмбиент-музыки.
- **Visual Novel Engine**: Диалоговая система с поддержкой **Dual Mode** (Overlay/Fullscreen), проверками навыков (18 голосов) и ветвлением сюжета (Interludes, Multi-ending Finale).
    - **Map-Driven Flow**: Fullscreen VN runs from MapPoint interactions (Investigate -> start_vn) and returns to /map on end.
    - **Virtual Window**: Гироскопический параллакс на мобильных устройствах.
    - **Cinematic Reveal**: "Умное" скрытие интерфейса для акцента на арт.
    - **UI Pro Max**: Асимметричный глассморфизм и микро-анимации.
- **Dialogue Battle System** ⚔️: Карточная боевая система вербальных дуэлей (в стиле Griftlands).
    - **15 стартовых карт** по 6 атрибутным группам (Intellect, Psyche, Social, Physical, Shadow, Spirit).
    - **Механика Resolve**: "HP" аргументов — снижайте решимость оппонента картами.
    - **Эффекты карт**: Урон, Блок, Лечение, Draw, Gain AP.
    - **Простой AI**: Оппонент разыгрывает карты автоматически.
    - **Интеграция с VN**: Переход VN → Battle → VN с сохранением контекста.
- **Interactive Text & Localization**: Мультиязычная система (EN, DE, RU). Игрок может кликать на `[[улики]]` (анимированные Framer Motion) для занесения в досье и на `[[ключевые слова]]` для получения контекста от Парламента (работает в Overlay и Fullscreen).
- **Premium Navbar (The Detective's Desk)**: Унифицированный интерфейс управления в стиле Art Deco (Warm Black/Gold) с использованием шрифтов Playfair Display и Courier Prime.
- **Character Page**: ÐŸÑ€Ð¾Ñ„Ð¸Ð»ÑŒ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð¶Ð° Ñ Ð²Ð¸Ð·ÑƒÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÐµÐ¹ Ð½Ð°Ð²Ñ‹ÐºÐ¾Ð² (Parliament of Voices), Ð° Ñ‚Ð°ÐºÐ¶Ðµ Ð²ÐºÐ»Ð°Ð´ÐºÐ¾Ð¹ **Psyche Profile** (Thought Cabinet) Ñ Ð²Ð¸Ð´Ð¸Ð¼Ñ‹Ð¼ Ð¿Ñ€Ð¾Ð³Ñ€ÐµÑÑÐ¾Ð¼ ÑÐµÐºÑ€ÐµÑ‚Ð¾Ð², ÑÐ²Ð¾Ð»ÑŽÑ†Ð¸Ð¸ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð¶ÐµÐ¹, Ñ„Ð°ÐºÑ†Ð¸Ð¾Ð½Ð½Ð¾Ð³Ð¾ Ð²Ñ‹Ñ€Ð°Ð²Ð½Ð¸Ð²Ð°Ð½Ð¸Ñ Ð¸ Ð½Ð°Ð´Ñ‘Ð¶Ð½Ð¾ÑÑ‚Ð¸ skill-check Ð¸ÑÑ‚Ð¾Ñ€Ð¸Ð¸.
- **Progress Tracking**: Разблокировка новых точек интереса по мере продвижения в расследовании.
- **Hybrid Quest System**: Система квестов, объединяющая линейное повествование с нелинейным сбором улик.
    - **Quest Log**: Виджет для отслеживания текущих целей.
    - **Heroic Progression**: Получение XP и Treits за выполнение расследований.
- **Heroic Progression (Hybrid)**: Комбинация Usage-based прокачки (Skyrim) и классических Dev Points (Fallout).
- **Enhanced Developer Dashboard**: Панель администратора (`/developer`) с редакторами флагов, навыков, реестром квестов (с функцией сброса) и функцией полного сброса (Factory Reset).
- **Persistent State**: Сохранение прогресса расследования и уровней навыков между сессиями.

### 🌍 Advanced Mapping
- **Mapbox v8 Integration**: Использование современного движка для плавной и быстрой работы с картой.
- **Custom Styling**: Полная поддержка пользовательских стилей (`inoti/cmktq...`) для каждой исторической эпохи.
- **Marker Animation**: Анимированные маркеры игрока и NPC для живого отображения перемещений.
- **Circular Map Pins**: Тематические "круглые" метки локаций с использованием архивных фотографий и символов (сургуч, чернила).

### 🏗 Инфраструктура
- **Unified Launch**: Запуск всего стека одной командой через `bun run dev`.
- **Eden Treaty (E2E Type Safety)**: Сквозная типизация API между сервером и клиентом через `@elysiajs/eden`. Клиент `apps/web/src/shared/api/client.ts` типизирован по серверному `App` типу.
- **Performance**: Сверхбыстрая сборка и выполнение благодаря Bun и Vite 7.
- **E2E Testing**: Playwright config + smoke test (`e2e/smoke.spec.ts`). Запуск: `bun run test:e2e`.
- **Drizzle Migrations**: Автоматическая генерация SQL-миграций для Supabase (`apps/server/drizzle/`).

---

## 🏗 Архитектура Системы

Проект спроектирован как модульный монорепозиторий, разделенный на функциональные приложения и общие пакеты.

### Основной Стек (Tech Stack)
- **Runtime**: [Bun](https://bun.sh) (управление пакетами, тесты, выполнение скриптов)
- **Frontend**: React 19 + Vite 7 + Tailwind CSS v4
- **Backend**: ElysiaJS + Drizzle ORM + Supabase (PostgreSQL)
- **Infrastructure**: Redis (Pub/Sub) + Clerk (Auth)

### Структура Директорий
```text
.
├── apps/
│   ├── web/                        # [Frontend] React + Vite + Tailwind 4
│   │   ├── src/
│   │   │   ├── entities/           # Бизнес-сущности (State & Model)
│   │   │   │   ├── inventory/      # Инвентарь игрока (Zustand)
│   │   │   │   ├── character/      # Characters (Model + UI)
│   │   │   │   └── visual-novel/   # Движок сценариев (Model, Scenarios)
│   │   │   │       └── scenarios/  # Case Bundles (detective/case_01, side_quests)
│   │   │   ├── features/           # Функциональные модули
│   │   │   │   └── detective/      # Режим детектива
│   │   │   │       ├── dossier/    # Логика Досье и Улик (Zustand)
│   │   │   │       ├── mind-palace/# Mind Palace Overlay (VoiceOrb, ThoughtCloud)
│   │   │   │       ├── lib/        # Parliament & Deductions
│   │   │   │       └── notebook/   # Виджет блокнота
│   │   │   ├── pages/              # Страницы (HomePage, QRScannerPage)
│   │   │   ├── shared/             # Переиспользуемый код (UI Kit, Libs)
│   │   │   │   └── ui/             # Shared UI (TypedText, Buttons)
│   │   │   ├── widgets/            # Крупные блоки интерфейса
│   │   │   │   ├── map/            # Mapbox обертки (MapView, Layers)
│   │   │   │   ├── navbar/         # Navigation bar (The Detective's Desk)
│   │   │   │   └── visual-novel/   # VN UI orchestration (Overlay, Mobile layout)
│   │   │   ├── App.tsx             # Root Component
│   │   │   └── main.tsx            # Entry Point
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── server/                     # [Backend] ElysiaJS + Bun
│       ├── src/
│       │   ├── config/             # Env vars (Redis, Clerk, Mapbox)
│       │   ├── db/                 # Drizzle Schemas & Migrations (Supabase/PostgreSQL)
│       │   ├── middleware/         # Auth (Clerk) & Logging
│       │   ├── modules/            # API Endpoints (Map, Health, resolve-code)
│       │   ├── scripts/            # Утилиты (Seeding, Maintenance)
│       │   └── services/           # Бизнес-логика (Redis)
│       └── package.json
├── packages/                       # [Shared Workspace]
│   └── shared/
│       ├── data/                   # Консолидированные данные (Parliament, Characters, Battle)
│       ├── locales/                # i18n словари
│       └── lib/                    # Shared Types, Zod Validators, Dice, RPG Config
├── .env                            # Secrets (Git Ignored)
└── package.json                    # Root Config (Workspaces)
```

---

## � Разработка и запуск

### Быстрый старт
Для управления проектом используется `concurrently`. Вы можете запустить всё одной командой из корня:

```bash
# 1. Установка зависимостей
bun install

# 2. Запуск всего стека (Web + Server в параллели)
bun run dev

# 3. Сборка всех проектов
bun run build
```

### Переменные окружения (.env)
Vite настроен на автоматическую загрузку переменных из корня монорепозитория. Обязательные ключи:
- `VITE_MAPBOX_TOKEN`: Токен для визуализации карт.
- `VITE_CLERK_PUBLISHABLE_KEY`: Публичный ключ авторизации.
- `CLERK_SECRET_KEY`: Секретный ключ сервера.
- `DATABASE_URL`: Строка подключения к базе. **Важно**: Для надежности на Windows используйте порт 6543 (PgBouncer) с параметром `?pgbouncer=true`.

---

## 🗺 Особенности картографии
В проекте реализована продвинутая работа с картами на базе **Mapbox v8**:
- **Custom Styles**: Использование специфичного стиля `mapbox://styles/inoti/cmktqmmks002s01pa3f3gfpll`.
- **Visual FX**: Наложение винтажных фильтров (sepia, contrast, brightness) динамически.
- **Dossier System**: Интеграция игровых точек интереса с Dossier Store для отслеживания прогресса улик.
- **Micro-Polish**: Оптимизированные размеры маркеров и адаптивная подсветка целей (Focus Ring) для лучшей читаемости.
- **Debug Logging**: Расширенная система трассировки событий (VN/Map/Quests) для быстрой диагностики.

---
*Grezwanderer 4 — Путешествие начинается здесь.*

## Статус QA и тестового контура (06.02.2026)

- Интеграционные map-тесты переведены на контролируемый контур без `skip`.
- `apps/server/test/modules/map.test.ts` использует in-memory `MapRepository` через `createMapModule(repository)`.
- Покрыты ключевые сценарии: lifecycle-фильтрация точек, `resolve-code` для `event_codes`, `resolve-code` для QR-точек с `persistentUnlock`, ответ `404` для неизвестного кода.
- Проверенные команды:
  - `bun test apps/server/test/modules/map.test.ts`
  - `bun test apps/server/test/simple.test.ts`
  - `bun test packages/shared/lib/map-resolver.test.ts`
  - `bun x tsc -p apps/server/tsconfig.json --noEmit`

## 📚 Knowledge Base (Obsidian)

Сюжет, Лор и Геймдизайн-документация живут в локальном **Obsidian Vault** (`obsidian/Detectiv`).
Это наш "второй мозг", построенный на принципах:
*   **Deduction Style**: Визуальное повествование вместо текста.
*   **Contradiction Style**: Реактивность мира на улики.
*   **Investigation Style**: Структура данных вместо художественной литературы.

Ключевые рабочие заметки:
- `obsidian/Detectiv/99_System/Creator_Framework.md`
- `obsidian/Detectiv/20_Game_Design/Systems/Sys_Investigation.md`
- `obsidian/Detectiv/20_Game_Design/Systems/Sys_FogOfWar.md`
- `obsidian/Detectiv/00_Map_Room/00_Start_Here.md`
- `obsidian/Detectiv/00_Map_Room/Sprint_Current.md`

> *Note: Папка `obsidian/` находится в `.gitignore` и не попадает в публичный репозиторий.*


## Detective Engine Status (2026-02-07)

### What is implemented now
- **Global Detective Engine module** is online on server with endpoints:
  - `GET /engine/world`
  - `POST /engine/time/tick`
  - `POST /engine/travel/start`
  - `POST /engine/travel/complete/:sessionId`
  - `POST /engine/case/advance`
  - `POST /engine/progress/apply`
  - `POST /engine/evidence/discover`
- **World simulation foundation** is persisted in Postgres tables:
  `world_clocks`, `city_routes`, `travel_sessions`, `cases`, `case_objectives`,
  `user_case_progress`, `player_progression`, `voice_progression`,
  `factions`, `user_faction_reputation`, `user_character_relations`,
  `evidence_catalog`, `user_evidence`, `domain_event_log`.
- **Action-step time model** is active:
  important actions advance ticks and world phase (`morning/day/evening/night`).
- **Night access gating** for bank is active:
  standard approach can be blocked at night; alternatives: `lockpick`, `bribe`, `warrant`.
- **District-aware availability** is active:
  `stuhlinger` destinations are soft-gated at night with recovery alternatives (`district_pass`, `wait_until_day`).
- **Travel beats** are active:
  travel can return contextual beat payloads (for example `intel_audio`).

### Web integration status
- `MapView` now syncs world snapshot from `/engine/world`.
- Interaction with a map point now runs through travel flow before scene start.
- `CaseCard` now displays world context (`phase`, `tick`, current location), busy state, and location availability.
- Alternative entry buttons (`lockpick/bribe/warrant`) are wired to `/engine/case/advance` and then continue into the scene if successful.

### Validation status
- `bun x tsc -p apps/web/tsconfig.app.json --noEmit`
- `bun x tsc -p apps/server/tsconfig.json --noEmit`
- `bun x tsc -p packages/contracts/tsconfig.json --noEmit`
- `bun test apps/server/test/modules/engine.test.ts`
- `bun test apps/server/test/modules/map.test.ts`

### Current constraints (known, accepted for Sprint 0)
- User identity is resolved per request: `Clerk auth -> x-user-id/x-demo-user-id -> demo_user (fallback)`.
- Objective routing in web is dynamic by stable location identity (`objective.locationId` matched with `point.data.locationId`, fallback to `point.id`).
- Progression/evidence apply from VN events is partially integrated and will be expanded in next sprint.

### Fog of war note (next implementation slice)
- `Fog of war` should be tracked at `location` level, not at individual scene/action level.
- Reveal channels: successful travel arrival, travel beats (`intel_audio` / rumors), evidence discovery, faction-driven unlocks.
- `Explored location` and `completed map point` must remain separate states.

## Mirror Protocol Status (2026-02-07)

### Phase 1 complete: Technical Debt Cleanup
- VN runtime now enforces scene preconditions and preserves logic contract fields during localization merge.
- Passive checks and scene `onEnter` behavior are stabilized for deterministic scene entry behavior.
- Canonical Parliament IDs are fully normalized in runtime data paths.
- Shared item registry is now the base data source for inventory/merchant flows.
- Map/location identifiers are normalized to reduce `unlock_point` and route binding mismatches.

### Phase 2 complete: Content and Systems Expansion (core slice)
- ✅ Quest-stage aware branching integrated into VN and map condition runtime.
- ✅ Stage-aware objective rendering in Quest Journal and Quest Log.
- ✅ Interactive Stage Timeline popover with transition hints (flags/actions) in quest UI.
- ✅ Expanded route graph in `city_routes` and normalized `loc_*` IDs in SQL seed.
- ✅ District-level movement rule documented in Obsidian and enforced as soft gate in engine.
- ✅ Merchant variants linked to character roles, location trade actions, and economy multipliers.
- âœ… Consumable gameplay effects integrated into inventory runtime.
- âœ… Secrets/evolution progression surfaced in dossier-facing UX (`Psyche Profile`).
