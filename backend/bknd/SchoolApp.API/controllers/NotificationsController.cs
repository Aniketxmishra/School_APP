using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;
using System.Security.Claims;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(INotificationService notificationService, ILogger<NotificationsController> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] long? classId, [FromQuery] int? sectionId)
    {
        // If user is a student, get their class/section from claims
        // For now, use the query params
        var notifications = await _notificationService.GetNotificationsAsync(classId, sectionId);
        return Ok(notifications);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNotificationById(long id)
    {
        var notification = await _notificationService.GetNotificationByIdAsync(id);
        if (notification == null) return NotFound("Notification not found");
        return Ok(notification);
    }

    [HttpPost]
    [Authorize(Roles = "admin,teacher")]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
    {
        var username = User.Identity?.Name ?? "System";
        var result = await _notificationService.CreateNotificationAsync(request, username);
        
        if (result) return Ok(new { message = "Notification created successfully" });
        return BadRequest("Failed to create notification");
    }
}