import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_TAVERN_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        tavern_intro: {
            text: 'Дым, карты и шепот. Имя Фридриха здесь произносят только рядом с инициалом W.',
            choices: {
                bribe_barkeep: 'Подкупить бармена',
                intimidate_witness: 'Надавить на свидетеля',
                leave_tavern: 'Покинуть таверну'
            }
        },
        bribe_success: {
            text: 'Бармен разговорился: Фридрих играл, чтобы закрыть долг, и передавал фишки человеку в сером.'
        },
        bribe_fail: {
            text: 'Бармен берет деньги, но уходит от деталей. Но наводка на казино все равно остается.'
        },
        intimidate_success: {
            text: 'Свидетель сдается и подтверждает отметку крупье, связанную с инициалом W.'
        },
        intimidate_fail: {
            text: 'В зале повисает тишина. Запасная подсказка все равно ведет к ночным визитам Фридриха в казино.'
        },
        tavern_outro: {
            text: 'Клара: «Следующий шаг — казино. Там цепочка либо подтвердится, либо развалится».',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_BANKER_TAVERN_RU;
