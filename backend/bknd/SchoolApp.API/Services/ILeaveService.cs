using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public interface ILeaveService
{
    // Leave Management
    Task<Tbleaveapplication> ApplyLeaveAsync(LeaveApplicationDto leaveDto, string currentUser);
    Task<List<Tbleaveapplication>> GetMyLeavesAsync(long userId, string userType);
    Task<List<Tbleaveapplication>> GetPendingLeavesAsync(string? userTypeFilter = null);
    Task<bool> ApproveRejectLeaveAsync(LeaveActionDto actionDto, string approverName);
    Task<List<Tbmasleavetype>> GetLeaveTypesAsync();
    Task<bool> CancelLeaveAsync(long applicationId, string currentUser);
}
