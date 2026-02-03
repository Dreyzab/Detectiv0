import { describe, expect, it, beforeAll, afterAll } from 'bun:test';
import { Database } from 'bun:sqlite';

// Set test DB before importing app (which initializes db)
process.env.DATABASE_URL = "test.db";

import { app } from '../../src/index';

const BASE_URL = 'http://localhost:3000';

const setupTestDb = () => {
    console.log("Setting up Test DB...");
    const db = new Database("test.db");
    // Create tables manually to match schema (simplified for test)
    db.run(`CREATE TABLE IF NOT EXISTS map_points (
        id TEXT PRIMARY KEY,
        packId TEXT NOT NULL,
        title TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        qr_code TEXT,
        bindings TEXT NOT NULL,
        data TEXT,
        schema_version INTEGER DEFAULT 1
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_map_point_user_states (
        user_id TEXT NOT NULL,
        point_id TEXT NOT NULL,
        state TEXT NOT NULL,
        data TEXT,
        PRIMARY KEY (user_id, point_id)
    )`);

    // Seed mock data
    db.run(`DELETE FROM map_points`);
    db.run(`DELETE FROM user_map_point_user_states`);

    db.run(`INSERT INTO map_points (id, packId, title, lat, lng, qr_code, bindings) VALUES 
        ('p1', 'test_pack', 'Test Point', 0, 0, 'TEST_QR_123', '${JSON.stringify([{ trigger: 'qr_scan', actions: [{ type: 'unlock_point', pointId: 'p1' }] }])}')
    `);
    console.log("DB Setup Complete");

    return db;
};

describe('Map Module', () => {
    beforeAll(() => {
        setupTestDb();
    });

    it('GET /map/points returns points list', async () => {
        console.log("Testing GET /map/points");
        const response = await app.handle(
            new Request(`${BASE_URL}/map/points`)
        );
        console.log("GET Response status:", response.status);
        expect(response.status).toBe(200);
        const data = await response.json() as any;
        console.log("GET Response data keys:", Object.keys(data));
        expect(data).toHaveProperty('points');
        expect(data.points).toBeInstanceOf(Array);
        expect(data.points.length).toBeGreaterThan(0);
        expect(data.points[0].id).toBe('p1');
    });

    it('POST /map/activate-qr handles valid code', async () => {
        console.log("Testing POST /map/activate-qr");
        const response = await app.handle(
            new Request(`${BASE_URL}/map/activate-qr`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: 'TEST_QR_123' })
            })
        );
        console.log("POST Valid Response status:", response.status);
        if (response.status !== 200) {
            const text = await response.text();
            console.log("POST Valid Response Body:", text);
        }

        expect(response.status).toBe(200);
        const data = await response.json() as any;

        expect(data.success).toBe(true);
        expect(data.pointId).toBe('p1');
        // Check state update
        const db = new Database("test.db");
        const state = db.query(`SELECT * FROM user_map_point_user_states WHERE point_id = 'p1' AND user_id = 'demo_user'`).get() as any;
        console.log("DB Verification State:", state);
        expect(state).toBeTruthy();
        expect(state.state).toBe('discovered');
    });

    it('POST /map/activate-qr handles invalid code', async () => {
        console.log("Testing POST /map/activate-qr INVALID");
        const response = await app.handle(
            new Request(`${BASE_URL}/map/activate-qr`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: 'INVALID_CODE' })
            })
        );
        console.log("POST Invalid Response status:", response.status);

        expect(response.status).toBe(404);
    });
});
