using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolApp.API.Services;
using SchoolApp.Infrastructure;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace SchoolApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SchoolAppDbContext _context;
        private readonly IPermissionService _permissionService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            SchoolAppDbContext context, 
            IPermissionService permissionService,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _context = context;
            _permissionService = permissionService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Username and password are required" });
                }

                // Check user credentials
                var user = await _context.Database
                    .SqlQueryRaw<UserLoginDto>(@"
                        SELECT l.fdusername as Username, l.fdpassword as Password, l.fdusertype as UserType, 
                               l.fdstatus as Status, COALESCE(sg.fdgroupname, 'Student') as GroupName, 
                               l.fdnooftimepwdtried as FailedCount, NULL as LockedUntil
                        FROM tbmaslogin l
                        LEFT JOIN tbstaffgroup sg ON l.fdgroupid = sg.fdgroupid
                        WHERE l.fdusername = {0} AND l.fdstatus = 'active'", request.Username)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    await LogLoginAttempt(request.Username, "failed", "User not found");
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                // Note: Account lockout functionality removed due to missing database column

                // Verify password (in production, use proper password hashing)
                if (!VerifyPassword(request.Password, user.Password))
                {
                    await UpdateFailedLoginCount(request.Username, user.FailedCount + 1);
                    await LogLoginAttempt(request.Username, "failed", "Invalid password");
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                // Reset failed count on successful login
                await UpdateFailedLoginCount(request.Username, 0);
                await UpdateLastLoginDate(request.Username);

                // Get user permissions
                var permissions = await _permissionService.GetUserPermissionsAsync(request.Username);
                var claims = await _permissionService.BuildUserClaimsAsync(request.Username);

                // Generate JWT token
                var token = GenerateJwtToken(claims);

                await LogLoginAttempt(request.Username, "success", "Login successful");

                return Ok(new LoginResponse
                {
                    Success = true,
                    Token = token,
                    User = new UserInfo
                    {
                        Username = user.Username,
                        UserType = user.UserType,
                        GroupName = user.GroupName ?? "Student",
                        Permissions = permissions
                    },
                    Message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user {Username}", request.Username);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout([FromBody] LogoutRequest request)
        {
            try
            {
                await LogLoginAttempt(request.Username, "logout", "User logged out");
                return Ok(new { message = "Logout successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout for user {Username}", request.Username);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("validate-token")]
        public async Task<ActionResult<TokenValidationResponse>> ValidateToken()
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var permissions = await _permissionService.GetUserPermissionsAsync(username);
                
                return Ok(new TokenValidationResponse
                {
                    Valid = true,
                    Username = username,
                    Permissions = permissions
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Unauthorized(new { message = "Invalid token" });
            }
        }

        [HttpGet("test/users")]
        public async Task<ActionResult> GetTestUsers()
        {
            try
            {
                // First check if table exists and get all users
                var allUsers = await _context.Database
                    .SqlQueryRaw<TestUserDto>(@"
                        SELECT fdusername as Username, fdpassword as Password, fdusertype as UserType, 
                               fdstatus as Status
                        FROM tbmaslogin 
                        LIMIT 10")
                    .ToListAsync();

                return Ok(new { 
                    totalUsers = allUsers.Count,
                    users = allUsers,
                    message = allUsers.Count == 0 ? "No users found in tbmaslogin table" : "Users found"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving test users");
                return StatusCode(500, new { 
                    message = "Error retrieving users", 
                    error = ex.Message,
                    suggestion = "Table 'tbmaslogin' might not exist or have different structure"
                });
            }
        }

        [HttpGet("test/rbac-debug/{username}")]
        public async Task<ActionResult> GetRbacDebug(string username)
        {
            try
            {
                // Get user details with group info
                var userInfo = await _context.Database
                    .SqlQueryRaw<UserRbacDebugDto>(@"
                        SELECT l.fdusername as Username, l.fdusertype as UserType, 
                               l.fdgroupid as GroupId, sg.fdgroupname as GroupName
                        FROM tbmaslogin l
                        LEFT JOIN tbstaffgroup sg ON l.fdgroupid = sg.fdgroupid
                        WHERE l.fdusername = {0}", username)
                    .FirstOrDefaultAsync();

                if (userInfo == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Get all modules
                var modules = await _context.Database
                    .SqlQueryRaw<ModuleDebugDto>(@"
                        SELECT fdid as ModuleId, fddisplayname as DisplayName, 
                               fdstatus as Status, fdmodulerefcode as ModuleName
                        FROM tbmasmodule 
                        WHERE fdstatus = 'active'")
                    .ToListAsync();

                // Get access rights for user's group
                var accessRights = await _context.Database
                    .SqlQueryRaw<AccessRightDebugDto>(@"
                        SELECT ar.fdgroupid as GroupId, ar.fdmoduleid as ModuleId,
                               ar.fdcanread as CanRead, ar.fdcanwrite as CanWrite,
                               m.fddisplayname as ModuleName
                        FROM tbaccessright ar
                        JOIN tbmasmodule m ON ar.fdmoduleid = m.fdid
                        WHERE ar.fdgroupid = {0}", userInfo.GroupId ?? 0)
                    .ToListAsync();

                return Ok(new {
                    user = userInfo,
                    totalModules = modules.Count,
                    modules = modules,
                    userAccessRights = accessRights,
                    issue = accessRights.Count == 0 ? "No access rights found for user's group" : "Access rights exist"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RBAC debug for user {Username}", username);
                return StatusCode(500, new { 
                    message = "Error debugging RBAC", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost("test/setup-rbac")]
        public async Task<ActionResult> SetupRbac()
        {
            try
            {
                // 1. Create modules
                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT IGNORE INTO tbmasmodule (fdid, fdmodulerefcode, fddisplayname, fdstatus, fdicon, fdroute, fdcreatedby, fdcreatedon)
                    VALUES 
                    (1, 'DASHBOARD', 'Dashboard', 'active', 'dashboard', '/dashboard', 'system', NOW()),
                    (2, 'STUDENTS', 'Student Management', 'active', 'people', '/students', 'system', NOW()),
                    (3, 'TEACHERS', 'Teacher Management', 'active', 'person', '/teachers', 'system', NOW()),
                    (4, 'CLASSES', 'Class Management', 'active', 'school', '/classes', 'system', NOW()),
                    (5, 'ATTENDANCE', 'Attendance', 'active', 'check-circle', '/attendance', 'system', NOW()),
                    (6, 'FEES', 'Fee Management', 'active', 'payment', '/fees', 'system', NOW()),
                    (7, 'EXAMS', 'Exam Management', 'active', 'assignment', '/exams', 'system', NOW()),
                    (8, 'LIBRARY', 'Library Management', 'active', 'library-books', '/library', 'system', NOW()),
                    (9, 'REPORTS', 'Reports', 'active', 'assessment', '/reports', 'system', NOW()),
                    (10, 'SETTINGS', 'System Settings', 'active', 'settings', '/settings', 'system', NOW())");

                // 2. Create staff groups
                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT IGNORE INTO tbstaffgroup (fdgroupid, fdgroupname, fdstatus, fdcreatedby, fdcreatedon)
                    VALUES 
                    (1, 'Super Admin', 'active', 'system', NOW()),
                    (2, 'Teacher', 'active', 'system', NOW()),
                    (3, 'Student', 'active', 'system', NOW()),
                    (4, 'Parent', 'active', 'system', NOW())");

                // 3. Update user group assignments
                await _context.Database.ExecuteSqlRawAsync(@"
                    UPDATE tbmaslogin SET fdgroupid = 1 WHERE fdusertype = 'admin'");
                await _context.Database.ExecuteSqlRawAsync(@"
                    UPDATE tbmaslogin SET fdgroupid = 2 WHERE fdusertype = 'teacher'");
                await _context.Database.ExecuteSqlRawAsync(@"
                    UPDATE tbmaslogin SET fdgroupid = 3 WHERE fdusertype = 'student'");
                await _context.Database.ExecuteSqlRawAsync(@"
                    UPDATE tbmaslogin SET fdgroupid = 4 WHERE fdusertype = 'parent'");

                // 4. Create access rights for all groups
                // Super Admin - full access
                for (int moduleId = 1; moduleId <= 10; moduleId++)
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
                        VALUES ({0}, {1}, 'Y', 'Y', 'Y', 'active', 'system', NOW())", 1, moduleId);
                }

                // Teacher - selective access
                var teacherModules = new[] { 1, 2, 4, 5, 7, 8, 9 };
                foreach (var moduleId in teacherModules)
                {
                    var canWrite = moduleId == 2 || moduleId == 5 || moduleId == 7 || moduleId == 8 ? "Y" : "N";
                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
                        VALUES ({0}, {1}, 'Y', {2}, 'N', 'active', 'system', NOW())", 2, moduleId, canWrite);
                }

                // Student - read-only access
                var studentModules = new[] { 1, 5, 7, 8 };
                foreach (var moduleId in studentModules)
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
                        VALUES ({0}, {1}, 'Y', 'N', 'N', 'active', 'system', NOW())", 3, moduleId);
                }

                // Parent - read-only access
                var parentModules = new[] { 1, 2, 5, 6, 7 };
                foreach (var moduleId in parentModules)
                {
                    await _context.Database.ExecuteSqlRawAsync(@"
                        INSERT IGNORE INTO tbaccessright (fdgroupid, fdmoduleid, fdcanread, fdcanwrite, fdcandelete, fdstatus, fdcreatedby, fdcreatedon)
                        VALUES ({0}, {1}, 'Y', 'N', 'N', 'active', 'system', NOW())", 4, moduleId);
                }

                return Ok(new { message = "RBAC setup completed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting up RBAC");
                return StatusCode(500, new { 
                    message = "Error setting up RBAC", 
                    error = ex.Message 
                });
            }
        }

        [HttpPost("test/create-users")]
        public async Task<ActionResult> CreateTestUsers()
        {
            try
            {
                // Create some test users for authentication
                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT IGNORE INTO tbmaslogin (fdusername, fdpassword, fdusertype, fdstatus, fdnooftimepwdtried, fdcreatedby, fdcreatedon)
                    VALUES 
                    ('admin', 'admin123', 'admin', 'active', 0, 'system', NOW()),
                    ('teacher1', 'teacher123', 'teacher', 'active', 0, 'system', NOW()),
                    ('student1', 'student123', 'student', 'active', 0, 'system', NOW()),
                    ('parent1', 'parent123', 'parent', 'active', 0, 'system', NOW())");

                return Ok(new { message = "Test users created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating test users");
                return StatusCode(500, new { 
                    message = "Error creating test users", 
                    error = ex.Message 
                });
            }
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            // Compare with actual database password
            // Note: In production, use proper password hashing like BCrypt
            return password == hashedPassword;
        }

        private string GenerateJwtToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-secret-key-here-make-it-long-enough"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "SchoolApp",
                audience: _configuration["Jwt:Audience"] ?? "SchoolApp",
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task LogLoginAttempt(string username, string status, string details)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO tbloginaudit (fdusername, fdstatus, fdlogindatetime, fdmodulename, fdsubmodulename)
                    VALUES ({0}, {1}, {2}, 'Authentication', {3})",
                    username, status, DateTime.Now, details);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging login attempt for {Username}", username);
            }
        }

        private async Task UpdateFailedLoginCount(string username, int count)
        {
            try
            {
                // Update the failed login count (using existing column)
                await _context.Database.ExecuteSqlRawAsync(@"
                    UPDATE tbmaslogin 
                    SET fdnooftimepwdtried = {1}
                    WHERE fdusername = {0}",
                    username, count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating failed login count for {Username}", username);
            }
        }

        private async Task UpdateLastLoginDate(string username)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(@"
                    UPDATE tbmaslogin 
                    SET fdlastlogindate = {1}
                    WHERE fdusername = {0}",
                    username, DateTime.Now);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating last login date for {Username}", username);
            }
        }
    }

    // DTOs
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LogoutRequest
    {
        public string Username { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public UserInfo User { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }

    public class UserInfo
    {
        public string Username { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
        public UserPermissions Permissions { get; set; } = new();
    }

    public class TokenValidationResponse
    {
        public bool Valid { get; set; }
        public string Username { get; set; } = string.Empty;
        public UserPermissions Permissions { get; set; } = new();
    }

    public class UserLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? GroupName { get; set; }
        public int FailedCount { get; set; }
        public DateTime? LockedUntil { get; set; }
    }

    public class TestUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class UserRbacDebugDto
    {
        public string Username { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public int? GroupId { get; set; }
        public string? GroupName { get; set; }
    }

    public class ModuleDebugDto
    {
        public int ModuleId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ModuleName { get; set; } = string.Empty;
    }

    public class AccessRightDebugDto
    {
        public int GroupId { get; set; }
        public int ModuleId { get; set; }
        public string CanRead { get; set; } = string.Empty;
        public string CanWrite { get; set; } = string.Empty;
        public string ModuleName { get; set; } = string.Empty;
    }
}