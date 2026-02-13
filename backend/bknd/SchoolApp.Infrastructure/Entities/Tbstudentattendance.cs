using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstudentattendance")]
public class Tbstudentattendance
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Column("fdclassid")]
    public long Fdclassid { get; set; }

    [Column("fdsectionid")]
    public int Fdsectionid { get; set; }

    [Column("fddate")]
    public DateTime Fddate { get; set; }

    [Required]
    [StringLength(2)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fdremark")]
    public string Fdremark { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

}
