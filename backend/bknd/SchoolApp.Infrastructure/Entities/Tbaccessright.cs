using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbaccessright")]
public class Tbaccessright
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdgroupid")]
    public int Fdgroupid { get; set; }

    [Column("fdmoduleid")]
    public int Fdmoduleid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fdmodulename")]
    public string Fdmodulename { get; set; } = string.Empty;

    [StringLength(100)]
    [Column("fdsubmodulename")]
    public string Fdsubmodulename { get; set; }

    [Column("fdcanread")]
    public int? Fdcanread { get; set; }

    [Column("fdcanwrite")]
    public int? Fdcanwrite { get; set; }

    [Column("fdcandelete")]
    public int? Fdcandelete { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

}
