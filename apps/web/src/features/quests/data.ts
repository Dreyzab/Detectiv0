
import { mergeQuest } from './utils';
import type { Quest } from './types';

import { CASE_01_ACT_1_LOGIC } from './case01_act1.logic';
import { CASE_01_ACT_1_EN } from './case01_act1.en';
import { CASE_01_ACT_1_RU } from './case01_act1.ru';
import { CASE_01_ACT_1_DE } from './case01_act1.de';
import { SANDBOX_META_LOGIC } from './sandbox_meta.logic';
import { SANDBOX_META_EN } from './sandbox_meta.en';
import { SANDBOX_META_RU } from './sandbox_meta.ru';
import { SANDBOX_META_DE } from './sandbox_meta.de';
import { SANDBOX_BANKER_LOGIC } from './sandbox_banker.logic';
import { SANDBOX_BANKER_EN } from './sandbox_banker.en';
import { SANDBOX_BANKER_RU } from './sandbox_banker.ru';
import { SANDBOX_BANKER_DE } from './sandbox_banker.de';
import { SANDBOX_DOG_LOGIC } from './sandbox_dog.logic';
import { SANDBOX_DOG_EN } from './sandbox_dog.en';
import { SANDBOX_DOG_RU } from './sandbox_dog.ru';
import { SANDBOX_DOG_DE } from './sandbox_dog.de';
import { SANDBOX_GHOST_LOGIC } from './sandbox_ghost.logic';
import { SANDBOX_GHOST_EN } from './sandbox_ghost.en';
import { SANDBOX_GHOST_RU } from './sandbox_ghost.ru';
import { SANDBOX_GHOST_DE } from './sandbox_ghost.de';

export const QUESTS: Record<string, Quest> = {
    'case01': mergeQuest(CASE_01_ACT_1_LOGIC, {
        en: CASE_01_ACT_1_EN,
        ru: CASE_01_ACT_1_RU,
        de: CASE_01_ACT_1_DE
    }),
    'sandbox_karlsruhe': mergeQuest(SANDBOX_META_LOGIC, {
        en: SANDBOX_META_EN,
        ru: SANDBOX_META_RU,
        de: SANDBOX_META_DE
    }),
    'sandbox_banker': mergeQuest(SANDBOX_BANKER_LOGIC, {
        en: SANDBOX_BANKER_EN,
        ru: SANDBOX_BANKER_RU,
        de: SANDBOX_BANKER_DE
    }),
    'sandbox_dog': mergeQuest(SANDBOX_DOG_LOGIC, {
        en: SANDBOX_DOG_EN,
        ru: SANDBOX_DOG_RU,
        de: SANDBOX_DOG_DE
    }),
    'sandbox_ghost': mergeQuest(SANDBOX_GHOST_LOGIC, {
        en: SANDBOX_GHOST_EN,
        ru: SANDBOX_GHOST_RU,
        de: SANDBOX_GHOST_DE
    })
};
