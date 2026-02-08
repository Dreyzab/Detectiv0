const DEFAULT_LOCAL_API_URL = 'http://localhost:3000';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

export const resolveApiBaseUrl = (): string => {
    const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
    if (configuredBaseUrl) {
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
