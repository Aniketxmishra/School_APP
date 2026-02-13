using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FeesController : ControllerBase
{
    private readonly IFeesService _feesService;
    private readonly ILogger<FeesController> _logger;

    public FeesController(IFeesService feesService, ILogger<FeesController> logger)
    {
        _feesService = feesService;
        _logger = logger;
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetStudentFeeDetails(long studentId)
    {
        var feeDetails = await _feesService.GetStudentFeeDetailsAsync(studentId);
        if (feeDetails == null) return NotFound("Student not found");
        return Ok(feeDetails);
    }

    [HttpGet("structure/{classId}")]
    public async Task<IActionResult> GetFeeStructure(long classId, [FromQuery] int? sectionId = null)
    {
        var structure = await _feesService.GetFeeStructureAsync(classId, sectionId);
        return Ok(structure);
    }

    [HttpPost("payment")]
    public async Task<IActionResult> RecordPayment([FromBody] RecordPaymentRequest request)
    {
        var username = User.Identity?.Name ?? "System";
        var result = await _feesService.RecordPaymentAsync(request, username);
        
        if (result) return Ok(new { message = "Payment recorded successfully" });
        return BadRequest("Failed to record payment. Student not found.");
    }

    [HttpGet("payment-history/{studentId}")]
    public async Task<IActionResult> GetPaymentHistory(long studentId)
    {
        var history = await _feesService.GetPaymentHistoryAsync(studentId);
        return Ok(history);
    }
}