import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_CLIENT_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        entry_hall: {
            text: 'Клерк закрывает за вами дверь кабинета. Господин Рихтер ждет у раскрытой ведомости и личного сейфа.'
        },
        bank_intro: {
            text: '«Мой сын исчезает по ночам», — говорит банкир. «Из частного сейфа пропадают деньги. Мне нужна тишина, а не полиция».',
            choices: {
                accept_case: 'Принять контракт',
                press_motive: 'Надавить на мотив и банковские записи'
            }
        },
        press_success: {
            text: 'Под давлением Рихтер оговаривается. Ты замечаешь свежие правки в журнале и след сургуча на перчатке.'
        },
        press_fail: {
            text: 'Он замыкается и отвечает сухо. Контракт остается, но доверие ниже.'
        },
        case_accepted: {
            text: 'Клара отмечает на карте две ветки: дом Фридриха и таверну.',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_BANKER_CLIENT_RU;
