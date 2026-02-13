using System.Security.Claims;
using Microsoft.Extensions.Options;
using SchoolApp.API.Configuration;
using SchoolApp.API.Utilities;

namespace SchoolApp.API.Services
{
    /// <summary>
    /// Cached wrapper for the permission service that implements caching for user permissions
    /// </summary>
    public class CachedPermissionService : ICachedPermissionService
    {
        private readonly IPermissionService _basePermissionService;
        private readonly ICacheService _cacheService;
        private readonly CacheSettings _cacheSettings;
        private readonly ILogger<CachedPermissionService> _logger;

        public CachedPermissionService(
            IPermissionService basePermissionService,
            ICacheService cacheService,
            IOptions<CacheSettings> cacheSettings,
            ILogger<CachedPermissionService> logger)
        {
            _basePermissionService = basePermissionService;
            _cacheService = cacheService;
            _cacheSettings = cacheSettings.Value;
            _logger = logger;
        }

        public async Task<UserPermissions> GetUserPermissionsAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                _logger.LogWarning("GetUserPermissionsAsync called with empty username");
                return new UserPermissions { Username = string.Empty, UserType = "student", GroupName = "Student", Modules = new List<ModulePermission>() };
            }

            var cacheKey = CacheKeyGenerator.UserPermissions(username);

            try
            {
                // Try to get from cache first
                var cachedPermissions = await _cacheService.GetAsync<UserPermissions>(cacheKey);
                if (cachedPermissions != null)
                {
                    _logger.LogDebug("Retrieved user permissions from cache for user: {Username}", username);
                    return cachedPermissions;
                }

                // Cache miss - get from database
                _logger.LogDebug("Cache miss for user permissions: {Username}, fetching from database", username);
                var permissions = await _basePermissionService.GetUserPermissionsAsync(username);

                // Cache the result
                if (permissions != null && permissions.Modules.Any())
                {
                    await _cacheService.SetAsync(cacheKey, permissions, _cacheSettings.PermissionsTTL);
                    _logger.LogDebug("Cached user permissions for user: {Username} with TTL: {TTL}", username, _cacheSettings.PermissionsTTL);
                }

                return permissions;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in cached permission service for user: {Username}", username);
                // Fallback to base service on cache errors
                return await _basePermissionService.GetUserPermissionsAsync(username);
            }
        }

        public async Task<bool> HasPermissionAsync(string username, string module, string permission, string? submodule = null)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(module) || string.IsNullOrWhiteSpace(permission))
            {
                _logger.LogWarning("HasPermissionAsync called with invalid parameters: Username={Username}, Module={Module}, Permission={Permission}", 
                    username, module, permission);
                return false;
            }

            try
            {
                // Get cached permissions (this will use cache or fetch from DB)
                var userPermissions = await GetUserPermissionsAsync(username);
                
                var modulePermission = userPermissions.Modules.FirstOrDefault(m => 
                    m.ModuleName.Equals(module, StringComparison.OrdinalIgnoreCase));
                
                if (modulePermission == null)
                {
                    _logger.LogDebug("Module {Module} not found for user {Username}", module, username);
                    return false;
                }

                if (!string.IsNullOrEmpty(submodule))
                {
                    var submodulePermission = modulePermission.Submodules.FirstOrDefault(s => 
                        s.SubmoduleName.Equals(submodule, StringComparison.OrdinalIgnoreCase));
                    
                    if (submodulePermission == null)
                    {
                        _logger.LogDebug("Submodule {Submodule} not found in module {Module} for user {Username}", 
                            submodule, module, username);
                        return false;
                    }
                    
                    return permission.ToLower() switch
                    {
                        "read" => submodulePermission.CanRead,
                        "write" => submodulePermission.CanWrite,
                        "delete" => submodulePermission.CanDelete,
                        "update" => submodulePermission.CanUpdate,
                        _ => false
                    };
                }

                var hasPermission = permission.ToLower() switch
                {
                    "read" => modulePermission.CanRead,
                    "write" => modulePermission.CanWrite,
                    "delete" => modulePermission.CanDelete,
                    "update" => modulePermission.CanUpdate,
                    _ => false
                };

                _logger.LogDebug("Permission check for user {Username}, module {Module}, permission {Permission}: {Result}", 
                    username, module, permission, hasPermission);

                return hasPermission;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking permission for user {Username}, module {Module}, permission {Permission}", 
                    username, module, permission);
                // Fallback to base service on errors
                return await _basePermissionService.HasPermissionAsync(username, module, permission, submodule);
            }
        }

        public async Task<List<ModulePermission>> GetUserModulesAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                _logger.LogWarning("GetUserModulesAsync called with empty username");
                return new List<ModulePermission>();
            }

            var cacheKey = CacheKeyGenerator.UserModules(username);

            try
            {
                // Try cache first
                var cachedModules = await _cacheService.GetAsync<List<ModulePermission>>(cacheKey);
                if (cachedModules != null)
                {
                    _logger.LogDebug("Retrieved user modules from cache for user: {Username}", username);
                    return cachedModules;
                }

                // Cache miss - get user permissions and filter readable modules
                var userPermissions = await GetUserPermissionsAsync(username);
                var readableModules = userPermissions.Modules.Where(m => m.CanRead).ToList();

                // Cache the filtered modules
                if (readableModules.Any())
                {
                    await _cacheService.SetAsync(cacheKey, readableModules, _cacheSettings.PermissionsTTL);
                    _logger.LogDebug("Cached user modules for user: {Username}", username);
                }

                return readableModules;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user modules for user: {Username}", username);
                // Fallback to base service
                return await _basePermissionService.GetUserModulesAsync(username);
            }
        }

        public async Task<List<Claim>> BuildUserClaimsAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                _logger.LogWarning("BuildUserClaimsAsync called with empty username");
                return new List<Claim>();
            }

            // Claims are typically built fresh each time for security reasons
            // But we can still benefit from cached permissions
            try
            {
                var userPermissions = await GetUserPermissionsAsync(username);
                var claims = new List<Claim>();

                // Add basic user claims
                claims.Add(new Claim(ClaimTypes.Name, username));
                claims.Add(new Claim("UserType", userPermissions.UserType));
                claims.Add(new Claim("GroupName", userPermissions.GroupName));

                // Add module-level permissions as claims
                foreach (var module in userPermissions.Modules)
                {
                    if (module.CanRead) claims.Add(new Claim($"Module:{module.ModuleName}", "Read"));
                    if (module.CanWrite) claims.Add(new Claim($"Module:{module.ModuleName}", "Write"));
                    if (module.CanDelete) claims.Add(new Claim($"Module:{module.ModuleName}", "Delete"));
                    if (module.CanUpdate) claims.Add(new Claim($"Module:{module.ModuleName}", "Update"));

                    // Add submodule permissions
                    foreach (var submodule in module.Submodules)
                    {
                        if (submodule.CanRead) claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Read"));
                        if (submodule.CanWrite) claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Write"));
                        if (submodule.CanDelete) claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Delete"));
                        if (submodule.CanUpdate) claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Update"));
                    }
                }

                _logger.LogDebug("Built {ClaimCount} claims for user: {Username}", claims.Count, username);
                return claims;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error building user claims for user: {Username}", username);
                // Fallback to base service
                return await _basePermissionService.BuildUserClaimsAsync(username);
            }
        }

        public async Task<bool> CanAccessModuleAsync(string username, string module)
        {
            return await HasPermissionAsync(username, module, "read");
        }

        /// <summary>
        /// Invalidate cached permissions for a specific user (synchronous version for interface compatibility)
        /// </summary>
        public void InvalidateUserCache(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return;
            }

            try
            {
                // Call the async version without waiting (fire and forget)
                _ = InvalidateUserPermissionsAsync(username);
                
                _logger.LogInformation("Triggered cache invalidation for user: {Username}", username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error triggering cache invalidation for user: {Username}", username);
            }
        }

        /// <summary>
        /// Invalidate cached permissions for a specific user (async version)
        /// </summary>
        public async Task InvalidateUserPermissionsAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return;
            }

            try
            {
                // Clear all user-related cache entries
                var pattern = CacheKeyGenerator.UserPattern(username);
                await _cacheService.RemoveByPatternAsync(pattern);
                
                _logger.LogInformation("Invalidated cached permissions for user: {Username}", username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating cached permissions for user: {Username}", username);
            }
        }

        /// <summary>
        /// Invalidate all cached permissions (use with caution)
        /// </summary>
        public async Task InvalidateAllPermissionsAsync()
        {
            try
            {
                await _cacheService.RemoveByPatternAsync("permissions:*");
                await _cacheService.RemoveByPatternAsync("modules:*");
                
                _logger.LogWarning("Invalidated all cached permissions");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating all cached permissions");
            }
        }

        /// <summary>
        /// Warm up cache for a specific user by pre-loading their permissions
        /// </summary>
        public async Task WarmUpUserCacheAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return;
            }

            try
            {
                _logger.LogDebug("Warming up cache for user: {Username}", username);
                
                // This will load permissions into cache
                await GetUserPermissionsAsync(username);
                await GetUserModulesAsync(username);
                
                _logger.LogDebug("Cache warmed up for user: {Username}", username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming up cache for user: {Username}", username);
            }
        }
    }
}
