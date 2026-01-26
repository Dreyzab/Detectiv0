import type { VNScenario } from '../model/types';
import { CASE1_BRIEFING } from './detective/case1_briefing';
import { CASE1_BANK_SCENE } from './detective/case1_bank';
import { CASE1_PUB_SCENE } from './detective/case1_pub';
import { CASE1_ARCHIVE_SCENE } from './detective/case1_archive';
import { CASE1_WAREHOUSE_SCENE } from './detective/case1_warehouse';

export const SCENARIO_REGISTRY: Record<string, VNScenario> = {
    'detective_case1_briefing': CASE1_BRIEFING,
    'detective_case1_bank_scene': CASE1_BANK_SCENE,
    'detective_case1_pub_rumors': CASE1_PUB_SCENE,
    'detective_case1_archive_search': CASE1_ARCHIVE_SCENE,
    'detective_case1_warehouse_finale': CASE1_WAREHOUSE_SCENE,
};

export const getScenarioById = (id: string): VNScenario | null => {
    return SCENARIO_REGISTRY[id] || null;
};
