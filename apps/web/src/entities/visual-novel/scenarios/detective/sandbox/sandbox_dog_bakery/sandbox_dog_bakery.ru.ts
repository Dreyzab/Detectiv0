import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_DOG_BAKERY_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        bakery_intro: {
            text: 'Пекарня пахнет тёплым тестом и сахаром. Хозяйка сразу узнаёт Бруно.',
            choices: {
                question_baker: 'Спросить, куда убежал Бруно',
                inspect_flour_marks: 'Проследить следы лап в муке',
                leave_bakery: 'Пока уйти'
            }
        },
        baker_statement: {
            text: '«Он ворует сладкие корки и несётся в Шлоссгартен», — вздыхает пекарша. «Сердце доброе, аппетит огромный».'
        },
        flour_success: {
            text: 'Ты находишь дорожку из мучных следов к парковой дороге. Клара одобрительно кивает: «Чистый маршрут, без обходов».'
        },
        flour_fail: {
            text: 'Тонкие следы теряются, но пекарша указывает туда же: в Шлоссгартен.'
        },
        bakery_outro: {
            text: 'С высокой вероятностью Бруно сейчас в дворцовом парке.',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_DOG_BAKERY_RU;
