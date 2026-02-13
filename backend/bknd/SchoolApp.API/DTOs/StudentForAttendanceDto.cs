namespace SchoolApp.API.DTOs;

public class StudentForAttendanceDto
{
    public int StudentId { get; set; }
    public string EnrollmentNo { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;
    public int IsMarked { get; set; }
}