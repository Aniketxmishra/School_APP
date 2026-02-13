namespace SchoolApp.API.DTOs;

public class StudentAttendanceDto
{
    public long StudentId { get; set; }
    public long ClassId { get; set; }
    public int SectionId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty; // P, A, L, etc.
    public string? Remark { get; set; }
}

public class StaffAttendanceDto
{
    public long StaffId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Remark { get; set; }
    public string? Geolocation { get; set; }
}

public class AttendanceSummaryDto
{
    public int TotalPresent { get; set; }
    public int TotalAbsent { get; set; }
    public int TotalLeave { get; set; }
    public int TotalStudents { get; set; }
    public double AttendancePercentage { get; set; }
}
