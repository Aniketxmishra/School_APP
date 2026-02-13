using Microsoft.EntityFrameworkCore;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.Infrastructure;

public class SchoolAppDbContext : DbContext
{
    public SchoolAppDbContext(DbContextOptions<SchoolAppDbContext> options) : base(options)
    {
    }

    // Main entities that match the actual database
    public DbSet<TbmasLogin> TbmasLogin { get; set; }
    public DbSet<Tbloginaudit> Tbloginaudit { get; set; }
    public DbSet<TbmasStudentActual> TbmasStudents { get; set; }
    public DbSet<TbmasTeacherActual> TbmasTeachers { get; set; }

    // Phase 2: Missing Entities
    public DbSet<Tbaccessright> Tbaccessright { get; set; }
    public DbSet<Tbattendanceverification> Tbattendanceverification { get; set; }
    public DbSet<Tbbookissue> Tbbookissue { get; set; }
    public DbSet<Tbclasssubjectmap> Tbclasssubjectmap { get; set; }
    public DbSet<Tbfeedue> Tbfeedue { get; set; }
    public DbSet<Tbfeepayment> Tbfeepayment { get; set; }
    public DbSet<Tbfeestructure> Tbfeestructure { get; set; }
    public DbSet<Tbgallery> Tbgallery { get; set; }
    public DbSet<Tbgallerymedia> Tbgallerymedia { get; set; }
    public DbSet<Tbgroupdml> Tbgroupdml { get; set; }
    public DbSet<Tbhomeworksubmission> Tbhomeworksubmission { get; set; }
    public DbSet<Tbleaveapplication> Tbleaveapplication { get; set; }
    public DbSet<Tbliveclass> Tbliveclass { get; set; }
    public DbSet<Tbmasacademicyear> Tbmasacademicyear { get; set; }
    public DbSet<Tbmasbook> Tbmasbook { get; set; }
    public DbSet<Tbmasclasssection> Tbmasclasssection { get; set; }
    public DbSet<Tbmasfeehead> Tbmasfeehead { get; set; }
    public DbSet<Tbmasgrade> Tbmasgrade { get; set; }
    public DbSet<Tbmashomework> Tbmashomework { get; set; }
    public DbSet<Tbmasleavetype> Tbmasleavetype { get; set; }
    public DbSet<Tbmasmodule> Tbmasmodule { get; set; }
    public DbSet<Tbmassection> Tbmassection { get; set; }
    public DbSet<Tbmassubject> Tbmassubject { get; set; }
    public DbSet<Tbstaffattendance> Tbstaffattendance { get; set; }
    public DbSet<Tbstaffgroup> Tbstaffgroup { get; set; }
    public DbSet<Tbstudentaddress> Tbstudentaddress { get; set; }
    public DbSet<Tbstudentattendance> Tbstudentattendance { get; set; }
    public DbSet<Tbstudentcontact> Tbstudentcontact { get; set; }
    public DbSet<Tbstudentdocuments> Tbstudentdocuments { get; set; }
    public DbSet<Tbstudentfamily> Tbstudentfamily { get; set; }
    public DbSet<Tbstudentmedicaldetails> Tbstudentmedicaldetails { get; set; }
    public DbSet<Tbstudentspecialattention> Tbstudentspecialattention { get; set; }
    public DbSet<Tbteacherbankdetails> Tbteacherbankdetails { get; set; }
    public DbSet<Tbteacherdocuments> Tbteacherdocuments { get; set; }
    public DbSet<Tbtimetable> Tbtimetable { get; set; }
    public DbSet<Tbtnotification> Tbtnotification { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Tbloginaudit entity
        modelBuilder.Entity<Tbloginaudit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Fdusername).IsRequired().HasMaxLength(100);
        });

        // Configure composite key for Tbstudentspecialattention
        modelBuilder.Entity<Tbstudentspecialattention>(entity =>
        {
            entity.HasKey(e => new { e.Fdstudentid, e.Fdattentiontype });
        });
    }
}

