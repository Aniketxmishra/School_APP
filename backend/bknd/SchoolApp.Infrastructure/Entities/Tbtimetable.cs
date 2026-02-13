using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbtimetable")]
public class Tbtimetable
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdclassid")]
    public long Fdclassid { get; set; }

    [Column("fdsubjectid")]
    public int Fdsubjectid { get; set; }

    [Column("fdteacherid")]
    public long Fdteacherid { get; set; }

    [Required]
    [StringLength(9)]
    [Column("fdday")]
    public string Fdday { get; set; } = string.Empty;

    [Required]
    [Column("fdfromtime")]
    public string Fdfromtime { get; set; } = string.Empty;

    [Required]
    [Column("fdtotime")]
    public string Fdtotime { get; set; } = string.Empty;

    [Column("fdeffectivefrom")]
    public DateTime? Fdeffectivefrom { get; set; }

    [Column("fdeffectiveto")]
    public DateTime? Fdeffectiveto { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

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
