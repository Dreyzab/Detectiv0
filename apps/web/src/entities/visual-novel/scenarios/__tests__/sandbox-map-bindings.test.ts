import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getScenarioById } from '../registry';

const sandboxPointsPath = fileURLToPath(
    new URL('../../../../../../../apps/server/src/scripts/data/sandbox_ka_points.ts', import.meta.url)
);

const extractStartVnScenarioIds = (source: string): string[] => {
    const ids: string[] = [];
    const matcher = /type:\s*'start_vn'[\s\S]*?scenarioId:\s*'([^']+)'/g;
    let match: RegExpExecArray | null;

    while ((match = matcher.exec(source)) !== null) {
        ids.push(match[1]);
    }

    return Array.from(new Set(ids));
};

describe('Sandbox KA map bindings', () => {
    it('keeps every start_vn map binding linked to an existing VN scenario', () => {
        const source = fs.readFileSync(sandboxPointsPath, 'utf8');
        const scenarioIds = extractStartVnScenarioIds(source);
        const missingScenarioIds = scenarioIds.filter((scenarioId) => !getScenarioById(scenarioId, 'en'));

        expect(scenarioIds.length).toBeGreaterThan(0);
        expect(missingScenarioIds).toEqual([]);
    });
});
