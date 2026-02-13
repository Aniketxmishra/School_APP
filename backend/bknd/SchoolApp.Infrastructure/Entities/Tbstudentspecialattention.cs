using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstudentspecialattention")]
public class Tbstudentspecialattention
{
    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fdattentiontype")]
    public string Fdattentiontype { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fddescription")]
    public string Fddescription { get; set; }

    [StringLength(65535)]
    [Column("fdremarks")]
    public string Fdremarks { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

}
