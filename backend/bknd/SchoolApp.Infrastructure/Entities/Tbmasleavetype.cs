using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasleavetype")]
public class Tbmasleavetype
{
    [Key]
    [Column("fdid")]
    public int Fdid { get; set; }

    [Required]
    [StringLength(50)]
    [Column("fdleavetype")]
    public string Fdleavetype { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fddescription")]
    public string Fddescription { get; set; }

    [Column("fdmaxdays")]
    public int? Fdmaxdays { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

}
