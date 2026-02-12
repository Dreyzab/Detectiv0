import { beforeEach, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import type { MapAction } from '@repo/shared/lib/detective_map_types';
import {
    createMapModule,
    type EventCodeRow,
    type MapPointRow,
    type MapRepository,
    type UpsertUserPointStateInput,
    type UserPointStateRow
} from '../../src/modules/map';

const BASE_URL = 'http://localhost:3000';
const DEMO_USER_ID = 'demo_user';

interface MockRepositoryContext {
    repo: MapRepository;
    points: MapPointRow[];
    states: UserPointStateRow[];
    eventCodes: EventCodeRow[];
    upserts: UpsertUserPointStateInput[];
    ensuredUsers: string[];
}

const createMockRepository = (): MockRepositoryContext => {
    const points: MapPointRow[] = [];
    const states: UserPointStateRow[] = [];
    const eventCodes: EventCodeRow[] = [];
    const upserts: UpsertUserPointStateInput[] = [];
    const ensuredUsers: string[] = [];

    const repo: MapRepository = {
        getPoints: async (packId) => {
            if (!packId) {
                return points;
            }
            return points.filter((point) => point.packId === packId);
        },
        getUserStates: async (userId) =>
            states.filter((state) => (state.userId ?? DEMO_USER_ID) === userId),
        getUserPointState: async (userId, pointId) =>
            states.find(
                (state) =>
                    (state.userId ?? DEMO_USER_ID) === userId &&
                    state.pointId === pointId
            ) ?? null,
        findActiveEventCode: async (code) =>
            eventCodes.find((eventCode) => eventCode.code === code && eventCode.active !== false) ?? null,
        findActivePointByQrCode: async (code) =>
            points.find((point) => point.qrCode === code && point.active !== false) ?? null,
        ensureUserExists: async (userId) => {
            ensuredUsers.push(userId);
        },
        upsertUserPointState: async (input) => {
            upserts.push(input);
            const idx = states.findIndex(
                (state) =>
                    (state.userId ?? DEMO_USER_ID) === input.userId &&
                    state.pointId === input.pointId
            );

            const nextState: UserPointStateRow = {
                userId: input.userId,
                pointId: input.pointId,
                state: input.state,
                persistentUnlock: input.persistentUnlock,
                unlockedByCaseId: input.unlockedByCaseId,
                data: input.data,
                meta: input.meta
            };

            if (idx >= 0) {
                states[idx] = nextState;
            } else {
                states.push(nextState);
            }
        }
    };

    return { repo, points, states, eventCodes, upserts, ensuredUsers };
};

describe('Map Module (Controlled Integration)', () => {
    let context: MockRepositoryContext;
    let app: { handle: (request: Request) => Promise<Response> };

    beforeEach(() => {
        context = createMockRepository();
        app = new Elysia().use(createMapModule(context.repo));
    });

    it('GET /map/points filters points by lifecycle rules and case', async () => {
        context.points.push(
            {
                id: 'p_global',
                packId: 'fbg1905',
                title: 'Global Point',
                lat: 0,
                lng: 0,
                category: 'INTEREST',
                bindings: [],
                scope: 'global',
                retentionPolicy: 'permanent',
                active: true
            },
            {
                id: 'p_case_01',
                packId: 'fbg1905',
                title: 'Case Point 01',
                lat: 0,
                lng: 0,
                category: 'QUEST',
                bindings: [],
                scope: 'case',
                caseId: 'case_01_bank',
                retentionPolicy: 'temporary',
                active: true
            },
            {
                id: 'p_case_02',
                packId: 'fbg1905',
                title: 'Case Point 02',
                lat: 0,
                lng: 0,
                category: 'QUEST',
                bindings: [],
                scope: 'case',
                caseId: 'case_02_other',
                retentionPolicy: 'temporary',
                active: true
            },
            {
                id: 'p_progression',
                packId: 'fbg1905',
                title: 'Progression Point',
                lat: 0,
                lng: 0,
                category: 'EVENT',
                bindings: [],
                scope: 'progression',
                caseId: 'case_01_bank',
                retentionPolicy: 'persistent_on_unlock',
                active: true
            },
            {
                id: 'p_inactive',
                packId: 'fbg1905',
                title: 'Inactive Point',
                lat: 0,
                lng: 0,
                category: 'EVENT',
                bindings: [],
                scope: 'global',
                retentionPolicy: 'permanent',
                active: false
            }
        );

        context.states.push({
            userId: DEMO_USER_ID,
            pointId: 'p_progression',
            state: 'visited',
            persistentUnlock: true
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/points?packId=fbg1905&caseId=case_01_bank`)
        );

        expect(response.status).toBe(200);
        const data = await response.json() as {
            points: Array<{ id: string }>;
            userStates: Record<string, string>;
        };

        const pointIds = data.points.map((point) => point.id).sort();
        expect(pointIds).toEqual(['p_case_01', 'p_global', 'p_progression']);
        expect(data.userStates.p_progression).toBe('visited');
        expect(context.ensuredUsers.includes(DEMO_USER_ID)).toBe(true);
    });

    it('GET /map/points uses x-user-id header when provided', async () => {
        context.points.push({
            id: 'p_global',
            packId: 'fbg1905',
            title: 'Global Point',
            lat: 0,
            lng: 0,
            category: 'INTEREST',
            bindings: [],
            scope: 'global',
            retentionPolicy: 'permanent',
            active: true
        });

        context.states.push(
            {
                userId: DEMO_USER_ID,
                pointId: 'p_global',
                state: 'locked',
                persistentUnlock: false
            },
            {
                userId: 'user_case_alt',
                pointId: 'p_global',
                state: 'visited',
                persistentUnlock: true
            }
        );

        const response = await app.handle(
            new Request(`${BASE_URL}/map/points?packId=fbg1905`, {
                headers: {
                    'x-user-id': 'user_case_alt'
                }
            })
        );

        expect(response.status).toBe(200);
        const data = await response.json() as {
            userStates: Record<string, string>;
        };

        expect(data.userStates.p_global).toBe('visited');
        expect(context.ensuredUsers.includes('user_case_alt')).toBe(true);
    });

    it('GET /map/points filters points by region radius when regionId is provided', async () => {
        context.points.push(
            {
                id: 'p_freiburg_near',
                packId: 'fbg1905',
                title: 'Near Freiburg Center',
                lat: 47.9962,
                lng: 7.8519,
                category: 'INTEREST',
                bindings: [],
                scope: 'global',
                retentionPolicy: 'permanent',
                active: true
            },
            {
                id: 'p_freiburg_far',
                packId: 'fbg1905',
                title: 'Far from Freiburg',
                lat: 49.0092,
                lng: 8.4037,
                category: 'INTEREST',
                bindings: [],
                scope: 'global',
                retentionPolicy: 'permanent',
                active: true
            }
        );

        const response = await app.handle(
            new Request(`${BASE_URL}/map/points?regionId=FREIBURG_1905`)
        );

        expect(response.status).toBe(200);
        const data = await response.json() as { points: Array<{ id: string }> };
        expect(data.points.map((point) => point.id)).toEqual(['p_freiburg_near']);
    });

    it('GET /map/points rejects conflicting packId and regionId', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/map/points?packId=ka1905&regionId=FREIBURG_1905`)
        );

        expect(response.status).toBe(400);
        const data = await response.json() as { error?: string };
        expect(data.error).toContain('conflicts');
    });

    it('GET /map/points rejects unknown regionId', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/map/points?regionId=UNKNOWN_REGION`)
        );

        expect(response.status).toBe(400);
        const data = await response.json() as { error?: string };
        expect(data.error).toContain('Unknown regionId');
    });

    it('POST /map/resolve-code returns event action without upsert', async () => {
        const eventActions: MapAction[] = [
            { type: 'add_flags', flags: ['case01_started'] }
        ];

        context.eventCodes.push({
            code: 'TEST_EVENT',
            actions: eventActions,
            active: true
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: 'TEST_EVENT' })
            })
        );

        expect(response.status).toBe(200);
        const data = await response.json() as {
            success: boolean;
            type: string;
            actions: MapAction[];
        };

        expect(data.success).toBe(true);
        expect(data.type).toBe('event');
        expect(data.actions).toEqual(eventActions);
        expect(context.upserts.length).toBe(0);
    });

    it('POST /map/resolve-code resolves map point and persists unlock lifecycle flags', async () => {
        context.points.push({
            id: 'p_case_unlock',
            packId: 'fbg1905',
            title: 'Unlock Point',
            lat: 0,
            lng: 0,
            category: 'CRIME_SCENE',
            qrCode: 'QR_CASE_UNLOCK',
            bindings: [
                {
                    id: 'qr_unlock',
                    trigger: 'qr_scan',
                    priority: 10,
                    actions: [{ type: 'unlock_point', pointId: 'p_case_unlock' }]
                }
            ],
            scope: 'progression',
            caseId: 'case_01_bank',
            retentionPolicy: 'persistent_on_unlock',
            active: true
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: 'QR_CASE_UNLOCK' })
            })
        );

        expect(response.status).toBe(200);
        const data = await response.json() as {
            success: boolean;
            type: string;
            pointId: string;
            actions: MapAction[];
        };

        expect(data.success).toBe(true);
        expect(data.type).toBe('map_point');
        expect(data.pointId).toBe('p_case_unlock');
        expect(data.actions[0]?.type).toBe('unlock_point');
        expect(context.upserts.length).toBe(1);
        expect(context.upserts[0]?.persistentUnlock).toBe(true);
        expect(context.upserts[0]?.unlockedByCaseId).toBe('case_01_bank');
    });

    it('POST /map/resolve-code keeps existing higher state (no downgrade)', async () => {
        context.points.push({
            id: 'p_case_unlock',
            packId: 'fbg1905',
            title: 'Unlock Point',
            lat: 0,
            lng: 0,
            category: 'CRIME_SCENE',
            qrCode: 'QR_CASE_UNLOCK',
            bindings: [],
            scope: 'progression',
            caseId: 'case_01_bank',
            retentionPolicy: 'persistent_on_unlock',
            active: true
        });
        context.states.push({
            userId: DEMO_USER_ID,
            pointId: 'p_case_unlock',
            state: 'visited',
            persistentUnlock: true
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: 'QR_CASE_UNLOCK' })
            })
        );

        expect(response.status).toBe(200);
        expect(context.upserts.length).toBe(1);
        expect(context.upserts[0]?.state).toBe('visited');
    });

    it('POST /map/resolve-code rejects invalid event action payload', async () => {
        context.eventCodes.push({
            code: 'TEST_BAD_EVENT',
            actions: [{ type: 'invalid_action' }],
            active: true
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: 'TEST_BAD_EVENT' })
            })
        );

        expect(response.status).toBe(500);
        const data = await response.json() as { success: boolean; error: string };
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid event configuration');
    });

    it('POST /map/resolve-code ignores inactive QR points', async () => {
        context.points.push({
            id: 'p_inactive_qr',
            packId: 'fbg1905',
            title: 'Inactive QR Point',
            lat: 0,
            lng: 0,
            category: 'EVENT',
            qrCode: 'QR_INACTIVE',
            bindings: [],
            scope: 'case',
            caseId: 'case_01_bank',
            retentionPolicy: 'temporary',
            active: false
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: 'QR_INACTIVE' })
            })
        );

        expect(response.status).toBe(404);
        const data = await response.json() as { success: boolean; error: string };
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid Code');
    });

    it('GET /map/resolve-code/:code returns 404 for unknown code', async () => {
        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code/UNKNOWN_CODE`)
        );

        expect(response.status).toBe(404);
        const data = await response.json() as { success: boolean; error: string };
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid Code');
    });

    it('GET /map/resolve-code/:code remains available as deprecated alias', async () => {
        context.eventCodes.push({
            code: 'TEST_EVENT',
            actions: [{ type: 'add_flags', flags: ['case01_started'] }],
            active: true
        });

        const response = await app.handle(
            new Request(`${BASE_URL}/map/resolve-code/TEST_EVENT`)
        );

        expect(response.status).toBe(200);
        const data = await response.json() as {
            success: boolean;
            type: string;
            actions: MapAction[];
        };
        expect(data.success).toBe(true);
        expect(data.type).toBe('event');
        expect(data.actions.length).toBe(1);
    });
});
