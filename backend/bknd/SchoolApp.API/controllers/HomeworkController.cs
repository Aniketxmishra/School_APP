using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HomeworkController : ControllerBase
{
    private readonly IHomeworkService _homeworkService;

    public HomeworkController(IHomeworkService homeworkService)
    {
        _homeworkService = homeworkService;
    }

    [HttpPost("assign")]
    public async Task<IActionResult> CreateHomework([FromBody] CreateHomeworkDto dto)
    {
        var username = User.Identity?.Name ?? "System";
        // TODO: Extract TeacherID from claims accurately
        long teacherId = 1; // Temporary mock until we have consistent claim mapping
        
        var result = await _homeworkService.CreateHomeworkAsync(dto, username, teacherId);
        if (result) return Ok(new { message = "Homework assigned successfully" });
        return BadRequest("Failed to assign homework");
    }

    [HttpGet("student/{classId}/{sectionId}")]
    public async Task<IActionResult> GetStudentHomework(long classId, int sectionId, [FromQuery] DateTime? date)
    {
        var homework = await _homeworkService.GetHomeworkForStudentAsync(classId, sectionId, date);
        return Ok(homework);
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitHomework([FromBody] HomeworkSubmissionDto dto)
    {
        // TODO: Validate user is the student
        var result = await _homeworkService.SubmitHomeworkAsync(dto.HomeworkId, dto.StudentId, dto.SubmissionText, dto.AttachmentPath);
        if (result) return Ok(new { message = "Homework submitted successfully" });
        return BadRequest("Failed to submit homework");
    }

    [HttpGet("submissions/{homeworkId}")]
    public async Task<IActionResult> GetSubmissions(long homeworkId)
    {
        var submissions = await _homeworkService.GetSubmissionsForTeacherAsync(homeworkId);
        return Ok(submissions);
    }

    [HttpPost("grade")]
    public async Task<IActionResult> GradeSubmission([FromBody] HomeworkSubmissionDto dto)
    {
        var username = User.Identity?.Name ?? "System";
        if (dto.MarksObtained == null) return BadRequest("Marks are required");
        
        var result = await _homeworkService.GradeSubmissionAsync(dto.Id, dto.MarksObtained.Value, dto.TeacherFeedback, username);
        if (result) return Ok(new { message = "Submission graded successfully" });
        return NotFound("Submission not found");
    }
}
