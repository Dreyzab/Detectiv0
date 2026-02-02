# Visual Novel Engine

Движок диалоговой системы для Interactive Fiction / Detective Mode.

---

## Архитектура (FSD)

```
packages/shared/
└── locales/                     # Локализация (en.ts, ru.ts)

apps/web/src/
├── entities/
│   ├── visual-novel/
│   │   ├── model/
│   │   │   ├── store.ts         # Zustand: activeScenario, dialogueHistory
│   │   │   ├── types.ts         # VNScene, VNDialogueEntry, VNAction
│   │   │   └── parser.ts        # mergeScenarioWithLocale()
│   │   └── scenarios/           # Case Bundles
│   │       └── detective/
│   │           ├── case_01_bank/
│   │           │   ├── 01_briefing/     # Хронологические файлы
│   │           │   ├── 02_bank/
│   │           │   └── index.ts         # Barrel export
│   │           └── side_quests/
│   └── character/
│       └── ui/SpeakerBadge.tsx  # Бейдж говорящего персонажа
│
├── widgets/
│   └── visual-novel/
│       ├── VisualNovelOverlay.tsx   # Overlay режим (поверх карты)
│       └── MobileVNLayout.tsx       # Glassmorphism UI для мобильных
│
├── shared/ui/
│   └── TypedText.tsx            # Печатающийся текст
│
└── pages/
    └── VisualNovelPage/
        └── VisualNovelPage.tsx  # Fullscreen VN (/vn/:id)
```

---

## Режимы работы

### 1. Overlay Mode
- VN отображается поверх карты
- Компактный интерфейс
- Используется для коротких диалогов

### 2. Fullscreen Mode
- Полноэкранный режим (`/vn/:scenarioId`)
- Запускается через MapPoint: `start_vn` → `/vn/:id`
- Возврат на `/map` после завершения сценария

---

## Типы

### VNScene
```typescript
interface VNScene {
    id: string;
    backgroundUrl?: string;
    ambient?: string;
    characters: VNCharacter[];
    dialogue: VNDialogueEntry[];
}
```

### VNDialogueEntry
```typescript
interface VNDialogueEntry {
    id: string;
    speaker?: string;
    speakerNameRu?: string;
    text: string;
    textRu?: string;
    emotion?: 'neutral' | 'happy' | 'angry' | 'sad' | 'surprised';
    choices?: VNChoice[];
    voiceCheck?: VoiceCheck;
    action?: VNAction;
}
```

### VNAction
```typescript
type VNAction =
    | { type: 'goto_scene'; payload: { sceneId: string } }
    | { type: 'end_scenario' }
    | { type: 'start_battle'; payload: { scenarioId: string; deckType: string } }
    | { type: 'add_flag'; payload: Record<string, boolean> }
    | { type: 'grant_evidence'; payload: Evidence }
    | { type: 'modify_relationship'; payload: { characterId: string; amount: number } }
    | { type: 'voice_check'; payload: VoiceCheck };
```

---

## Skill Checks (Parliament of Voices)

VN поддерживает проверки 18 голосов из Parliament:

```typescript
voiceCheck: {
    voiceId: 'logic',          // ID голоса
    difficulty: 12,            // Порог
    modifiers: [
        { condition: 'hasEvidence_bloodstains', bonus: 2 }
    ],
    onSuccess: { type: 'goto_scene', payload: { sceneId: 'deduction' } },
    onFailure: { type: 'goto_scene', payload: { sceneId: 'no_clue' } }
}
```

---

## Сценарии (Case Bundles)

### Структура файлов
```
case_01_bank/
├── 01_briefing/
│   ├── briefing.logic.ts      # Логика, переходы, действия
│   └── briefing.en.ts         # Английская локаль
│   └── briefing.ru.ts         # Русская локаль
├── 02_bank/
│   └── ...
└── index.ts                    # Экспорт всего Case Bundle
```

### Registry
```typescript
// scenarios/detective/registry.ts
export const SCENARIO_REGISTRY: Record<string, VNScenario> = {
    'case_01_briefing': case01Briefing,
    'case_01_bank_investigation': case01BankInvestigation,
    // ...
};
```

---

## UI Features

### Glassmorphism (Mobile)
- Асимметричные стеклянные панели
- Backdrop blur эффекты
- Connected Speaker Badge с декоративной линией

### Virtual Window (Gyroscope)
- Параллакс фона при наклоне устройства
- DeviceOrientation API + iOS Permissions
- Плавная интерполяция (Lerp)

### Cinematic Reveal
- Автоматическое скрытие HUD при смене сцены
- Фокус на арт локации
- Возврат интерфейса по клику

### TypedText
- Посимвольная печать диалога
- Пропуск анимации по клику
- Курсор "Continue" при завершении

---

## Интеграция с Battle System

VN может запустить бой через action:
```typescript
{
    type: 'start_battle',
    payload: {
        scenarioId: 'detective_skirmish',
        deckType: 'detective'
    }
}
```

После боя система возвращает игрока в VN сцену через `onWin.resumeSceneId`.

---

## Flow: Map → VN → Map

```
1. Player clicks MapPoint (City Hall)
2. CaseCard shows "Investigate" button
3. Click triggers: navigate('/vn/case_01_briefing')
4. VN runs fullscreen
5. Scenario ends → navigate('/map')
6. Player continues exploration
```