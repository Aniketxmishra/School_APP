using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers
{
    /// <summary>
    /// Controller for testing and managing cached student data
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class StudentCacheController : ControllerBase
    {
        private readonly ICachedStudentService _cachedStudentService;
        private readonly ILogger<StudentCacheController> _logger;

        public StudentCacheController(
            ICachedStudentService cachedStudentService,
            ILogger<StudentCacheController> logger)
        {
            _cachedStudentService = cachedStudentService;
            _logger = logger;
        }

        /// <summary>
        /// Test cached student retrieval performance
        /// </summary>
        [HttpGet("test/performance")]
        public async Task<IActionResult> TestPerformance([FromQuery] int iterations = 5)
        {
            try
            {
                if (iterations > 20) iterations = 20;

                var results = await TestStudentPerformance(iterations);

                return Ok(new
                {
                    students = results,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during student cache performance test");
                return StatusCode(500, new { error = "Performance test failed", details = ex.Message });
            }
        }

        /// <summary>
        /// Get all students with caching
        /// </summary>
        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var students = await _cachedStudentService.GetAllRealStudentsAsync();
                stopwatch.Stop();

                return Ok(new
                {
                    students = students.Take(10).Select(s => new
                    {
                        id = s.FdStudentId,
                        enrollmentNo = s.FdEnrollmentNo,
                        name = s.FdStudentName,
                        gender = s.FdGender,
                        status = s.FdStatus
                    }),
                    totalCount = students.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cached students");
                return StatusCode(500, new { error = "Failed to retrieve students", details = ex.Message });
            }
        }

        /// <summary>
        /// Get student by ID with caching
        /// </summary>
        [HttpGet("students/{id}")]
        public async Task<IActionResult> GetStudentById(long id)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var student = await _cachedStudentService.GetRealStudentByIdAsync(id);
                stopwatch.Stop();

                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                return Ok(new
                {
                    student = new
                    {
                        id = student.FdStudentId,
                        enrollmentNo = student.FdEnrollmentNo,
                        name = student.FdStudentName,
                        gender = student.FdGender,
                        status = student.FdStatus
                    },
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cached student with ID {StudentId}", id);
                return StatusCode(500, new { error = "Failed to retrieve student", details = ex.Message });
            }
        }

        /// <summary>
        /// Search students with caching
        /// </summary>
        [HttpGet("students/search")]
        public async Task<IActionResult> SearchStudents([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest(new { message = "Search query is required" });
                }

                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var students = await _cachedStudentService.SearchRealStudentsAsync(q);
                stopwatch.Stop();

                return Ok(new
                {
                    searchTerm = q,
                    students = students.Select(s => new
                    {
                        id = s.FdStudentId,
                        enrollmentNo = s.FdEnrollmentNo,
                        name = s.FdStudentName,
                        gender = s.FdGender,
                        status = s.FdStatus
                    }),
                    resultCount = students.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching cached students with term '{SearchTerm}'", q);
                return StatusCode(500, new { error = "Search failed", details = ex.Message });
            }
        }

        /// <summary>
        /// Get active students with caching
        /// </summary>
        [HttpGet("students/active")]
        public async Task<IActionResult> GetActiveStudents()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                var students = await _cachedStudentService.GetActiveRealStudentsAsync();
                stopwatch.Stop();

                return Ok(new
                {
                    students = students.Take(10).Select(s => new
                    {
                        id = s.FdStudentId,
                        enrollmentNo = s.FdEnrollmentNo,
                        name = s.FdStudentName,
                        gender = s.FdGender,
                        status = s.FdStatus
                    }),
                    totalCount = students.Count,
                    responseTimeMs = stopwatch.ElapsedMilliseconds,
                    cached = true,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active cached students");
                return StatusCode(500, new { error = "Failed to retrieve active students", details = ex.Message });
            }
        }

        /// <summary>
        /// Invalidate student cache
        /// </summary>
        [HttpDelete("cache/students")]
        public async Task<IActionResult> InvalidateStudentCache([FromQuery] long? studentId = null)
        {
            try
            {
                await _cachedStudentService.InvalidateRealStudentCacheAsync(studentId);

                var message = studentId.HasValue 
                    ? $"Cache invalidated for student ID {studentId.Value}"
                    : "All student caches invalidated";

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
                _logger.LogError(ex, "Error invalidating student cache for ID {StudentId}", studentId);
                return StatusCode(500, new { error = "Failed to invalidate cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Warm up student cache
        /// </summary>
        [HttpPost("cache/warmup")]
        public async Task<IActionResult> WarmUpCache()
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                await _cachedStudentService.WarmUpStudentCacheAsync();
                stopwatch.Stop();

                _logger.LogInformation("Student cache warmed up in {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);

                return Ok(new
                {
                    success = true,
                    message = "Student cache warmed up successfully",
                    warmupTimeMs = stopwatch.ElapsedMilliseconds,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error warming up student cache");
                return StatusCode(500, new { error = "Failed to warm up cache", details = ex.Message });
            }
        }

        /// <summary>
        /// Get student cache statistics
        /// </summary>
        [HttpGet("cache/statistics")]
        public async Task<IActionResult> GetCacheStatistics()
        {
            try
            {
                var stats = await _cachedStudentService.GetCacheStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving student cache statistics");
                return StatusCode(500, new { error = "Failed to retrieve statistics", details = ex.Message });
            }
        }

        #region Private Helper Methods

        private async Task<object> TestStudentPerformance(int iterations)
        {
            var times = new List<long>();

            await _cachedStudentService.InvalidateRealStudentCacheAsync();

            for (int i = 0; i < iterations; i++)
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                await _cachedStudentService.GetAllRealStudentsAsync();
                stopwatch.Stop();
                times.Add(stopwatch.ElapsedMilliseconds);
            }

            return new
            {
                type = "Students",
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