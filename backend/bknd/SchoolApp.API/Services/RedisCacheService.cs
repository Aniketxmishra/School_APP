using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System.Text.Json;
using SchoolApp.API.Configuration;

namespace SchoolApp.API.Services
{
    /// <summary>
    /// Redis implementation of the caching service with graceful degradation
    /// </summary>
    public class RedisCacheService : ICacheService, IDisposable
    {
        private readonly IConnectionMultiplexer? _redis;
        private readonly IDatabase? _database;
        private readonly ILogger<RedisCacheService> _logger;
        private readonly CacheSettings _settings;
        private readonly JsonSerializerOptions _jsonOptions;
        private long _hitCount = 0;
        private long _missCount = 0;
        private bool _isConnected = false;

        public RedisCacheService(IConnectionMultiplexer? redis, IOptions<CacheSettings> settings, ILogger<RedisCacheService> logger)
        {
            _redis = redis;
            _database = redis?.GetDatabase();
            _logger = logger;
            _settings = settings.Value;
            _isConnected = redis?.IsConnected ?? false;

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };

            if (!_isConnected && _settings.Enabled)
            {
                _logger.LogWarning("Redis is not connected. Cache operations will be bypassed.");
            }
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            if (!_settings.Enabled || !_isConnected || _database == null)
            {
                Interlocked.Increment(ref _missCount);
                return null;
            }

            try
            {
                var cacheKey = GenerateCacheKey(key);
                var cachedValue = await _database.StringGetAsync(cacheKey);

                if (!cachedValue.HasValue)
                {
                    Interlocked.Increment(ref _missCount);
                    return null;
                }

                Interlocked.Increment(ref _hitCount);
                var result = JsonSerializer.Deserialize<T>(cachedValue!, _jsonOptions);
                _logger.LogDebug("Cache hit for key: {Key}", cacheKey);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cache value for key: {Key}", key);
                Interlocked.Increment(ref _missCount);
                return null;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            if (!_settings.Enabled || !_isConnected || _database == null)
            {
                return;
            }

            try
            {
                var cacheKey = GenerateCacheKey(key);
                var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
                var expiryTime = expiry ?? _settings.DefaultTTL;

                await _database.StringSetAsync(cacheKey, serializedValue, expiryTime);
                _logger.LogDebug("Cache set for key: {Key} with expiry: {Expiry}", cacheKey, expiryTime);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cache value for key: {Key}", key);
            }
        }

        public async Task RemoveAsync(string key)
        {
            if (!_settings.Enabled || !_isConnected || _database == null)
            {
                return;
            }

            try
            {
                var cacheKey = GenerateCacheKey(key);
                await _database.KeyDeleteAsync(cacheKey);
                _logger.LogDebug("Cache removed for key: {Key}", cacheKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cache value for key: {Key}", key);
            }
        }

        public async Task RemoveByPatternAsync(string pattern)
        {
            if (!_settings.Enabled || !_isConnected || _redis == null)
            {
                return;
            }

            try
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var cachePattern = GenerateCacheKey(pattern);
                var keys = server.Keys(pattern: cachePattern).ToArray();

                if (keys.Length > 0)
                {
                    await _database!.KeyDeleteAsync(keys);
                    _logger.LogDebug("Cache removed for pattern: {Pattern}, {Count} keys deleted", cachePattern, keys.Length);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cache values for pattern: {Pattern}", pattern);
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            if (!_settings.Enabled || !_isConnected || _database == null)
            {
                return false;
            }

            try
            {
                var cacheKey = GenerateCacheKey(key);
                return await _database.KeyExistsAsync(cacheKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking cache existence for key: {Key}", key);
                return false;
            }
        }

        public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> getItem, TimeSpan? expiry = null) where T : class
        {
            var cachedItem = await GetAsync<T>(key);
            if (cachedItem != null)
            {
                return cachedItem;
            }

            var item = await getItem();
            if (item != null)
            {
                await SetAsync(key, item, expiry);
            }

            return item;
        }

        public async Task<CacheStatistics> GetStatisticsAsync()
        {
            var stats = new CacheStatistics
            {
                HitCount = _hitCount,
                MissCount = _missCount,
                IsConnected = _isConnected,
                ConnectionStatus = _isConnected ? "Connected" : "Disconnected"
            };

            if (_isConnected && _redis != null)
            {
                try
                {
                    var server = _redis.GetServer(_redis.GetEndPoints().First());
                    var info = await server.InfoAsync("stats");
                    var statsGroup = info.FirstOrDefault();
                    var connectedClients = statsGroup?.FirstOrDefault(x => x.Key == "connected_clients");
                    stats.ConnectionStatus = $"Connected - {connectedClients?.Value ?? "Unknown"} clients";
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Could not retrieve Redis server statistics");
                    stats.ConnectionStatus = "Connected - Stats unavailable";
                }
            }

            return stats;
        }

        private string GenerateCacheKey(string key)
        {
            return $"{_settings.KeyPrefix}:{key}";
        }

        public void Dispose()
        {
            _redis?.Dispose();
        }
    }
}