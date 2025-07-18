// Advanced caching service (memory + Redis)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const memoryCache = new Map<string, any>();

export async function getCache(key: string): Promise<any> {
  if (memoryCache.has(key)) return memoryCache.get(key);
  const redisValue = await redis.get(key);
  if (redisValue) {
    memoryCache.set(key, JSON.parse(redisValue));
    return JSON.parse(redisValue);
  }
  return null;
}

export async function setCache(key: string, value: any, ttl = 60): Promise<void> {
  memoryCache.set(key, value);
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}
