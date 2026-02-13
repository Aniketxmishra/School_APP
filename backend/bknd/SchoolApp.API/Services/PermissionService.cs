using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SchoolApp.Infrastructure;

namespace SchoolApp.API.Services
{
    public interface IPermissionService
    {
        Task<UserPermissions> GetUserPermissionsAsync(string username);
        Task<bool> HasPermissionAsync(string username, string module, string permission, string? submodule = null);
        Task<List<ModulePermission>> GetUserModulesAsync(string username);
        Task<List<Claim>> BuildUserClaimsAsync(string username);
        Task<bool> CanAccessModuleAsync(string username, string module);
        void InvalidateUserCache(string username);
    }

    public class PermissionService : IPermissionService
    {
        private readonly SchoolAppDbContext _context;
        private readonly ILogger<PermissionService> _logger;

        public PermissionService(SchoolAppDbContext context, ILogger<PermissionService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<UserPermissions> GetUserPermissionsAsync(string username)
        {
            try
            {
                _logger.LogInformation("Fetching permissions for user: {Username}", username);

                // First get user info
                var userInfo = await _context.Database
                    .SqlQueryRaw<UserBasicInfo>(@"
                        SELECT fdusername as Username, fdusertype as UserType
                        FROM tbmaslogin 
                        WHERE fdusername = {0} AND fdstatus = 'active'", username)
                    .FirstOrDefaultAsync();

                if (userInfo == null)
                {
                    _logger.LogWarning("User not found or inactive: {Username}", username);
                    return new UserPermissions 
                    { 
                        Username = username, 
                        UserType = "student", 
                        GroupName = "Student", 
                        Modules = new List<ModulePermission>() 
                    };
                }

                // If user is admin, give full access to ALL modules from database
                if (userInfo.UserType.Equals("admin", StringComparison.OrdinalIgnoreCase))
                {
                    return await GetAdminPermissionsAsync(username);
                }

                // For non-admin users, use RBAC from tbaccessright
                var query = @"
                    SELECT 
                        l.fdusername as Username,
                        l.fdusertype as UserType,
                        sg.fdgroupname as GroupName,
                        m.fdmodulerefcode as ModuleName,
                        ar.fdsubmodulename as SubmoduleName,
                        ar.fdcanread as CanRead,
                        ar.fdcanwrite as CanWrite,
                        ar.fdcandelete as CanDelete,
                        ar.fdcanwrite as CanUpdate,
                        m.fddisplayname as DisplayName,
                        m.fdicon as Icon,
                        m.fdroute as Route
                    FROM tbmaslogin l
                    INNER JOIN tbstaffgroup sg ON l.fdgroupid = sg.fdgroupid
                    INNER JOIN tbaccessright ar ON sg.fdgroupid = ar.fdgroupid
                    INNER JOIN tbmasmodule m ON ar.fdmoduleid = m.fdid
                    WHERE l.fdusername = {0}
                        AND l.fdstatus = 'active' 
                        AND sg.fdstatus = 'active' 
                        AND ar.fdstatus = 'active'
                        AND m.fdstatus = 'active'
                    ORDER BY m.fdmodulerefcode";

                var permissions = await _context.Database
                    .SqlQueryRaw<UserPermissionDto>(query, username)
                    .AsNoTracking()
                    .ToListAsync();

                // Check for user-level permission overrides from tbgroupdml
                var userOverridesQuery = @"
                    SELECT 
                        gd.fdusername as Username,
                        m.fdmodulerefcode as ModuleName,
                        gd.fdsubmodulename as SubmoduleName,
                        gd.fdcanread as CanRead,
                        gd.fdcanwrite as CanWrite,
                        gd.fdcandelete as CanDelete,
                        gd.fdcanwrite as CanUpdate,
                        m.fddisplayname as DisplayName,
                        m.fdicon as Icon,
                        m.fdroute as Route
                    FROM tbgroupdml gd
                    INNER JOIN tbmasmodule m ON gd.fdmoduleid = m.fdid
                    WHERE gd.fdusername = {0}
                        AND gd.fdstatus = 'active'
                        AND m.fdstatus = 'active'
                        AND (gd.fdefffromdate IS NULL OR gd.fdefffromdate <= CURDATE())
                        AND (gd.fdefftodate IS NULL OR gd.fdefftodate >= CURDATE())";

                List<UserPermissionDto> userOverrides;
                try
                {
                    userOverrides = await _context.Database
                        .SqlQueryRaw<UserPermissionDto>(userOverridesQuery, username)
                        .AsNoTracking()
                        .ToListAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error fetching user overrides for {Username}, continuing without overrides", username);
                    userOverrides = new List<UserPermissionDto>();
                }

                // Merge group permissions with user overrides
                var allPermissions = permissions.ToList();
                
                foreach (var userOverride in userOverrides)
                {
                    var existingPerm = allPermissions.FirstOrDefault(p => 
                        p.ModuleName == userOverride.ModuleName && 
                        p.SubmoduleName == userOverride.SubmoduleName);

                    if (existingPerm != null)
                    {
                        existingPerm.CanRead = userOverride.CanRead;
                        existingPerm.CanWrite = userOverride.CanWrite;
                        existingPerm.CanDelete = userOverride.CanDelete;
                        existingPerm.CanUpdate = userOverride.CanUpdate;
                    }
                    else
                    {
                        allPermissions.Add(userOverride);
                    }
                }

                var result = new UserPermissions
                {
                    Username = username,
                    UserType = allPermissions.FirstOrDefault()?.UserType ?? userInfo.UserType,
                    GroupName = allPermissions.FirstOrDefault()?.GroupName ?? "Default",
                    Modules = allPermissions
                        .GroupBy(p => p.ModuleName)
                        .Select(g => new ModulePermission
                        {
                            ModuleName = g.Key,
                            DisplayName = g.First().DisplayName,
                            Icon = g.First().Icon,
                            Route = g.First().Route,
                            CanRead = g.Any(p => p.CanRead),
                            CanWrite = g.Any(p => p.CanWrite),
                            CanDelete = g.Any(p => p.CanDelete),
                            CanUpdate = g.Any(p => p.CanUpdate),
                            Submodules = g
                                .Where(p => !string.IsNullOrEmpty(p.SubmoduleName))
                                .Select(p => new SubmodulePermission
                                {
                                    SubmoduleName = p.SubmoduleName!,
                                    CanRead = p.CanRead,
                                    CanWrite = p.CanWrite,
                                    CanDelete = p.CanDelete,
                                    CanUpdate = p.CanUpdate
                                })
                                .DistinctBy(s => s.SubmoduleName)
                                .ToList()
                        })
                        .ToList()
                };

                _logger.LogInformation("Successfully fetched {ModuleCount} module permissions for user: {Username}", 
                    result.Modules.Count, username);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user permissions for {Username}", username);
                return new UserPermissions 
                { 
                    Username = username, 
                    UserType = "student", 
                    GroupName = "Student", 
                    Modules = new List<ModulePermission>() 
                };
            }
        }

        private async Task<UserPermissions> GetAdminPermissionsAsync(string username)
        {
            try
            {
                _logger.LogInformation("Loading ALL available modules for admin user: {Username}", username);

                // Get ALL active modules from database for admin (no filtering)
                var modules = await _context.Database
                    .SqlQueryRaw<ModuleInfo>(@"
                        SELECT 
                            fdid as ModuleId,
                            fdmodulerefcode as ModuleName, 
                            fddisplayname as DisplayName, 
                            fdicon as Icon, 
                            fdroute as Route
                        FROM tbmasmodule 
                        WHERE fdstatus = 'active'
                        ORDER BY fdmodulerefcode")
                    .AsNoTracking()
                    .ToListAsync();

                if (!modules.Any())
                {
                    _logger.LogWarning("No modules found in database for admin, using default fallback modules");
                    modules = GetDefaultAdminModules();
                }
                else
                {
                    _logger.LogInformation("Successfully loaded {ModuleCount} modules from database for admin user: {Username}", 
                        modules.Count, username);
                }

                // Give admin FULL access to ALL modules
                return new UserPermissions
                {
                    Username = username,
                    UserType = "admin",
                    GroupName = "Super Admin",
                    Modules = modules.Select(m => new ModulePermission
                    {
                        ModuleName = m.ModuleName,
                        DisplayName = m.DisplayName,
                        Icon = m.Icon,
                        Route = m.Route,
                        CanRead = true,      // Full access
                        CanWrite = true,     // Full access
                        CanDelete = true,    // Full access
                        CanUpdate = true,    // Full access
                        Submodules = new List<SubmodulePermission>()
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting admin permissions for {Username}, using fallback defaults", username);
                
                // Fallback to default admin modules on database error
                var fallbackModules = GetDefaultAdminModules();
                
                return new UserPermissions
                {
                    Username = username,
                    UserType = "admin",
                    GroupName = "Super Admin",
                    Modules = fallbackModules.Select(m => new ModulePermission
                    {
                        ModuleName = m.ModuleName,
                        DisplayName = m.DisplayName,
                        Icon = m.Icon,
                        Route = m.Route,
                        CanRead = true,
                        CanWrite = true,
                        CanDelete = true,
                        CanUpdate = true,
                        Submodules = new List<SubmodulePermission>()
                    }).ToList()
                };
            }
        }

        private List<ModuleInfo> GetDefaultAdminModules()
        {
            _logger.LogWarning("Using hardcoded default admin modules - database query failed");
            
            // All 19 modules from your database as fallback
            return new List<ModuleInfo>
            {
                new() { ModuleId = 1, ModuleName = "STUDENT_MGMT", DisplayName = "Student Management", Icon = "people", Route = "/students" },
                new() { ModuleId = 2, ModuleName = "TEACHER_MGMT", DisplayName = "Teacher Management", Icon = "person", Route = "/teachers" },
                new() { ModuleId = 3, ModuleName = "ATTENDANCE", DisplayName = "Attendance", Icon = "check-circle", Route = "/attendance" },
                new() { ModuleId = 4, ModuleName = "ACADEMIC", DisplayName = "Academic", Icon = "school", Route = "/academic" },
                new() { ModuleId = 5, ModuleName = "FEE_MGMT", DisplayName = "Fee Management", Icon = "payment", Route = "/fees" },
                new() { ModuleId = 6, ModuleName = "LIBRARY", DisplayName = "Library", Icon = "library-books", Route = "/library" },
                new() { ModuleId = 7, ModuleName = "COMMUNICATION", DisplayName = "Communication", Icon = "message", Route = "/communication" },
                new() { ModuleId = 8, ModuleName = "REPORTS", DisplayName = "Reports", Icon = "assessment", Route = "/reports" },
                new() { ModuleId = 9, ModuleName = "SYSTEM_SETTINGS", DisplayName = "System Settings", Icon = "settings", Route = "/settings" },
                new() { ModuleId = 10, ModuleName = "GALLERY", DisplayName = "Gallery", Icon = "photo", Route = "/gallery" },
                new() { ModuleId = 11, ModuleName = "LIVE_CLASS", DisplayName = "Live Classes", Icon = "video", Route = "/live-class" },
                new() { ModuleId = 12, ModuleName = "BUS_TRACKING", DisplayName = "Bus Tracking", Icon = "directions-bus", Route = "/bus-tracking" },
                new() { ModuleId = 13, ModuleName = "LEAVE_MGMT", DisplayName = "Leave Management", Icon = "event-busy", Route = "/leave" },
                new() { ModuleId = 14, ModuleName = "ASSIGNMENTS", DisplayName = "Assignments", Icon = "assignment", Route = "/assignments" },
                new() { ModuleId = 15, ModuleName = "EXAM_MGMT", DisplayName = "Exam Management", Icon = "assignment-turned-in", Route = "/exams" },
                new() { ModuleId = 16, ModuleName = "TIMETABLE", DisplayName = "Timetable", Icon = "schedule", Route = "/timetable" },
                new() { ModuleId = 17, ModuleName = "CALENDAR", DisplayName = "Calendar/Holidays", Icon = "calendar-today", Route = "/calendar" },
                new() { ModuleId = 18, ModuleName = "NEWS", DisplayName = "News & Stories", Icon = "newspaper", Route = "/news" },
                new() { ModuleId = 19, ModuleName = "STUDENT_DASHBOARD", DisplayName = "Student Dashboard", Icon = "dashboard", Route = "/student-dashboard" }
            };
        }

        public async Task<bool> HasPermissionAsync(string username, string module, string permission, string? submodule = null)
        {
            try
            {
                var userPermissions = await GetUserPermissionsAsync(username);
                var modulePermission = userPermissions.Modules
                    .FirstOrDefault(m => m.ModuleName.Equals(module, StringComparison.OrdinalIgnoreCase));
                
                if (modulePermission == null) 
                {
                    _logger.LogDebug("Module {Module} not found for user {Username}", module, username);
                    return false;
                }

                if (!string.IsNullOrEmpty(submodule))
                {
                    var submodulePermission = modulePermission.Submodules
                        .FirstOrDefault(s => s.SubmoduleName.Equals(submodule, StringComparison.OrdinalIgnoreCase));
                    
                    if (submodulePermission == null)
                    {
                        _logger.LogDebug("Submodule {Submodule} not found for user {Username}", submodule, username);
                        return false;
                    }
                    
                    return permission.ToLower() switch
                    {
                        "read" => submodulePermission.CanRead,
                        "write" => submodulePermission.CanWrite,
                        "delete" => submodulePermission.CanDelete,
                        "update" => submodulePermission.CanUpdate,
                        _ => false
                    };
                }

                return permission.ToLower() switch
                {
                    "read" => modulePermission.CanRead,
                    "write" => modulePermission.CanWrite,
                    "delete" => modulePermission.CanDelete,
                    "update" => modulePermission.CanUpdate,
                    _ => false
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking permission for {Username}, Module: {Module}, Permission: {Permission}", 
                    username, module, permission);
                return false;
            }
        }

        public async Task<List<ModulePermission>> GetUserModulesAsync(string username)
        {
            var userPermissions = await GetUserPermissionsAsync(username);
            return userPermissions.Modules.Where(m => m.CanRead).ToList();
        }

        public async Task<List<Claim>> BuildUserClaimsAsync(string username)
        {
            var claims = new List<Claim>();
            var userPermissions = await GetUserPermissionsAsync(username);

            claims.Add(new Claim(ClaimTypes.Name, username));
            claims.Add(new Claim("UserType", userPermissions.UserType));
            claims.Add(new Claim("GroupName", userPermissions.GroupName));

            foreach (var module in userPermissions.Modules)
            {
                if (module.CanRead) claims.Add(new Claim($"Module:{module.ModuleName}", "Read"));
                if (module.CanWrite) claims.Add(new Claim($"Module:{module.ModuleName}", "Write"));
                if (module.CanDelete) claims.Add(new Claim($"Module:{module.ModuleName}", "Delete"));
                if (module.CanUpdate) claims.Add(new Claim($"Module:{module.ModuleName}", "Update"));

                foreach (var submodule in module.Submodules)
                {
                    if (submodule.CanRead) 
                        claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Read"));
                    if (submodule.CanWrite) 
                        claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Write"));
                    if (submodule.CanDelete) 
                        claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Delete"));
                    if (submodule.CanUpdate) 
                        claims.Add(new Claim($"Submodule:{module.ModuleName}:{submodule.SubmoduleName}", "Update"));
                }
            }

            return claims;
        }

        public async Task<bool> CanAccessModuleAsync(string username, string module)
        {
            return await HasPermissionAsync(username, module, "read");
        }

        public void InvalidateUserCache(string username)
        {
            _logger.LogInformation("Cache invalidation called for user: {Username}", username);
        }
    }

    // DTOs
    public class UserPermissions
    {
        public string Username { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
        public List<ModulePermission> Modules { get; set; } = new();
    }

    public class ModulePermission
    {
        public string ModuleName { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Icon { get; set; }
        public string? Route { get; set; }
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
        public bool CanUpdate { get; set; }
        public List<SubmodulePermission> Submodules { get; set; } = new();
    }

    public class SubmodulePermission
    {
        public string SubmoduleName { get; set; } = string.Empty;
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
        public bool CanUpdate { get; set; }
    }

    public class UserPermissionDto
    {
        public string Username { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
        public string ModuleName { get; set; } = string.Empty;
        public string? SubmoduleName { get; set; }
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public bool CanDelete { get; set; }
        public bool CanUpdate { get; set; }
        public string? DisplayName { get; set; }
        public string? Icon { get; set; }
        public string? Route { get; set; }
    }

    public class UserBasicInfo
    {
        public string Username { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
    }

    public class ModuleInfo
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Icon { get; set; }
        public string? Route { get; set; }
    }
}
