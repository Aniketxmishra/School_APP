using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TimetableController : ControllerBase
{
    private readonly ITimetableService _timetableService;

    public TimetableController(ITimetableService timetableService)
    {
        _timetableService = timetableService;
    }

    [HttpGet("class/{classId}/{sectionId}")]
    public async Task<IActionResult> GetClassTimetable(long classId, int sectionId, [FromQuery] string day = "Monday")
    {
        // TODO: Validate user verification (ensure student belongs to this class)
        var timetable = await _timetableService.GetClassTimetableAsync(classId, sectionId, day);
        return Ok(timetable);
    }

    [HttpGet("teacher/{teacherId}")]
    public async Task<IActionResult> GetTeacherTimetable(long teacherId, [FromQuery] string day = "Monday")
    {
        var timetable = await _timetableService.GetTeacherTimetableAsync(teacherId, day);
        return Ok(timetable);
    }
}
