using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmaslogin")]
public class TbmasLogin
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }
    
    [Required]
    [StringLength(100)]
    [Column("fdusername")]
    public string Fdusername { get; set; } = string.Empty;
    
    [Required]
    [StringLength(255)]
    [Column("fdpassword")]
    public string Fdpassword { get; set; } = string.Empty;
    
    [Required]
    [Column("fdusertype")]
    public string Fdusertype { get; set; } = string.Empty; // admin, teacher, student, parent
    
    [Column("fdgroupid")]
    public uint? Fdgroupid { get; set; }
    
    [Column("fdstatus")]
    public string Fdstatus { get; set; } = "active"; // active, inactive, suspended
    
    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }
    
    [StringLength(100)]
    [Column("fdaudituser")]
    public string? Fdaudituser { get; set; }
    
    [Column("fdlastlogindate")]
    public DateTime? Fdlastlogindate { get; set; }
    
    [Column("fdnooftimepwdtried")]
    public int Fdnooftimepwdtried { get; set; } = 0;
    
    [Column("fdresigneddate")]
    public DateOnly? Fdresigneddate { get; set; }
    
    [StringLength(100)]
    [Column("fdresignedby")]
    public string? Fdresignedby { get; set; }
}
