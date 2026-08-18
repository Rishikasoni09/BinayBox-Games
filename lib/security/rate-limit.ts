/**
 * Lightweight in-memory rate limiter for public Next.js API route handlers.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Max requests allowed in window
  windowMs?: number; // Time window in ms (default: 60s)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; reset: number } {
  const limit = options.limit ?? 60;
  const windowMs = options.windowMs ?? 60 * 1000;
  const now = Date.now();

  const record = ipStore.get(identifier);

  if (!record || now > record.resetTime) {
    ipStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}
