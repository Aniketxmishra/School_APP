using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers
{
    /// <summary>
    /// Controller for testing and managing cached permissions
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionCacheController : ControllerBase
    {
        private readonly ICachedPermissionService _cachedPermissionService;
        private readonly ILogger<PermissionCacheController> _logger;

        public PermissionCacheController(
            ICachedPermissionService cachedPermissionService,
            ILogger<PermissionCacheController> logger)
        {
            _cachedPermissionService = cachedPermissionService;
            _logger = logger;
        }

        /// <summary>
        /// Test cached permission retrieval
        /// </summary>
        [HttpGet("test/{username}")]
        public async Task<IActionResult> TestUserPermissions(string username)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                
                // First call - should hit database and cache result
                var permissions1 = await _cachedPermissionService.GetUserPermissionsAsync(username);
                var firstCallTime = stopwatch.ElapsedMilliseconds;
                
                stopwatch.Restart();
                
                // Second call - should hit cache
                var permissions2 = await _cachedPermissionService.GetUserPermissionsAsync(username);
                var secondCallTime = stopwatch.ElapsedMilliseconds;
                
                return Ok(new
                {
                    username = username,
                    permissions = permissions1,
                    performance = new
                    {
                        firstCallMs = firstCallTime,
                        secondCallMs = secondCallTime,
                        cacheSpeedup = firstCallTime > 0 ? $"{(double)firstCallTime / secondCallTime:F2}x" : "N/A"
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing cached permissions for user: {Username}", username);
                return StatusCode(500, new { error = "Failed to test cached permissions", details = ex.Message });
            }
        }

        /// <summary>
        /// Test permission checking with caching
        /// </summary>
        [HttpGet("check/{username}/{module}/{permission}")]
        public async Task<IActionResult> TestPermissionCheck(string username, string module, string permission, [FromQuery] string? submodule = null)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                
                var hasPermission = await _cachedPermissionService.HasPermissionAsync(username, module, permission, submodule);
                
                stopwatch.Stop();
                
                return Ok(new
                {
                    username = username,
                    module = module,
                    permission = permission,
                    submodule = submodule,
                    hasPermission = hasPermission,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking permission for user: {Username}, module: {Module}, permission: {Permission}", 
                    username, module, permission);
                return StatusCode(500, new { error = "Failed to check permission", details = ex.Message });
            }
        }

        /// <summary>
        /// Get user modules with caching
        /// </summary>
        [HttpGet("modules/{username}")]
        public async Task<IActionResult> GetUserModules(string username)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                
                var modules = await _cachedPermissionService.GetUserModulesAsync(username);
                
                stopwatch.Stop();
                
                return Ok(new
                {
                    username = username,
                    modules = modules,
                    moduleCount = modules.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user modules for user: {Username}", username);
                return StatusCode(500, new { error = "Failed to get user modules", details = ex.Message });
            }
        }

        /// <summary>
        /// Invalidate cached permissions for a user
        /// </summary>
        [HttpDelete("invalidate/{username}")]
        public async Task<IActionResult> InvalidateUserPermissions(string username)
        {
            try
            {
                await _cachedPermissionService.InvalidateUserPermissionsAsync(username);
                
                _logger.LogInformation("Invalidated cached permissions for user: {Username}", username);
                
                return Ok(new
                {
                    success = true,
                    message = $"Cached permissions invalidated for user: {username}",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating cached permissions for user: {Username}", username);
                return StatusCode(500, new { error = "Failed to invalidate cached permissions", details = ex.Message });
            }
        }

        /// <summary>
        /// Warm up cache for a user
        /// </summary>
        [HttpPost("warmup/{username}")]
        public async Task<IActionResult> WarmUpUserCache(string username)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                
                await _cachedPermissionService.WarmUpUserCacheAsync(username);
                
                stopwatch.Stop();
                
                _logger.LogInformation("Warmed up cache for user: {Username} in {ElapsedMs}ms", username, stopwatch.ElapsedMilliseconds);
                
                return Ok(new
                {
                    success = true,
                    message = $"Cache warmed up for user: {username}",
                    warmupTimeMs = stopwatch.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming up cache for user: {Username}", username);
                return StatusCode(500, new { error = "Failed to warm up cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Invalidate all cached permissions (Admin only)
        /// </summary>
        [HttpDelete("invalidate-all")]
        public async Task<IActionResult> InvalidateAllPermissions()
        {
            try
            {
                // In production, add authorization check here
                // [Authorize(Roles = "Admin")]
                
                await _cachedPermissionService.InvalidateAllPermissionsAsync();
                
                _logger.LogWarning("Invalidated all cached permissions");
                
                return Ok(new
                {
                    success = true,
                    message = "All cached permissions invalidated",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating all cached permissions");
                return StatusCode(500, new { error = "Failed to invalidate all cached permissions", details = ex.Message });
            }
        }

        /// <summary>
        /// Performance comparison between cached and non-cached permission checks
        /// </summary>
        [HttpGet("performance-test/{username}")]
        public async Task<IActionResult> PerformanceTest(string username, [FromQuery] int iterations = 10)
        {
            try
            {
                if (iterations > 100) iterations = 100; // Limit to prevent abuse
                
                var results = new List<long>();
                
                // Clear cache first to ensure fair test
                await _cachedPermissionService.InvalidateUserPermissionsAsync(username);
                
                // Run multiple iterations
                for (int i = 0; i < iterations; i++)
                {
                    var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                    await _cachedPermissionService.GetUserPermissionsAsync(username);
                    stopwatch.Stop();
                    results.Add(stopwatch.ElapsedMilliseconds);
                }
                
                return Ok(new
                {
                    username = username,
                    iterations = iterations,
                    results = results,
                    statistics = new
                    {
                        firstCall = results.First(), // Should be slowest (DB hit)
                        averageAfterFirst = results.Skip(1).Average(), // Should be faster (cache hits)
                        min = results.Min(),
                        max = results.Max(),
                        average = results.Average()
                    },
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running performance test for user: {Username}", username);
                return StatusCode(500, new { error = "Failed to run performance test", details = ex.Message });
            }
        }
    }
}