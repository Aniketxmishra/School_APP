using SchoolApp.API.DTOs;

namespace SchoolApp.API.Services;

public interface ITimetableService
{
    Task<List<TimetableDto>> GetClassTimetableAsync(long classId, int sectionId, string day);
    Task<List<TimetableDto>> GetTeacherTimetableAsync(long teacherId, string day);
}

public interface IHomeworkService
{
    Task<bool> CreateHomeworkAsync(CreateHomeworkDto homeworkDto, string currentUser, long teacherId);
    Task<List<HomeworkDto>> GetHomeworkForStudentAsync(long classId, int sectionId, DateTime? date = null);
    Task<bool> SubmitHomeworkAsync(long homeworkId, long studentId, string submissionText, string? attachmentPath);
    Task<List<HomeworkSubmissionDto>> GetSubmissionsForTeacherAsync(long homeworkId);
    Task<bool> GradeSubmissionAsync(long submissionId, decimal marks, string feedback, string currentUser);
}

public interface ILiveClassService
{
    Task<List<LiveClassDto>> GetScheduledClassesAsync(long classSectionId, DateTime date);
    Task<bool> ScheduleLiveClassAsync(CreateLiveClassDto liveClassDto, long teacherId, string currentUser);
}
