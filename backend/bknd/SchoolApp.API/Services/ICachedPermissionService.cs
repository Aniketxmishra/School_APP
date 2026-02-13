namespace SchoolApp.API.Services
{
    /// <summary>
    /// Extended interface for cached permission service with cache management methods
    /// </summary>
    public interface ICachedPermissionService : IPermissionService
    {
        /// <summary>
        /// Invalidate cached permissions for a specific user
        /// </summary>
        Task InvalidateUserPermissionsAsync(string username);

        /// <summary>
        /// Invalidate all cached permissions (use with caution)
        /// </summary>
        Task InvalidateAllPermissionsAsync();

        /// <summary>
        /// Warm up cache for a specific user by pre-loading their permissions
        /// </summary>
        Task WarmUpUserCacheAsync(string username);
    }
}