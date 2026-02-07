import { readdir, readFile, stat } from "fs/promises";
import { join, basename, relative } from "path";

// --- Configuration ---
const VAULT_ROOT = "obsidian/Detectiv";
const REQUIRED_ID_DIRS = [
    "10_Narrative/Characters",
    "20_Game_Design/Voices"
];

// --- Types ---
interface FileNode {
    path: string;
    name: string;
    id?: string;
    aliases: string[];
    links: string[]; // Raw link targets
}

interface ValidationReport {
    missingIds: string[];
    brokenLinks: { source: string; target: string }[];
    orphans: string[]; // Notes not linked from anywhere
}

// --- CLI Args ---
const args = process.argv.slice(2);
const isStrict = args.includes("--strict");
const isReport = args.includes("--report");

if (!isStrict && !isReport) {
    console.log("Usage: bun obsidian_validator.ts [--strict | --report]");
    console.log("Defaulting to --report mode.");
}

// --- Main ---
async function main() {
    console.log(`🔍 Scanning vault: ${VAULT_ROOT}...`);

    const allFiles = await getAllMarkdownFiles(VAULT_ROOT);
    const nodes = await Promise.all(allFiles.map(parseFile));

    // Build Registry
    const registry = new Set<string>(); // Paths, IDs, Aliases, Basenames
    for (const node of nodes) {
        registry.add(node.path); // Relative path
        registry.add(node.name); // Basename
        if (node.id) registry.add(node.id);
        for (const alias of node.aliases) registry.add(alias);
    }

    const report: ValidationReport = {
        missingIds: [],
        brokenLinks: [],
        orphans: []
    };

    // Validation Logic
    const validLinkTargets = new Set<string>(); // Track what is being linked TO

    for (const node of nodes) {
        // 1. Check Required IDs
        const relativeDir = join(VAULT_ROOT, "..", node.path).replace(/\\/g, "/"); // Approximate check
        const isRequiredDir = REQUIRED_ID_DIRS.some(dir => node.path.includes(dir));

        if (isRequiredDir && !node.id) {
            report.missingIds.push(node.path);
        }

        // 2. Check Links
        for (const link of node.links) {
            // Resolve link: [[target|label]] -> target
            // [[target#header]] -> target
            let target = link.split("|")[0].split("#")[0].trim();

            // Handle path-based links? Obsidian usually matches basename, alias, or path.
            // We'll check if 'target' exists in our registry.
            // Note: Registry contains basenames "File.md" vs link "File". 
            // We need to normalize.

            const found = nodes.some(n =>
                n.name === target ||
                n.name.replace(".md", "") === target ||
                (n.id && n.id === target) ||
                n.aliases.includes(target) ||
                n.path === target
            );

            if (found) {
                validLinkTargets.add(target);
                // Also mark the actual file as linked?
                // It's hard to map back 'target' string to specific file node efficiently without a map.
                // For orphan check, we'll do a reverse pass.
                const targetNode = nodes.find(n =>
                    n.name === target ||
                    n.name.replace(".md", "") === target ||
                    (n.id && n.id === target) ||
                    n.aliases.includes(target)
                );
                if (targetNode) validLinkTargets.add(targetNode.path);
            } else {
                // Ignore external/templates for now?
                if (!target.startsWith("http")) {
                    report.brokenLinks.push({ source: node.path, target: link });
                }
            }
        }
    }

    // 3. Check Orphans (Audit mostly)
    // Notes in 10_Narrative and 20_Game_Design should likely not be orphans?
    for (const node of nodes) {
        if (node.path.includes("00_Map_Room")) continue; // Entry points are naturally orphans or roots
        if (!validLinkTargets.has(node.path)) {
            // Double check aliases/id
            const isLinkedViaId = node.id && validLinkTargets.has(node.id);
            const isLinkedViaName = validLinkTargets.has(node.name) || validLinkTargets.has(node.name.replace(".md", ""));
            const isLinkedViaAlias = node.aliases.some(a => validLinkTargets.has(a));

            if (!isLinkedViaId && !isLinkedViaName && !isLinkedViaAlias) {
                report.orphans.push(node.path);
            }
        }
    }

    // --- Output ---
    console.log("\n📊 Validation Report");
    console.log("====================");

    if (report.missingIds.length > 0) {
        console.log(`\n❌ Missing IDs (${report.missingIds.length}):`);
        report.missingIds.forEach(p => console.log(`  - ${p}`));
    }

    if (report.brokenLinks.length > 0) {
        console.log(`\n🔗 Broken Links (${report.brokenLinks.length}):`);
        report.brokenLinks.forEach(l => console.log(`  - ${l.source} -> [[${l.target}]]`));
    }

    if (report.orphans.length > 0 && isReport) {
        console.log(`\n👻 Orphans (Potential):`);
        report.orphans.slice(0, 10).forEach(p => console.log(`  - ${p}`));
        if (report.orphans.length > 10) console.log(`  ... and ${report.orphans.length - 10} more.`);
    }

    const errorCount = report.missingIds.length + report.brokenLinks.length;
    console.log(`\nTotal Errors: ${errorCount}`);

    if (isStrict && errorCount > 0) {
        console.error("Strict mode enabled. Exiting with error.");
        process.exit(1);
    }
}

// --- Helpers ---

async function getAllMarkdownFiles(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const res = join(dir, entry.name);
        if (entry.isDirectory()) {
            return await getAllMarkdownFiles(res);
        } else {
            return res.endsWith(".md") ? [res] : [];
        }
    }));
    return files.flat();
}

async function parseFile(filePath: string): Promise<FileNode> {
    const content = await readFile(filePath, "utf-8");
    const relativePath = relative(process.cwd(), filePath).replace(/\\/g, "/"); // Normalize

    // Frontmatter parsing (simple regex)
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let id: string | undefined;
    let aliases: string[] = [];

    if (fmMatch) {
        const fm = fmMatch[1];
        const idMatch = fm.match(/^id:\s*(.*)$/m);
        if (idMatch) id = idMatch[1].trim();

        const aliasMatch = fm.match(/^aliases:\s*\n((?:[ \t]*-\s*.*\n?)+)/m);
        if (aliasMatch) {
            aliases = aliasMatch[1].split("\n")
                .map(l => l.replace(/^[ \t]*-\s*/, "").trim())
                .filter(Boolean);
        }
        // Also check inline "aliases: [a, b]" format? Ignored for now based on style guide.
    }

    // WikiLink parsing
    const linkRegex = /\[\[(.*?)\]\]/g;
    const links: string[] = [];
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }

    return {
        path: relativePath, // validation uses relative paths roughly
        name: basename(filePath),
        id,
        aliases,
        links
    };
}

main().catch(console.error);
