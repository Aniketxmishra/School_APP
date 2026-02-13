using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class HomeworkService : IHomeworkService
{
    private readonly SchoolAppDbContext _context;

    public HomeworkService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateHomeworkAsync(CreateHomeworkDto homeworkDto, string currentUser, long teacherId)
    {
        var homework = new Tbmashomework
        {
            Fdhomeworktitle = homeworkDto.Title,
            Fddescription = homeworkDto.Description,
            Fdclassid = homeworkDto.ClassId,
            Fdsectionid = homeworkDto.SectionId,
            Fdsubjectid = homeworkDto.SubjectId,
            Fdteacherid = teacherId,
            Fdassigneddate = DateTime.UtcNow,
            Fdduedate = homeworkDto.DueDate,
            Fdmaxmarks = homeworkDto.MaxMarks,
            Fdattachmentpath = homeworkDto.AttachmentPath,
            Fdstatus = "Active",
            Fdcreatedby = currentUser,
            Fdcreatedon = DateTime.UtcNow
        };

        await _context.Tbmashomework.AddAsync(homework);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<HomeworkDto>> GetHomeworkForStudentAsync(long classId, int sectionId, DateTime? date = null)
    {
        // Join with Subject and Teacher
        var query = from h in _context.Tbmashomework
                    join s in _context.Tbmassubject on h.Fdsubjectid equals s.Fdid into subjects
                    from sub in subjects.DefaultIfEmpty()
                    join t in _context.TbmasTeachers on h.Fdteacherid equals t.FdTeacherId into teachers
                    from tea in teachers.DefaultIfEmpty()
                    where h.Fdclassid == classId && h.Fdsectionid == sectionId
                    where h.Fdstatus == "Active"
                    select new HomeworkDto
                    {
                        Id = h.Fdid,
                        Title = h.Fdhomeworktitle,
                        Description = h.Fddescription,
                        SubjectName = sub != null ? sub.Fdsubjectname : "Unknown Subject",
                        TeacherName = tea != null ? (tea.FdFirstName + " " + tea.FdLastName) : "Unknown Teacher",
                        AssignedDate = h.Fdassigneddate,
                        DueDate = h.Fdduedate,
                        MaxMarks = h.Fdmaxmarks,
                        AttachmentPath = h.Fdattachmentpath,
                        Status = h.Fdstatus
                    };

        if (date.HasValue)
        {
            query = query.Where(h => h.AssignedDate.Date == date.Value.Date);
        }

        return await query.OrderByDescending(h => h.AssignedDate).ToListAsync();
    }

    public async Task<bool> SubmitHomeworkAsync(long homeworkId, long studentId, string submissionText, string? attachmentPath)
    {
        var existing = await _context.Tbhomeworksubmission
            .FirstOrDefaultAsync(x => x.Fdhomeworkid == homeworkId && x.Fdstudentid == studentId);

        if (existing != null)
        {
            // Update
            existing.Fdsubmissiontext = submissionText;
            existing.Fdattachmentpath = attachmentPath ?? existing.Fdattachmentpath;
            existing.Fdsubmitteddate = DateTime.UtcNow;
            existing.Fdstatus = "Submitted";
            _context.Tbhomeworksubmission.Update(existing);
        }
        else
        {
            // Insert
            var submission = new Tbhomeworksubmission
            {
                Fdhomeworkid = homeworkId,
                Fdstudentid = studentId,
                Fdsubmissiontext = submissionText,
                Fdattachmentpath = attachmentPath,
                Fdsubmitteddate = DateTime.UtcNow,
                Fdstatus = "Submitted"
            };
            await _context.Tbhomeworksubmission.AddAsync(submission);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<HomeworkSubmissionDto>> GetSubmissionsForTeacherAsync(long homeworkId)
    {
        var query = from s in _context.Tbhomeworksubmission
                    join stu in _context.TbmasStudents on s.Fdstudentid equals stu.FdStudentId into students
                    from student in students.DefaultIfEmpty()
                    where s.Fdhomeworkid == homeworkId
                    select new HomeworkSubmissionDto
                    {
                        Id = s.Fdid,
                        HomeworkId = s.Fdhomeworkid,
                        StudentId = s.Fdstudentid,
                        StudentName = student != null ? student.FdStudentName : "Unknown Student",
                        SubmissionText = s.Fdsubmissiontext,
                        AttachmentPath = s.Fdattachmentpath,
                        SubmittedDate = s.Fdsubmitteddate,
                        MarksObtained = s.Fdmarksobtained,
                        TeacherFeedback = s.Fdteacherfeedback,
                        Status = s.Fdstatus
                    };

        return await query.ToListAsync();
    }

    public async Task<bool> GradeSubmissionAsync(long submissionId, decimal marks, string feedback, string currentUser)
    {
        var submission = await _context.Tbhomeworksubmission.FindAsync(submissionId);
        if (submission == null) return false;

        submission.Fdmarksobtained = marks;
        submission.Fdteacherfeedback = feedback;
        submission.Fdcheckedby = currentUser;
        submission.Fdcheckeddate = DateTime.UtcNow;
        submission.Fdstatus = "Graded";

        _context.Tbhomeworksubmission.Update(submission);
        await _context.SaveChangesAsync();
        return true;
    }
}
