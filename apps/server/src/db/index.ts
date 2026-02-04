import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
console.log("🔌 Initializing DB with URL:", databaseUrl ? databaseUrl.replace(/:[^:@]+@/, ':***@') : "UNDEFINED");

if (!databaseUrl) {
    console.warn("⚠️ DATABASE_URL is not set. The server will likely fail to connect to the database.");
    console.warn("Please set DATABASE_URL in .env to a valid PostgreSQL connection string.");
}

// Disable prefetch to work better with serverless and proxies
const client = postgres(databaseUrl || "postgres://user:pass@localhost:5432/db", { prepare: false });
export const db = drizzle(client, { schema });
