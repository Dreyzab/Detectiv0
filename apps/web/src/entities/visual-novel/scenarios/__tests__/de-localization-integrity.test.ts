import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CONTENT_PACKS } from '../registry';
import type { VNContentPack, VNScenarioLogic } from '../../model/types';

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

describe('German Locale Integrity', () => {
    it('keeps DE JSON locale files aligned with EN keys', () => {
        const localesRoot = fileURLToPath(new URL('../../../../locales', import.meta.url));
        const enDir = path.join(localesRoot, 'en');
        const deDir = path.join(localesRoot, 'de');
        const issues: string[] = [];

        for (const file of fs.readdirSync(enDir).filter((entry) => entry.endsWith('.json'))) {
            const enPath = path.join(enDir, file);
            const dePath = path.join(deDir, file);

            if (!fs.existsSync(dePath)) {
                issues.push(`Missing DE locale file: ${file}`);
                continue;
            }

            const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
            const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));
            const enKeys = flattenKeys(enJson).sort();
            const deKeys = flattenKeys(deJson).sort();

            const missingInDe = enKeys.filter((key) => !deKeys.includes(key));
            const extraInDe = deKeys.filter((key) => !enKeys.includes(key));

            missingInDe.forEach((key) => issues.push(`${file}: missing key '${key}' in DE`));
            extraInDe.forEach((key) => issues.push(`${file}: extra key '${key}' in DE`));
        }

        expect(issues).toEqual([]);
    });

    it('provides DE content packs for every VN scenario and keeps logic keys complete', () => {
        const issues: string[] = [];

        for (const [scenarioId, bundle] of Object.entries(CONTENT_PACKS)) {
            const logic = bundle.logic as VNScenarioLogic;
            const dePack = bundle.de as VNContentPack | undefined;

            if (!dePack) {
                issues.push(`Scenario '${scenarioId}' is missing DE content pack`);
                continue;
            }

            if (dePack.locale !== 'de') {
                issues.push(`Scenario '${scenarioId}' has DE file with locale='${dePack.locale}'`);
            }

            for (const sceneLogic of Object.values(logic.scenes)) {
                const sceneContent = dePack.scenes?.[sceneLogic.id];
                if (!sceneContent?.text) {
                    issues.push(`Scenario '${scenarioId}' scene '${sceneLogic.id}' missing DE text`);
                }

                for (const choiceLogic of sceneLogic.choices ?? []) {
                    if (!sceneContent?.choices?.[choiceLogic.id]) {
                        issues.push(
                            `Scenario '${scenarioId}' scene '${sceneLogic.id}' missing DE choice '${choiceLogic.id}'`
                        );
                    }
                }
            }
        }

        expect(issues).toEqual([]);
    });

    it('avoids EN fallback text inside DE content packs', () => {
        const issues: string[] = [];

        for (const [scenarioId, bundle] of Object.entries(CONTENT_PACKS)) {
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
