import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_GUILD_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        guild_intro: {
            text: 'В гильдии сыщиков дубовые стены увешаны картами и схемами вскрытий. Клара спрашивает, какой паттерн разобрать первым.',
            choices: {
                present_supernatural_pattern: 'Представить сверхъестественный паттерн',
                present_contraband_pattern: 'Представить контрабандный паттерн',
                ask_for_neutral_method: 'Попросить нейтральный метод'
            }
        },
        guild_supernatural: {
            text: 'Мастер гильдии обводит записи о сквозняке и налёте. «Если это подделка, то дорогая и очень аккуратная».'
        },
        guild_contraband: {
            text: 'Он стучит по схеме тайного хода. «Контрабандисты любят маскироваться под легенды о призраках. Ищи логистику».'
        },
        guild_neutral: {
            text: '«Не влюбляйся в первую версию», — предупреждает мастер. «Обвиняй только то, что держится на двух независимых уликах».'
        },
        guild_outro: {
            text: 'Каркас обвинения готов. Возвращайся в поместье и выноси вердикт.',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_GHOST_GUILD_RU;
