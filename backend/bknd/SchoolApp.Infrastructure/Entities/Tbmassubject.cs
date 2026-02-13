using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmassubject")]
public class Tbmassubject
{
    [Key]
    [Column("fdid")]
    public int Fdid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fdsubjectname")]
    public string Fdsubjectname { get; set; } = string.Empty;

    [StringLength(15)]
    [Column("fdtype")]
    public string Fdtype { get; set; }

    [StringLength(65535)]
    [Column("fdsyllabusurl")]
    public string Fdsyllabusurl { get; set; }

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
