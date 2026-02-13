using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public interface IAttendanceService
{
    // Student Attendance
    Task<bool> MarkStudentAttendanceAsync(List<StudentAttendanceDto> attendanceList, string currentUser);
    Task<List<Tbstudentattendance>> GetStudentAttendanceAsync(long classId, int sectionId, DateTime date);
    Task<AttendanceSummaryDto> GetClassAttendanceSummaryAsync(long classId, int sectionId, DateTime date);
    Task<List<Tbstudentattendance>> GetStudentHistoryAsync(long studentId, DateTime startDate, DateTime endDate);

    // Staff Attendance
    Task<bool> MarkStaffAttendanceAsync(List<StaffAttendanceDto> attendanceList, string currentUser);
    Task<List<Tbstaffattendance>> GetStaffAttendanceAsync(DateTime date);
    Task<AttendanceSummaryDto> GetStaffAttendanceSummaryAsync(DateTime date);
}
