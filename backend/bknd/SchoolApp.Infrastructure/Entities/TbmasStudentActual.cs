using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasstudent")]
public class TbmasStudentActual
{
    [Key]
    [Column("fdstudentid")]
    public long FdStudentId { get; set; }
    
    [Required]
    [StringLength(50)]
    [Column("fdenrollmentno")]
    public string FdEnrollmentNo { get; set; } = string.Empty;
    
    [Required]
    [StringLength(255)]
    [Column("fdstudentname")]
    public string FdStudentName { get; set; } = string.Empty;
    
    [Required]
    [Column("fdgender")]
    public string FdGender { get; set; } = string.Empty; // Male, Female, Other
    
    [Required]
    [Column("fddateofbirth")]
    public DateTime FdDateOfBirth { get; set; }
    
    [StringLength(50)]
    [Column("fdreligion")]
    public string? FdReligion { get; set; }
    
    [Column("fdaddress")]
    public string? FdAddress { get; set; }
    
    [StringLength(100)]
    [Column("fdcity")]
    public string? FdCity { get; set; }
    
    [StringLength(100)]
    [Column("fdstate")]
    public string? FdState { get; set; }
    
    [StringLength(10)]
    [Column("fdpincode")]
    public string? FdPincode { get; set; }
    
    [Required]
    [Column("fdjoiningdate")]
    public DateTime FdJoiningDate { get; set; }
    
    [Column("fdphoto")]
    public string? FdPhoto { get; set; }
    
    [StringLength(255)]
    [Column("fdmothername")]
    public string? FdMotherName { get; set; }
    
    [StringLength(255)]
    [Column("fdguardianname")]
    public string? FdGuardianName { get; set; }
    
    [Column("fdguardiantype")]
    public string? FdGuardianType { get; set; } // Father, Mother, Guardian, Other
    
    [Column("fdstatus")]
    public string FdStatus { get; set; } = "active"; // active, inactive, transferred, graduated, suspended
    
    [Column("fdauditdate")]
    public DateTime? FdAuditDate { get; set; }
    
    [StringLength(100)]
    [Column("fdaudituser")]
    public string? FdAuditUser { get; set; }
    
    [Column("fdmodifieddate")]
    public DateTime? FdModifiedDate { get; set; }
    
    [StringLength(100)]
    [Column("fdmodifiedby")]
    public string? FdModifiedBy { get; set; }
}