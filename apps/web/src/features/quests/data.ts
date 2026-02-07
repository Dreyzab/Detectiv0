
import { mergeQuest } from './utils';
import type { Quest } from './types';

import { CASE_01_ACT_1_LOGIC } from './case01_act1.logic';
import { CASE_01_ACT_1_EN } from './case01_act1.en';
import { CASE_01_ACT_1_RU } from './case01_act1.ru';
import { CASE_01_ACT_1_DE } from './case01_act1.de';

export const QUESTS: Record<string, Quest> = {
    'case01': mergeQuest(CASE_01_ACT_1_LOGIC, {
        en: CASE_01_ACT_1_EN,
        ru: CASE_01_ACT_1_RU,
        de: CASE_01_ACT_1_DE
    })
};
