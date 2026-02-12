import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'apps', 'web', 'src');

const TARGET_PATHS = [
    '/images/detective/',
    '/images/characters/',
    '/images/scenarios/',
    '/images/regions/'
];

function shouldProcess(filePath: string) {
    return filePath.endsWith('.ts') || filePath.endsWith('.tsx');
}

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    const regex = /(\/images\/(detective|characters|scenarios|regions)\/[a-zA-Z0-9_\-\.\/]+)\.png/g;

    if (regex.test(content)) {
        content = content.replace(regex, '$1.webp');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated refs in ${path.relative(SRC_DIR, filePath)}`);
    }
}

async function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            await walkDir(filePath);
        } else if (shouldProcess(filePath)) {
            processFile(filePath);
        }
    }
}

async function main() {
    console.log('Updating references...');
    if (fs.existsSync(SRC_DIR)) {
        await walkDir(SRC_DIR);
    }
    console.log('Done!');
}

main();
