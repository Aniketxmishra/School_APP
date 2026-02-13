using SchoolApp.API.Configuration;
using Microsoft.Extensions.Options;

namespace SchoolApp.API.Validators
{
    /// <summary>
    /// Validator for cache configuration settings
    /// </summary>
    public class CacheSettingsValidator : IValidateOptions<CacheSettings>
    {
        public ValidateOptionsResult Validate(string? name, CacheSettings options)
        {
            var failures = new List<string>();

            // Validate connection string
            if (options.Enabled && string.IsNullOrWhiteSpace(options.ConnectionString))
            {
                failures.Add("ConnectionString is required when caching is enabled");
            }

            // Validate TTL values
            if (options.DefaultTTL <= TimeSpan.Zero)
            {
                failures.Add("DefaultTTL must be greater than zero");
            }

            if (options.PermissionsTTL <= TimeSpan.Zero)
            {
                failures.Add("PermissionsTTL must be greater than zero");
            }

            if (options.AttendanceTTL <= TimeSpan.Zero)
            {
                failures.Add("AttendanceTTL must be greater than zero");
            }

            if (options.StudentDataTTL <= TimeSpan.Zero)
            {
                failures.Add("StudentDataTTL must be greater than zero");
            }

            if (options.TeacherDataTTL <= TimeSpan.Zero)
            {
                failures.Add("TeacherDataTTL must be greater than zero");
            }

            // Validate key prefix
            if (string.IsNullOrWhiteSpace(options.KeyPrefix))
            {
                failures.Add("KeyPrefix cannot be empty");
            }

            // Validate timeout values
            if (options.ConnectionTimeoutSeconds <= 0)
            {
                failures.Add("ConnectionTimeoutSeconds must be greater than zero");
            }

            if (options.CommandTimeoutSeconds <= 0)
            {
                failures.Add("CommandTimeoutSeconds must be greater than zero");
            }

            if (options.RetryCount < 0)
            {
                failures.Add("RetryCount cannot be negative");
            }

            // Validate reasonable TTL limits (not too long)
            var maxTTL = TimeSpan.FromHours(24);
            if (options.DefaultTTL > maxTTL)
            {
                failures.Add($"DefaultTTL should not exceed {maxTTL.TotalHours} hours");
            }

            if (options.PermissionsTTL > maxTTL)
            {
                failures.Add($"PermissionsTTL should not exceed {maxTTL.TotalHours} hours");
            }

            if (failures.Count > 0)
            {
                return ValidateOptionsResult.Fail(failures);
            }

            return ValidateOptionsResult.Success;
        }
    }
}