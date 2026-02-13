using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstaffattendance")]
public class Tbstaffattendance
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdstaffid")]
    public long Fdstaffid { get; set; }

    [Column("fddate")]
    public DateTime Fddate { get; set; }

    [Required]
    [StringLength(2)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fdremark")]
    public string Fdremark { get; set; }

    [StringLength(65535)]
    [Column("fdimageurl")]
    public string Fdimageurl { get; set; }

    [StringLength(100)]
    [Column("fdgeolocation")]
    public string Fdgeolocation { get; set; }

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
