using Microsoft.AspNetCore.Mvc;

namespace SchoolApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            message = "API is running successfully",
            timestamp = DateTime.UtcNow,
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
        });
    }

    [HttpGet("version")]
    public IActionResult GetVersion()
    {
        return Ok(new
        {
            application = "SchoolApp API",
            version = "1.0.0",
            dotnet = Environment.Version.ToString(),
            timestamp = DateTime.UtcNow
        });
    }
}
