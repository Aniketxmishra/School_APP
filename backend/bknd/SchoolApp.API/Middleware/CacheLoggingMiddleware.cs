using SchoolApp.API.Services;

namespace SchoolApp.API.Middleware
{
    /// <summary>
    /// Middleware for logging cache performance metrics
    /// </summary>
    public class CacheLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CacheLoggingMiddleware> _logger;

        public CacheLoggingMiddleware(RequestDelegate next, ILogger<CacheLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, ICacheService cacheService)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();
            
            await _next(context);
            
            stopwatch.Stop();

            // Log cache statistics periodically (every 100 requests)
            if (context.TraceIdentifier.GetHashCode() % 100 == 0)
            {
                try
                {
                    var stats = await cacheService.GetStatisticsAsync();
                    _logger.LogInformation(
                        "Cache Statistics - Hits: {HitCount}, Misses: {MissCount}, Hit Ratio: {HitRatio:P2}, Connected: {IsConnected}",
                        stats.HitCount,
                        stats.MissCount,
                        stats.HitRatio,
                        stats.IsConnected
                    );
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to retrieve cache statistics");
                }
            }

            // Log slow requests
            if (stopwatch.ElapsedMilliseconds > 1000)
            {
                _logger.LogWarning(
                    "Slow request detected: {Method} {Path} took {ElapsedMs}ms",
                    context.Request.Method,
                    context.Request.Path,
                    stopwatch.ElapsedMilliseconds
                );
            }
        }
    }

    /// <summary>
    /// Extension method to register cache logging middleware
    /// </summary>
    public static class CacheLoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseCacheLogging(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CacheLoggingMiddleware>();
        }
    }
}