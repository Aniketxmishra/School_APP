using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LeaveController : ControllerBase
{
    private readonly ILeaveService _leaveService;

    public LeaveController(ILeaveService leaveService)
    {
        _leaveService = leaveService;
    }

    [HttpPost("apply")]
    public async Task<IActionResult> ApplyLeave([FromBody] LeaveApplicationDto leaveDto)
    {
        var username = User.Identity?.Name ?? "System";
        
        // Basic validation
        if (leaveDto.EndDate < leaveDto.StartDate)
            return BadRequest("End date cannot be before start date.");

        var result = await _leaveService.ApplyLeaveAsync(leaveDto, username);
        return Ok(new { message = "Leave application submitted successfully.", data = result });
    }

    [HttpGet("my-history")]
    public async Task<IActionResult> GetMyLeaves([FromQuery] long userId, [FromQuery] string userType)
    {
        var leaves = await _leaveService.GetMyLeavesAsync(userId, userType);
        return Ok(leaves);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingLeaves([FromQuery] string? userType)
    {
        // TODO: Add RBAC check to ensure only Approver/Admin can access this
        var list = await _leaveService.GetPendingLeavesAsync(userType);
        return Ok(list);
    }

    [HttpPost("action")]
    public async Task<IActionResult> ApproveRejectLeave([FromBody] LeaveActionDto actionDto)
    {
        var approverName = User.Identity?.Name ?? "System";
        var result = await _leaveService.ApproveRejectLeaveAsync(actionDto, approverName);
        
        if (result)
            return Ok(new { message = $"Leave application {actionDto.Status} successfully." });
        
        return NotFound("Leave application not found.");
    }

    [HttpGet("types")]
    public async Task<IActionResult> GetLeaveTypes()
    {
        var types = await _leaveService.GetLeaveTypesAsync();
        return Ok(types);
    }

    [HttpPost("cancel/{id}")]
    public async Task<IActionResult> CancelLeave(long id)
    {
        var username = User.Identity?.Name ?? "System";
        var result = await _leaveService.CancelLeaveAsync(id, username);
        
        if (result)
            return Ok(new { message = "Leave application cancelled successfully." });
        
        return BadRequest("Cannot cancel leave. It might not be in Pending status.");
    }
}
