using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasacademicyear")]
public class Tbmasacademicyear
{
    [Key]
    [Column("fdid")]
    public int Fdid { get; set; }

    [Column("fdstartdate")]
    public DateTime Fdstartdate { get; set; }

    [Column("fdenddate")]
    public DateTime Fdenddate { get; set; }

    [Required]
    [StringLength(100)]
    [Column("facademicdesc")]
    public string Facademicdesc { get; set; } = string.Empty;

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

    [Column("fdeffectivefrom")]
    public DateTime? Fdeffectivefrom { get; set; }

    [Column("fdeffectiveto")]
    public DateTime? Fdeffectiveto { get; set; }

}
