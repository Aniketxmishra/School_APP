namespace SchoolApp.API.Configuration
{
    /// <summary>
    /// Configuration settings for Redis caching
    /// </summary>
    public class CacheSettings
    {
        public const string SectionName = "Cache";

        /// <summary>
        /// Enable or disable caching globally
        /// </summary>
        public bool Enabled { get; set; } = true;

        /// <summary>
        /// Redis connection string
        /// </summary>
        public string ConnectionString { get; set; } = "localhost:6379";

        /// <summary>
        /// Default TTL for cached items
        /// </summary>
        public TimeSpan DefaultTTL { get; set; } = TimeSpan.FromMinutes(30);

        /// <summary>
        /// TTL for user permissions cache
        /// </summary>
        public TimeSpan PermissionsTTL { get; set; } = TimeSpan.FromMinutes(15);

        /// <summary>
        /// TTL for attendance data cache
        /// </summary>
        public TimeSpan AttendanceTTL { get; set; } = TimeSpan.FromMinutes(10);

        /// <summary>
        /// TTL for student data cache
        /// </summary>
        public TimeSpan StudentDataTTL { get; set; } = TimeSpan.FromMinutes(30);

        /// <summary>
        /// TTL for teacher data cache
        /// </summary>
        public TimeSpan TeacherDataTTL { get; set; } = TimeSpan.FromMinutes(30);

        /// <summary>
        /// Cache key prefix to avoid collisions
        /// </summary>
        public string KeyPrefix { get; set; } = "school_app";

        /// <summary>
        /// Connection timeout in seconds
        /// </summary>
        public int ConnectionTimeoutSeconds { get; set; } = 5;

        /// <summary>
        /// Command timeout in seconds
        /// </summary>
        public int CommandTimeoutSeconds { get; set; } = 5;

        /// <summary>
        /// Retry count for failed operations
        /// </summary>
        public int RetryCount { get; set; } = 3;
    }
}