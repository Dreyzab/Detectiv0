import type { QuestContent } from './types';

export const SANDBOX_BANKER_RU: QuestContent = {
    title: 'Сын банкира',
    description: 'Найди Фридриха Рихтера, распутай долговую цепочку и закрой семейный скандал.',
    stages: {
        not_started: 'Не начато',
        client_met: 'Клиент принят',
        investigating: 'Сбор зацепок',
        duel: 'Дуэль в казино',
        resolved: 'Закрыто'
    },
    transitions: {
        'not_started->client_met': 'Ты принимаешь приватный контракт господина Рихтера.',
        'client_met->investigating': 'Открываются следы: дом Фридриха и таверна.',
        'investigating->duel': 'Расследование выводит к конфронтации в казино.',
        'duel->resolved': 'Последствия дуэли закрывают кейс и обновляют карту.'
    },
    objectives: {
        obj_meet_banker: 'Поговорить с банкиром в Handelsbank',
        obj_collect_leads: 'Собрать ключевые зацепки по долговому следу',
        obj_confront_son: 'Выйти на очную ставку с Фридрихом в казино',
        obj_close_case: 'Закрыть контракт банкира и вернуться на карту'
    }
};
