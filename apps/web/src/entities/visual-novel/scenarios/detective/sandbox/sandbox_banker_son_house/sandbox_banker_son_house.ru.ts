import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_SON_HOUSE_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        son_house_arrival: {
            text: 'Комната в беспорядке, но без роскоши. Это больше похоже на панику, чем на праздность.',
            choices: {
                inspect_desk: 'Осмотреть письменный стол',
                inspect_wardrobe: 'Проверить гардероб и сундук',
                leave_house: 'Пока уйти'
            }
        },
        desk_findings: {
            text: 'Среди неоплаченных писем лежит долговая записка с инициалом W и коротким сроком.'
        },
        wardrobe_findings: {
            text: 'В шве пальто спрятаны квитанции ломбарда. Фридрих закладывал личные вещи до дат «краж».',
        },
        house_outro: {
            text: 'Клара: «Он затыкал дыру, а не прожигал деньги ради игры».',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_BANKER_SON_HOUSE_RU;
