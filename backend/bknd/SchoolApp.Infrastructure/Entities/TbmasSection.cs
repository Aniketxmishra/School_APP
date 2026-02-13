using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmassection")]
public class Tbmassection
{
    [Key]
    [Column("fdid")]
    public int Fdid { get; set; }

    [Required]
    [StringLength(10)]
    [Column("fdsectionname")]
    public string Fdsectionname { get; set; } = string.Empty;

    [StringLength(20)]
    [Column("fdroomno")]
    public string Fdroomno { get; set; }

    [StringLength(10)]
    [Column("fdfloorno")]
    public string Fdfloorno { get; set; }

    [Column("fdeffectivefrom")]
    public DateTime? Fdeffectivefrom { get; set; }

    [Column("fdeffectiveto")]
    public DateTime? Fdeffectiveto { get; set; }

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

    [Column("fdhdrid")]
    public int? Fdhdrid { get; set; }

}
