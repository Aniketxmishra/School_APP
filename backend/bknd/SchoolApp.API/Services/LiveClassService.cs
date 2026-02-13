using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class LiveClassService : ILiveClassService
{
    private readonly SchoolAppDbContext _context;

    public LiveClassService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<LiveClassDto>> GetScheduledClassesAsync(long classSectionId, DateTime date)
    {
        // Join with Subject and Teacher
        var query = from l in _context.Tbliveclass
                    join s in _context.Tbmassubject on l.Fdsubjectid equals s.Fdid into subjects
                    from sub in subjects.DefaultIfEmpty()
                    join t in _context.TbmasTeachers on l.Fdteacherid equals t.FdTeacherId into teachers
                    from tea in teachers.DefaultIfEmpty()
                    where l.Fdclasssectionid == classSectionId
                    where l.Fdstarttime.Date == date.Date
                    where l.Fdstatus == "Active"
                    select new LiveClassDto
                    {
                        Id = l.Fdid,
                        SubjectName = sub != null ? sub.Fdsubjectname : "Unknown Subject",
                        TeacherName = tea != null ? (tea.FdFirstName + " " + tea.FdLastName) : "Unknown Teacher",
                        StartTime = l.Fdstarttime,
                        EndTime = l.Fdendtime,
                        Link = l.Fdlink,
                        Status = l.Fdstatus
                    };

        return await query.OrderBy(x => x.StartTime).ToListAsync();
    }

    public async Task<bool> ScheduleLiveClassAsync(CreateLiveClassDto liveClassDto, long teacherId, string currentUser)
    {
        var liveClass = new Tbliveclass
        {
            Fdclasssectionid = liveClassDto.ClassSectionId,
            Fdsubjectid = liveClassDto.SubjectId,
            Fdteacherid = teacherId,
            Fdstarttime = liveClassDto.StartTime,
            Fdendtime = liveClassDto.EndTime,
            Fdlink = liveClassDto.Link,
            Fdstatus = "Active",
            Fdcreatedby = currentUser,
            Fdcreatedon = DateTime.UtcNow
        };

        await _context.Tbliveclass.AddAsync(liveClass);
        await _context.SaveChangesAsync();
        return true;
    }
}
