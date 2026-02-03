import Redis from "ioredis";
import { config } from "../config";
import { logger } from "@repo/shared";

const redis = new Redis(config.env.REDIS_URL, {
    lazyConnect: true,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on("error", (err) => {
    logger.error("Redis connection error", { error: err.message });
});

redis.on("connect", () => {
    logger.info("Redis connected successfully");
});

export { redis };
