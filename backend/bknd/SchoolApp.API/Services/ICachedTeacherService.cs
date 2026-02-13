using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services
{
    /// <summary>
    /// Interface for cached teacher data service
    /// </summary>
    public interface ICachedTeacherService
    {
        // Teacher methods (from TbmasTeacherActual entity)
        Task<List<TbmasTeacherActual>> GetAllRealTeachersAsync();
        Task<TbmasTeacherActual?> GetRealTeacherByIdAsync(long id);
        Task<List<TbmasTeacherActual>> GetActiveRealTeachersAsync();
        Task<List<TbmasTeacherActual>> SearchRealTeachersAsync(string searchTerm);
        Task<List<TbmasTeacherActual>> GetRealTeachersByStatusAsync(string status);
        Task<List<TbmasTeacherActual>> GetTeacherHierarchyAsync();
        
        // Cache management methods
        Task InvalidateRealTeacherCacheAsync(long? teacherId = null);
        Task InvalidateAllTeacherCacheAsync();
        Task WarmUpTeacherCacheAsync();
        
        // Statistics and monitoring
        Task<TeacherCacheStatistics> GetCacheStatisticsAsync();
    }

    /// <summary>
    /// Cache statistics for teacher data
    /// </summary>
    public class TeacherCacheStatistics
    {
        public int TotalRealTeachers { get; set; }
        public int ActiveRealTeachers { get; set; }
        public int CachedTeacherLists { get; set; }
        public int CachedIndividualTeachers { get; set; }
        public DateTime LastCacheUpdate { get; set; }
        public TimeSpan CacheTTL { get; set; }
        public double CacheHitRatio { get; set; }
    }
}
