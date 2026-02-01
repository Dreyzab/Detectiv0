import { mergeScenario } from '../lib/localization';
import type { VNScenario, VNContentPack, VNScenarioLogic } from '../model/types';
import { logger } from '@repo/shared';

// Type definition for scenario bundles to avoid 'any'
type ScenarioBundle = {
    logic: VNScenarioLogic;
} & Record<string, VNContentPack | VNScenarioLogic>;

// --- Dynamic Import Logic ---

// 1. Glob Logic Files (*.logic.ts)
const logicModules = import.meta.glob<VNScenarioLogic>(
    './**/*.logic.ts',
    { eager: true, import: 'default' }
);

// 2. Glob Content Files (*.en.ts, *.de.ts, etc.)
const contentModules = import.meta.glob<VNContentPack>(
    './**/*.{en,de,ru}.ts',
    { eager: true, import: 'default' }
);

export const CONTENT_PACKS: Record<string, ScenarioBundle> = {};

// 3. Assemble Bundles automatically
Object.keys(logicModules).forEach(logicPath => {
    // logicPath e.g. "./detective/case1_bank.logic.ts"
    const logicModule = logicModules[logicPath];

    // Safety check for default export
    if (!logicModule || !logicModule.id) {
        logger.warn(`[VN Registry] Invalid logic module at ${logicPath}`);
        return;
    }

    const scenarioId = logicModule.id;

    // Initialize Bundle
    if (!CONTENT_PACKS[scenarioId]) {
        CONTENT_PACKS[scenarioId] = {
            logic: logicModule
        };
    } else {
        CONTENT_PACKS[scenarioId].logic = logicModule;
    }

    // Find matching content files
    // Strategy: Look for files with same basename prefix in same folder?
    // Or scan contentModules and check ID inside? 
    // Usually content packs might NOT have the ID export, just the object.
    // So we rely on naming convention or we iterate contentModules.

    // Better Strategy: Iterate contentModules and match by filename convention
    // Convention: [name].logic.ts <-> [name].[locale].ts
    const basePath = logicPath.replace('.logic.ts', '');

    // We can try to guess supported locales or iterate known ones
    ['en', 'de', 'ru'].forEach(locale => {
        const contentPath = `${basePath}.${locale}.ts`;
        if (contentModules[contentPath]) {
            CONTENT_PACKS[scenarioId][locale] = contentModules[contentPath];
        }
    });
});

export const SCENARIO_REGISTRY: Record<string, VNScenario> = {
    // Legacy static imports can still be added here if needed
    // But ideally everything is now in CONTENT_PACKS
};

export const getScenarioById = (id: string, locale: string = 'en'): VNScenario | null => {
    // 1. Check for Localized Scenario (Dynamic)
    if (CONTENT_PACKS[id]) {
        const pack = CONTENT_PACKS[id];
        // Ensure we treat the property as VNContentPack when accessing by locale
        const content = (pack[locale] as VNContentPack) || (pack['en'] as VNContentPack);
        const fallback = pack['en'] as VNContentPack;

        if (pack.logic && content) {
            return mergeScenario(pack.logic, content, fallback);
        }
    }

    // 2. Legacy/Static Scenarios
    return SCENARIO_REGISTRY[id] || null;
};

