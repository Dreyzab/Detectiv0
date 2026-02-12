import { Elysia, t } from 'elysia';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { eventCodes, mapPoints, userMapPointStates } from '../db/schema';
import type { MapAction, MapPointBinding, PointStateEnum } from '@repo/shared/lib/detective_map_types';
import { MapActionSchema, MapPointBindingSchema, PointStateSchema } from '@repo/shared/lib/map-validators';
import { getRegionMeta, isRegionId, type RegionMeta } from '@repo/shared/data/regions';
import { resolveUserId } from '../lib/user-id';
import { ensureUserExists as ensureDbUserExists } from '../db/user-utils';

type PointScope = 'global' | 'case' | 'progression';
type PointRetentionPolicy = 'temporary' | 'persistent_on_unlock' | 'permanent';

export interface MapPointRow {
    id: string;
    packId: string;
    qrCode?: string | null;
    bindings: unknown;
    scope?: string | null;
    caseId?: string | null;
    retentionPolicy?: string | null;
    active?: boolean | null;
    [key: string]: unknown;
}

export interface UserPointStateRow {
    userId?: string;
    pointId: string;
    state: string;
    persistentUnlock?: boolean | null;
    unlockedByCaseId?: string | null;
    data?: unknown;
    meta?: unknown;
}

export interface EventCodeRow {
    code: string;
    actions: unknown;
    active?: boolean | null;
    description?: string | null;
}

export interface UpsertUserPointStateInput {
    userId: string;
    pointId: string;
    state: PointStateEnum;
    persistentUnlock: boolean;
    unlockedByCaseId: string | null;
    data: Record<string, unknown>;
    meta: Record<string, unknown>;
}

export interface MapRepository {
    getPoints: (packId?: string) => Promise<MapPointRow[]>;
    getUserStates: (userId: string) => Promise<UserPointStateRow[]>;
    getUserPointState: (userId: string, pointId: string) => Promise<UserPointStateRow | null>;
    findActiveEventCode: (code: string) => Promise<EventCodeRow | null>;
    findActivePointByQrCode: (code: string) => Promise<MapPointRow | null>;
    upsertUserPointState: (input: UpsertUserPointStateInput) => Promise<void>;
    ensureUserExists: (userId: string) => Promise<void>;
}

const POINT_STATE_PRIORITY: Record<PointStateEnum, number> = {
    locked: 0,
    discovered: 1,
    visited: 2,
    completed: 3
};

const keepMonotonicState = (
    currentState: PointStateEnum | null | undefined,
    requestedState: PointStateEnum
): PointStateEnum => {
    if (!currentState) {
        return requestedState;
    }

    return POINT_STATE_PRIORITY[currentState] >= POINT_STATE_PRIORITY[requestedState]
        ? currentState
        : requestedState;
};

const normalizeScope = (scope: string | null | undefined): PointScope => {
    if (scope === 'global' || scope === 'case' || scope === 'progression') {
        return scope;
    }
    return 'case';
};

const normalizeRetentionPolicy = (policy: string | null | undefined): PointRetentionPolicy => {
    if (policy === 'temporary' || policy === 'persistent_on_unlock' || policy === 'permanent') {
        return policy;
    }
    return 'temporary';
};

const toCoordinate = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return null;
};

const haversineDistanceKm = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number => {
    const toRadians = (value: number): number => value * (Math.PI / 180);
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

const parsePointBindings = (point: MapPointRow): MapPointBinding[] => {
    try {
        const rawBindings = typeof point.bindings === 'string'
            ? JSON.parse(point.bindings)
            : point.bindings;

        if (!Array.isArray(rawBindings)) {
            return [];
        }

        return rawBindings
            .map((rawBinding, index) => {
                const parsed = MapPointBindingSchema.safeParse(rawBinding);
                if (!parsed.success) {
                    console.warn(`Invalid binding at index ${index} for point '${point.id}', skipping`);
                    return null;
                }
                return parsed.data;
            })
            .filter((binding): binding is MapPointBinding => binding !== null);
    } catch (error) {
        console.error('Binding parse error', error);
        return [];
    }
};

const parseActions = (
    rawActions: unknown,
    sourceLabel: string
): MapAction[] | null => {
    try {
        const source = typeof rawActions === 'string'
            ? JSON.parse(rawActions)
            : rawActions;

        if (!Array.isArray(source)) {
            console.warn(`Invalid actions for '${sourceLabel}': expected array`);
            return null;
        }

        const actions: MapAction[] = [];
        for (let index = 0; index < source.length; index++) {
            const candidate = source[index];
            const parsed = MapActionSchema.safeParse(candidate);
            if (!parsed.success) {
                console.warn(`Invalid action at index ${index} for '${sourceLabel}', rejecting payload`);
                return null;
            }
            actions.push(parsed.data);
        }

        return actions;
    } catch (error) {
        console.warn(`Failed to parse actions for '${sourceLabel}'`, error);
        return null;
    }
};

const toStateMap = (states: UserPointStateRow[]): Record<string, PointStateEnum> => {
    const map: Record<string, PointStateEnum> = {};
    states.forEach((stateRow) => {
        const parsed = PointStateSchema.safeParse(stateRow.state);
        if (parsed.success) {
            map[stateRow.pointId] = parsed.data;
        } else {
            console.warn(`Invalid state '${stateRow.state}' for point '${stateRow.pointId}', skipping`);
        }
    });
    return map;
};

const filterVisiblePoints = (
    points: MapPointRow[],
    states: UserPointStateRow[],
    activeCaseId?: string
): MapPointRow[] => {
    const persistentUnlockedPointIds = new Set(
        states
            .filter((state) => state.persistentUnlock)
            .map((state) => state.pointId)
    );

    return points.filter((point) => {
        if (point.active === false) {
            return false;
        }

        const scope = normalizeScope(point.scope);
        const retentionPolicy = normalizeRetentionPolicy(point.retentionPolicy);

        if (scope === 'global') {
            return true;
        }

        if (scope === 'case') {
            // Preserve legacy behavior: if case is not specified, include case points.
            return !activeCaseId || point.caseId === activeCaseId;
        }

        // scope === 'progression'
        if (retentionPolicy === 'permanent') {
            return true;
        }

        if (persistentUnlockedPointIds.has(point.id)) {
            return true;
        }

        // If not yet unlocked permanently, point can still appear in active case context.
        return Boolean(activeCaseId && point.caseId === activeCaseId);
    });
};

const filterPointsByRegionRadius = (
    points: MapPointRow[],
    regionMeta: RegionMeta
): MapPointRow[] =>
    points.filter((point) => {
        const pointLat = toCoordinate(point.lat);
        const pointLng = toCoordinate(point.lng);
        if (pointLat === null || pointLng === null) {
            return false;
        }

        const distanceKm = haversineDistanceKm(
            pointLat,
            pointLng,
            regionMeta.geoCenterLat,
            regionMeta.geoCenterLng
        );

        return distanceKm <= regionMeta.radiusKm;
    });

export const createDrizzleMapRepository = (): MapRepository => ({
    getPoints: async (packId) =>
        db.select().from(mapPoints).where(packId ? eq(mapPoints.packId, packId) : undefined),

    getUserStates: async (userId) =>
        db.select().from(userMapPointStates).where(eq(userMapPointStates.userId, userId)),

    getUserPointState: async (userId, pointId) =>
        (await db.query.userMapPointStates.findFirst({
            where: and(
                eq(userMapPointStates.userId, userId),
                eq(userMapPointStates.pointId, pointId)
            )
        })) ?? null,

    findActiveEventCode: async (code) =>
        (await db.query.eventCodes.findFirst({
            where: and(eq(eventCodes.code, code), eq(eventCodes.active, true))
        })) ?? null,

    findActivePointByQrCode: async (code) =>
        (await db.query.mapPoints.findFirst({
            where: and(eq(mapPoints.qrCode, code), eq(mapPoints.active, true))
        })) ?? null,

    upsertUserPointState: async (input) => {
        await db.insert(userMapPointStates).values({
            userId: input.userId,
            pointId: input.pointId,
            state: input.state,
            persistentUnlock: input.persistentUnlock,
            unlockedByCaseId: input.unlockedByCaseId,
            data: input.data,
            meta: input.meta
        }).onConflictDoUpdate({
            target: [userMapPointStates.userId, userMapPointStates.pointId],
            set: {
                state: input.state,
                persistentUnlock: input.persistentUnlock,
                unlockedByCaseId: input.unlockedByCaseId,
                data: input.data,
                meta: input.meta
            }
        });
    },

    ensureUserExists: async (userId) => {
        await ensureDbUserExists(userId);
    }
});

export const createMapModule = (repository: MapRepository = createDrizzleMapRepository()) => {
    const resolveCodeResponseSchema = t.Object({
        success: t.Boolean(),
        type: t.Optional(t.Union([t.Literal('event'), t.Literal('map_point')])),
        pointId: t.Optional(t.String()),
        error: t.Optional(t.String()),
        actions: t.Optional(t.Array(t.Any()))
    });

    const resolveCode = async (
        codeRaw: string | undefined,
        context: {
            request: Request;
            set: { status?: number | string };
            auth?: (options?: unknown) => { userId?: string | null };
        }
    ) => {
        const code = typeof codeRaw === 'string' ? codeRaw.trim() : '';
        if (!code) {
            context.set.status = 400;
            return { success: false as const, error: 'Code is required' };
        }

        try {
            const userId = resolveUserId({
                request: context.request,
                auth: context.auth
            });
            await repository.ensureUserExists(userId);

            const eventCode = await repository.findActiveEventCode(code);
            if (eventCode) {
                const eventActions = parseActions(eventCode.actions, `event_code:${code}`);
                if (!eventActions) {
                    context.set.status = 500;
                    return { success: false as const, error: 'Invalid event configuration' };
                }

                return {
                    success: true as const,
                    type: 'event' as const,
                    actions: eventActions
                };
            }

            const point = await repository.findActivePointByQrCode(code);
            if (!point) {
                context.set.status = 404;
                return { success: false as const, error: 'Invalid Code' };
            }

            const existingStateRow = await repository.getUserPointState(userId, point.id);
            const parsedCurrentState = PointStateSchema.safeParse(existingStateRow?.state);
            const nextState = keepMonotonicState(
                parsedCurrentState.success ? parsedCurrentState.data : null,
                'discovered'
            );

            const retentionPolicy = normalizeRetentionPolicy(point.retentionPolicy);
            const shouldPersistUnlock =
                retentionPolicy === 'persistent_on_unlock' || retentionPolicy === 'permanent';
            const unlockMeta = { unlockedAt: Date.now(), source: 'resolve_code' };

            await repository.upsertUserPointState({
                userId,
                pointId: point.id,
                state: nextState,
                persistentUnlock: shouldPersistUnlock,
                unlockedByCaseId: shouldPersistUnlock ? (point.caseId ?? null) : null,
                data: unlockMeta,
                meta: unlockMeta
            });

            const bindings = parsePointBindings(point);
            const qrBinding = bindings.find((binding) => binding.trigger === 'qr_scan');
            const actions = qrBinding
                ? qrBinding.actions
                : [{ type: 'unlock_point', pointId: point.id } as MapAction];

            return {
                success: true as const,
                type: 'map_point' as const,
                pointId: point.id,
                actions
            };
        } catch (error) {
            const traceId = crypto.randomUUID();
            console.error(`[Map][${traceId}] Failed to resolve code`, error);
            context.set.status = 500;
            return {
                success: false as const,
                error: `Internal Server Error (traceId: ${traceId})`
            };
        }
    };

    return new Elysia({ prefix: '/map' })
        .get('/points', async (context) => {
            const { query, set, request } = context;
            try {
                const packIdFromQuery = typeof query.packId === 'string' ? query.packId : undefined;
                const activeCaseId = typeof query.caseId === 'string' ? query.caseId : undefined;
                const regionIdRaw = typeof query.regionId === 'string' ? query.regionId.trim() : undefined;

                let resolvedPackId = packIdFromQuery;
                let regionMeta: RegionMeta | null = null;
                if (regionIdRaw) {
                    if (!isRegionId(regionIdRaw)) {
                        set.status = 400;
                        return {
                            error: `Unknown regionId '${regionIdRaw}'`,
                            points: [],
                            userStates: {}
                        };
                    }

                    regionMeta = getRegionMeta(regionIdRaw);
                    if (packIdFromQuery && packIdFromQuery !== regionMeta.packId) {
                        set.status = 400;
                        return {
                            error: `packId '${packIdFromQuery}' conflicts with regionId '${regionIdRaw}'`,
                            points: [],
                            userStates: {}
                        };
                    }

                    resolvedPackId = packIdFromQuery ?? regionMeta.packId;
                }

                const userId = resolveUserId({
                    request,
                    auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
                });
                await repository.ensureUserExists(userId);

                const points = await repository.getPoints(resolvedPackId);
                const states = await repository.getUserStates(userId);

                const visiblePoints = filterVisiblePoints(points, states, activeCaseId);
                const regionFilteredPoints = regionMeta
                    ? filterPointsByRegionRadius(visiblePoints, regionMeta)
                    : visiblePoints;
                const stateMap = toStateMap(states);

                return { points: regionFilteredPoints, userStates: stateMap };
            } catch (error) {
                const traceId = crypto.randomUUID();
                console.error(`[Map][${traceId}] CRITICAL: Failed to fetch map points from repository`, error);
                set.status = 500;
                return {
                    error: 'Database connection failed',
                    traceId,
                    points: [],
                    userStates: {}
                };
            }
        })
        .post('/resolve-code', (context) =>
            resolveCode(context.body.code, {
                request: context.request,
                set: context.set,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            }), {
            body: t.Object({
                code: t.String()
            }),
            response: resolveCodeResponseSchema
        })
        .get('/resolve-code/:code', (context) =>
            resolveCode(context.params.code, {
                request: context.request,
                set: context.set,
                auth: (context as { auth?: (options?: unknown) => { userId?: string | null } }).auth
            }), {
            response: resolveCodeResponseSchema
        });
};

export const mapModule = createMapModule();
