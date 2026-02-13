using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbattendanceverification")]
public class Tbattendanceverification
{
    [Key]
    [Column("fdverificationid")]
    public long Fdverificationid { get; set; }

    [Column("fdattendanceid")]
    public long Fdattendanceid { get; set; }

    [Required]
    [StringLength(7)]
    [Column("fdattendancetype")]
    public string Fdattendancetype { get; set; } = string.Empty;

    [Required]
    [StringLength(11)]
    [Column("fdtype")]
    public string Fdtype { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fdvalue")]
    public string Fdvalue { get; set; }

    [StringLength(100)]
    [Column("fdverifiedby")]
    public string Fdverifiedby { get; set; }

    [Column("fdverifiedon")]
    public DateTime? Fdverifiedon { get; set; }

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
