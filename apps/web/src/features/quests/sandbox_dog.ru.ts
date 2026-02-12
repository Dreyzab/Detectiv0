import type { QuestContent } from './types';

export const SANDBOX_DOG_RU: QuestContent = {
    title: 'Собака бургомистра',
    description: 'Пройди по следу еды и верни Бруно домой.',
    stages: {
        not_started: 'Не начато',
        client_met: 'Клиент принят',
        searching: 'Поиск',
        found: 'Собака найдена',
        resolved: 'Закрыто'
    },
    objectives: {
        obj_meet_mayor: 'Поговорить с бургомистром',
        obj_follow_trail: 'Пройти по следу торговцев',
        obj_find_dog: 'Найти Бруно'
    }
};
