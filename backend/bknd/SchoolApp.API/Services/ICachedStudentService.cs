using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services
{
    /// <summary>
    /// Interface for cached student data service
    /// </summary>
    public interface ICachedStudentService
    {
        // Student methods (from TbmasStudentActual entity)
        Task<List<TbmasStudentActual>> GetAllRealStudentsAsync();
        Task<TbmasStudentActual?> GetRealStudentByIdAsync(long id);
        Task<List<TbmasStudentActual>> GetActiveRealStudentsAsync();
        Task<List<TbmasStudentActual>> SearchRealStudentsAsync(string searchTerm);
        
        // Cache management methods
        Task InvalidateRealStudentCacheAsync(long? studentId = null);
        Task InvalidateAllStudentCacheAsync();
        Task WarmUpStudentCacheAsync();
        
        // Statistics and monitoring
        Task<StudentCacheStatistics> GetCacheStatisticsAsync();
    }

    /// <summary>
    /// Cache statistics for student data
    /// </summary>
    public class StudentCacheStatistics
    {
        public int TotalRealStudents { get; set; }
        public int CachedStudentLists { get; set; }
        public int CachedIndividualStudents { get; set; }
        public DateTime LastCacheUpdate { get; set; }
        public TimeSpan CacheTTL { get; set; }
        public double CacheHitRatio { get; set; }
    }
}
