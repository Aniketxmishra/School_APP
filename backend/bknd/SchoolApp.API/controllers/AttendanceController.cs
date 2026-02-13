using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpPost("student")]
    public async Task<IActionResult> MarkStudentAttendance([FromBody] List<StudentAttendanceDto> attendanceList)
    {
        if (attendanceList == null || !attendanceList.Any())
            return BadRequest("Attendance list cannot be empty.");

        var username = User.Identity?.Name ?? "System";
        var result = await _attendanceService.MarkStudentAttendanceAsync(attendanceList, username);
        
        if (result)
            return Ok(new { message = "Student attendance marked successfully." });
        
        return StatusCode(500, "An error occurred while marking attendance.");
    }

    [HttpGet("student/{classId}/{sectionId}/{date}")]
    public async Task<IActionResult> GetStudentAttendance(long classId, int sectionId, DateTime date)
    {
        var attendance = await _attendanceService.GetStudentAttendanceAsync(classId, sectionId, date);
        var summary = await _attendanceService.GetClassAttendanceSummaryAsync(classId, sectionId, date);
        
        return Ok(new { 
            summary,
            details = attendance 
        });
    }

    [HttpGet("student/history/{studentId}")]
    public async Task<IActionResult> GetStudentHistory(long studentId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var history = await _attendanceService.GetStudentHistoryAsync(studentId, startDate, endDate);
        return Ok(history);
    }

    [HttpPost("staff")]
    public async Task<IActionResult> MarkStaffAttendance([FromBody] List<StaffAttendanceDto> attendanceList)
    {
        if (attendanceList == null || !attendanceList.Any())
            return BadRequest("Attendance list cannot be empty.");

        var username = User.Identity?.Name ?? "System";
        var result = await _attendanceService.MarkStaffAttendanceAsync(attendanceList, username);
        
        if (result)
            return Ok(new { message = "Staff attendance marked successfully." });
        
        return StatusCode(500, "An error occurred while marking attendance.");
    }

    [HttpGet("staff/{date}")]
    public async Task<IActionResult> GetStaffAttendance(DateTime date)
    {
        var attendance = await _attendanceService.GetStaffAttendanceAsync(date);
        var summary = await _attendanceService.GetStaffAttendanceSummaryAsync(date);
        
        return Ok(new { 
            summary,
            details = attendance 
        });
    }
}
