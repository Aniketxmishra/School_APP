using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchoolApp.Infrastructure;
using SchoolApp.API.Extensions;
using SchoolApp.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<SchoolAppDbContext>(opt =>
    opt.UseMySql(
        builder.Configuration.GetConnectionString("Default"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("Default"))
    )
);

// Add CORS for mobile app connectivity
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMobileApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Redis Caching
builder.Services.AddRedisCaching(builder.Configuration);

// Add Services - Use decorator pattern for cached permissions
builder.Services.AddScoped<SchoolApp.API.Services.PermissionService>();
builder.Services.AddScoped<SchoolApp.API.Services.IPermissionService>(provider =>
{
    var baseService = provider.GetRequiredService<SchoolApp.API.Services.PermissionService>();
    var cacheService = provider.GetRequiredService<SchoolApp.API.Services.ICacheService>();
    var cacheSettings = provider.GetRequiredService<Microsoft.Extensions.Options.IOptions<SchoolApp.API.Configuration.CacheSettings>>();
    var logger = provider.GetRequiredService<ILogger<SchoolApp.API.Services.CachedPermissionService>>();
    
    return new SchoolApp.API.Services.CachedPermissionService(baseService, cacheService, cacheSettings, logger);
});

// Register the cached permission service interface separately for cache management
builder.Services.AddScoped<SchoolApp.API.Services.ICachedPermissionService>(provider =>
    (SchoolApp.API.Services.ICachedPermissionService)provider.GetRequiredService<SchoolApp.API.Services.IPermissionService>());

// Register cached student service
builder.Services.AddScoped<SchoolApp.API.Services.ICachedStudentService, SchoolApp.API.Services.CachedStudentService>();

// Register cached teacher service
builder.Services.AddScoped<SchoolApp.API.Services.ICachedTeacherService, SchoolApp.API.Services.CachedTeacherService>();

// Register attendance service
builder.Services.AddScoped<SchoolApp.API.Services.IAttendanceService, SchoolApp.API.Services.AttendanceService>();

// Register leave service
builder.Services.AddScoped<SchoolApp.API.Services.ILeaveService, SchoolApp.API.Services.LeaveService>();

// Register academic services
builder.Services.AddScoped<SchoolApp.API.Services.ITimetableService, SchoolApp.API.Services.TimetableService>();
builder.Services.AddScoped<SchoolApp.API.Services.IHomeworkService, SchoolApp.API.Services.HomeworkService>();
builder.Services.AddScoped<SchoolApp.API.Services.ILiveClassService, SchoolApp.API.Services.LiveClassService>();

// Register library and gallery services
builder.Services.AddScoped<SchoolApp.API.Services.ILibraryService, SchoolApp.API.Services.LibraryService>();
builder.Services.AddScoped<SchoolApp.API.Services.IGalleryService, SchoolApp.API.Services.GalleryService>();

// Register fees and notification services
builder.Services.AddScoped<SchoolApp.API.Services.IFeesService, SchoolApp.API.Services.FeesService>();
builder.Services.AddScoped<SchoolApp.API.Services.INotificationService, SchoolApp.API.Services.NotificationService>();

// Add Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Authentication config
var jwt = builder.Configuration.GetSection("Jwt");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowMobileApp");

// Add cache logging middleware
app.UseCacheLogging();

// Add health check endpoint
app.MapGet("/api/health", () => new { 
    status = "healthy", 
    message = "API is running successfully", 
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
});

// Map health checks
app.MapHealthChecks("/api/health/cache");

// Add test endpoint
app.MapGet("/api/test/connection", async (SchoolAppDbContext context) => {
    try 
    {
        await context.Database.CanConnectAsync();
        return Results.Ok(new { 
            status = "success", 
            message = "Database connection successful",
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database connection failed: {ex.Message}");
    }
});

// Add cache configuration test endpoint
app.MapGet("/api/test/cache-config", (IConfiguration config) => {
    var cacheSection = config.GetSection("Cache");
    return Results.Ok(new {
        enabled = cacheSection.GetValue<bool>("Enabled"),
        connectionString = cacheSection.GetValue<string>("ConnectionString"),
        defaultTTL = cacheSection.GetValue<string>("DefaultTTL"),
        keyPrefix = cacheSection.GetValue<string>("KeyPrefix"),
        environment = app.Environment.EnvironmentName,
        timestamp = DateTime.UtcNow
    });
});

// Add permission service test endpoint
app.MapGet("/api/test/permissions/{username}", async (string username, SchoolApp.API.Services.IPermissionService permissionService) => {
    try
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        var permissions = await permissionService.GetUserPermissionsAsync(username);
        stopwatch.Stop();
        
        return Results.Ok(new {
            username = username,
            userType = permissions.UserType,
            groupName = permissions.GroupName,
            moduleCount = permissions.Modules.Count,
            responseTimeMs = stopwatch.ElapsedMilliseconds,
            usingCache = permissionService.GetType().Name.Contains("Cached"),
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Permission test failed: {ex.Message}");
    }
});

// Add student service test endpoint
app.MapGet("/api/test/students", async (SchoolApp.API.Services.ICachedStudentService studentService) => {
    try
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        var students = await studentService.GetAllRealStudentsAsync();
        stopwatch.Stop();
        
        return Results.Ok(new {
            studentCount = students.Count,
            responseTimeMs = stopwatch.ElapsedMilliseconds,
            usingCache = true,
            sampleStudents = students.Take(3).Select(s => new { s.FdStudentId, s.FdStudentName, s.FdEnrollmentNo }),
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Student test failed: {ex.Message}");
    }
});

// Add teacher service test endpoint
app.MapGet("/api/test/teachers", async (SchoolApp.API.Services.ICachedTeacherService teacherService) => {
    try
    {
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        var teachers = await teacherService.GetAllRealTeachersAsync();
        stopwatch.Stop();
        
        return Results.Ok(new {
            teacherCount = teachers.Count,
            responseTimeMs = stopwatch.ElapsedMilliseconds,
            usingCache = true,
            sampleTeachers = teachers.Take(3).Select(t => new { t.FdTeacherId, t.FdFirstName, t.FdLastName, t.FdStaffCode }),
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Teacher test failed: {ex.Message}");
    }
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
