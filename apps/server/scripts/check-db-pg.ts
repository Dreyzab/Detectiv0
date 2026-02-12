
import 'dotenv/config';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in environment");
    process.exit(1);
}

async function check() {
    console.log("Connecting with pg...", connectionString!.replace(/:[^:@]+@/, ':***@'));
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected!");
        const res = await client.query('SELECT 1 as res');
        console.log("Query result:", res.rows);
        await client.end();
    } catch (e) {
        console.error("Connection failed:", e);
    }
}

check();
