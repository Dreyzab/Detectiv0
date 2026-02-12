import type { QuestContent } from './types';

export const SANDBOX_GHOST_RU: QuestContent = {
    title: 'Проклятое поместье',
    description: 'Исследуй поместье, посети гильдию и вынеси финальный вывод.',
    stages: {
        not_started: 'Не начато',
        client_met: 'Клиент принят',
        investigating: 'Расследование',
        evidence_collected: 'Улики собраны',
        guild_visit: 'Визит в гильдию',
        accusation: 'Обвинение',
        resolved: 'Закрыто'
    },
    objectives: {
        obj_meet_estate_client: 'Поговорить с заказчиком из поместья',
        obj_investigate_estate: 'Исследовать поместье',
        obj_visit_guild: 'Посетить гильдию',
        obj_make_accusation: 'Сделать финальное обвинение'
    }
};
