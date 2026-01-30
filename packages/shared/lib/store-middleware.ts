import type { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { logger } from './logger';

export type LoggerMiddleware = <
    T,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
    f: StateCreator<T, Mps, Mcs>,
    name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
    f: StateCreator<T, [], []>,
    name?: string
) => StateCreator<T, [], []>;

const logMiddlewareImpl: LoggerImpl = (f, name) => (set, get, api) => {
    const loggedSet: typeof set = (...a) => {
        // @ts-ignore - spread args is safe here but types are strict
        set(...(a as Parameters<typeof set>));
        const state = get();
        logger.store(`Action in ${name || 'Store'}`, {
            newState: state
        });
    };
    api.setState = loggedSet;

    return f(loggedSet, get, api);
};

export const logMiddleware = logMiddlewareImpl as unknown as LoggerMiddleware;
