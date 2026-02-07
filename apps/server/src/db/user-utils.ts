import { db } from './index';
import { users } from './schema';

const toSafeUsername = (userId: string): string => {
    const normalized = userId
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 32);

    if (normalized.length > 0) {
        return normalized;
    }

    return `user_${Date.now()}`;
};

export const ensureUserExists = async (userId: string): Promise<void> => {
    const trimmed = userId.trim();
    if (!trimmed) return;

    await db.insert(users).values({
        id: trimmed,
        username: toSafeUsername(trimmed),
        email: null,
        createdAt: new Date()
    }).onConflictDoNothing({
        target: users.id
    });
};
