# Redis Caching Implementation - Design Document

## Overview

This design implements a comprehensive Redis caching layer for the School Management System. The solution provides a generic caching service with specific implementations for user permissions, student/teacher data, and attendance records. The design emphasizes performance, reliability, and maintainability while ensuring graceful degradation when Redis is unavailable.

## Architecture

### High-Level Architecture

```
Mobile App → API Controller → Cache Service → Redis
                    ↓              ↓
                Database ←─────────┘
```

### Cache Strategy
- **Cache-Aside Pattern**: Application manages cache explicitly
- **Write-Through**: Updates go to both cache and database
- **TTL-Based Expiration**: Automatic cache invalidation
- **Graceful Degradation**: Fallback to database when Redis unavailable

## Components and Interfaces

### 1. Core Caching Interface

```csharp
public interface ICacheService
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class;
    Task RemoveAsync(string key);
    Task RemoveByPatternAsync(string pattern);
    Task<bool> ExistsAsync(string key);
    Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> getItem, TimeSpan? expiry = null) where T : class;
}
```

### 2. Cache Configuration

```csharp
public class CacheSettings
{
    public bool Enabled { get; set; } = true;
    public string ConnectionString { get; set; } = "localhost:6379";
    public TimeSpan DefaultTTL { get; set; } = TimeSpan.FromMinutes(30);
    public TimeSpan PermissionsTTL { get; set; } = TimeSpan.FromMinutes(15);
    public TimeSpan AttendanceTTL { get; set; } = TimeSpan.FromMinutes(10);
    public TimeSpan StudentDataTTL { get; set; } = TimeSpan.FromMinutes(30);
    public string KeyPrefix { get; set; } = "school_app";
}
```

### 3. Enhanced Permission Service

The existing PermissionService will be enhanced with caching:

```csharp
public class CachedPermissionService : IPermissionService
{
    private readonly IPermissionService _baseService;
    private readonly ICacheService _cache;
    
    // Cache user permissions with 15-minute TTL
    // Invalidate on permission updates
    // Use cache keys like: "permissions:user:{username}"
}
```

### 4. Cached Data Services

New cached services for frequently accessed data:

```csharp
public interface ICachedStudentService
{
    Task<List<Student>> GetAllStudentsAsync();
    Task<Student?> GetStudentByIdAsync(int id);
    Task InvalidateStudentCacheAsync(int? studentId = null);
}

public interface ICachedTeacherService
{
    Task<List<Teacher>> GetAllTeachersAsync();
    Task<Teacher?> GetTeacherByIdAsync(int id);
    Task InvalidateTeacherCacheAsync(int? teacherId = null);
}
```

## Data Models

### Cache Key Naming Convention

```
{prefix}:{entity}:{identifier}:{optional_suffix}

Examples:
- school_app:permissions:user:john_doe
- school_app:students:list:all
- school_app:student:detail:123
- school_app:attendance:daily:2024-01-15
- school_app:teachers:list:active
```

### Cache Entry Structure

```csharp
public class CacheEntry<T>
{
    public T Data { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public string Version { get; set; } // For cache versioning
}
```

## Error Handling

### Redis Connection Failures
1. **Startup**: Log warning if Redis unavailable, continue with database-only mode
2. **Runtime**: Catch Redis exceptions, fallback to database queries
3. **Monitoring**: Log cache hit/miss ratios and connection status

### Cache Invalidation Failures
1. **Graceful Degradation**: If cache invalidation fails, log error but continue
2. **Consistency**: Implement cache versioning to handle stale data
3. **Fallback**: Provide manual cache clear endpoints for administrators

### Data Serialization Issues
1. **JSON Serialization**: Use System.Text.Json with proper configuration
2. **Type Safety**: Generic constraints ensure only serializable types are cached
3. **Backward Compatibility**: Handle schema changes gracefully

## Testing Strategy

### Unit Tests
- Mock ICacheService for testing business logic
- Test cache hit/miss scenarios
- Verify fallback behavior when cache unavailable
- Test cache invalidation logic

### Integration Tests
- Test with real Redis instance
- Verify cache TTL behavior
- Test concurrent access scenarios
- Validate cache key naming conventions

### Performance Tests
- Measure cache vs database response times
- Test cache memory usage
- Validate cache eviction policies
- Load test with high concurrent requests

## Implementation Plan

### Phase 1: Core Infrastructure
1. Add Redis NuGet packages
2. Implement ICacheService with Redis backend
3. Add cache configuration to appsettings
4. Implement graceful degradation logic

### Phase 2: Permission Caching
1. Create CachedPermissionService wrapper
2. Implement cache invalidation on permission updates
3. Add cache metrics and logging
4. Update DI registration

### Phase 3: Data Service Caching
1. Implement cached student/teacher services
2. Add cache invalidation to CRUD operations
3. Implement attendance data caching
4. Add cache warming strategies

### Phase 4: Monitoring and Optimization
1. Add cache performance metrics
2. Implement cache statistics endpoints
3. Add cache administration endpoints
4. Performance tuning and optimization

## Security Considerations

### Cache Data Security
- **Sensitive Data**: Avoid caching sensitive information like passwords
- **User Isolation**: Ensure cache keys prevent cross-user data access
- **Data Encryption**: Consider encrypting cached data for sensitive information

### Access Control
- **Cache Administration**: Secure cache management endpoints
- **Redis Security**: Use Redis AUTH and secure network configuration
- **Key Namespacing**: Prevent cache key collisions and unauthorized access

## Monitoring and Observability

### Metrics to Track
- Cache hit/miss ratios per service
- Cache response times vs database response times
- Redis connection health
- Cache memory usage
- Cache invalidation frequency

### Logging Strategy
- Log cache operations at appropriate levels
- Track cache performance metrics
- Monitor Redis connection status
- Alert on cache failure patterns

### Health Checks
- Redis connectivity health check
- Cache service availability check
- Performance threshold monitoring
- Automated cache warming verification