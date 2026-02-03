import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().default("file:dev.db"),
    REDIS_URL: z.string().default("redis://localhost:6379"),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const config = {
    env: envSchema.parse(process.env),
};
