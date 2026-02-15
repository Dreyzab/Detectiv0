import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const case01Root = fileURLToPath(
    new URL('../detective/case_01_bank', import.meta.url)
);

const listCase01LogicFiles = (root: string): string[] => {
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

const extractSceneIds = (source: string): Set<string> => {
    const ids = new Set<string>();
    const matcher = /^\s*'([^']+)'\s*:\s*\{/gm;
    let match: RegExpExecArray | null;

    while ((match = matcher.exec(source)) !== null) {
        ids.add(match[1]);
    }

    return ids;
};

const extractNextSceneIds = (source: string): string[] => {
    const ids: string[] = [];
    const matcher = /nextSceneId:\s*'([^']+)'/g;
    let match: RegExpExecArray | null;

    while ((match = matcher.exec(source)) !== null) {
        ids.push(match[1]);
    }

    return ids;
};

describe('Case01 graph integrity', () => {
    it('has no dangling nextSceneId references in case_01_bank logic files', () => {
        const issues: string[] = [];
        const logicFiles = listCase01LogicFiles(case01Root);

        for (const file of logicFiles) {
            const source = fs.readFileSync(file, 'utf8');
            const sceneIds = extractSceneIds(source);
            const nextSceneIds = extractNextSceneIds(source);
            const missingInFile = Array.from(
                new Set(
                    nextSceneIds.filter((id) => id !== 'END' && !sceneIds.has(id))
                )
            );

            if (missingInFile.length > 0) {
                const rel = path.relative(process.cwd(), file).replaceAll('\\', '/');
                issues.push(`${rel}: ${missingInFile.join(', ')}`);
            }
        }

        expect(issues).toEqual([]);
    });
});

