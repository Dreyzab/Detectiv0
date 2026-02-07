export const FALLBACK_USER_ID = 'demo_user';

interface AuthState {
    userId?: string | null;
}

interface UserIdentityContext {
    request: Request;
    auth?: (options?: unknown) => AuthState | null | undefined;
}

const extractHeaderUserId = (request: Request): string | null => {
    const candidates = [
        request.headers.get('x-user-id'),
        request.headers.get('x-demo-user-id')
    ];

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim();
        }
    }

    return null;
};

export const resolveUserId = (context: UserIdentityContext): string => {
    try {
        if (typeof context.auth === 'function') {
            const userId = context.auth()?.userId;
            if (typeof userId === 'string' && userId.trim().length > 0) {
                return userId.trim();
            }
        }
    } catch {
        // Ignore auth resolution errors and fallback below.
    }

    const headerUserId = extractHeaderUserId(context.request);
    if (headerUserId) {
        return headerUserId;
    }

    return FALLBACK_USER_ID;
};
