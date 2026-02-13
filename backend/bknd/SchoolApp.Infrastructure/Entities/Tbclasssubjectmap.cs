using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbclasssubjectmap")]
public class Tbclasssubjectmap
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdclassid")]
    public long Fdclassid { get; set; }

    [Column("fdteacherid")]
    public long? Fdteacherid { get; set; }

    [Column("fdsubjectid")]
    public int Fdsubjectid { get; set; }

    [StringLength(10)]
    [Column("fdcategory")]
    public string Fdcategory { get; set; }

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
