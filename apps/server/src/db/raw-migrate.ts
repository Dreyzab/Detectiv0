
import postgres from "postgres";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL!;
console.log("Connecting to DB (Raw SQL Mode)...", connectionString.replace(/:[^:@]+@/, ':***@'));

const client = postgres(connectionString, {
    max: 1,
    prepare: false, // Critical for PgBouncer
});

async function run() {
    try {
        const sqlPath = path.join(import.meta.dir, "../drizzle/0000_perpetual_robin_chapel.sql");
        const sqlContent = fs.readFileSync(sqlPath, "utf-8");

        console.log("Reading SQL file:", sqlPath);
        // Split by semi-colon if needed, but postgres.js usually handles multi-statement query
        // However, robust migrations usually run statement by statement or in one transaction block

        console.log("Executing SQL...");
        await client.unsafe(sqlContent);

        console.log("✅ Migration SUCCESS!");
    } catch (e) {
        console.error("❌ Migration FAILED:", e);
    } finally {
        await client.end();
    }
}

run();
