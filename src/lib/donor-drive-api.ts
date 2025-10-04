// Shared Donor Drive API utilities for server-side routes

// API Configuration
export const BASE_URL = 'https://www.extra-life.org/api';
export const API_VERSION = '1.3';
export const FIFTEEN_SECONDS = 15 * 1000;

// Server-side cache
const cache = new Map<string, { data: unknown; timestamp: number; etag?: string }>();
const rateLimitMap = new Map<
  string,
  { blockedUntil: number; requestCount: number; windowStart: number }
>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

export function withVersion(path: string): string {
  return `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}version=${API_VERSION}`;
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const rateLimit = rateLimitMap.get(key);

  if (!rateLimit) {
    rateLimitMap.set(key, {
      blockedUntil: 0,
      requestCount: 0,
      windowStart: now,
    });
    return false;
  }

  // Check if currently blocked
  if (now < rateLimit.blockedUntil) {
    return true;
  }

  // Reset window if needed
  if (now - rateLimit.windowStart > RATE_LIMIT_WINDOW) {
    rateLimit.requestCount = 0;
    rateLimit.windowStart = now;
  }

  // Increment request count
  rateLimit.requestCount++;

  // Check if we've exceeded the limit
  if (rateLimit.requestCount > MAX_REQUESTS_PER_WINDOW) {
    rateLimit.blockedUntil = now + BLOCK_DURATION;
    console.log(`Rate limiting ${key} until ${new Date(rateLimit.blockedUntil).toISOString()}`);
    return true;
  }

  return false;
}

export async function fetchWithCache<T>(
  key: string,
  url: string
): Promise<T | 'Rate limited' | 'Not modified'> {
  const now = Date.now();

  // Check rate limiting
  if (isRateLimited(key)) {
    return 'Rate limited';
  }

  // Check cache
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < FIFTEEN_SECONDS) {
    return cached.data as T;
  }

  try {
    const headers: HeadersInit = {};

    // Add ETag if we have one
    if (cached?.etag) {
      headers['If-None-Match'] = cached.etag;
    }

    const response = await fetch(url, { headers });

    // Handle rate limiting from Donor Drive
    if (response.status === 429) {
      // Block this key for 5 minutes
      const rateLimit = rateLimitMap.get(key);
      if (rateLimit) {
        rateLimit.blockedUntil = now + BLOCK_DURATION;
      }
      console.log(`Donor Drive rate limited ${key}`);
      return 'Rate limited';
    }

    // Handle 304 Not Modified - return cached data
    if (response.status === 304) {
      console.log(`ETag match - data not modified for ${key}, returning cached data`);
      if (cached) {
        return cached.data as T;
      }
      return 'Not modified';
    }

    // Parse response
    const data = await response.json();
    const etag = response.headers.get('etag');

    // Update cache
    cache.set(key, {
      data,
      timestamp: now,
      etag: etag || undefined,
    });

    return data as T;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    throw error;
  }
}

// Clear cache functions for manual refresh
export function clearCache(): void {
  cache.clear();
}

export function clearRateLimit(): void {
  rateLimitMap.clear();
}

export function clearParticipantCache(participantId: string): void {
  const keysToDelete: string[] = [];
  for (const key of cache.keys()) {
    if (key.includes(participantId)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((key) => cache.delete(key));
}
