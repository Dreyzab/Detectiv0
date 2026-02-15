import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const case01PointsPath = fileURLToPath(
    new URL('../../../../../../../apps/server/src/scripts/data/case_01_points.ts', import.meta.url)
);

const scenariosRoot = fileURLToPath(new URL('..', import.meta.url));

const extractStartVnScenarioIds = (source: string): string[] => {
    const ids: string[] = [];
    const matcher = /type:\s*'start_vn'[\s\S]*?scenarioId:\s*'([^']+)'/g;
    let match: RegExpExecArray | null;

    while ((match = matcher.exec(source)) !== null) {
        ids.push(match[1]);
    }

    return Array.from(new Set(ids));
};

const listScenarioLogicFiles = (root: string): string[] => {
    const out: string[] = [];
    const stack = [root];

    while (stack.length > 0) {
        const current = stack.pop()!;
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const nextPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(nextPath);
                continue;
            }
            if (entry.isFile() && nextPath.endsWith('.logic.ts')) {
                out.push(nextPath);
            }
        }
    }

    return out;
};

const extractScenarioId = (source: string): string | null => {
    const match = source.match(/\bid:\s*'([^']+)'/);
    return match ? match[1] : null;
};

const collectScenarioIds = (): Set<string> => {
    const ids = new Set<string>();
    for (const file of listScenarioLogicFiles(scenariosRoot)) {
        const source = fs.readFileSync(file, 'utf8');
        const id = extractScenarioId(source);
        if (id) {
            ids.add(id);
        }
    }
    return ids;
};

describe('Case01 map bindings', () => {
    it('keeps every case_01 start_vn binding linked to an existing VN scenario', () => {
        const source = fs.readFileSync(case01PointsPath, 'utf8');
        const startVnIds = extractStartVnScenarioIds(source);
        const scenarioIds = collectScenarioIds();
        const missingScenarioIds = startVnIds.filter((scenarioId) => !scenarioIds.has(scenarioId));

        expect(startVnIds.length).toBeGreaterThan(0);
        expect(missingScenarioIds).toEqual([]);
    });
});

