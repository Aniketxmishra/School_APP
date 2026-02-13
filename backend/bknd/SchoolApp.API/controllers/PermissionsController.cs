using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionService _permissionService;
        private readonly ILogger<PermissionsController> _logger;

        public PermissionsController(IPermissionService permissionService, ILogger<PermissionsController> logger)
        {
            _permissionService = permissionService;
            _logger = logger;
        }

        /// <summary>
        /// Get all permissions for a specific user
        /// </summary>
        [HttpGet("user/{username}")]
        public async Task<ActionResult<UserPermissions>> GetUserPermissions(string username)
        {
            try
            {
                var permissions = await _permissionService.GetUserPermissionsAsync(username);
                return Ok(permissions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting permissions for user {Username}", username);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get accessible modules for a user (only modules they can read)
        /// </summary>
        [HttpGet("user/{username}/modules")]
        public async Task<ActionResult<List<ModulePermission>>> GetUserModules(string username)
        {
            try
            {
                var modules = await _permissionService.GetUserModulesAsync(username);
                return Ok(modules);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting modules for user {Username}", username);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if user has specific permission on a module
        /// </summary>
        [HttpGet("user/{username}/check")]
        public async Task<ActionResult<bool>> CheckPermission(
            string username, 
            [FromQuery] string module, 
            [FromQuery] string permission, 
            [FromQuery] string? submodule = null)
        {
            try
            {
                var hasPermission = await _permissionService.HasPermissionAsync(username, module, permission, submodule);
                return Ok(hasPermission);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking permission for user {Username}", username);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Check if user can access a specific module
        /// </summary>
        [HttpGet("user/{username}/access/{module}")]
        public async Task<ActionResult<bool>> CanAccessModule(string username, string module)
        {
            try
            {
                var canAccess = await _permissionService.CanAccessModuleAsync(username, module);
                return Ok(canAccess);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking module access for user {Username}", username);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get user claims for JWT token generation
        /// </summary>
        [HttpGet("user/{username}/claims")]
        public async Task<ActionResult<List<string>>> GetUserClaims(string username)
        {
            try
            {
                var claims = await _permissionService.BuildUserClaimsAsync(username);
                var claimStrings = claims.Select(c => $"{c.Type}:{c.Value}").ToList();
                return Ok(claimStrings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting claims for user {Username}", username);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    /// <summary>
    /// Authorization attribute for module-based access control
    /// </summary>
    public class RequireModulePermissionAttribute : AuthorizeAttribute
    {
        public RequireModulePermissionAttribute(string module, string permission = "Read")
        {
            Policy = $"Module:{module}:{permission}";
        }
    }

    /// <summary>
    /// Authorization attribute for submodule-based access control
    /// </summary>
    public class RequireSubmodulePermissionAttribute : AuthorizeAttribute
    {
        public RequireSubmodulePermissionAttribute(string module, string submodule, string permission = "Read")
        {
            Policy = $"Submodule:{module}:{submodule}:{permission}";
        }
    }
}