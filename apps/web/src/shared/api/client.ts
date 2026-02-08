import type {
    ApplyProgressionRequest,
    ApplyProgressionResponse,
    CaseAdvanceRequest,
    CaseAdvanceResponse,
    DossierSnapshotResponse,
    DiscoverEvidenceRequest,
    DiscoverEvidenceResponse,
    MapPointsQuery,
    MapPointsResponse,
    InventorySnapshotResponse,
    ResolveCodeResponse,
    SaveDossierSnapshotRequest,
    SaveDossierSnapshotResponse,
    QuestSnapshotResponse,
    SaveInventorySnapshotRequest,
    SaveInventorySnapshotResponse,
    SaveQuestSnapshotRequest,
    SaveQuestSnapshotResponse,
    TimeTickRequest,
    TimeTickResponse,
    TravelCompleteResponse,
    TravelStartRequest,
    TravelStartResponse,
    WorldSnapshotResponse
} from '@repo/contracts';
import { API_BASE_URL } from './baseUrl';

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
        if (!isJson) {
            return {
                data: null,
                error: {
                    status: response.status,
                    message: `Expected JSON response but received '${contentType || 'unknown'}'`
                }
            };
        }

        const payload = await response.json() as TResponse;

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
    },
    inventory: {
        snapshot: {
            get: async (): Promise<ApiResult<InventorySnapshotResponse>> =>
                requestJson<InventorySnapshotResponse>('/inventory/snapshot'),
            post: async ({ body }: { body: SaveInventorySnapshotRequest }): Promise<ApiResult<SaveInventorySnapshotResponse>> =>
                requestJson<SaveInventorySnapshotResponse, SaveInventorySnapshotRequest>('/inventory/snapshot', {
                    method: 'POST',
                    body
                })
        }
    },
    quests: {
        snapshot: {
            get: async (): Promise<ApiResult<QuestSnapshotResponse>> =>
                requestJson<QuestSnapshotResponse>('/quests/snapshot'),
            post: async ({ body }: { body: SaveQuestSnapshotRequest }): Promise<ApiResult<SaveQuestSnapshotResponse>> =>
                requestJson<SaveQuestSnapshotResponse, SaveQuestSnapshotRequest>('/quests/snapshot', {
                    method: 'POST',
                    body
                })
        }
    },
    dossier: {
        snapshot: {
            get: async (): Promise<ApiResult<DossierSnapshotResponse>> =>
                requestJson<DossierSnapshotResponse>('/dossier/snapshot'),
            post: async ({ body }: { body: SaveDossierSnapshotRequest }): Promise<ApiResult<SaveDossierSnapshotResponse>> =>
                requestJson<SaveDossierSnapshotResponse, SaveDossierSnapshotRequest>('/dossier/snapshot', {
                    method: 'POST',
                    body
                })
        }
    }
};
