import type { VNContentPack } from '../../../../../model/types';

export const CASE1_LAB_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        'start': {
            text: '[[Микроскоп]] готов к работе на верстаке. Профессор Штайн протирает очки. "Что ж, посмотрим, что скажет нам этот [[фрагмент ткани]]."',
            choices: {
                'analyze_fabric': 'Проанализировать ткань'
            }
        },
        'analysis_result': {
            text: '"Интересное плетение," бормочет Штайн. "[[Импортный шелк]]. Особая краска из партии 1904 года. Только один портной в Фрайбурге использует такую: [[личный портной Гантера]]."',
            choices: {
                'take_report': 'Взять лабораторный отчет'
            }
        }
    }
};

export default CASE1_LAB_RU;
