using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstudentfamily")]
public class Tbstudentfamily
{
    [Key]
    [Column("fdfamilyid")]
    public long Fdfamilyid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Required]
    [StringLength(255)]
    [Column("fdmembername")]
    public string Fdmembername { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    [Column("fdrelationship")]
    public string Fdrelationship { get; set; } = string.Empty;

    [StringLength(15)]
    [Column("fdmobile")]
    public string Fdmobile { get; set; }

    [StringLength(100)]
    [Column("fdemail")]
    public string Fdemail { get; set; }

    [StringLength(100)]
    [Column("fdoccupation")]
    public string Fdoccupation { get; set; }

    [Column("fdisprimarycontact")]
    public int? Fdisprimarycontact { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

}
