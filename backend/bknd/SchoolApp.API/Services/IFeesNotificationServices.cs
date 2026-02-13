using SchoolApp.API.DTOs;

namespace SchoolApp.API.Services;

public interface IFeesService
{
    Task<StudentFeeDetailsDto?> GetStudentFeeDetailsAsync(long studentId);
    Task<List<FeeStructureDto>> GetFeeStructureAsync(long classId, int? sectionId = null);
    Task<bool> RecordPaymentAsync(RecordPaymentRequest request, string recordedBy);
    Task<List<FeePaymentDto>> GetPaymentHistoryAsync(long studentId);
}

public interface INotificationService
{
    Task<List<NotificationDto>> GetNotificationsAsync(long? classId = null, int? sectionId = null);
    Task<NotificationDto?> GetNotificationByIdAsync(long notificationId);
    Task<bool> CreateNotificationAsync(CreateNotificationRequest request, string createdBy);
}
