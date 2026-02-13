namespace SchoolApp.API.DTOs;

public class TimetableDto
{
    public long Id { get; set; }
    public string Day { get; set; } = string.Empty;
    public string FromTime { get; set; } = string.Empty;
    public string ToTime { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public string? RoomNo { get; set; }
}

public class HomeworkDto
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal? MaxMarks { get; set; }
    public string? AttachmentPath { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateHomeworkDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public long ClassId { get; set; }
    public int SectionId { get; set; }
    public int SubjectId { get; set; }
    public DateTime DueDate { get; set; }
    public decimal? MaxMarks { get; set; }
    public string? AttachmentPath { get; set; }
}

public class HomeworkSubmissionDto
{
    public long Id { get; set; }
    public long HomeworkId { get; set; }
    public long StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string? SubmissionText { get; set; }
    public string? AttachmentPath { get; set; }
    public DateTime? SubmittedDate { get; set; }
    public decimal? MarksObtained { get; set; }
    public string? TeacherFeedback { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class LiveClassDto
{
    public long Id { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Link { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class CreateLiveClassDto
{
    public long ClassSectionId { get; set; }
    public int SubjectId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Link { get; set; } = string.Empty;
}
