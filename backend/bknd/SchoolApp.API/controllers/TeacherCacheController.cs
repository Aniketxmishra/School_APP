using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers
{
    /// <summary>
    /// Controller for testing and managing cached teacher data
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherCacheController : ControllerBase
    {
        private readonly ICachedTeacherService _cachedTeacherService;
        private readonly ILogger<TeacherCacheController> _logger;

        public TeacherCacheController(
            ICachedTeacherService cachedTeacherService,
            ILogger<TeacherCacheController> logger)
        {
            _cachedTeacherService = cachedTeacherService;
            _logger = logger;
        }

        /// <summary>
        /// Test cached teacher retrieval performance
        /// </summary>
        [HttpGet("test/performance")]
        public async Task<IActionResult> TestPerformance([FromQuery] int iterations = 5)
        {
            try
            {
                if (iterations > 20) iterations = 20;

                var results = await TestTeacherPerformance(iterations);

                return Ok(new
                {
                    teachers = results,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during teacher cache performance test");
                return StatusCode(500, new { error = "Performance test failed", details = ex.Message });
            }
        }

        /// <summary>
        /// Get all teachers with caching
        /// </summary>
        [HttpGet("teachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var teachers = await _cachedTeacherService.GetAllRealTeachersAsync();
                stopwatch.Stop();

                return Ok(new
                {
                    teachers = teachers.Take(10).Select(t => new
                    {
                        id = t.FdTeacherId,
                        staffCode = t.FdStaffCode,
                        firstName = t.FdFirstName,
                        lastName = t.FdLastName,
                        fullName = t.FdFullName,
                        email = t.FdEmail,
                        mobile = t.FdMobile,
                        status = t.FdStatus
                    }),
                    totalCount = teachers.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cached teachers");
                return StatusCode(500, new { error = "Failed to retrieve teachers", details = ex.Message });
            }
        }

        /// <summary>
        /// Get teacher by ID with caching
        /// </summary>
        [HttpGet("teachers/{id}")]
        public async Task<IActionResult> GetTeacherById(long id)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var teacher = await _cachedTeacherService.GetRealTeacherByIdAsync(id);
                stopwatch.Stop();

                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found" });
                }

                return Ok(new
                {
                    teacher = new
                    {
                        id = teacher.FdTeacherId,
                        staffCode = teacher.FdStaffCode,
                        firstName = teacher.FdFirstName,
                        lastName = teacher.FdLastName,
                        fullName = teacher.FdFullName,
                        email = teacher.FdEmail,
                        mobile = teacher.FdMobile,
                        status = teacher.FdStatus
                    },
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cached teacher with ID {TeacherId}", id);
                return StatusCode(500, new { error = "Failed to retrieve teacher", details = ex.Message });
            }
        }

        /// <summary>
        /// Search teachers with caching
        /// </summary>
        [HttpGet("teachers/search")]
        public async Task<IActionResult> SearchTeachers([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new { message = "Search query is required" });
                }

                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var teachers = await _cachedTeacherService.SearchRealTeachersAsync(q);
                stopwatch.Stop();

                return Ok(new
                {
                    searchTerm = q,
                    teachers = teachers.Select(t => new
                    {
                        id = t.FdTeacherId,
                        staffCode = t.FdStaffCode,
                        firstName = t.FdFirstName,
                        lastName = t.FdLastName,
                        fullName = t.FdFullName,
                        email = t.FdEmail,
                        status = t.FdStatus
                    }),
                    resultCount = teachers.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching cached teachers with term '{SearchTerm}'", q);
                return StatusCode(500, new { error = "Search failed", details = ex.Message });
            }
        }

        /// <summary>
        /// Get active teachers with caching
        /// </summary>
        [HttpGet("teachers/active")]
        public async Task<IActionResult> GetActiveTeachers()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var teachers = await _cachedTeacherService.GetActiveRealTeachersAsync();
                stopwatch.Stop();

                return Ok(new
                {
                    teachers = teachers.Take(10).Select(t => new
                    {
                        id = t.FdTeacherId,
                        staffCode = t.FdStaffCode,
                        firstName = t.FdFirstName,
                        lastName = t.FdLastName,
                        fullName = t.FdFullName,
                        status = t.FdStatus
                    }),
                    totalCount = teachers.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active cached teachers");
                return StatusCode(500, new { error = "Failed to retrieve active teachers", details = ex.Message });
            }
        }

        /// <summary>
        /// Get teacher hierarchy with caching
        /// </summary>
        [HttpGet("teachers/hierarchy")]
        public async Task<IActionResult> GetTeacherHierarchy()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var teachers = await _cachedTeacherService.GetTeacherHierarchyAsync();
                stopwatch.Stop();

                return Ok(new
                {
                    hierarchy = teachers.Select(t => new
                    {
                        id = t.FdTeacherId,
                        staffCode = t.FdStaffCode,
                        fullName = t.FdFullName,
                        reportsTo = t.FdReportsTo,
                        status = t.FdStatus
                    }),
                    totalCount = teachers.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cached teacher hierarchy");
                return StatusCode(500, new { error = "Failed to retrieve teacher hierarchy", details = ex.Message });
            }
        }

        /// <summary>
        /// Invalidate teacher cache
        /// </summary>
        [HttpDelete("cache/teachers")]
        public async Task<IActionResult> InvalidateTeacherCache([FromQuery] long? teacherId = null)
        {
            try
            {
                await _cachedTeacherService.InvalidateRealTeacherCacheAsync(teacherId);

                var message = teacherId.HasValue 
                    ? $"Cache invalidated for teacher ID {teacherId.Value}"
                    : "All teacher caches invalidated";

                _logger.LogInformation(message);

                return Ok(new
                {
                    success = true,
                    message = message,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating teacher cache for ID {TeacherId}", teacherId);
                return StatusCode(500, new { error = "Failed to invalidate cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Warm up teacher cache
        /// </summary>
        [HttpPost("cache/warmup")]
        public async Task<IActionResult> WarmUpCache()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                await _cachedTeacherService.WarmUpTeacherCacheAsync();
                stopwatch.Stop();

                _logger.LogInformation("Teacher cache warmed up in {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);

                return Ok(new
                {
                    success = true,
                    message = "Teacher cache warmed up successfully",
                    warmupTimeMs = stopwatch.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming up teacher cache");
                return StatusCode(500, new { error = "Failed to warm up cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Get teacher cache statistics
        /// </summary>
        [HttpGet("cache/statistics")]
        public async Task<IActionResult> GetCacheStatistics()
        {
            try
            {
                var stats = await _cachedTeacherService.GetCacheStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teacher cache statistics");
                return StatusCode(500, new { error = "Failed to retrieve statistics", details = ex.Message });
            }
        }

        #region Private Helper Methods

        private async Task<object> TestTeacherPerformance(int iterations)
        {
            var times = new List<long>();

            await _cachedTeacherService.InvalidateRealTeacherCacheAsync();

            for (int i = 0; i < iterations; i++)
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                await _cachedTeacherService.GetAllRealTeachersAsync();
                stopwatch.Stop();
                times.Add(stopwatch.ElapsedMilliseconds);
            }

            return new
            {
                type = "Teachers",
                iterations = iterations,
                times = times,
                firstCall = times.First(),
                averageAfterFirst = times.Skip(1).Any() ? times.Skip(1).Average() : 0,
                min = times.Min(),
                max = times.Max(),
                average = times.Average()
            };
        }

        #endregion
    }
}