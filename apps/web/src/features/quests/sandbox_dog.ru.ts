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
        obj_vendor_sweep: 'Расспросить торговцев на площади',
        obj_check_butcher: 'Проверить мясную лавку',
        obj_check_stables: 'Проверить старые конюшни',
        obj_check_docks: 'Проверить речные доки',
        obj_check_service_lane: 'Проверить служебный переулок',
        obj_check_bakery: 'Проверить пекарню',
        obj_find_dog: 'Найти Бруно в парке'
    }
};
