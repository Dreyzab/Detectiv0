import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
console.log("Connecting to migration DB...", connectionString.replace(/:[^:@]+@/, ':***@'));

// Use max: 1 for migrations to avoid connection limits
const client = postgres(connectionString, { max: 1, ssl: { rejectUnauthorized: false } });
const db = drizzle(client);

console.log("Running migrations...");
try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations complete!");
} catch (e) {
    console.error("Migration failed:", e);
} finally {
    await client.end();
}
process.exit(0);
