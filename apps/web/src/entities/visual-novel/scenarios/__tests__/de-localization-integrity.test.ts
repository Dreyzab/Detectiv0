import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CONTENT_PACKS } from '../registry';
import type { VNContentPack, VNScenarioLogic } from '../../model/types';

const FALLBACK_ALLOWLIST = new Set([
    'detective_case1_bank_scene',
    'lead_tailor',
    'lead_apothecary',
    'lead_pub'
]);

function flattenKeys(value: unknown, prefix = ''): string[] {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return [prefix];
    }

    const objectValue = value as Record<string, unknown>;
    return Object.entries(objectValue).flatMap(([key, nested]) => {
        const next = prefix ? `${prefix}.${key}` : key;
        return flattenKeys(nested, next);
    });
}

describe('Locale Integrity', () => {
    it('keeps DE/RU JSON locale files aligned with EN keys', () => {
        const localesRoot = fileURLToPath(new URL('../../../../locales', import.meta.url));
        const enDir = path.join(localesRoot, 'en');
        const issues: string[] = [];

        for (const file of fs.readdirSync(enDir).filter((entry) => entry.endsWith('.json'))) {
            const enPath = path.join(enDir, file);
            const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
            const enKeys = flattenKeys(enJson).sort();

            for (const locale of ['de', 'ru'] as const) {
                const localePath = path.join(localesRoot, locale, file);
                if (!fs.existsSync(localePath)) {
                    issues.push(`Missing ${locale.toUpperCase()} locale file: ${file}`);
                    continue;
                }

                const localeJson = JSON.parse(fs.readFileSync(localePath, 'utf8'));
                const localeKeys = flattenKeys(localeJson).sort();

                const missing = enKeys.filter((key) => !localeKeys.includes(key));
                const extra = localeKeys.filter((key) => !enKeys.includes(key));

                missing.forEach((key) => issues.push(`${file}: missing key '${key}' in ${locale.toUpperCase()}`));
                extra.forEach((key) => issues.push(`${file}: extra key '${key}' in ${locale.toUpperCase()}`));
            }
        }

        expect(issues).toEqual([]);
    });

    it('provides DE/RU content packs for every VN scenario and keeps logic keys complete', () => {
        const issues: string[] = [];

        for (const [scenarioId, bundle] of Object.entries(CONTENT_PACKS)) {
            if (FALLBACK_ALLOWLIST.has(scenarioId)) {
                continue;
            }

            const logic = bundle.logic as VNScenarioLogic;

            for (const locale of ['de', 'ru'] as const) {
                const pack = bundle[locale] as VNContentPack | undefined;

                if (!pack) {
                    issues.push(`Scenario '${scenarioId}' is missing ${locale.toUpperCase()} content pack`);
                    continue;
                }

                if (pack.locale !== locale) {
                    issues.push(
                        `Scenario '${scenarioId}' has ${locale.toUpperCase()} file with locale='${pack.locale}'`
                    );
                }

                for (const sceneLogic of Object.values(logic.scenes)) {
                    const sceneContent = pack.scenes?.[sceneLogic.id];
                    if (!sceneContent?.text) {
                        issues.push(
                            `Scenario '${scenarioId}' scene '${sceneLogic.id}' missing ${locale.toUpperCase()} text`
                        );
                    }

                    for (const choiceLogic of sceneLogic.choices ?? []) {
                        if (!sceneContent?.choices?.[choiceLogic.id]) {
                            issues.push(
                                `Scenario '${scenarioId}' scene '${sceneLogic.id}' missing ${locale.toUpperCase()} choice '${choiceLogic.id}'`
                            );
                        }
                    }
                }
            }
        }

        expect(issues).toEqual([]);
    });

    it('avoids EN fallback text inside DE content packs', () => {
        const issues: string[] = [];

        for (const [scenarioId, bundle] of Object.entries(CONTENT_PACKS)) {
            if (FALLBACK_ALLOWLIST.has(scenarioId)) {
                continue;
            }

            const enPack = bundle.en as VNContentPack | undefined;
            const dePack = bundle.de as VNContentPack | undefined;

            if (!enPack || !dePack) continue;

            for (const [sceneId, enScene] of Object.entries(enPack.scenes)) {
                const deScene = dePack.scenes[sceneId];
                if (!deScene) continue;

                if (deScene.text === enScene.text) {
                    issues.push(`Scenario '${scenarioId}' scene '${sceneId}' has identical EN/DE text`);
                }

                const enChoices = enScene.choices ?? {};
                for (const [choiceId, enChoiceText] of Object.entries(enChoices)) {
                    const deChoiceText = deScene.choices?.[choiceId];
                    if (deChoiceText === enChoiceText) {
                        issues.push(
                            `Scenario '${scenarioId}' scene '${sceneId}' choice '${choiceId}' has identical EN/DE text`
                        );
                    }
                }
            }
        }

        expect(issues).toEqual([]);
    });
});
