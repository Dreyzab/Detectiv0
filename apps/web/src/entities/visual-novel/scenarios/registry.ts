import { mergeScenario } from '../lib/localization';
import type { VNScenario } from '../model/types';
// import { CASE1_BRIEFING } from './detective/case1_briefing'; // Legacy

// Localization Imports
import { CASE1_BANK_LOGIC } from './detective/case1_bank.logic';
import { CASE1_BANK_EN } from './detective/case1_bank.en';
import { CASE1_BANK_DE } from './detective/case1_bank.de';
import { CASE1_BANK_RU } from './detective/case1_bank.ru';

import { CASE1_BRIEFING_LOGIC } from './detective/case1_briefing.logic';
import { CASE1_BRIEFING_EN } from './detective/case1_briefing.en';

// Lab Analysis Imports
import { CASE1_LAB_LOGIC } from './detective/case1_lab_analysis.logic';
import { CASE1_LAB_EN } from './detective/case1_lab_analysis.en';
import { CASE1_LAB_DE } from './detective/case1_lab_analysis.de';
import { CASE1_LAB_RU } from './detective/case1_lab_analysis.ru';

import { CASE1_PUB_SCENE } from './detective/case1_pub';
import { CASE1_ARCHIVE_SCENE } from './detective/case1_archive';
import { CASE1_WAREHOUSE_SCENE } from './detective/case1_warehouse';
import { CASE1_FINALE_SCENE } from './detective/case1_finale';

// Lead Investigation Imports
import { LEAD_PUB_LOGIC } from './detective/lead_pub.logic';
import { LEAD_PUB_EN } from './detective/lead_pub.en';
import { LEAD_TAILOR_LOGIC } from './detective/lead_tailor.logic';
import { LEAD_TAILOR_EN } from './detective/lead_tailor.en';
import { LEAD_APOTHECARY_LOGIC } from './detective/lead_apothecary.logic';
import { LEAD_APOTHECARY_EN } from './detective/lead_apothecary.en';

// Finales & Interludes
import { INTERLUDE_VICTORIA_LOGIC } from './detective/interlude_victoria.logic';
import { INTERLUDE_VICTORIA_EN } from './detective/interlude_victoria.en';
import { INTERLUDE_LOTTE_LOGIC } from './detective/interlude_lotte.logic';
import { INTERLUDE_LOTTE_EN } from './detective/interlude_lotte.en';
import { CASE1_FINALE_LOGIC } from './detective/case1_finale.logic';
import { CASE1_FINALE_EN } from './detective/case1_finale.en';

// Personal Quests
import { QUEST_VICTORIA_POETRY_LOGIC } from './detective/quest_victoria_poetry.logic';
import { QUEST_VICTORIA_POETRY_EN } from './detective/quest_victoria_poetry.en';
// Flavor Encounters
import { encounterCleanerLogic } from './flavor/encounter_cleaner.logic';
import { encounterCleanerEn } from './flavor/encounter_cleaner.en';
import { encounterStudentLogic } from './flavor/encounter_student.logic';
import { encounterStudentEn } from './flavor/encounter_student.en';
import { encounterTouristLogic } from './flavor/encounter_tourist.logic';
import { encounterTouristEn } from './flavor/encounter_tourist.en';

// Lotte Quest
import { questLotteWiresLogic } from './detective/quest_lotte_wires.logic';
import { questLotteWiresEn } from './detective/quest_lotte_wires.en';

// Inspector Quest
import { questInspectorViennaLogic } from './detective/quest_inspector_vienna.logic';
import { questInspectorViennaEn } from './detective/quest_inspector_vienna.en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CONTENT_PACKS: Record<string, any> = {
    'detective_case1_briefing': {
        logic: CASE1_BRIEFING_LOGIC,
        en: CASE1_BRIEFING_EN
    },
    'detective_case1_bank_scene': {
        logic: CASE1_BANK_LOGIC,
        en: CASE1_BANK_EN,
        de: CASE1_BANK_DE,
        ru: CASE1_BANK_RU
    },
    'detective_case1_lab_analysis': {
        logic: CASE1_LAB_LOGIC,
        en: CASE1_LAB_EN,
        de: CASE1_LAB_DE,
        ru: CASE1_LAB_RU
    },
    // Open City Investigation Leads
    'lead_pub': {
        logic: LEAD_PUB_LOGIC,
        en: LEAD_PUB_EN
    },
    'lead_tailor': {
        logic: LEAD_TAILOR_LOGIC,
        en: LEAD_TAILOR_EN
    },
    'lead_apothecary': {
        logic: LEAD_APOTHECARY_LOGIC,
        en: LEAD_APOTHECARY_EN
    },
    // Finale & Interludes
    'interlude_victoria_street': { logic: INTERLUDE_VICTORIA_LOGIC, en: INTERLUDE_VICTORIA_EN },
    'interlude_lotte_warning': { logic: INTERLUDE_LOTTE_LOGIC, en: INTERLUDE_LOTTE_EN },
    'case1_finale': { logic: CASE1_FINALE_LOGIC, en: CASE1_FINALE_EN },

    // Personal Quests
    'quest_victoria_poetry': {
        logic: QUEST_VICTORIA_POETRY_LOGIC,
        en: QUEST_VICTORIA_POETRY_EN
    },
    'quest_lotte_wires': {
        logic: questLotteWiresLogic,
        en: questLotteWiresEn
    },
    'quest_inspector_vienna': {
        logic: questInspectorViennaLogic,
        en: questInspectorViennaEn
    },
    // Flavor Encounters
    'encounter_cleaner': {
        logic: encounterCleanerLogic,
        en: encounterCleanerEn
    },
    'encounter_student': {
        logic: encounterStudentLogic,
        en: encounterStudentEn
    },
    'encounter_tourist': {
        logic: encounterTouristLogic,
        en: encounterTouristEn
    }
};

export const SCENARIO_REGISTRY: Record<string, VNScenario> = {
    // 'detective_case1_briefing': CASE1_BRIEFING, // Moved to Content Packs
    // Dynamic scenarios are prioritized in getScenarioById
    'detective_case1_pub_rumors': CASE1_PUB_SCENE,
    'detective_case1_archive_search': CASE1_ARCHIVE_SCENE,
    'detective_case1_warehouse_finale': CASE1_WAREHOUSE_SCENE,
    'detective_case1_finale': CASE1_FINALE_SCENE,
};

export const getScenarioById = (id: string, locale: string = 'en'): VNScenario | null => {
    // 1. Check for Localized Scenario
    if (CONTENT_PACKS[id]) {
        const pack = CONTENT_PACKS[id];
        const content = pack[locale] || pack['en']; // Fallback to EN content
        const fallback = pack['en'];

        return mergeScenario(pack.logic, content, fallback);
    }

    // 2. Legacy/Static Scenarios
    return SCENARIO_REGISTRY[id] || null;
};
