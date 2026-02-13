namespace SchoolApp.API.DTOs;

public class NotificationDto
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string NoteType { get; set; } = string.Empty;
    public long? ClassId { get; set; }
    public int? SectionId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? CreatedOn { get; set; }
}

public class CreateNotificationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string NoteType { get; set; } = string.Empty; // Circular, Event, Holiday, etc.
    public long? ClassId { get; set; }
    public int? SectionId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
}
