import type { MapPointsQuery, MapPointsResponse, ResolveCodeResponse } from '@repo/contracts';

export interface ApiError {
    status: number;
    message: string;
}

interface ApiResult<T> {
    data: T | null;
    error: ApiError | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const toQueryString = (query?: Record<string, string | undefined>): string => {
    if (!query) {
        return '';
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
            params.set(key, value);
        }
    }

    const serialized = params.toString();
    return serialized ? `?${serialized}` : '';
};

const requestJson = async <T>(path: string, query?: Record<string, string | undefined>): Promise<ApiResult<T>> => {
    const url = `${API_BASE_URL}${path}${toQueryString(query)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const contentType = response.headers.get('content-type') ?? '';
        const isJson = contentType.includes('application/json');
        const payload = isJson ? await response.json() as T : null;

        if (!response.ok) {
            return {
                data: payload,
                error: {
                    status: response.status,
                    message: `Request failed: ${response.status}`
                }
            };
        }

        return {
            data: payload,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: {
                status: 0,
                message: error instanceof Error ? error.message : 'Network error'
            }
        };
    }
};

/**
 * Contract-driven API client.
 * This client intentionally avoids direct imports from server source code.
 */
export const api = {
    map: {
        points: {
            get: async ({ query }: { query?: MapPointsQuery } = {}): Promise<ApiResult<MapPointsResponse>> =>
                requestJson<MapPointsResponse>('/map/points', {
                    packId: query?.packId,
                    caseId: query?.caseId
                })
        },
        'resolve-code': ({ code }: { code: string }) => ({
            get: async (): Promise<ApiResult<ResolveCodeResponse>> =>
                requestJson<ResolveCodeResponse>(`/map/resolve-code/${encodeURIComponent(code)}`)
        })
    }
};
