# Battle System — Dialogue Duels ⚔️

Система вербальных поединков в стиле Griftlands. Игрок использует карты-аргументы, чтобы снизить **Resolve** (решимость) оппонента до нуля.

---

## Архитектура (FSD)

```
packages/shared/data/battle.ts       # Схема данных, типы, карты, сценарии

apps/web/src/
├── entities/battle/
│   ├── model/store.ts               # Zustand + Immer (состояние боя)
│   ├── lib/deck.ts                  # Утилиты колод (shuffle, draw)
│   ├── ui/
│   │   ├── Card.tsx                 # Карточка аргумента
│   │   ├── UnitStatus.tsx           # Avatar + Resolve bar + Block badge
│   │   └── FloatingText.tsx         # Анимированные числа + звуки
│   └── index.ts                     # Barrel export
│
├── features/battle/
│   └── lib/sound.ts                 # Web Audio API синтезатор
│
└── pages/BattlePage/
    ├── BattlePage.tsx               # UI: сценарии, drag-to-play, battle arena
    └── BattlePage.css               # Стили с анимациями
```

---

## Механики

### Resolve (Решимость)
- Аналог HP — у игрока и оппонента есть полоска решимости
- Цель: снизить Resolve оппонента до 0
- Если Resolve игрока падает до 0 → поражение

### Action Points (AP)
- 3 AP за ход
- Карты стоят 1-3 AP
- В конце хода AP обнуляются

### Block (Блок)
- Временная защита, поглощает урон
- Сбрасывается в начале каждого хода

### Turn Flow
```
1. Ход игрока
   ├── Перетащить карту в зону розыгрыша (drag-to-play)
   └── Нажать "End Turn"

2. Ход оппонента (AI)
   ├── Показывается "Enemy Intent" (следующая карта)
   └── AI разыгрывает карту → анимация

3. Новый ход
   ├── +2 карты в руку
   ├── AP восстановлены
   └── Block сброшен
```

---

## Типы (packages/shared/data/battle.ts)

### TurnPhase
```typescript
type TurnPhase =
    | 'player_start'    // Начало хода игрока
    | 'player_action'   // Игрок может играть карты
    | 'opponent_turn'   // Ход оппонента
    | 'resolution'      // Разрешение эффектов
    | 'victory'         // Победа
    | 'defeat';         // Поражение
```

### VisualEvent
```typescript
interface VisualEvent {
    id: string;
    type: 'damage' | 'block' | 'heal' | 'buff';
    value: number | string;
    target: 'player' | 'opponent';
}
```

### PlayerEntity / OpponentEntity
```typescript
interface PlayerEntity extends BattleEntity {
    currentAP: number;
    maxAP: number;
    hand: CardDefinition[];
    deck: CardDefinition[];
    discardPile: CardDefinition[];
}

interface OpponentEntity extends BattleEntity {
    nextMoveId?: string;  // Intent
    deck: string[];
}
```

### BattleScenario
```typescript
interface BattleScenario {
    id: string;
    title: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Boss';
    opponentId: string;
    opponentName: string;
    opponentAvatar?: string;
    opponentResolve: number;
    playerStartingResolve: number;
    playerActionPoints: number;
    cardsPerTurn: number;
    opponentDeck: string[];
    playerStartingDeck?: string[];
    onWin?: { resumeSceneId?: string };
    onLose?: { resumeSceneId?: string };
}
```

---

## 6 Атрибутных Групп

| Группа | Цвет | Примеры карт |
|--------|------|--------------|
| 🔵 **Intellect** | `#3498db` | Logical Argument, Analyze Weakness, Brilliant Deduction |
| 🟣 **Psyche** | `#9b59b6` | Empathic Appeal, Gut Feeling, Read Intent |
| 🔴 **Social** | `#e74c3c` | Assertive Stance, Silver Tongue, Commanding Presence |
| 🟢 **Physical** | `#2ecc71` | Steady Nerves, Relentless |
| ⚫ **Shadow** | `#2c3e50` | Misdirection, Veiled Threat |
| 🟠 **Spirit** | `#e67e22` | Appeal to Tradition, Poetic Strike |

---

## Эффекты Карт

| Эффект | Описание |
|--------|----------|
| `damage` | Урон по Resolve оппонента (через Block) |
| `block` | Временная защита до следующего хода |
| `heal` | Восстановление Resolve (до максимума) |
| `draw` | Взять дополнительные карты |
| `gain_ap` | Получить дополнительные AP |
| `discard` | Заставить оппонента сбросить карты |

### Voice Scaling
```typescript
effects: [{
    type: 'damage',
    value: 8,
    target: 'opponent',
    voiceScaling: 'logic',
    scalePerLevel: 0.1
}]
```

---

## UI Features

### Drag-to-Play
- Перетаскивание карты вверх для розыгрыша
- Визуальный индикатор drop zone
- Автоматический розыгрыш при отпускании над зоной

### Visual Events (FloatingText)
- Анимированные числа урона/лечения/блока
- Плавающий текст с fade-out
- Web Audio API звуки:
  - **Damage**: Низкий глухой удар
  - **Block**: Механический щелчок
  - **Heal**: Тёплый подъём
  - **Buff**: Мистический shimmer

### Enemy Intent
- Bubble над портретом оппонента
- Показывает следующую карту и её эффект
- Позволяет планировать защиту

### Ambient Background
- Radial gradient фон
- Два glow эффекта (purple/blue)
- Backdrop blur на header

---

## Тестовые Сценарии

| ID | Название | Оппонент | Сложность |
|----|----------|----------|-----------|
| `detective_skirmish` | Casual Interrogation | Suspicious Merchant | Easy (20 HP) |
| `detective_boss_krebs` | Confrontation with Krebs | Heinrich Krebs | Boss (35 HP) |

### Быстрый тест
```
http://localhost:5173/battle
http://localhost:5173/battle?scenarioId=detective_skirmish
```

---

## Store (Zustand + Immer)

```typescript
interface BattleState {
    scenario: BattleScenario | null;
    turnPhase: TurnPhase;
    turnCount: number;
    log: string[];
    visualQueue: VisualEvent[];
    
    player: PlayerEntity;
    opponent: OpponentEntity;
    
    // Actions
    initializeBattle: (scenarioId: string) => void;
    playCard: (cardIndex: number) => void;
    endTurn: () => void;
    resetBattle: () => void;
    dismissVisualEvent: (id: string) => void;
}
```

---

## Интеграция с VN

### Запуск боя из VN
```typescript
{
    type: 'start_battle',
    payload: {
        scenarioId: 'detective_skirmish',
        deckType: 'detective'
    }
}
```

### Возврат в VN после боя
```typescript
onWin: {
    resumeSceneId: 'case1_victory_scene'
}
```

---

## Roadmap

- [x] Immer для иммутабельных обновлений
- [x] VisualEvent с floating text
- [x] Web Audio API звуки
- [x] Drag-to-play механика
- [x] Enemy Intent display
- [ ] Расширенная AI логика (приоритеты, синергии)
- [ ] Система апгрейда карт (Dev Points)
- [ ] Новые типы эффектов (buff/debuff стеки)
- [ ] Deck Builder UI
