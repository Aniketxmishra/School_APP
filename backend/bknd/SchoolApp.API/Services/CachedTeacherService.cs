using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SchoolApp.API.Configuration;
using SchoolApp.API.Utilities;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services
{
    /// <summary>
    /// Cached implementation of teacher data service
    /// </summary>
    public class CachedTeacherService : ICachedTeacherService
    {
        private readonly SchoolAppDbContext _context;
        private readonly ICacheService _cacheService;
        private readonly CacheSettings _cacheSettings;
        private readonly ILogger<CachedTeacherService> _logger;

        public CachedTeacherService(
            SchoolAppDbContext context,
            ICacheService cacheService,
            IOptions<CacheSettings> cacheSettings,
            ILogger<CachedTeacherService> logger)
        {
            _context = context;
            _cacheService = cacheService;
            _cacheSettings = cacheSettings.Value;
            _logger = logger;
        }

        #region Teacher Methods

        public async Task<List<TbmasTeacherActual>> GetAllRealTeachersAsync()
        {
            var cacheKey = "real_teachers:list:all";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for all teachers, fetching from database");
                        var teachers = await _context.TbmasTeachers
                            .OrderBy(t => t.FdFirstName)
                            .ThenBy(t => t.FdLastName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Retrieved {Count} teachers from database", teachers.Count);
                        return teachers;
                    },
                    _cacheSettings.TeacherDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all teachers");
                return await _context.TbmasTeachers
                    .OrderBy(t => t.FdFirstName)
                    .ThenBy(t => t.FdLastName)
                    .ToListAsync();
            }
        }

        public async Task<TbmasTeacherActual?> GetRealTeacherByIdAsync(long id)
        {
            var cacheKey = $"real_teacher:detail:{id}";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for teacher ID {TeacherId}, fetching from database", id);
                        var teacher = await _context.TbmasTeachers.FindAsync(id);
                        
                        if (teacher != null)
                        {
                            _logger.LogDebug("Retrieved teacher {TeacherId} from database", id);
                        }
                        else
                        {
                            _logger.LogDebug("Teacher {TeacherId} not found in database", id);
                        }
                        
                        return teacher;
                    },
                    _cacheSettings.TeacherDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teacher with ID {TeacherId}", id);
                return await _context.TbmasTeachers.FindAsync(id);
            }
        }

        public async Task<List<TbmasTeacherActual>> GetActiveRealTeachersAsync()
        {
            var cacheKey = "real_teachers:list:active";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for active teachers, fetching from database");
                        var teachers = await _context.TbmasTeachers
                            .Where(t => t.FdStatus == "active")
                            .OrderBy(t => t.FdFirstName)
                            .ThenBy(t => t.FdLastName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Retrieved {Count} active teachers from database", teachers.Count);
                        return teachers;
                    },
                    _cacheSettings.TeacherDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active teachers");
                return await _context.TbmasTeachers
                    .Where(t => t.FdStatus == "active")
                    .OrderBy(t => t.FdFirstName)
                    .ThenBy(t => t.FdLastName)
                    .ToListAsync();
            }
        }

        public async Task<List<TbmasTeacherActual>> SearchRealTeachersAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return new List<TbmasTeacherActual>();
            }

            var cacheKey = $"real_teachers:search:{searchTerm.ToLowerInvariant()}";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for teacher search '{SearchTerm}', fetching from database", searchTerm);
                        var teachers = await _context.TbmasTeachers
                            .Where(t => 
                                t.FdFirstName.Contains(searchTerm) || 
                                (t.FdLastName != null && t.FdLastName.Contains(searchTerm)) ||
                                t.FdStaffCode.Contains(searchTerm) ||
                                (t.FdEmail != null && t.FdEmail.Contains(searchTerm)) ||
                                (t.FdMobile != null && t.FdMobile.Contains(searchTerm)) ||
                                (t.FdFullName != null && t.FdFullName.Contains(searchTerm)))
                            .OrderBy(t => t.FdFirstName)
                            .ThenBy(t => t.FdLastName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Found {Count} teachers matching search term '{SearchTerm}'", teachers.Count, searchTerm);
                        return teachers;
                    },
                    TimeSpan.FromMinutes(10)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching teachers with term '{SearchTerm}'", searchTerm);
                return await _context.TbmasTeachers
                    .Where(t => 
                        t.FdFirstName.Contains(searchTerm) || 
                        (t.FdLastName != null && t.FdLastName.Contains(searchTerm)) ||
                        t.FdStaffCode.Contains(searchTerm) ||
                        (t.FdEmail != null && t.FdEmail.Contains(searchTerm)) ||
                        (t.FdMobile != null && t.FdMobile.Contains(searchTerm)) ||
                        (t.FdFullName != null && t.FdFullName.Contains(searchTerm)))
                    .OrderBy(t => t.FdFirstName)
                    .ThenBy(t => t.FdLastName)
                    .ToListAsync();
            }
        }

        public async Task<List<TbmasTeacherActual>> GetRealTeachersByStatusAsync(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return new List<TbmasTeacherActual>();
            }

            var cacheKey = $"real_teachers:status:{status.ToLowerInvariant()}";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for teachers by status '{Status}', fetching from database", status);
                        var teachers = await _context.TbmasTeachers
                            .Where(t => t.FdStatus == status)
                            .OrderBy(t => t.FdFirstName)
                            .ThenBy(t => t.FdLastName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Found {Count} teachers with status '{Status}'", teachers.Count, status);
                        return teachers;
                    },
                    _cacheSettings.TeacherDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teachers by status '{Status}'", status);
                return await _context.TbmasTeachers
                    .Where(t => t.FdStatus == status)
                    .OrderBy(t => t.FdFirstName)
                    .ThenBy(t => t.FdLastName)
                    .ToListAsync();
            }
        }

        public async Task<List<TbmasTeacherActual>> GetTeacherHierarchyAsync()
        {
            var cacheKey = "real_teachers:hierarchy";

            try
            {
                return await _cacheService.GetOrSetAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for teacher hierarchy, fetching from database");
                        var teachers = await _context.TbmasTeachers
                            .Where(t => t.FdStatus == "active")
                            .OrderBy(t => t.FdReportsTo ?? long.MaxValue)
                            .ThenBy(t => t.FdFirstName)
                            .ToListAsync();
                        
                        _logger.LogDebug("Retrieved teacher hierarchy with {Count} teachers", teachers.Count);
                        return teachers;
                    },
                    _cacheSettings.TeacherDataTTL
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teacher hierarchy");
                return await _context.TbmasTeachers
                    .Where(t => t.FdStatus == "active")
                    .OrderBy(t => t.FdReportsTo ?? long.MaxValue)
                    .ThenBy(t => t.FdFirstName)
                    .ToListAsync();
            }
        }

        #endregion

        #region Cache Management

        public async Task InvalidateRealTeacherCacheAsync(long? teacherId = null)
        {
            try
            {
                if (teacherId.HasValue)
                {
                    await _cacheService.RemoveAsync($"real_teacher:detail:{teacherId.Value}");
                    _logger.LogInformation("Invalidated cache for teacher ID {TeacherId}", teacherId.Value);
                }
                else
                {
                    await _cacheService.RemoveAsync("real_teachers:list:all");
                    await _cacheService.RemoveAsync("real_teachers:list:active");
                    await _cacheService.RemoveAsync("real_teachers:hierarchy");
                    await _cacheService.RemoveByPatternAsync("real_teachers:search:*");
                    await _cacheService.RemoveByPatternAsync("real_teachers:status:*");
                    _logger.LogInformation("Invalidated all teacher list caches");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating teacher cache for ID {TeacherId}", teacherId);
            }
        }

        public async Task InvalidateAllTeacherCacheAsync()
        {
            try
            {
                await InvalidateRealTeacherCacheAsync();
                await _cacheService.RemoveByPatternAsync("*teacher*");
                _logger.LogWarning("Invalidated all teacher-related caches");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating all teacher caches");
            }
        }

        public async Task WarmUpTeacherCacheAsync()
        {
            try
            {
                _logger.LogInformation("Starting teacher cache warm-up");
                
                var tasks = new List<Task>
                {
                    GetAllRealTeachersAsync(),
                    GetActiveRealTeachersAsync(),
                    GetTeacherHierarchyAsync()
                };

                await Task.WhenAll(tasks);
                
                _logger.LogInformation("Teacher cache warm-up completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during teacher cache warm-up");
            }
        }

        public async Task<TeacherCacheStatistics> GetCacheStatisticsAsync()
        {
            try
            {
                var stats = new TeacherCacheStatistics
                {
                    LastCacheUpdate = DateTime.UtcNow,
                    CacheTTL = _cacheSettings.TeacherDataTTL
                };

                var realTeacherCountTask = _context.TbmasTeachers.CountAsync();
                var activeRealTeacherCountTask = _context.TbmasTeachers.CountAsync(t => t.FdStatus == "active");

                await Task.WhenAll(realTeacherCountTask, activeRealTeacherCountTask);

                stats.TotalRealTeachers = await realTeacherCountTask;
                stats.ActiveRealTeachers = await activeRealTeacherCountTask;

                var cacheChecks = new[]
                {
                    _cacheService.ExistsAsync("real_teachers:list:all"),
                    _cacheService.ExistsAsync("real_teachers:list:active"),
                    _cacheService.ExistsAsync("real_teachers:hierarchy")
                };

                var cacheResults = await Task.WhenAll(cacheChecks);
                stats.CachedTeacherLists = cacheResults.Count(r => r);

                var cacheServiceStats = await _cacheService.GetStatisticsAsync();
                stats.CacheHitRatio = cacheServiceStats.HitRatio;

                return stats;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teacher cache statistics");
                return new TeacherCacheStatistics
                {
                    LastCacheUpdate = DateTime.UtcNow,
                    CacheTTL = _cacheSettings.TeacherDataTTL
                };
            }
        }

        #endregion
    }
}