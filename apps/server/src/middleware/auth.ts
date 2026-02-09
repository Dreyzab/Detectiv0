import { Elysia } from 'elysia';
import { clerkPlugin } from 'elysia-clerk';

const resolveClerkPublishableKey = (): string => {
    const fromServerEnv = process.env.CLERK_PUBLISHABLE_KEY?.trim();
    if (fromServerEnv) {
        return fromServerEnv;
    }

    const fromClientEnv = process.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
    if (fromClientEnv) {
        return fromClientEnv;
    }

    return '';
};

const publishableKey = resolveClerkPublishableKey();

// In production we allow running without Clerk credentials.
// Routes already resolve a fallback demo user id when auth is unavailable.
export const authModule = publishableKey
    ? clerkPlugin({ publishableKey })
    : new Elysia({ name: 'auth-disabled' });

// Usage example for protected routes:
// app.use(authModule).get("/protected", ({ auth }) => { ... })
