using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasmodule")]
public class Tbmasmodule
{
    [Key]
    [Column("fdid")]
    public int Fdid { get; set; }

    [Required]
    [StringLength(50)]
    [Column("fdmodulerefcode")]
    public string Fdmodulerefcode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [Column("fddisplayname")]
    public string Fddisplayname { get; set; } = string.Empty;

    [StringLength(100)]
    [Column("fdicon")]
    public string Fdicon { get; set; }

    [StringLength(255)]
    [Column("fdroute")]
    public string Fdroute { get; set; }

    [Column("fdparentmodule")]
    public int? Fdparentmodule { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [StringLength(100)]
    [Column("fdlastupdatedby")]
    public string Fdlastupdatedby { get; set; }

    [Column("fdlastupdatedon")]
    public DateTime? Fdlastupdatedon { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

}
