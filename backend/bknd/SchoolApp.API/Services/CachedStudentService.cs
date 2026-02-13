using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SchoolApp.API.Configuration;
using SchoolApp.API.Utilities;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services
{
    /// <summary>
    /// Cached implementation of student data service
    /// </summary>
    public class CachedStudentService : ICachedStudentService
    {
        private readonly SchoolAppDbContext _context;
        private readonly ICacheService _cacheService;
        private readonly CacheSettings _cacheSettings;
        private readonly ILogger<CachedStudentService> _logger;

        public CachedStudentService(
            SchoolAppDbContext context,
            ICacheService cacheService,
            IOptions<CacheSettings> cacheSettings,
            ILogger<CachedStudentService> logger)
        {
            _context = context;
            _cacheService = cacheService;
            _cacheSettings = cacheSettings.Value;
            _logger = logger;
        }

        #region Student Methods

        public async Task<List<TbmasStudentActual>> GetAllRealStudentsAsync()
        {
            var cacheKey = "real_students:list:all";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for all students, fetching from database");
                        var students = await _context.TbmasStudents
                            .OrderBy(s => s.FdStudentName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Retrieved {Count} students from database", students.Count);
                        return students;
                    },
                    _cacheSettings.StudentDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all students");
                return await _context.TbmasStudents
                    .OrderBy(s => s.FdStudentName)
                    .ToListAsync();
            }
        }

        public async Task<TbmasStudentActual?> GetRealStudentByIdAsync(long id)
        {
            var cacheKey = $"real_student:detail:{id}";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for student ID {StudentId}, fetching from database", id);
                        var student = await _context.TbmasStudents.FindAsync(id);
                        
                        if (student != null)
                        {
                            _logger.LogDebug("Retrieved student {StudentId} from database", id);
                        }
                        else
                        {
                            _logger.LogDebug("Student {StudentId} not found in database", id);
                        }
                        
                        return student;
                    },
                    _cacheSettings.StudentDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving student with ID {StudentId}", id);
                return await _context.TbmasStudents.FindAsync(id);
            }
        }

        public async Task<List<TbmasStudentActual>> GetActiveRealStudentsAsync()
        {
            var cacheKey = "real_students:list:active";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for active students, fetching from database");
                        var students = await _context.TbmasStudents
                            .Where(s => s.FdStatus == "active")
                            .OrderBy(s => s.FdStudentName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Retrieved {Count} active students from database", students.Count);
                        return students;
                    },
                    _cacheSettings.StudentDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active students");
                return await _context.TbmasStudents
                    .Where(s => s.FdStatus == "active")
                    .OrderBy(s => s.FdStudentName)
                    .ToListAsync();
            }
        }

        public async Task<List<TbmasStudentActual>> SearchRealStudentsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return new List<TbmasStudentActual>();
            }

            var cacheKey = $"real_students:search:{searchTerm.ToLowerInvariant()}";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for student search '{SearchTerm}', fetching from database", searchTerm);
                        var students = await _context.TbmasStudents
                            .Where(s => 
                                s.FdStudentName.Contains(searchTerm) || 
                                s.FdEnrollmentNo.Contains(searchTerm) ||
                                (s.FdMotherName != null && s.FdMotherName.Contains(searchTerm)) ||
                                (s.FdGuardianName != null && s.FdGuardianName.Contains(searchTerm)))
                            .OrderBy(s => s.FdStudentName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Found {Count} students matching search term '{SearchTerm}'", students.Count, searchTerm);
                        return students;
                    },
                    TimeSpan.FromMinutes(10)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching students with term '{SearchTerm}'", searchTerm);
                return await _context.TbmasStudents
                    .Where(s => 
                        s.FdStudentName.Contains(searchTerm) || 
                        s.FdEnrollmentNo.Contains(searchTerm) ||
                        (s.FdMotherName != null && s.FdMotherName.Contains(searchTerm)) ||
                        (s.FdGuardianName != null && s.FdGuardianName.Contains(searchTerm)))
                    .OrderBy(s => s.FdStudentName)
                    .ToListAsync();
            }
        }

        #endregion

        #region Cache Management

        public async Task InvalidateRealStudentCacheAsync(long? studentId = null)
        {
            try
            {
                if (studentId.HasValue)
                {
                    await _cacheService.RemoveAsync($"real_student:detail:{studentId.Value}");
                    _logger.LogInformation("Invalidated cache for student ID {StudentId}", studentId.Value);
                }
                else
                {
                    await _cacheService.RemoveAsync("real_students:list:all");
                    await _cacheService.RemoveAsync("real_students:list:active");
                    await _cacheService.RemoveByPatternAsync("real_students:search:*");
                    _logger.LogInformation("Invalidated all student list caches");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating student cache for ID {StudentId}", studentId);
            }
        }

        public async Task InvalidateAllStudentCacheAsync()
        {
            try
            {
                await InvalidateRealStudentCacheAsync();
                await _cacheService.RemoveByPatternAsync("*student*");
                _logger.LogWarning("Invalidated all student-related caches");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating all student caches");
            }
        }

        public async Task WarmUpStudentCacheAsync()
        {
            try
            {
                _logger.LogInformation("Starting student cache warm-up");
                
                var tasks = new List<Task>
                {
                    GetAllRealStudentsAsync(),
                    GetActiveRealStudentsAsync()
                };

                await Task.WhenAll(tasks);
                
                _logger.LogInformation("Student cache warm-up completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during student cache warm-up");
            }
        }

        public async Task<StudentCacheStatistics> GetCacheStatisticsAsync()
        {
            try
            {
                var stats = new StudentCacheStatistics
                {
                    LastCacheUpdate = DateTime.UtcNow,
                    CacheTTL = _cacheSettings.StudentDataTTL
                };

                stats.TotalRealStudents = await _context.TbmasStudents.CountAsync();

                var cacheChecks = new[]
                {
                    _cacheService.ExistsAsync("real_students:list:all"),
                    _cacheService.ExistsAsync("real_students:list:active")
                };

                var cacheResults = await Task.WhenAll(cacheChecks);
                stats.CachedStudentLists = cacheResults.Count(r => r);

                var cacheServiceStats = await _cacheService.GetStatisticsAsync();
                stats.CacheHitRatio = cacheServiceStats.HitRatio;

                return stats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving student cache statistics");
                return new StudentCacheStatistics
                {
                    LastCacheUpdate = DateTime.UtcNow,
                    CacheTTL = _cacheSettings.StudentDataTTL
                };
            }
        }

        #endregion
    }
}