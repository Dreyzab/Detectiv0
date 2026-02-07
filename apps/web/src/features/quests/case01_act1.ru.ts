
import type { QuestContent } from './types';

export const CASE_01_ACT_1_RU: QuestContent = {
    title: 'Дело 01: Тени в Банке',
    description: 'Акт 1: Инициалы. Ограбление в Банке Кребса. Исследуйте место преступления и найдите улики.',
    stages: {
        not_started: 'Не начато',
        briefing: 'Брифинг',
        bank_investigation: 'Осмотр банка',
        leads_open: 'Открыты зацепки',
        leads_done: 'Зацепки отработаны',
        finale: 'Финал',
        resolved: 'Дело закрыто'
    },
    transitions: {
        'not_started->briefing': 'Запускается вступление и следователь входит в брифинг.',
        'briefing->bank_investigation': 'Брифинг завершен, начинается основной осмотр банка.',
        'bank_investigation->leads_open': 'Банковские улики сведены, открываются городские зацепки.',
        'leads_open->leads_done': 'Все ветки зацепок обработаны.',
        'leads_done->finale': 'Цепочка доказательств сходится, открывается финал.',
        'finale->resolved': 'Финальная развязка завершена, дело закрыто.'
    },
    objectives: {
        visit_bank: 'Посетить место преступления (Банк Кребса)',
        find_clue_safe: 'Осмотреть сейф',
        interrogate_clerk: 'Допросить клерка'
    }
};
