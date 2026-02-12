import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_BANKER_CASINO_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        casino_arrival: {
            text: 'Зеленое сукно, звон фишек и Фридрих за центральным столом. Говорить он согласен только после дуэли.',
            choices: {
                start_duel: 'Принять дуэль',
                step_back: 'Отступить пока'
            }
        },
        launch_duel: {
            text: 'Ты садишься за стол. В зале становится тихо, когда раздают первые карты.'
        },
        casino_fallout: {
            text: 'Дуэль окончена. Фридрих признает долговую цепочку и скрытые правки отца в бухгалтерии.',
            choices: {
                expose_publicly: 'Вскрыть правду публично',
                settle_privately: 'Закрыть вопрос приватно'
            }
        },
        resolution_public: {
            text: 'Ты выводишь дело в публичное поле. Город узнает правду, но семья раскалывается.'
        },
        resolution_private: {
            text: 'Ты гасишь скандал за закрытыми дверями. Семья ранена, но не уничтожена на глазах города.'
        },
        case_closed: {
            text: 'Контракт банкира закрыт. На карте города появились новые варианты хода.',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_BANKER_CASINO_RU;
