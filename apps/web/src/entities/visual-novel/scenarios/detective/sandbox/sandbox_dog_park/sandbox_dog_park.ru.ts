import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_PARK_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        park_intro: {
            text: 'Среди старых дубов Шлоссгартена тяжёлый коричневый пёс грызёт украденную булку. Бруно настораживает ухо.',
            choices: {
                call_bruno: 'Позвать Бруно по имени',
                approach_with_sausage: 'Подойти аккуратно с колбасой',
                retreat: 'Отступить и вернуться позже'
            }
        },
        bruno_spooked: {
            text: 'Бруно юркает за скамью, но тут же выглядывает обратно. Клара шепчет: «Спокойно. Без резких движений».'
        },
        bruno_found: {
            text: 'Пёс узнаёт голос и начинает махать хвостом так, что с ветки сыплются листья.',
            choices: {
                check_collar: 'Проверить ошейник',
                escort_to_rathaus: 'Отвести Бруно в ратушу'
            }
        },
        collar_clue: {
            text: 'На ошейнике блестит латунная бирка с печатью города. Принадлежность подтверждена.'
        },
        dog_resolved: {
            text: 'В ратуше Пфайффер выдыхает с явным облегчением. «Вы спасли и моего пса, и мою репутацию, детектив».',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_DOG_PARK_RU;
