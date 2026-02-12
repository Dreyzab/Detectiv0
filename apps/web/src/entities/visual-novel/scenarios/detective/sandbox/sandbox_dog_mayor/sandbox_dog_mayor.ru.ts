import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_MAYOR_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        mayor_briefing: {
            text: 'Бургомистр Пфайффер закрывает дверь кабинета. «Детектив, мой пёс Бруно пропал. Если город узнает, завтра из ратуши сделают цирк».',
            choices: {
                accept_case: 'Взяться за дело',
                press_for_details: 'Спросить о политическом риске',
                decline_for_now: 'Отложить на потом'
            }
        },
        public_risk: {
            text: '«Оппозиция уже шепчет, что я не могу управлять даже собственной площадью», — он сжимает перчатки. «Верните Бруно до вечера».'
        },
        mayor_details: {
            text: 'Клара отмечает район мясника на карте. «Бруно ходит по запаху еды: мясник, пекарня, затем парк».',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_DOG_MAYOR_RU;
