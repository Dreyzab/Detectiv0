import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { glob } from 'glob';

const CANONICAL_VOICE_IDS = [
    'logic', 'perception', 'encyclopedia',
    'intuition', 'empathy', 'imagination',
    'authority', 'charisma', 'volition',
    'endurance', 'agility', 'senses',
    'stealth', 'deception', 'intrusion',
    'occultism', 'tradition', 'gambling'
] as const;

const thisFile = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(thisFile);
const repoRoot = path.resolve(scriptsDir, '../../../..');
const obsidianRoot = path.join(repoRoot, 'obsidian', 'Detectiv');

const toPosix = (value: string): string => value.replace(/\\/g, '/');

const parseCharacterIdsFromCode = async (): Promise<string[]> => {
    const source = await readFile(path.join(repoRoot, 'packages/shared/data/characters.ts'), 'utf8');
    const unionBlock = source.match(/export type CharacterId\s*=([\s\S]*?);/);
    if (!unionBlock) return [];
    const ids = [...unionBlock[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    return Array.from(new Set(ids)).sort();
};

const parseLocationIdsFromCasePoints = async (): Promise<string[]> => {
    const source = await readFile(path.join(repoRoot, 'apps/server/src/scripts/data/case_01_points.ts'), 'utf8');
    const ids = [...source.matchAll(/'((?:loc_[a-z0-9_]+))'\s*:\s*\{/g)].map((m) => m[1]);
    return Array.from(new Set(ids)).sort();
};

const listObsidianCharacterRuntimeIds = async (): Promise<string[]> => {
    const files = await glob('30_World_Intel/Characters/char_*.md', { cwd: obsidianRoot, nodir: true, windowsPathsNoEscape: true });
    const ids: string[] = [];
    for (const file of files) {
        const raw = await readFile(path.join(obsidianRoot, file), 'utf8');
        const parsed = matter(raw);
        const data = parsed.data as Record<string, unknown>;
        const runtime = typeof data.runtime_character_id === 'string'
            ? data.runtime_character_id
            : path.basename(file, '.md').replace(/^char_/, '');
        ids.push(runtime);
    }
    return Array.from(new Set(ids)).sort();
};

const listObsidianLocationRuntimeIds = async (): Promise<string[]> => {
    const files = await glob('30_World_Intel/Locations/*.md', { cwd: obsidianRoot, nodir: true, windowsPathsNoEscape: true });
    const ids: string[] = [];
    for (const file of files) {
        const base = path.basename(file);
        if (base.startsWith('_')) continue;

        const raw = await readFile(path.join(obsidianRoot, file), 'utf8');
        const parsed = matter(raw);
        const data = parsed.data as Record<string, unknown>;
        const runtime = typeof data.runtime_location_id === 'string'
            ? data.runtime_location_id
            : raw.match(/> \*\*ID\*\*: `([^`]+)`/)?.[1] ?? '';
        if (runtime.length > 0) ids.push(runtime);
    }
    return Array.from(new Set(ids)).sort();
};

interface ParliamentCheck {
    voiceFiles: string[];
    mocLinks: string[];
    missingInMoc: string[];
    extraInMoc: string[];
    missingCanonicalFiles: string[];
    nonCanonicalFiles: string[];
    orphanVoiceNotes: string[];
    groupCountValid: boolean;
    entryCountValid: boolean;
}

const checkParliament = async (): Promise<ParliamentCheck> => {
    const voiceFiles = (await glob('20_Game_Design/Voices/Voice_*.md', {
        cwd: obsidianRoot,
        nodir: true,
        windowsPathsNoEscape: true
    })).map((file) => path.basename(file, '.md').replace(/^Voice_/, '').toLowerCase()).sort();

    const mocPath = path.join(obsidianRoot, '20_Game_Design/Voices/MOC_Parliament.md');
    const moc = await readFile(mocPath, 'utf8');
    const mocLinks = Array.from(new Set(
        [...moc.matchAll(/\[\[(?:[^\]|]+\/)?Voice_([^\]|]+)(?:\|[^\]]+)?\]\]/g)]
            .map((match) => match[1].toLowerCase())
    )).sort();

    const voiceSet = new Set(voiceFiles);
    const mocSet = new Set(mocLinks);
    const canonicalSet = new Set(CANONICAL_VOICE_IDS);

    const missingInMoc = voiceFiles.filter((id) => !mocSet.has(id));
    const extraInMoc = mocLinks.filter((id) => !voiceSet.has(id));
    const missingCanonicalFiles = CANONICAL_VOICE_IDS.filter((id) => !voiceSet.has(id));
    const nonCanonicalFiles = voiceFiles.filter((id) => !canonicalSet.has(id as never));
    const orphanVoiceNotes = voiceFiles.filter((id) => !mocSet.has(id));

    const groupCountValid = ['## Brain', '## Soul', '## Character', '## Body', '## Shadow', '## Spirit']
        .every((heading) => moc.includes(heading));
    const entryCountValid = (moc.match(/\[\[(?:[^\]|]+\/)?Voice_[^\]]+\]\]/g) ?? []).length === 18;

    return {
        voiceFiles,
        mocLinks,
        missingInMoc,
        extraInMoc,
        missingCanonicalFiles,
        nonCanonicalFiles,
        orphanVoiceNotes,
        groupCountValid,
        entryCountValid
    };
};

interface DuplicateResult {
    duplicateBasenames: Array<{ name: string; files: string[] }>;
    duplicateFrontmatterIds: Array<{ id: string; files: string[] }>;
}

const checkDuplicates = async (): Promise<DuplicateResult> => {
    const files = await glob('**/*.md', { cwd: obsidianRoot, nodir: true, windowsPathsNoEscape: true });

    const basenameMap = new Map<string, string[]>();
    const idMap = new Map<string, string[]>();

    for (const file of files) {
        const basename = path.basename(file);
        if (!basenameMap.has(basename)) basenameMap.set(basename, []);
        basenameMap.get(basename)!.push(file);

        const raw = await readFile(path.join(obsidianRoot, file), 'utf8');
        const parsed = matter(raw);
        const data = parsed.data as Record<string, unknown>;
        if (typeof data.id === 'string' && data.id.length > 0) {
            if (!idMap.has(data.id)) idMap.set(data.id, []);
            idMap.get(data.id)!.push(file);
        }
    }

    const duplicateBasenames = Array.from(basenameMap.entries())
        .filter(([name, entries]) => entries.length > 1 && name !== 'READ_ME.md')
        .map(([name, entries]) => ({ name, files: entries.map((entry) => toPosix(path.join('obsidian/Detectiv', entry))) }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const duplicateFrontmatterIds = Array.from(idMap.entries())
        .filter(([, entries]) => entries.length > 1)
        .map(([id, entries]) => ({ id, files: entries.map((entry) => toPosix(path.join('obsidian/Detectiv', entry))) }))
        .sort((a, b) => a.id.localeCompare(b.id));

    return { duplicateBasenames, duplicateFrontmatterIds };
};

const diff = (left: string[], right: string[]): string[] => left.filter((value) => !right.includes(value));

const main = async (): Promise<void> => {
    const reportLines: string[] = [];
    let hasErrors = false;

    const duplicateResult = await checkDuplicates();
    reportLines.push('== Duplicate Checks ==');
    if (duplicateResult.duplicateBasenames.length === 0) {
        reportLines.push('- Duplicate basenames: none');
    } else {
        hasErrors = true;
        reportLines.push('- Duplicate basenames: found');
        for (const entry of duplicateResult.duplicateBasenames) {
            reportLines.push(`  - ${entry.name}: ${entry.files.join(', ')}`);
        }
    }

    if (duplicateResult.duplicateFrontmatterIds.length === 0) {
        reportLines.push('- Duplicate frontmatter ids: none');
    } else {
        hasErrors = true;
        reportLines.push('- Duplicate frontmatter ids: found');
        for (const entry of duplicateResult.duplicateFrontmatterIds) {
            reportLines.push(`  - ${entry.id}: ${entry.files.join(', ')}`);
        }
    }

    const [codeCharacterIds, obsidianCharacterIds] = await Promise.all([
        parseCharacterIdsFromCode(),
        listObsidianCharacterRuntimeIds()
    ]);
    const missingCharacterNotes = diff(codeCharacterIds, obsidianCharacterIds);

    reportLines.push('');
    reportLines.push('== Character Coverage ==');
    reportLines.push(`- Code CharacterId count: ${codeCharacterIds.length}`);
    reportLines.push(`- Obsidian runtime_character_id count: ${obsidianCharacterIds.length}`);
    if (missingCharacterNotes.length > 0) {
        hasErrors = true;
        reportLines.push(`- Missing character notes: ${missingCharacterNotes.join(', ')}`);
    } else {
        reportLines.push('- Missing character notes: none');
    }

    const [caseLocationIds, obsidianLocationIds] = await Promise.all([
        parseLocationIdsFromCasePoints(),
        listObsidianLocationRuntimeIds()
    ]);
    const missingLocationNotes = diff(caseLocationIds, obsidianLocationIds);

    reportLines.push('');
    reportLines.push('== Location Coverage ==');
    reportLines.push(`- Case locationId count: ${caseLocationIds.length}`);
    reportLines.push(`- Obsidian runtime_location_id count: ${obsidianLocationIds.length}`);
    if (missingLocationNotes.length > 0) {
        hasErrors = true;
        reportLines.push(`- Missing location notes: ${missingLocationNotes.join(', ')}`);
    } else {
        reportLines.push('- Missing location notes: none');
    }

    const parliament = await checkParliament();
    reportLines.push('');
    reportLines.push('== Parliament Integrity ==');
    reportLines.push(`- Voice files: ${parliament.voiceFiles.length}`);
    reportLines.push(`- MOC links: ${parliament.mocLinks.length}`);

    const parliamentFailures: string[] = [];
    if (!parliament.groupCountValid) parliamentFailures.push('MOC missing one or more required group headings');
    if (!parliament.entryCountValid) parliamentFailures.push('MOC does not contain exactly 18 voice links');
    if (parliament.missingInMoc.length > 0) parliamentFailures.push(`Missing links for voice files: ${parliament.missingInMoc.join(', ')}`);
    if (parliament.extraInMoc.length > 0) parliamentFailures.push(`MOC has extra links without files: ${parliament.extraInMoc.join(', ')}`);
    if (parliament.missingCanonicalFiles.length > 0) parliamentFailures.push(`Missing canonical voice files: ${parliament.missingCanonicalFiles.join(', ')}`);
    if (parliament.nonCanonicalFiles.length > 0) parliamentFailures.push(`Non-canonical voice files detected: ${parliament.nonCanonicalFiles.join(', ')}`);
    if (parliament.orphanVoiceNotes.length > 0) parliamentFailures.push(`Orphan voice notes (not linked from MOC): ${parliament.orphanVoiceNotes.join(', ')}`);

    if (parliamentFailures.length > 0) {
        hasErrors = true;
        reportLines.push('- Integrity: FAILED');
        for (const failure of parliamentFailures) {
            reportLines.push(`  - ${failure}`);
        }
    } else {
        reportLines.push('- Integrity: PASS');
    }

    const report = reportLines.join('\n') + '\n';
    const reportPath = path.join(repoRoot, 'obsidian_validation_report.txt');
    await writeFile(reportPath, report, 'utf8');

    process.stdout.write(report);
    process.stdout.write(`\nReport written to ${toPosix(path.relative(repoRoot, reportPath))}\n`);

    if (hasErrors) {
        process.exitCode = 1;
    }
};

main().catch((error) => {
    console.error('[obsidian-validate] Failed:', error);
    process.exitCode = 1;
});
