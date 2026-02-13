using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasfeehead")]
public class Tbmasfeehead
{
    [Key]
    [Column("fdid")]
    public int Fdid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fdname")]
    public string Fdname { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fddescription")]
    public string Fddescription { get; set; }

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
