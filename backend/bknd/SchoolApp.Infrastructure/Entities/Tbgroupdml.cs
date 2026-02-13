using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbgroupdml")]
public class Tbgroupdml
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fdusername")]
    public string Fdusername { get; set; } = string.Empty;

    [Column("fdmoduleid")]
    public int? Fdmoduleid { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(100)]
    [Column("fdsubmodulename")]
    public string Fdsubmodulename { get; set; }

    [Column("fdcanread")]
    public int? Fdcanread { get; set; }

    [Column("fdcanwrite")]
    public int? Fdcanwrite { get; set; }

    [Column("fdcandelete")]
    public int? Fdcandelete { get; set; }

    [Column("fdcanupdate")]
    public int? Fdcanupdate { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [Column("fdefffromdate")]
    public DateTime? Fdefffromdate { get; set; }

    [Column("fdefftodate")]
    public DateTime? Fdefftodate { get; set; }

}
