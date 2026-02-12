import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'apps', 'web', 'public');
const BACKUP_DIR = path.join(process.cwd(), '../..', 'assets_backup'); // Root/assets_backup

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const TARGET_DIRS = [
    path.join(PUBLIC_DIR, 'images', 'characters'),
    path.join(PUBLIC_DIR, 'images', 'scenarios'),
    path.join(PUBLIC_DIR, 'images', 'detective'),
    path.join(PUBLIC_DIR, 'images', 'regions'),
];

async function processFile(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;

    const relativePath = path.relative(PUBLIC_DIR, filePath);
    const backupPath = path.join(BACKUP_DIR, relativePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    // Backup
    fs.copyFileSync(filePath, backupPath);

    const newFilePath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    try {
        await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(newFilePath);

        console.log(`Optimized: ${relativePath} -> ${path.basename(newFilePath)}`);

        // Delete original
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

async function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            await walkDir(filePath);
        } else {
            await processFile(filePath);
        }
    }
}

async function main() {
    console.log('Starting optimization...');
    for (const dir of TARGET_DIRS) {
        if (fs.existsSync(dir)) {
            await walkDir(dir);
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    }
    console.log('Done!');
}

main();
