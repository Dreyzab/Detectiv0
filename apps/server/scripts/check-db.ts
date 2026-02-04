
import { db } from '../src/db';
import { sql } from 'drizzle-orm';
import { mapPoints, userMapPointStates } from '../src/db/schema';

async function check() {
    console.log("Checking DB connection...");
    try {
        const res = await db.execute(sql`SELECT 1 as res`);
        console.log("DB Connection SUCCESS");

        console.log("Checking map_points with raw SQL...");
        const pointsCount = await db.execute(sql`SELECT count(*) from map_points`);
        console.log("Raw count:", pointsCount);

        console.log("Checking map_points with ORM...");
        try {
            const points = await db.select().from(mapPoints).limit(1);
            console.log("ORM Select MapPoints Success. First item:", points[0] ? "Found" : "Empty");
        } catch (e) {
            console.error("ORM Select MapPoints FAILED:", (e as Error).message);
            console.error(e);
        }

        console.log("Listing all tables...");
        const tables = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        console.log("Tables found:", tables.map((t: any) => t.table_name));

    } catch (e) {
        console.error("DB Check FAILED:", (e as Error).message);
    }
    process.exit(0);
}

check();
