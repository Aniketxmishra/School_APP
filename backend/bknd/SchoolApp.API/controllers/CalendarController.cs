using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SchoolApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CalendarController : ControllerBase
    {
        private readonly ILogger<CalendarController> _logger;

        public CalendarController(ILogger<CalendarController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get calendar events
        /// </summary>
        [HttpGet("events")]
        public async Task<ActionResult<List<CalendarEventDto>>> GetEvents(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow.Date;
                var end = endDate ?? DateTime.UtcNow.Date.AddMonths(1);

                // Mock calendar events
                var events = new List<CalendarEventDto>
                {
                    new CalendarEventDto
                    {
                        Id = 1,
                        Title = "Mid-term Examinations",
                        Description = "Mid-term examinations for all classes",
                        StartDate = DateTime.UtcNow.AddDays(7),
                        EndDate = DateTime.UtcNow.AddDays(14),
                        EventType = "Exam",
                        IsHoliday = false
                    },
                    new CalendarEventDto
                    {
                        Id = 2,
                        Title = "Republic Day",
                        Description = "National Holiday - Republic Day",
                        StartDate = new DateTime(DateTime.UtcNow.Year, 1, 26),
                        EndDate = new DateTime(DateTime.UtcNow.Year, 1, 26),
                        EventType = "Holiday",
                        IsHoliday = true
                    },
                    new CalendarEventDto
                    {
                        Id = 3,
                        Title = "Parent-Teacher Meeting",
                        Description = "Monthly parent-teacher meeting",
                        StartDate = DateTime.UtcNow.AddDays(15),
                        EndDate = DateTime.UtcNow.AddDays(15),
                        EventType = "Meeting",
                        IsHoliday = false
                    },
                    new CalendarEventDto
                    {
                        Id = 4,
                        Title = "Sports Day",
                        Description = "Annual sports day celebration",
                        StartDate = DateTime.UtcNow.AddDays(30),
                        EndDate = DateTime.UtcNow.AddDays(30),
                        EventType = "Event",
                        IsHoliday = false
                    }
                };

                var filteredEvents = events
                    .Where(e => e.StartDate >= start && e.StartDate <= end)
                    .OrderBy(e => e.StartDate)
                    .ToList();

                return Ok(filteredEvents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving calendar events");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get holidays
        /// </summary>
        [HttpGet("holidays")]
        public async Task<ActionResult<List<CalendarEventDto>>> GetHolidays([FromQuery] int year = 0)
        {
            try
            {
                var targetYear = year == 0 ? DateTime.UtcNow.Year : year;

                var holidays = new List<CalendarEventDto>
                {
                    new CalendarEventDto
                    {
                        Id = 1,
                        Title = "New Year's Day",
                        Description = "New Year Holiday",
                        StartDate = new DateTime(targetYear, 1, 1),
                        EndDate = new DateTime(targetYear, 1, 1),
                        EventType = "Holiday",
                        IsHoliday = true
                    },
                    new CalendarEventDto
                    {
                        Id = 2,
                        Title = "Republic Day",
                        Description = "National Holiday",
                        StartDate = new DateTime(targetYear, 1, 26),
                        EndDate = new DateTime(targetYear, 1, 26),
                        EventType = "Holiday",
                        IsHoliday = true
                    },
                    new CalendarEventDto
                    {
                        Id = 3,
                        Title = "Independence Day",
                        Description = "National Holiday",
                        StartDate = new DateTime(targetYear, 8, 15),
                        EndDate = new DateTime(targetYear, 8, 15),
                        EventType = "Holiday",
                        IsHoliday = true
                    },
                    new CalendarEventDto
                    {
                        Id = 4,
                        Title = "Gandhi Jayanti",
                        Description = "National Holiday",
                        StartDate = new DateTime(targetYear, 10, 2),
                        EndDate = new DateTime(targetYear, 10, 2),
                        EventType = "Holiday",
                        IsHoliday = true
                    }
                };

                return Ok(holidays);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving holidays");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Create calendar event (admin only)
        /// </summary>
        [HttpPost("events")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<CalendarEventDto>> CreateEvent([FromBody] CreateEventRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var calendarEvent = new CalendarEventDto
                {
                    Id = new Random().Next(1000, 9999),
                    Title = request.Title,
                    Description = request.Description,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    EventType = request.EventType,
                    IsHoliday = request.IsHoliday
                };

                _logger.LogInformation("Calendar event created: {Title}", request.Title);
                return CreatedAtAction(nameof(GetEvents), new { }, calendarEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating calendar event");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    // DTOs
    public class CalendarEventDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string EventType { get; set; } = string.Empty;
        public bool IsHoliday { get; set; }
    }

    public class CreateEventRequest
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string EventType { get; set; } = string.Empty;

        public bool IsHoliday { get; set; } = false;
    }
}