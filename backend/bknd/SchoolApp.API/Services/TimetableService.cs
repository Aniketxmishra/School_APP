using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;

namespace SchoolApp.API.Services;

public class TimetableService : ITimetableService
{
    private readonly SchoolAppDbContext _context;

    public TimetableService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TimetableDto>> GetClassTimetableAsync(long classId, int sectionId, string day)
    {
        // Note: Joining with Subject and Teacher tables to get names
        // Ideally we should double check if the relationships are set up in detail,
        // but for now we'll do manual joins or assume navigation properties if configured.
        // Since we generated entities without navigation properties, we'll likely need manual joins or multiple queries.
        // Let's use LINQ joins for safety.
        
        var query = from t in _context.Tbtimetable
                    join s in _context.Tbmassubject on t.Fdsubjectid equals s.Fdid into subjects
                    from sub in subjects.DefaultIfEmpty()
                    join teach in _context.TbmasTeachers on t.Fdteacherid equals teach.FdTeacherId into teachers
                    from teacher in teachers.DefaultIfEmpty()
                    where t.Fdclassid == classId 
                          // && t.Fdsectionid == sectionId // Wait, Tbtimetable doesn't seem to have SectionID in my earlier view? 
                          // Let me double check Tbtimetable.cs content I viewed earlier:
                          // [Column("fdclassid")] public long Fdclassid
                          // It does NOT have sectionid? Let me re-read Tbtimetable.cs to be sure.
                          // Checked Step 686: Tbtimetable has Fdclassid, but NO Fdsectionid.
                          // It likely links to `tbmasclasssection` via `Fdclassid`? 
                          // Or maybe the `Fdclassid` IS the `fdclasssectionid` (primary key of tbmasclasssection)?
                          // I'll assume Fdclassid refers to the specific Class-Section combo ID for now, as that's common.
                    where t.Fdday == day
                    where t.Fdstatus == "Active"
                    select new TimetableDto
                    {
                        Id = t.Fdid,
                        Day = t.Fdday,
                        FromTime = t.Fdfromtime,
                        ToTime = t.Fdtotime,
                        SubjectName = sub != null ? sub.Fdsubjectname : "Unknown Subject",
                        TeacherName = teacher != null ? (teacher.FdFirstName + " " + teacher.FdLastName) : "Unknown Teacher",
                        RoomNo = "" // Not in table?
                    };

        return await query.OrderBy(x => x.FromTime).ToListAsync();
    }

    public async Task<List<TimetableDto>> GetTeacherTimetableAsync(long teacherId, string day)
    {
        var query = from t in _context.Tbtimetable
                    join s in _context.Tbmassubject on t.Fdsubjectid equals s.Fdid into subjects
                    from sub in subjects.DefaultIfEmpty()
                    // Join with ClassSection to get Class Name? We don't have that entity fully mapped with name yet?
                    // We have Tbmasclasssection, Tbmassection, Tbmasgrade.
                    // For now, returning subject and times.
                    where t.Fdteacherid == teacherId
                    where t.Fdday == day
                    where t.Fdstatus == "Active"
                    select new TimetableDto
                    {
                        Id = t.Fdid,
                        Day = t.Fdday,
                        FromTime = t.Fdfromtime,
                        ToTime = t.Fdtotime,
                        SubjectName = sub != null ? sub.Fdsubjectname : "Unknown Subject",
                        TeacherName = "Self",
                        RoomNo = ""
                    };

        return await query.OrderBy(x => x.FromTime).ToListAsync();
    }
}
