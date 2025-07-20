# Caching

## Purpose of This Document

This document outlines the caching strategies and implementations used throughout the sentiment analysis platform to optimize performance and reduce external API calls.

## Caching Strategy

The application employs multiple caching layers to optimize different types of data access and reduce latency for frequently accessed information.

## In-Memory Caching

### Provider Cache

- **Location**: `packages/services/src/providers/providers.service.ts`
- **Purpose**: Cache social media provider metadata to avoid repeated database queries
- **Implementation**: Map-based cache with TTL expiration
- **TTL**: 5 minutes (300 seconds)
- **Cache Key Pattern**: `name:{normalizedProviderName}`

### Cache Management

- **Expiry Handling**: Automatic cache invalidation based on TTL timestamps
- **Cache Cleanup**: Expired entries automatically removed on access attempts
- **Memory Management**: Map-based storage with automatic garbage collection

## Cache Patterns

### Read-Through Caching

- Check cache first before database queries
- Populate cache on cache misses
- Consistent cache key generation for predictable lookups

### Cache-Aside Pattern

- Application manages cache population and invalidation
- Database remains the authoritative data source
- Cache serves as a performance optimization layer

## Performance Optimizations

### Database Query Reduction

- Provider lookups cached to reduce database load
- Frequently accessed metadata stored in memory
- Cache hit logging for performance monitoring

### API Rate Limiting Support

- Caching helps stay within external API rate limits
- Reduced calls to Reddit, YouTube, and other external services
- Cached responses for repeated requests

## Implementation Details

### Cache Structure

```typescript
private providerCache = new Map<string, Provider>();
private cacheExpiry = new Map<string, number>();
private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

### Cache Operations

- **Set**: Store data with expiration timestamp
- **Get**: Retrieve data with automatic expiry checking
- **Invalidate**: Remove expired entries during access

## Future Caching Opportunities

While the current implementation uses in-memory caching, the architecture could be extended to support:

- Redis for distributed caching across multiple instances
- Database query result caching for expensive analytics queries
- API response caching for external service calls
- User session data caching for improved authentication performance

## Monitoring and Debugging

- Cache hit/miss logging for performance analysis
- Console logging for cache operations during development
- Cache statistics could be exposed for monitoring dashboards
