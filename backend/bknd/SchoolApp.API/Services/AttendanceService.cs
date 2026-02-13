using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class AttendanceService : IAttendanceService
{
    private readonly SchoolAppDbContext _context;
    private readonly ILogger<AttendanceService> _logger;

    public AttendanceService(SchoolAppDbContext context, ILogger<AttendanceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> MarkStudentAttendanceAsync(List<StudentAttendanceDto> attendanceList, string currentUser)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var today = DateTime.UtcNow.Date; // Using UTC or could be configured for local time

            // Check if attendance already exists for these students on this date
            // For bulk updates, we might want to upsert (update if exists, insert if not)
            foreach (var item in attendanceList)
            {
                var inputDate = item.Date.Date;
                
                var existing = await _context.Tbstudentattendance
                    .FirstOrDefaultAsync(x => x.Fdstudentid == item.StudentId && x.Fddate.Date == inputDate);

                if (existing != null)
                {
                    // Update existing
                    existing.Fdstatus = item.Status;
                    existing.Fdremark = item.Remark;
                    existing.Fdaudituser = currentUser;
                    existing.Fdauditdate = DateTime.UtcNow;
                    _context.Tbstudentattendance.Update(existing);
                }
                else
                {
                    // Insert new
                    var newRecord = new Tbstudentattendance
                    {
                        Fdstudentid = item.StudentId,
                        Fdclassid = item.ClassId,
                        Fdsectionid = item.SectionId,
                        Fddate = inputDate,
                        Fdstatus = item.Status,
                        Fdremark = item.Remark,
                        Fdcreatedby = currentUser,
                        Fdcreatedon = DateTime.UtcNow,
                        Fdaudituser = currentUser,
                        Fdauditdate = DateTime.UtcNow
                    };
                    await _context.Tbstudentattendance.AddAsync(newRecord);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error marking student attendance");
            throw;
        }
    }

    public async Task<List<Tbstudentattendance>> GetStudentAttendanceAsync(long classId, int sectionId, DateTime date)
    {
        return await _context.Tbstudentattendance
            .Where(x => x.Fdclassid == classId && x.Fdsectionid == sectionId && x.Fddate.Date == date.Date)
            .ToListAsync();
    }

    public async Task<AttendanceSummaryDto> GetClassAttendanceSummaryAsync(long classId, int sectionId, DateTime date)
    {
        var attendance = await _context.Tbstudentattendance
            .Where(x => x.Fdclassid == classId && x.Fdsectionid == sectionId && x.Fddate.Date == date.Date)
            .ToListAsync();

        var total = attendance.Count;
        if (total == 0) return new AttendanceSummaryDto();

        var present = attendance.Count(x => x.Fdstatus == "P");
        var absent = attendance.Count(x => x.Fdstatus == "A");
        var leave = attendance.Count(x => x.Fdstatus == "L");

        return new AttendanceSummaryDto
        {
            TotalStudents = total,
            TotalPresent = present,
            TotalAbsent = absent,
            TotalLeave = leave,
            AttendancePercentage = (double)present / total * 100
        };
    }

    public async Task<List<Tbstudentattendance>> GetStudentHistoryAsync(long studentId, DateTime startDate, DateTime endDate)
    {
        return await _context.Tbstudentattendance
            .Where(x => x.Fdstudentid == studentId && x.Fddate.Date >= startDate.Date && x.Fddate.Date <= endDate.Date)
            .OrderByDescending(x => x.Fddate)
            .ToListAsync();
    }

    // Staff Attendance
    public async Task<bool> MarkStaffAttendanceAsync(List<StaffAttendanceDto> attendanceList, string currentUser)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            foreach (var item in attendanceList)
            {
                var inputDate = item.Date.Date;
                var existing = await _context.Tbstaffattendance
                    .FirstOrDefaultAsync(x => x.Fdstaffid == item.StaffId && x.Fddate.Date == inputDate);

                if (existing != null)
                {
                    existing.Fdstatus = item.Status;
                    existing.Fdremark = item.Remark;
                    existing.Fdgeolocation = item.Geolocation;
                    existing.Fdaudituser = currentUser;
                    existing.Fdauditdate = DateTime.UtcNow;
                    _context.Tbstaffattendance.Update(existing);
                }
                else
                {
                    var newRecord = new Tbstaffattendance
                    {
                        Fdstaffid = item.StaffId,
                        Fddate = inputDate,
                        Fdstatus = item.Status,
                        Fdremark = item.Remark,
                        Fdgeolocation = item.Geolocation,
                        Fdcreatedby = currentUser,
                        Fdcreatedon = DateTime.UtcNow,
                        Fdaudituser = currentUser,
                        Fdauditdate = DateTime.UtcNow
                    };
                    await _context.Tbstaffattendance.AddAsync(newRecord);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error marking staff attendance");
            throw;
        }
    }

    public async Task<List<Tbstaffattendance>> GetStaffAttendanceAsync(DateTime date)
    {
        return await _context.Tbstaffattendance
            .Where(x => x.Fddate.Date == date.Date)
            .ToListAsync();
    }

    public async Task<AttendanceSummaryDto> GetStaffAttendanceSummaryAsync(DateTime date)
    {
        var attendance = await _context.Tbstaffattendance
            .Where(x => x.Fddate.Date == date.Date)
            .ToListAsync();

        var total = attendance.Count;
        if (total == 0) return new AttendanceSummaryDto();

        var present = attendance.Count(x => x.Fdstatus == "P");
        var absent = attendance.Count(x => x.Fdstatus == "A");
        var leave = attendance.Count(x => x.Fdstatus == "L");

        return new AttendanceSummaryDto
        {
            TotalStudents = total, // Using same DTO property for staff count
            TotalPresent = present,
            TotalAbsent = absent,
            TotalLeave = leave,
            AttendancePercentage = (double)present / total * 100
        };
    }
}
