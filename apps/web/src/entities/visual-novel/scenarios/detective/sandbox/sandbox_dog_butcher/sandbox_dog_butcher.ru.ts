import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_BUTCHER_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        butcher_intro: {
            text: 'Мясник вытирает нож и косится на вас. На каменном полу следы жира и талой воды.',
            choices: {
                question_butcher: 'Спросить о Бруно',
                inspect_counter: 'Осмотреть разделочный стол',
                leave_shop: 'Пока уйти'
            }
        },
        butcher_statement: {
            text: '«Большой коричневый пёс? Бруно ест у меня два раза в день», — фыркает мясник. «Потом идёт к пекарне за корками».'
        },
        butcher_trace_success: {
            text: 'У задней двери ты находишь жирную бумагу, припудренную мукой. Клара кивает: «Маршрут подтверждён: мясник, потом пекарня».'
        },
        butcher_trace_fail: {
            text: 'Тонкие следы ускользают, но мясник всё равно отправляет тебя в пекарный квартал.'
        },
        butcher_outro: {
            text: 'След уверенно ведёт к пекарне.',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_DOG_BUTCHER_RU;
