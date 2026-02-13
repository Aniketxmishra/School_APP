using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class LeaveService : ILeaveService
{
    private readonly SchoolAppDbContext _context;
    private readonly ILogger<LeaveService> _logger;

    public LeaveService(SchoolAppDbContext context, ILogger<LeaveService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Tbleaveapplication> ApplyLeaveAsync(LeaveApplicationDto leaveDto, string currentUser)
    {
        var leave = new Tbleaveapplication
        {
            Fdusertype = leaveDto.UserType,
            Fduserid = leaveDto.UserId,
            Fdusername = leaveDto.UserName, // Make sure DTO has this or fetch it
            Fdleavestartdate = leaveDto.StartDate,
            Fdleaveenddate = leaveDto.EndDate,
            Fdduration = (leaveDto.EndDate.Date - leaveDto.StartDate.Date).Days + 1,
            Fdleavetypeid = leaveDto.LeaveTypeId,
            Fdreason = leaveDto.Reason,
            Fdstatus = "Pending",
            Fdcreatedby = currentUser,
            Fdcreatedon = DateTime.UtcNow,
            Fdaudituser = currentUser,
            Fdauditdate = DateTime.UtcNow
        };

        await _context.Tbleaveapplication.AddAsync(leave);
        await _context.SaveChangesAsync();
        return leave;
    }

    public async Task<List<Tbleaveapplication>> GetMyLeavesAsync(long userId, string userType)
    {
        return await _context.Tbleaveapplication
            .Where(x => x.Fduserid == userId && x.Fdusertype == userType)
            .OrderByDescending(x => x.Fdleavestartdate)
            .ToListAsync();
    }

    public async Task<List<Tbleaveapplication>> GetPendingLeavesAsync(string? userTypeFilter = null)
    {
        var query = _context.Tbleaveapplication.AsQueryable();

        query = query.Where(x => x.Fdstatus == "Pending");

        if (!string.IsNullOrEmpty(userTypeFilter))
        {
            query = query.Where(x => x.Fdusertype == userTypeFilter);
        }

        return await query.OrderBy(x => x.Fdleavestartdate).ToListAsync();
    }

    public async Task<bool> ApproveRejectLeaveAsync(LeaveActionDto actionDto, string approverName)
    {
        var leave = await _context.Tbleaveapplication.FindAsync(actionDto.ApplicationId);
        if (leave == null) return false;

        leave.Fdstatus = actionDto.Status;
        leave.Fdapprovedby = approverName;
        leave.Fdapprovedate = DateTime.UtcNow;
        leave.Fdcomments = actionDto.Comments;
        
        // Update audit fields
        leave.Fdaudituser = approverName;
        leave.Fdauditdate = DateTime.UtcNow;
        leave.Fdlastupdatedby = approverName;
        leave.Fdlastupdatedon = DateTime.UtcNow;

        _context.Tbleaveapplication.Update(leave);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Tbmasleavetype>> GetLeaveTypesAsync()
    {
        return await _context.Tbmasleavetype
            .Where(x => x.Fdstatus == "Active")
            .ToListAsync();
    }

    public async Task<bool> CancelLeaveAsync(long applicationId, string currentUser)
    {
        var leave = await _context.Tbleaveapplication.FindAsync(applicationId);
        
        // Only allow cancellation if pending
        if (leave == null || leave.Fdstatus != "Pending") return false;

        leave.Fdstatus = "Cancelled";
        leave.Fdlastupdatedby = currentUser;
        leave.Fdlastupdatedon = DateTime.UtcNow;
        
        _context.Tbleaveapplication.Update(leave);
        await _context.SaveChangesAsync();
        return true;
    }
}
