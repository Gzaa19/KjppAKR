import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Redis is configured
const isRedisConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Only create rate limiters if Redis is configured
export const loginRateLimit = isRedisConfigured
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
        analytics: true,
        prefix: "ratelimit:login",
    })
    : null;

export const apiRateLimit = isRedisConfigured
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
        analytics: true,
        prefix: "ratelimit:api",
    })
    : null;

// Helper function to check rate limit
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ success: boolean }> {
    // If no limiter configured (dev mode), always allow
    if (!limiter) {
        return { success: true };
    }

    // Otherwise use actual rate limiter
    return await limiter.limit(identifier);
}
