import type { QuestContent } from './types';

export const SANDBOX_META_RU: QuestContent = {
    title: 'Песочница Карлсруэ',
    description: 'Нелинейный городской прогресс по контрактам Карлсруэ.',
    stages: {
        not_started: 'Не начато',
        intro: 'Вводный брифинг',
        exploring: 'Контракты клиентов',
        guild_unlocked: 'Открыта гильдия',
        completed: 'Завершено'
    },
    transitions: {
        'not_started->intro': 'Песочница стартует после первого брифинга в агентстве.',
        'intro->exploring': 'Хабы на карте открыты, доступны три клиента.',
        'exploring->guild_unlocked': 'Доступ к гильдии открывается по прогрессу в деле поместья.',
        'guild_unlocked->completed': 'Контракты банкира и поместья закрыты.'
    },
    objectives: {
        obj_start_sandbox: 'Запустить песочницу Карлсруэ',
        obj_complete_banker: 'Закрыть контракт банкира',
        obj_complete_ghost: 'Закрыть контракт по поместью'
    }
};
