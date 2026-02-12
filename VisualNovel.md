# Visual Novel: актуальная техкарта

## Scope + Source of Truth
- База анализа: текущее рабочее дерево репозитория (включая незакоммиченные изменения), не только `HEAD`.
- Дата фиксации: `2026-02-09`.
- Этот документ описывает фактическую реализацию на момент фиксации, без проектных допущений.
- Основные каталоги-источники:
  - `apps/web/src/entities/visual-novel/**`
  - `apps/web/src/widgets/visual-novel/**`
  - `apps/web/src/pages/VisualNovelPage/**`
  - `apps/web/src/widgets/map/**`
  - `apps/web/src/features/quests/**`
  - `apps/server/src/modules/map.ts`
  - `apps/server/src/modules/detective.ts`
  - `packages/shared/data/**`
  - `packages/shared/lib/**`

## Статус API/типов
- В этом цикле кодовые API и runtime-контракты не менялись.
- Ниже зафиксированы текущие интерфейсы как справка для разработки и ревью.

### VN контракты (`apps/web/src/entities/visual-novel/model/types.ts`)

```ts
type VNAction =
  | { type: 'grant_evidence'; payload: Evidence }
  | { type: 'unlock_point'; payload: string }
  | { type: 'add_flag'; payload: Record<string, boolean> }
  | { type: 'set_quest_stage'; payload: { questId: string; stage: string } }
  | { type: 'add_heat'; payload: number }
  | { type: 'modify_relationship'; payload: { characterId: CharacterId; amount: number } }
  | { type: 'set_character_status'; payload: { characterId: CharacterId; status: string } }
  | { type: 'set_stat'; payload: { id: string; value: number } }
  | { type: 'start_battle'; payload: { scenarioId: string; deckType: string } };
```

```ts
interface VNConditionContext {
  evidenceIds: Set<string>;
  hasEvidence: (evidenceId: string) => boolean;
  questStages: Record<string, string>;
  isQuestAtStage: (questId: string, stage: string) => boolean;
  isQuestPastStage: (questId: string, stage: string) => boolean;
}
```

```ts
interface VNScenarioLogic {
  id: string;
  title: string;
  defaultBackgroundUrl: string;
  musicUrl?: string;
  initialSceneId: string;
  mode?: 'overlay' | 'fullscreen';
  scenes: Record<string, VNSceneLogic>;
}

interface VNContentPack {
  locale: string;
  scenes: Record<string, { text: string; choices?: Record<string, string> }>;
}
```

### Map action контракт (`packages/shared/data/map.ts` + `packages/shared/lib/map-validators.ts`)
- Базовый DSL карты (`packages/shared/data/map.ts`) включает `start_vn`, `unlock_point`, `grant_evidence`, `set_flag`, `set_quest_stage`, `start_battle`, `open_trade`, `teleport`, `show_toast` и др.
- Runtime-валидация действий (`packages/shared/lib/map-validators.ts`) также поддерживает совместимость/расширения: `add_flags`, `unlock_entry`, `set_active_case`.
- Фактический серверный парсинг в `apps/server/src/modules/map.ts` валидирует действия через `MapActionSchema`.

### Save API (`apps/server/src/modules/detective.ts`)
- `GET /detective/saves/:slot` -> чтение слота.
- `POST /detective/saves/:slot` -> запись слота (тело: `{ data: any }`).
- Клиентская интеграция из VN store: `syncToServer(slotId)` и `loadFromServer(slotId)`.

## Архитектура VN (актуальная)

### Два рантайма UI
- Fullscreen рантайм: `apps/web/src/pages/VisualNovelPage/VisualNovelPage.tsx`, маршрут `'/vn/:scenarioId'`.
- Overlay рантайм: `apps/web/src/widgets/visual-novel/VisualNovelOverlay.tsx`, глобально смонтирован в `apps/web/src/App.tsx` и скрывается на `'/'` и `'/vn/*'`.

### Общее ядро
- Состояние: `apps/web/src/entities/visual-novel/model/store.ts` (Zustand + persist).
- Runtime-предикаты/доступность: `apps/web/src/entities/visual-novel/lib/runtime.ts`.
- Локализационный merge: `apps/web/src/entities/visual-novel/lib/localization.ts`.
- Реестр сценариев: `apps/web/src/entities/visual-novel/scenarios/registry.ts`.

### Принцип logic/content
- Сценарий собирается из пары:
  - `*.logic.ts` (граф, переходы, проверки, действия)
  - `*.{en,de,ru}.ts` (текст и choice-тексты)
- `registry.ts` грузит пакеты через `import.meta.glob` и вызывает `mergeScenario(logic, localePack, enFallback)`.
- При отсутствии ключа в выбранной локали используется EN fallback; при отсутствии и там подставляется `"[MISSING ...]"`.

## Жизненный цикл сцены (pipeline)
1. `startScenario(scenarioId)` в `useVNStore` активирует сценарий, сбрасывает `currentSceneId`, `history`, `dialogueHistory`.
2. UI-рантайм резолвит сценарий: `getScenarioById(activeScenarioId, locale)`.
3. Формируется `requestedSceneId`:
   - `currentSceneId` из store, если есть.
   - иначе `initialSceneId`.
4. Recovery по доступности сцены:
   - `resolveAccessibleSceneId(...)` проверяет preconditions кандидата.
   - если кандидат недоступен -> пробует `initialSceneId`.
   - если и он недоступен -> выбирает первую доступную сцену.
   - если доступной сцены нет -> `null` и warning.
5. Recovery по целостности:
   - если `effectiveSceneId` указывает на отсутствующую сцену -> reset на `initialSceneId`.
6. Из `scene.choices` отбираются только доступные варианты через `filterAvailableChoices(...)` и `choice.condition`.
7. `onEnter`-actions выполняются один раз на ключ сцены (`scenarioId:sceneId`) через `processedOnEnterRef`.
8. Passive checks:
   - Fullscreen (`VisualNovelPage`) выполняет `passiveChecks` с `performSkillCheck`, пишет результаты, выдает XP, запускает outcome actions и может сразу перевести сцену.
   - Overlay-ветка использует отдельный контур `MindPalaceOverlay` + `usePassiveChecks` для показа пассивных реплик.
9. Переход по выбору:
   - опционально skill check в choice (`onSuccess`/`onFail`).
   - стандартный `choice.nextSceneId` или `END`.
10. Завершение:
   - `endScenario()` очищает активный сценарий.
   - fullscreen обычно делает `navigate('/map')`.
   - спец-ветка: `detective_case1_qr_scan_bank` после завершения ведет на `'/vn/detective_case1_bank_scene'`.

## Интеграции с системами

| Источник | Точка входа | Поток | Результат |
|---|---|---|---|
| Map marker/case action | `apps/web/src/widgets/map/map-view/MapView.tsx` | `start_vn` -> `startScenario(id)` -> `getScenarioById(id, locale)` -> если `mode === 'fullscreen'`, `navigate('/vn/:id')`, иначе overlay | Запуск VN из карты |
| Унифицированный map action handler | `apps/web/src/features/detective/lib/map-action-handler.ts` | `executeAction(MapAction)` поддерживает `start_vn`, `unlock_point`, `grant_evidence`, `set_flag`, `add_flags`, `set_quest_stage`, `start_battle`, `open_trade`, `teleport` | Мост карты/квестов/мира к VN и обратно |
| QR | `apps/web/src/pages/QRScannerPage.tsx` + `apps/server/src/modules/map.ts` | `POST /map/resolve-code` -> сервер валидирует `actions` -> клиент исполняет действия (`start_vn`, `grant_evidence`, `unlock_point`, ...) | Запуск VN и прогресс через QR |
| Quests | `apps/web/src/features/quests/engine.ts` | Stage transition -> строковые `triggerActions` (`start_vn(...)`, `set_quest_stage(...)`) -> parse -> `executeAction` | Квесты триггерят VN-сцены и прогрессию |
| VN actions | `VisualNovelPage.tsx` / `VisualNovelOverlay.tsx` | `executeActions(VNAction[])` | Интеграция с Dossier, Quest, Character, Battle, Map |
| Parliament/tooltips/tokens | `TypedText.tsx`, `interactiveToken.ts`, `tooltipRegistry.ts` | `[[clueId|text]]`/`[[note]]`/legacy spans -> clue в evidence+flag, tooltip в `ParliamentKeywordCard`, fallback в notebook entry | Связка narrative текста с evidence/notebook/voice commentary |

### Что именно затрагивают `VNAction`
- Dossier: `grant_evidence`, `add_flag`, `unlock_point`, результаты skill checks.
- Quests: `set_quest_stage`.
- Character: `modify_relationship`, `set_character_status`.
- Battle: `start_battle` -> `navigate('/battle?...')` и завершение текущего VN.
- Voice stats: `set_stat`, XP на skill/passive checks.

## Каталог сценариев (`*.logic.ts`)

- Фактический состав: `22` logic-сценария.
- Распределение режимов:
  - `14` -> `fullscreen`
  - `3` -> `overlay (explicit)`
  - `5` -> `overlay (default)` (режим не задан в logic, используется поведение по умолчанию)

| scenarioId | mode | path |
|---|---|---|
| `case1_finale` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/05_finale/case1_finale.logic.ts` |
| `detective_case1_alt_briefing` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/01_briefing/case1_alt_briefing.logic.ts` |
| `detective_case1_archive_search` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/03_archive/case1_archive.logic.ts` |
| `detective_case1_bank_scene` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/02_bank/case1_bank.logic.ts` |
| `detective_case1_hbf_arrival` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/00_onboarding/case1_hbf_arrival.logic.ts` |
| `detective_case1_lab_analysis` | `overlay (explicit)` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/leads/apothecary/case1_lab_analysis.logic.ts` |
| `detective_case1_map_first_exploration` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/00_onboarding/case1_map_first_exploration.logic.ts` |
| `detective_case1_mayor_followup` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/01_briefing/case1_mayor_followup.logic.ts` |
| `detective_case1_qr_scan_bank` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/00_onboarding/case1_qr_scan_bank.logic.ts` |
| `encounter_cleaner` | `overlay (default)` | `apps/web/src/entities/visual-novel/scenarios/flavor/encounter_cleaner.logic.ts` |
| `encounter_student` | `overlay (default)` | `apps/web/src/entities/visual-novel/scenarios/flavor/encounter_student.logic.ts` |
| `encounter_tourist` | `overlay (default)` | `apps/web/src/entities/visual-novel/scenarios/flavor/encounter_tourist.logic.ts` |
| `interlude_lotte_warning` | `overlay (explicit)` | `apps/web/src/entities/visual-novel/scenarios/detective/side_quests/lotte_wires/interlude_lotte.logic.ts` |
| `interlude_victoria_street` | `overlay (explicit)` | `apps/web/src/entities/visual-novel/scenarios/detective/side_quests/victoria_poetry/interlude_victoria.logic.ts` |
| `intro_char_creation` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/creation/intro_char_creation.logic.ts` |
| `intro_journalist` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/origins/intro_journalist.logic.ts` |
| `lead_apothecary` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/leads/apothecary/lead_apothecary.logic.ts` |
| `lead_pub` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/leads/pub/lead_pub.logic.ts` |
| `lead_tailor` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/leads/tailor/lead_tailor.logic.ts` |
| `quest_inspector_vienna` | `overlay (default)` | `apps/web/src/entities/visual-novel/scenarios/detective/side_quests/inspector_vienna/quest_inspector_vienna.logic.ts` |
| `quest_lotte_wires` | `overlay (default)` | `apps/web/src/entities/visual-novel/scenarios/detective/side_quests/lotte_wires/quest_lotte_wires.logic.ts` |
| `quest_victoria_poetry` | `fullscreen` | `apps/web/src/entities/visual-novel/scenarios/detective/side_quests/victoria_poetry/quest_victoria_poetry.logic.ts` |

### Зафиксированные расхождения content/logic
- Есть content-файлы без пары `*.logic.ts`:
  - `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/01_briefing/case1_briefing.en.ts`
  - `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/01_briefing/case1_briefing.de.ts`
  - `apps/web/src/entities/visual-novel/scenarios/detective/case_01_bank/main/01_briefing/case1_briefing.ru.ts`

## Сохранения и персистентность

### Локально (Zustand persist)
- Ключ: `gw4-vn-store` (`apps/web/src/entities/visual-novel/model/store.ts`).
- Persist-поля: `locale`, `activeScenarioId`, `currentSceneId`, `history`, `choiceHistory`.
- Не persist-поля: `dialogueHistory` (сессионная история, очищается при старте/завершении сценария).

### Экспорт/импорт
- `exportSave()` сериализует persisted-поля в JSON строку.
- `importSave(json)` валидирует базовую структуру и восстанавливает state, включая `choiceHistory`.
- Текущее ограничение: нет.

### Серверные слоты
- `syncToServer(slotId)` -> `POST /detective/saves/:slot` с телом `{ data: <saveObject> }`.
- `loadFromServer(slotId)` -> `GET /detective/saves/:slot` -> `importSave(...)`.
- API реализован в `apps/server/src/modules/detective.ts`.

## Тестовый контур (фактически проверено)

### Прошло
- `bun test apps/web/src/entities/visual-novel/model/__tests__/engine.test.ts`
  - проверяет merge logic/content, fallback поведение, condition context.
- `bun test apps/web/src/entities/visual-novel/lib/__tests__/interactiveToken.test.ts`
  - проверяет нормализацию notebook id и резолв tooltip keyword.
- `cd apps/web && bun x vitest run src/entities/visual-novel/scenarios/__tests__/de-localization-integrity.test.ts`
  - проверяет целостность локализаций и completeness content packs.

### Известный запускной нюанс
- `bun test apps/web/src/entities/visual-novel/scenarios/__tests__/de-localization-integrity.test.ts` из корня падает с:
  - `TypeError: import.meta.glob is not a function`
- Причина: тест зависит от Vite-трансформа (`import.meta.glob` в `scenarios/registry.ts`), поэтому должен исполняться через Vitest в контексте `apps/web`.

## Технические риски и наблюдения (без фиксов в этом цикле)
- Есть дублирование orchestration-логики между `VisualNovelPage` и `VisualNovelOverlay`:
  - резолв сцены, recovery, action execution, one-shot guards.
- Passive checks реализованы в двух контурах:
  - прямой processing в `VisualNovelPage`.
  - отдельный hook `usePassiveChecks` через `MindPalaceOverlay` в overlay-рантайме.

## Практический чеклист автора нового VN-сценария
1. Создавай файлы одним basename:
   - `name.logic.ts`
   - `name.en.ts`
   - `name.de.ts`
   - `name.ru.ts`
2. В каждом файле должен быть `export default`.
3. В `name.logic.ts` поле `id` должно быть уникальным и соответствовать ожидаемому `scenarioId`.
4. `logic/content` должны совпадать по basename и директории, чтобы их подхватил `import.meta.glob`-реестр.
5. Если сценарий должен открываться страницей, укажи `mode: 'fullscreen'`; иначе оставляй overlay (или ставь `mode: 'overlay'` явно).
6. Для новой логики добавляй EN как рабочий fallback и проверяй заполнение `de/ru` ключей для всех сцен и choices.
7. Если сценарий запускается из карты/QR/квестов, синхронизируй `scenarioId` в:
   - `MapAction start_vn`,
   - quest transition actions,
   - любые ручные навигации `/vn/:scenarioId`.
8. Проверяй preconditions и recovery-путь: недоступная сцена не должна ломать поток.
9. Для интерактивных токенов используй формат `[[clue_id|text]]` или `[[note text]]`; при tooltip-терминах синхронизируй с `tooltipRegistry`.
10. Минимальный прогон перед PR:
   - `bun test apps/web/src/entities/visual-novel/model/__tests__/engine.test.ts`
   - `bun test apps/web/src/entities/visual-novel/lib/__tests__/interactiveToken.test.ts`
   - `cd apps/web && bun x vitest run src/entities/visual-novel/scenarios/__tests__/de-localization-integrity.test.ts`
