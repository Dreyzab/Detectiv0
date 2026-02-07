import type {
    ApplyProgressionRequest,
    ApplyProgressionResponse,
    CaseAdvanceRequest,
    CaseAdvanceResponse,
    DiscoverEvidenceRequest,
    DiscoverEvidenceResponse,
    MapPointsQuery,
    MapPointsResponse,
    ResolveCodeResponse,
    TimeTickRequest,
    TimeTickResponse,
    TravelCompleteResponse,
    TravelStartRequest,
    TravelStartResponse,
    WorldSnapshotResponse
} from '@repo/contracts';

export interface ApiError {
    status: number;
    message: string;
}

interface ApiResult<T> {
    data: T | null;
    error: ApiError | null;
}

type HttpMethod = 'GET' | 'POST';

interface RequestOptions<TBody> {
    method?: HttpMethod;
    query?: Record<string, string | undefined>;
    body?: TBody;
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

const requestJson = async <TResponse, TBody = undefined>(
    path: string,
    options: RequestOptions<TBody> = {}
): Promise<ApiResult<TResponse>> => {
    const {
        method = 'GET',
        query,
        body
    } = options;
    const url = `${API_BASE_URL}${path}${toQueryString(query)}`;

    try {
        const headers: Record<string, string> = {
            'Accept': 'application/json'
        };

        if (method !== 'GET' && body !== undefined) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            method,
            headers,
            body: method !== 'GET' && body !== undefined
                ? JSON.stringify(body)
                : undefined
        });

        const contentType = response.headers.get('content-type') ?? '';
        const isJson = contentType.includes('application/json');
        const payload = isJson ? await response.json() as TResponse : null;

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
                    query: {
                        packId: query?.packId,
                        caseId: query?.caseId
                    }
                })
        },
        'resolve-code': ({ code }: { code: string }) => ({
            get: async (): Promise<ApiResult<ResolveCodeResponse>> =>
                requestJson<ResolveCodeResponse>(`/map/resolve-code/${encodeURIComponent(code)}`)
        })
    },
    engine: {
        world: {
            get: async ({ query }: { query?: { caseId?: string } } = {}): Promise<ApiResult<WorldSnapshotResponse>> =>
                requestJson<WorldSnapshotResponse>('/engine/world', {
                    query: { caseId: query?.caseId }
                })
        },
        time: {
            tick: {
                post: async ({ body }: { body: TimeTickRequest }): Promise<ApiResult<TimeTickResponse>> =>
                    requestJson<TimeTickResponse, TimeTickRequest>('/engine/time/tick', {
                        method: 'POST',
                        body
                    })
            }
        },
        travel: {
            start: {
                post: async ({ body }: { body: TravelStartRequest }): Promise<ApiResult<TravelStartResponse>> =>
                    requestJson<TravelStartResponse, TravelStartRequest>('/engine/travel/start', {
                        method: 'POST',
                        body
                    })
            },
            complete: ({ sessionId }: { sessionId: string }) => ({
                post: async (): Promise<ApiResult<TravelCompleteResponse>> =>
                    requestJson<TravelCompleteResponse>(`/engine/travel/complete/${encodeURIComponent(sessionId)}`, {
                        method: 'POST'
                    })
            })
        },
        case: {
            advance: {
                post: async ({ body }: { body: CaseAdvanceRequest }): Promise<ApiResult<CaseAdvanceResponse>> =>
                    requestJson<CaseAdvanceResponse, CaseAdvanceRequest>('/engine/case/advance', {
                        method: 'POST',
                        body
                    })
            }
        },
        progress: {
            apply: {
                post: async ({ body }: { body: ApplyProgressionRequest }): Promise<ApiResult<ApplyProgressionResponse>> =>
                    requestJson<ApplyProgressionResponse, ApplyProgressionRequest>('/engine/progress/apply', {
                        method: 'POST',
                        body
                    })
            }
        },
        evidence: {
            discover: {
                post: async ({ body }: { body: DiscoverEvidenceRequest }): Promise<ApiResult<DiscoverEvidenceResponse>> =>
                    requestJson<DiscoverEvidenceResponse, DiscoverEvidenceRequest>('/engine/evidence/discover', {
                        method: 'POST',
                        body
                    })
            }
        }
    }
};
