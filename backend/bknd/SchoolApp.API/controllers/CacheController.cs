using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.Services;
using SchoolApp.API.Utilities;

namespace SchoolApp.API.Controllers
{
    /// <summary>
    /// Controller for cache administration and testing
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class CacheController : ControllerBase
    {
        private readonly ICacheService _cacheService;
        private readonly ILogger<CacheController> _logger;

        public CacheController(ICacheService cacheService, ILogger<CacheController> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        /// <summary>
        /// Get cache statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            try
            {
                var stats = await _cacheService.GetStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cache statistics");
                return StatusCode(500, new { error = "Failed to retrieve cache statistics" });
            }
        }

        /// <summary>
        /// Test cache functionality
        /// </summary>
        [HttpPost("test")]
        public async Task<IActionResult> TestCache([FromBody] CacheTestRequest request)
        {
            try
            {
                var testKey = $"test:{Guid.NewGuid()}";
                var testValue = new { message = request.TestMessage, timestamp = DateTime.UtcNow };

                // Test Set
                await _cacheService.SetAsync(testKey, testValue, TimeSpan.FromMinutes(1));
                
                // Test Get
                var cachedValue = await _cacheService.GetAsync<object>(testKey);
                
                // Test Exists
                var exists = await _cacheService.ExistsAsync(testKey);
                
                // Clean up
                await _cacheService.RemoveAsync(testKey);

                return Ok(new
                {
                    success = true,
                    message = "Cache test completed successfully",
                    results = new
                    {
                        setValue = testValue,
                        retrievedValue = cachedValue,
                        keyExists = exists,
                        testKey = testKey
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cache test failed");
                return StatusCode(500, new { error = "Cache test failed", details = ex.Message });
            }
        }

        /// <summary>
        /// Clear cache by pattern (Admin only)
        /// </summary>
        [HttpDelete("clear/{pattern}")]
        public async Task<IActionResult> ClearCacheByPattern(string pattern)
        {
            try
            {
                // In production, add authorization check here
                // [Authorize(Roles = "Admin")]
                
                await _cacheService.RemoveByPatternAsync(pattern);
                
                _logger.LogInformation("Cache cleared for pattern: {Pattern}", pattern);
                
                return Ok(new { 
                    success = true, 
                    message = $"Cache cleared for pattern: {pattern}",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cache for pattern: {Pattern}", pattern);
                return StatusCode(500, new { error = "Failed to clear cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Clear specific cache key (Admin only)
        /// </summary>
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCacheKey([FromQuery] string key)
        {
            try
            {
                // In production, add authorization check here
                // [Authorize(Roles = "Admin")]
                
                await _cacheService.RemoveAsync(key);
                
                _logger.LogInformation("Cache cleared for key: {Key}", key);
                
                return Ok(new { 
                    success = true, 
                    message = $"Cache cleared for key: {key}",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cache for key: {Key}", key);
                return StatusCode(500, new { error = "Failed to clear cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Get cache key suggestions for common operations
        /// </summary>
        [HttpGet("keys/suggestions")]
        public IActionResult GetKeySuggestions()
        {
            var suggestions = new
            {
                userPermissions = new
                {
                    pattern = "permissions:user:*",
                    example = CacheKeyGenerator.UserPermissions("john_doe"),
                    description = "User permission cache keys"
                },
                students = new
                {
                    pattern = "student*",
                    examples = new[]
                    {
                        CacheKeyGenerator.AllStudents(),
                        CacheKeyGenerator.StudentById(123),
                        CacheKeyGenerator.ActiveStudents()
                    },
                    description = "Student data cache keys"
                },
                teachers = new
                {
                    pattern = "teacher*",
                    examples = new[]
                    {
                        CacheKeyGenerator.AllTeachers(),
                        CacheKeyGenerator.TeacherById(456),
                        CacheKeyGenerator.ActiveTeachers()
                    },
                    description = "Teacher data cache keys"
                },
                attendance = new
                {
                    pattern = "attendance*",
                    examples = new[]
                    {
                        CacheKeyGenerator.DailyAttendance(DateTime.Today),
                        CacheKeyGenerator.StudentAttendance(123, DateTime.Today),
                        CacheKeyGenerator.ClassAttendance("10A", DateTime.Today)
                    },
                    description = "Attendance data cache keys"
                }
            };

            return Ok(suggestions);
        }
    }

    /// <summary>
    /// Request model for cache testing
    /// </summary>
    public class CacheTestRequest
    {
        public string TestMessage { get; set; } = "Cache test message";
    }
}