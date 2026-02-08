import { db } from './src/db';
import { sql } from 'drizzle-orm';

const run = async () => {
    try {
        console.log('Adding missing columns to map_points...');
        await db.execute(sql`ALTER TABLE map_points ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'case'`);
        await db.execute(sql`ALTER TABLE map_points ADD COLUMN IF NOT EXISTS retention_policy text NOT NULL DEFAULT 'temporary'`);
        await db.execute(sql`ALTER TABLE map_points ADD COLUMN IF NOT EXISTS default_state text NOT NULL DEFAULT 'locked'`);
        await db.execute(sql`ALTER TABLE map_points ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true`);
        console.log('Success.');
    } catch (e) {
        console.error('Failed:', e);
    }
};

run();
