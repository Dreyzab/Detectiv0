
import { CASE_01_POINTS } from './apps/server/src/scripts/data/case_01_points';
import fs from 'fs';

const mapCategory = (type: string) => {
    switch (type) {
        case 'crime': return 'CRIME_SCENE';
        case 'support': return 'NPC';
        case 'bureau': return 'QUEST';
        case 'interest': return 'INTEREST';
        default: return 'INTEREST';
    }
};

const mapBinding = (b: any) => {
    const conditions = b.conditions || (b.condition ? [b.condition] : []);
    return {
        id: b.id,
        trigger: b.trigger,
        label: b.label,
        priority: b.priority || 0,
        conditions: conditions.length > 0 ? conditions : undefined,
        actions: b.actions
    };
};

let sql = `-- SEED DATA FOR SUPABASE SQL EDITOR\n\n`;

// 1. Quests
sql += `INSERT INTO "quests" ("id", "title", "description", "objectives", "completion_condition", "rewards") VALUES (\n`;
sql += `    'case01_act1',\n`;
sql += `    'Case 01: Shadows at the Bank - Act 1',\n`;
sql += `    'A mysterious robbery at Bankhaus J.A. Krebs. No witnesses, strange traces. Investigate the crime scene.',\n`;
sql += `    '[{"id":"inspect_safe","text":"Inspect the Vault","condition":{"type":"flag","flag":"EVIDENCE_SAFE_CRACKED"}},{"id":"interrogate_clerk","text":"Talk to the Teller","condition":{"type":"flag","flag":"INTERROGATION_CLERK_DONE"}}]',\n`;
sql += `    '{"type":"logic_and","conditions":[{"type":"flag","flag":"EVIDENCE_SAFE_CRACKED"},{"type":"flag","flag":"INTERROGATION_CLERK_DONE"}]}',\n`;
sql += `    '{"xp":150,"traits":["observant"]}'\n`;
sql += `) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, objectives = EXCLUDED.objectives, completion_condition = EXCLUDED.completion_condition, rewards = EXCLUDED.rewards;\n\n`;

// 2. Map Points
sql += `INSERT INTO "map_points" ("id", "packId", "title", "description", "lat", "lng", "category", "image", "qr_code", "bindings", "data", "schema_version") VALUES\n`;

const points = Object.values(CASE_01_POINTS);
const rows = points.map(p => {
    const category = mapCategory(p.type);
    const additionalData = p.voices ? { voices: p.voices } : null;
    const bindings = p.bindings.map(mapBinding);

    return `(` +
        `'${p.id}', ` +
        `'${p.packId}', ` +
        `'${p.title.replace(/'/g, "''")}', ` +
        `${p.description ? `'${p.description.replace(/'/g, "''")}'` : 'NULL'}, ` +
        `${p.lat}, ` +
        `${p.lng}, ` +
        `'${category}', ` +
        `${p.image ? `'${p.image}'` : 'NULL'}, ` +
        `NULL, ` +
        `'${JSON.stringify(bindings).replace(/'/g, "''")}', ` +
        `${additionalData ? `'${JSON.stringify(additionalData).replace(/'/g, "''")}'` : 'NULL'}, ` +
        `1` +
        `)`;
});

sql += rows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, lat = EXCLUDED.lat, lng = EXCLUDED.lng, category = EXCLUDED.category, image = EXCLUDED.image, bindings = EXCLUDED.bindings, data = EXCLUDED.data;\n`;

fs.writeFileSync('supabase_seed.sql', sql);
console.log('✅ Generated supabase_seed.sql');
