
import { Client } from 'pg';

const connectionString = "postgres://postgres.oumuctqpkzcxakqzslef:Detective6684Qaz@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

async function check() {
    console.log("Connecting with pg...", connectionString.replace(/:[^:@]+@/, ':***@'));
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
