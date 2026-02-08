const DEFAULT_LOCAL_API_URL = 'http://localhost:3000';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const isHttpUrl = (value: string): boolean => {
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

const isLoopbackHost = (host: string): boolean => {
    const normalized = host.toLowerCase();
    return normalized === 'localhost'
        || normalized === '127.0.0.1'
        || normalized === '::1'
        || normalized.endsWith('.localhost');
};

const isUnsafeLoopbackForCurrentOrigin = (candidateBaseUrl: string): boolean => {
    if (import.meta.env.DEV) {
        return false;
    }

    if (typeof window === 'undefined' || typeof window.location?.origin !== 'string') {
        return false;
    }

    try {
        const candidateHost = new URL(candidateBaseUrl).hostname;
        const appHost = new URL(window.location.origin).hostname;
        return isLoopbackHost(candidateHost) && !isLoopbackHost(appHost);
    } catch {
        return false;
    }
};

const readConfiguredBaseUrl = (): string | null => {
    const configured = import.meta.env.VITE_API_BASE_URL?.trim()
        || import.meta.env.VITE_API_URL?.trim();

    if (!configured) {
        return null;
    }

    if (!isHttpUrl(configured)) {
        return null;
    }

    return trimTrailingSlash(configured);
};

export const resolveApiBaseUrl = (): string => {
    const configuredBaseUrl = readConfiguredBaseUrl();
    if (configuredBaseUrl && !isUnsafeLoopbackForCurrentOrigin(configuredBaseUrl)) {
        return trimTrailingSlash(configuredBaseUrl);
    }

    if (import.meta.env.DEV) {
        return DEFAULT_LOCAL_API_URL;
    }

    if (typeof window !== 'undefined' && typeof window.location?.origin === 'string' && window.location.origin.length > 0) {
        return trimTrailingSlash(window.location.origin);
    }

    return DEFAULT_LOCAL_API_URL;
};

export const API_BASE_URL = resolveApiBaseUrl();
