# Cache Key Naming Conventions

## Overview
This document defines the standardized naming conventions for Redis cache keys in the School Management System.

## Key Structure
All cache keys follow this pattern:
```
{prefix}:{entity}:{identifier}:{optional_suffix}
```

## Prefix
- **Development**: `school_app_dev`
- **Production**: `school_app`

## Entity Types

### User Permissions
- **Pattern**: `permissions:user:{username}`
- **Example**: `school_app:permissions:user:john_doe`
- **TTL**: 15 minutes
- **Description**: Cached user permissions and roles

### Students
- **All Students**: `students:list:all`
- **Active Students**: `students:list:active`
- **Individual Student**: `student:detail:{studentId}`
- **TTL**: 30 minutes
- **Examples**:
  - `school_app:students:list:all`
  - `school_app:student:detail:123`

### Teachers
- **All Teachers**: `teachers:list:all`
- **Active Teachers**: `teachers:list:active`
- **Individual Teacher**: `teacher:detail:{teacherId}`
- **TTL**: 30 minutes
- **Examples**:
  - `school_app:teachers:list:all`
  - `school_app:teacher:detail:456`

### Attendance
- **Daily Attendance**: `attendance:daily:{yyyy-MM-dd}`
- **Student Attendance**: `attendance:student:{studentId}:{yyyy-MM-dd}`
- **Class Attendance**: `attendance:class:{className}:{yyyy-MM-dd}`
- **TTL**: 10 minutes
- **Examples**:
  - `school_app:attendance:daily:2024-01-15`
  - `school_app:attendance:student:123:2024-01-15`
  - `school_app:attendance:class:10a:2024-01-15`

### Modules and Menus
- **User Modules**: `modules:user:{username}`
- **Menu Items**: `menu:items:all`
- **TTL**: 15 minutes (modules), 60 minutes (menu items)

## Pattern Keys for Bulk Operations

### Clear User Data
- **Pattern**: `*:user:{username}*`
- **Usage**: Clear all cached data for a specific user

### Clear Student Data
- **All Students**: `*student*`
- **Specific Student**: `*student*:{studentId}*`

### Clear Teacher Data
- **All Teachers**: `*teacher*`
- **Specific Teacher**: `*teacher*:{teacherId}*`

### Clear Attendance Data
- **All Attendance**: `*attendance*`
- **Specific Date**: `*attendance*:{yyyy-MM-dd}*`

## Best Practices

### Key Naming
1. Use lowercase for all keys
2. Use colons (`:`) as separators
3. Use underscores (`_`) within identifiers if needed
4. Keep keys concise but descriptive

### TTL Guidelines
1. **Frequently changing data**: 5-10 minutes
2. **User-specific data**: 15 minutes
3. **Reference data**: 30-60 minutes
4. **Static configuration**: 2-4 hours

### Invalidation Patterns
1. **User logout**: Clear `*:user:{username}*`
2. **Student update**: Clear `*student*:{studentId}*`
3. **Teacher update**: Clear `*teacher*:{teacherId}*`
4. **Attendance update**: Clear `*attendance*:{date}*`

## Cache Key Generator Usage

```csharp
// User permissions
var key = CacheKeyGenerator.UserPermissions("john_doe");
// Result: "permissions:user:john_doe"

// Student data
var key = CacheKeyGenerator.StudentById(123);
// Result: "student:detail:123"

// Attendance data
var key = CacheKeyGenerator.DailyAttendance(DateTime.Today);
// Result: "attendance:daily:2024-01-15"

// Pattern for clearing user data
var pattern = CacheKeyGenerator.UserPattern("john_doe");
// Result: "*:user:john_doe*"
```

## Monitoring and Debugging

### Cache Statistics Endpoint
- **URL**: `GET /api/cache/statistics`
- **Returns**: Hit/miss ratios, connection status

### Cache Key Suggestions
- **URL**: `GET /api/cache/keys/suggestions`
- **Returns**: Common key patterns and examples

### Clear Cache (Admin Only)
- **Clear by pattern**: `DELETE /api/cache/clear/{pattern}`
- **Clear specific key**: `DELETE /api/cache/clear?key={key}`

## Environment-Specific Considerations

### Development
- Use `school_app_dev` prefix
- Shorter TTL values for testing
- Enable detailed logging

### Production
- Use `school_app` prefix
- Optimized TTL values
- Monitor cache performance
- Implement proper security for admin endpoints