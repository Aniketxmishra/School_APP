using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmashomework")]
public class Tbmashomework
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Required]
    [StringLength(255)]
    [Column("fdhomeworktitle")]
    public string Fdhomeworktitle { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fddescription")]
    public string Fddescription { get; set; }

    [Column("fdclassid")]
    public long Fdclassid { get; set; }

    [Column("fdsectionid")]
    public int Fdsectionid { get; set; }

    [Column("fdsubjectid")]
    public int Fdsubjectid { get; set; }

    [Column("fdteacherid")]
    public long Fdteacherid { get; set; }

    [Column("fdassigneddate")]
    public DateTime Fdassigneddate { get; set; }

    [Column("fdduedate")]
    public DateTime Fdduedate { get; set; }

    [Column("fdmaxmarks")]
    public decimal? Fdmaxmarks { get; set; }

    [StringLength(65535)]
    [Column("fdattachmentpath")]
    public string Fdattachmentpath { get; set; }

    [StringLength(9)]
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
