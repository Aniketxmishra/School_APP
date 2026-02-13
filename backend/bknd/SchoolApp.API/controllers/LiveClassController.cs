using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LiveClassController : ControllerBase
{
    private readonly ILiveClassService _liveClassService;

    public LiveClassController(ILiveClassService liveClassService)
    {
        _liveClassService = liveClassService;
    }

    [HttpGet("student/{classSectionId}")]
    public async Task<IActionResult> GetStudentClasses(long classSectionId, [FromQuery] DateTime? date)
    {
        var targetDate = date ?? DateTime.UtcNow;
        var classes = await _liveClassService.GetScheduledClassesAsync(classSectionId, targetDate);
        return Ok(classes);
    }

    [HttpPost("schedule")]
    public async Task<IActionResult> ScheduleClass([FromBody] CreateLiveClassDto dto)
    {
        var username = User.Identity?.Name ?? "System";
        long teacherId = 1; // Mock teacher ID from claims
        
        var result = await _liveClassService.ScheduleLiveClassAsync(dto, teacherId, username);
        if (result) return Ok(new { message = "Live class scheduled successfully" });
        return BadRequest("Failed to schedule class");
    }
}
