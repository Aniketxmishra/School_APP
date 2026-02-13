namespace SchoolApp.API.DTOs;

public class LeaveApplicationDto
{
    public long? Id { get; set; }
    public string UserType { get; set; } = string.Empty; // Student, Teacher, Staff
    public long UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int LeaveTypeId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? Status { get; set; } // Pending, Approved, Rejected
    public string? Comments { get; set; }
}

public class LeaveTypeDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MaxDays { get; set; }
}

public class LeaveActionDto
{
    public long ApplicationId { get; set; }
    public string Status { get; set; } = string.Empty; // Approved, Rejected
    public string ApproverId { get; set; } = string.Empty;
    public string? Comments { get; set; }
}
