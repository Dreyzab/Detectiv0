import { logger } from './logger';

export const fetchWithLog = async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]): Promise<Response> => {
    const url = input.toString();
    const method = init?.method || 'GET';
    const startTime = performance.now();

    try {
        logger.net(`Request: ${method} ${url}`, {
            method,
            url,
            // avoid logging full bodies for privacy/size, but could log size or keys
        });

        const response = await fetch(input, init);

        const duration = Math.round(performance.now() - startTime);
        logger.net(`Response: ${response.status} ${url} (${duration}ms)`, {
            status: response.status,
            duration,
            ok: response.ok
        });

        return response;
    } catch (error) {
        const duration = Math.round(performance.now() - startTime);
        logger.error(`Network Error: ${method} ${url}`, {
            error: error instanceof Error ? error.message : String(error),
            duration
        }, 'net');
        throw error;
    }
};
