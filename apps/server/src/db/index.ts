import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.warn("⚠️ DATABASE_URL is not set. The server will likely fail to connect to the database.");
    console.warn("Please set DATABASE_URL in .env to a valid PostgreSQL connection string.");
}

// Robust logging/parsing to debug connection issues (e.g. IPv6 vs IPv4 pooler)
const clientConfig = { prepare: false };
if (databaseUrl) {
    try {
        const url = new URL(databaseUrl);
        console.log(`🔌 DB Config: Host=${url.hostname} Port=${url.port} User=${url.username} Path=${url.pathname}`);
        if (url.port === '6543') {
            console.log("✅ Detected Supavisor Pooler port (6543). Using Transaction Mode optimized settings.");
        }
    } catch (e) {
        console.warn("⚠️ Could not parse DATABASE_URL for logging:", e);
    }
}

// Disable prefetch to work better with serverless and proxies
const client = postgres(databaseUrl || "postgres://user:pass@localhost:5432/db", clientConfig);
export const db = drizzle(client, { schema });
