using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasteacher")]
public class TbmasTeacherActual
{
    [Key]
    [Column("fdteacherid")]
    public long FdTeacherId { get; set; }
    
    [Required]
    [StringLength(50)]
    [Column("fdstaffcode")]
    public string FdStaffCode { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    [Column("fdfirstname")]
    public string FdFirstName { get; set; } = string.Empty;
    
    [StringLength(100)]
    [Column("fdlastname")]
    public string? FdLastName { get; set; }
    
    [StringLength(255)]
    [Column("fdfullname")]
    public string? FdFullName { get; set; }
    
    [StringLength(255)]
    [Column("fdfatherorhusbandname")]
    public string? FdFatherOrHusbandName { get; set; }
    
    [Required]
    [Column("fdgender")]
    public string FdGender { get; set; } = string.Empty; // Male, Female, Other
    
    [Required]
    [Column("fddateofbirth")]
    public DateTime FdDateOfBirth { get; set; }
    
    [StringLength(10)]
    [Column("fdbloodgroup")]
    public string? FdBloodGroup { get; set; }
    
    [StringLength(50)]
    [Column("fdreligion")]
    public string? FdReligion { get; set; }
    
    [StringLength(50)]
    [Column("fdcategory")]
    public string? FdCategory { get; set; }
    
    [StringLength(15)]
    [Column("fdmobile")]
    public string? FdMobile { get; set; }
    
    [StringLength(100)]
    [Column("fdemail")]
    public string? FdEmail { get; set; }
    
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
    
    [StringLength(12)]
    [Column("fdaadharno")]
    public string? FdAadharNo { get; set; }
    
    [StringLength(10)]
    [Column("fdpan")]
    public string? FdPan { get; set; }
    
    [Column("fdqualification")]
    public string? FdQualification { get; set; }
    
    [Column("fdexperience")]
    public int FdExperience { get; set; } = 0;
    
    [Column("fdreportsto")]
    public long? FdReportsTo { get; set; }
    
    [Column("fdphoto")]
    public string? FdPhoto { get; set; }
    
    [Column("fdstatus")]
    public string FdStatus { get; set; } = "active"; // active, inactive, resigned, terminated
    
    [Column("fdauditdate")]
    public DateTime? FdAuditDate { get; set; }
    
    [StringLength(100)]
    [Column("fdaudituser")]
    public string? FdAuditUser { get; set; }
    
    [StringLength(100)]
    [Column("fdcreatedby")]
    public string? FdCreatedBy { get; set; }
    
    [Column("fdcreatedon")]
    public DateTime? FdCreatedOn { get; set; }
    
    // Navigation property for self-reference
    [ForeignKey("FdReportsTo")]
    public virtual TbmasTeacherActual? ReportsToTeacher { get; set; }
}