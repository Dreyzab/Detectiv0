import type { MapAction, MapPoint, PointStateEnum } from '@repo/shared';

export interface MapPointsQuery {
    packId?: string;
    caseId?: string;
}

export interface MapPointsResponse {
    points: MapPoint[];
    userStates: Record<string, PointStateEnum>;
    error?: string;
    details?: string;
    stack?: string;
}

export interface ResolveCodeEventResponse {
    success: true;
    type: 'event';
    actions: MapAction[];
}

export interface ResolveCodeMapPointResponse {
    success: true;
    type: 'map_point';
    pointId: string;
    actions: MapAction[];
}

export interface ResolveCodeErrorResponse {
    success: false;
    error: string;
}

export type ResolveCodeResponse =
    | ResolveCodeEventResponse
    | ResolveCodeMapPointResponse
    | ResolveCodeErrorResponse;
