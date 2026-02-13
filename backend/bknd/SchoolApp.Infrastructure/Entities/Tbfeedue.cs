using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbfeedue")]
public class Tbfeedue
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Column("fdfeeheadid")]
    public int Fdfeeheadid { get; set; }

    [Column("fdamountdue")]
    public decimal Fdamountdue { get; set; }

    [Column("fdduedate")]
    public DateTime Fdduedate { get; set; }

    [StringLength(7)]
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
