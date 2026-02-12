import type { VNContentPack } from '../../../../model/types';

export const SANDBOX_GHOST_INVESTIGATE_RU: VNContentPack = {
    locale: 'ru',
    scenes: {
        estate_entry: {
            text: 'Поместье скрипит под зимним ветром. Клара раскрывает блокнот: «Сначала факты, потом обвинения».',
            choices: {
                inspect_cold_hall: 'Осмотреть ледяной коридор',
                inspect_fireplace: 'Проверить стену у камина',
                question_servant: 'Допросить служанку',
                inspect_residue: 'Осмотреть светящийся налёт',
                summarize_findings: 'Свести выводы',
                leave_estate: 'Покинуть поместье пока'
            }
        },
        cold_draft_clue: {
            text: 'По закрытому коридору режет ледяной сквозняк. Ни окна, ни шахты, ни очевидного источника.'
        },
        hidden_passage_clue: {
            text: 'За панелью камина скрыт узкий проход, а на ступенях — свежая грязь.'
        },
        servant_testimony_clue: {
            text: '«Каждую ночь дрожит дверь в подвал», — говорит служанка. «И кто-то идёт по коридору без шагов».'
        },
        ectoplasm_clue: {
            text: 'Зелёный налёт тускло светится даже в темноте и остаётся ледяным на ощупь.'
        },
        estate_outro: {
            text: 'Материала достаточно для структурной дедукции. Теперь гильдия может оценить твою модель дела.',
            choices: {
                return_to_map: 'Вернуться на карту'
            }
        }
    }
};

export default SANDBOX_GHOST_INVESTIGATE_RU;
