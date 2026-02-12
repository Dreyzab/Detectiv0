# PLAN-sandbox-flow

> Status: APPROVED
> Owner: @project-planner  
> Scope: `obsidian/StoryDetective/40_GameViewer/Sandbox_KA/**`  
> Format: Obsidian notes + canvas only (no runtime code changes)

---

## 1) Цель

Собрать `Sandbox_KA` как понятный поток:

`Start -> Language -> Backstory -> First Map Scene -> Location Hubs -> Quest Flows -> Exit To Map`

Ключевая идея: карта является центральным узлом, а каждая локация работает как хаб с квестами и сервисами.

---

## 2) Зафиксированные решения (без доп. согласований)

1. Механика напарника фиксируется как дизайн-узел в Obsidian (иконка на карте + текстовое облако), без кода.
2. Выбор предыстории в этом цикле описывается на уровне флагов/заметок в дизайне, без внедрения в рантайм.
3. `hub_*` трактуется как узел карты (точка входа + список доступных действий), а не как первая VN-сцена.
4. На этапе планирования не делаем массовый перенос существующих `scene_*`; сначала строим поток и связываем узлы ссылками.

---

## 3) Целевой Flow (что должно быть на канвасе)

### 3.1 Entry Flow (линейный)
1. `scene_start`
2. `scene_language_select`
3. `scene_backstory_select`
4. `scene_map_intro`

### 3.2 Map Layer (центр карты)
От `scene_map_intro`:
1. узел карты `map_karlsruhe_main`
2. отдельные узлы доступных локаций (`loc_*` / `hub_*`)
3. узел напарника `char_partner` (иконка в нижнем углу)

Текст напарника (обязательный дизайн-блок):
- "Нужно поговорить с 3 заказчиками."
- Пояснение: клиентские хабы открыты, порядок прохождения свободный.

### 3.3 Hub Layer (каждая локация = хаб)
Для каждого `hub_*` обязательны секции:
1. `Available Quests`
2. `Available Interactions` (trade, upgrade, heal, info, etc.)
3. `Requirements` (что нужно для открытия/использования)
4. `Purpose` (зачем игроку этот хаб)
5. `Transitions` (куда уходит поток)

### 3.4 Quest Flow Layer (из хаба в сюжет)
Для каждого квеста:

`hub_* -> scene_*_entry -> (структура как в Case01/Plot/01_Onboarding) -> scene_*_exit_to_map -> map_karlsruhe_main`

`scene_*_entry` обязан содержать:
1. первый background (что видит игрок)
2. стартовый текст до первого выбора
3. пассивные проверки/условия
4. начальный state input (какие флаги/данные приходят игроку)

`scene_*_exit_to_map` обязан содержать:
1. результат квеста (кратко)
2. что изменилось на карте
3. какие новые возможности открыты

---

## 4) Целевая структура файлов

```text
obsidian/StoryDetective/40_GameViewer/Sandbox_KA/
├── Sandbox_KA_Flow.canvas
├── Sandbox_KA_Flow.md
├── 00_Entry/
│   ├── scene_start.md
│   ├── scene_language_select.md
│   ├── scene_backstory_select.md
│   └── scene_map_intro.md
├── 00_Global/
│   ├── map_karlsruhe_main.md
│   └── char_partner.md
├── 01_Hubs/
│   ├── hub_agency.md
│   ├── hub_bank.md
│   ├── hub_rathaus.md
│   └── hub_estate.md
├── 02_Quest_Entries/
│   ├── scene_banker_entry.md
│   ├── scene_dog_entry.md
│   └── scene_ghost_entry.md
└── 03_Map_Return/
    ├── scene_banker_exit_to_map.md
    ├── scene_dog_exit_to_map.md
    └── scene_ghost_exit_to_map.md
```

Примечание: существующие цепочки в `Plot/01_Banker`, `Plot/02_Dog`, `Plot/03_Ghost` используются как "внутренние квестовые блоки" через ссылки.

---

## 5) Шаблоны узлов (минимум)

### 5.1 Шаблон `hub_*`
1. Trigger Source
2. Preconditions
3. Designer View
4. Mechanics View
5. State Delta
6. Transitions
7. Validation

### 5.2 Шаблон `scene_*_entry`
1. Trigger Source (из какого `hub_*` пришли)
2. Preconditions (флаги/требования)
3. Designer View (BG + стартовый текст)
4. Mechanics View (проверки, выдачи, скрытые броски)
5. State Delta (что выставляется на входе)
6. Transitions (в первую сцену квеста)
7. Validation

### 5.3 Шаблон `scene_*_exit_to_map`
1. Trigger Source (финал квеста)
2. Preconditions (какой исход)
3. Designer View (итоговый текст)
4. Mechanics View (разблокировки, награды)
5. State Delta (изменения глобальных флагов)
6. Transitions (`map_karlsruhe_main`)
7. Validation

---

## 6) План реализации по шагам

### Phase 0. Инвентаризация (без переносов)
1. Зафиксировать текущие активные `scene_*` в `Sandbox_KA/Plot/**`.
2. Привязать каждый существующий поток к будущему `hub_*`.
3. Проверить, что для каждого квеста определены точка входа и точка возврата на карту.

### Phase 1. Entry Chain
1. Создать `00_Entry/*`.
2. Сделать линейные связи от `scene_start` до `scene_map_intro`.
3. Добавить в `scene_backstory_select` явный выход в карту.

### Phase 2. Map + Partner Mechanic
1. Создать `00_Global/map_karlsruhe_main.md`.
2. Создать `00_Global/char_partner.md`.
3. Зафиксировать механику иконок карты (дизайн-описание, без кода).
4. Добавить реплику напарника про "3 заказчиков".

### Phase 3. Hubs
1. Создать `01_Hubs/hub_*` по каждой ключевой локации.
2. В каждом `hub_*` описать сервисы, квесты, требования, назначение.
3. Добавить переходы из карты в каждый хаб и обратно.

### Phase 4. Quest Entry Wrappers
1. Создать `02_Quest_Entries/scene_*_entry`.
2. Привязать каждый `scene_*_entry` к существующей цепочке в `Plot/*`.
3. Для входного узла заполнить BG/текст/проверки/initial state.

### Phase 5. Exit To Map
1. Создать `03_Map_Return/scene_*_exit_to_map`.
2. Завести в эти узлы выходы из финалов каждого квеста.
3. Описать пост-эффекты и новые опции на карте.

### Phase 6. Canvas Assembly
1. Собрать `Sandbox_KA_Flow.canvas` в 4 слоя: Entry, Map, Hubs, Quest Flows.
2. Подписать стрелки условий (`available`, `locked`, `completed`).
3. Проверить, что из любого финала есть маршрут назад в карту.

---

## 7) Критерии готовности (DoD)

1. Есть единая линейная входная цепочка из 4 узлов до карты.
2. На карте есть отдельные узлы локаций и отдельный узел напарника.
3. В каждом `hub_*` описаны квесты, взаимодействия и требования.
4. Для каждого квеста есть явный `scene_*_entry` и `scene_*_exit_to_map`.
5. Каждый квестовый поток связан с паттерном `Case01/Plot/01_Onboarding`.
6. Нет тупиков: любой квестовый финал возвращает игрока на карту.
7. Все изменения документированы в Obsidian-узлах, без изменений runtime-кода.

---

## 8) Что делаем после утверждения плана

1. Создаем каркас файлов и канвас-узлы по разделу 4.
2. Заполняем шаблоны `hub_*`, `scene_*_entry`, `scene_*_exit_to_map`.
3. Привязываем существующие квестовые сцены `Sandbox_KA/Plot/**` к новой карте потоков.
