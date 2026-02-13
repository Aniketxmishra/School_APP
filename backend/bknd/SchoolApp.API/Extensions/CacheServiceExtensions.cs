using SchoolApp.API.Configuration;
using SchoolApp.API.Services;
using SchoolApp.API.Validators;
using StackExchange.Redis;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace SchoolApp.API.Extensions
{
    /// <summary>
    /// Extension methods for configuring cache services
    /// </summary>
    public static class CacheServiceExtensions
    {
        /// <summary>
        /// Add Redis caching services to the DI container
        /// </summary>
        public static IServiceCollection AddRedisCaching(this IServiceCollection services, IConfiguration configuration)
        {
            // Bind cache settings with validation
            var cacheSettings = new CacheSettings();
            configuration.GetSection(CacheSettings.SectionName).Bind(cacheSettings);
            services.Configure<CacheSettings>(configuration.GetSection(CacheSettings.SectionName));
            services.AddSingleton<IValidateOptions<CacheSettings>, CacheSettingsValidator>();

            // Add Redis connection if caching is enabled
            if (cacheSettings.Enabled)
            {
                try
                {
                    var configurationOptions = new ConfigurationOptions
                    {
                        EndPoints = { cacheSettings.ConnectionString },
                        ConnectTimeout = cacheSettings.ConnectionTimeoutSeconds * 1000,
                        CommandMap = CommandMap.Create(new HashSet<string>
                        {
                            // Disable potentially dangerous commands in production
                            "FLUSHDB", "FLUSHALL", "KEYS"
                        }, available: false),
                        AbortOnConnectFail = false, // Don't fail startup if Redis is unavailable
                        ConnectRetry = cacheSettings.RetryCount
                    };

                    services.AddSingleton<IConnectionMultiplexer>(provider =>
                    {
                        var logger = provider.GetRequiredService<ILogger<IConnectionMultiplexer>>();
                        try
                        {
                            var connection = ConnectionMultiplexer.Connect(configurationOptions);
                            logger.LogInformation("Successfully connected to Redis at {ConnectionString}", cacheSettings.ConnectionString);
                            return connection;
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning(ex, "Failed to connect to Redis at {ConnectionString}. Caching will be disabled.", cacheSettings.ConnectionString);
                            return null!;
                        }
                    });
                }
                catch (Exception ex)
                {
                    // Log error but don't fail startup - create a simple logger
                    using var serviceProvider = services.BuildServiceProvider();
                    var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
                    var logger = loggerFactory.CreateLogger("CacheServiceExtensions");
                    logger.LogError(ex, "Error configuring Redis connection. Caching will be disabled.");
                }
            }
            else
            {
                // Register null connection when caching is disabled
                services.AddSingleton<IConnectionMultiplexer>(provider => null!);
            }

            // Register cache service
            services.AddSingleton<ICacheService, RedisCacheService>();

            // Add health check for Redis
            if (cacheSettings.Enabled)
            {
                services.AddHealthChecks()
                    .AddCheck<RedisCacheHealthCheck>("redis_cache");
            }

            return services;
        }
    }

    /// <summary>
    /// Health check for Redis cache connectivity
    /// </summary>
    public class RedisCacheHealthCheck : IHealthCheck
    {
        private readonly IConnectionMultiplexer? _redis;
        private readonly ILogger<RedisCacheHealthCheck> _logger;

        public RedisCacheHealthCheck(IConnectionMultiplexer? redis, ILogger<RedisCacheHealthCheck> logger)
        {
            _redis = redis;
            _logger = logger;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    return HealthCheckResult.Unhealthy("Redis is not connected");
                }

                var database = _redis.GetDatabase();
                await database.PingAsync();

                return HealthCheckResult.Healthy("Redis is connected and responsive");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Redis health check failed");
                return HealthCheckResult.Unhealthy("Redis health check failed", ex);
            }
        }
    }
}