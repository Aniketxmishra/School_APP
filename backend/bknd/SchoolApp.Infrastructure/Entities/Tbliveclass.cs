using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbliveclass")]
public class Tbliveclass
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdteacherid")]
    public long Fdteacherid { get; set; }

    [Column("fdsubjectid")]
    public int Fdsubjectid { get; set; }

    [Column("fdclasssectionid")]
    public long Fdclasssectionid { get; set; }

    [Column("fdstarttime")]
    public DateTime Fdstarttime { get; set; }

    [Column("fdendtime")]
    public DateTime Fdendtime { get; set; }

    [StringLength(65535)]
    [Column("fdlink")]
    public string Fdlink { get; set; }

    [StringLength(9)]
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
