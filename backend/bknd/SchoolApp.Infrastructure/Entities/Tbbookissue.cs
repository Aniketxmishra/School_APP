using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbbookissue")]
public class Tbbookissue
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdbookid")]
    public long Fdbookid { get; set; }

    [Column("fdissuedto")]
    public long Fdissuedto { get; set; }

    [Required]
    [StringLength(7)]
    [Column("fdissueeid")]
    public string Fdissueeid { get; set; } = string.Empty;

    [Column("fdissuedate")]
    public DateTime Fdissuedate { get; set; }

    [Column("fdduedate")]
    public DateTime Fdduedate { get; set; }

    [Column("fdreturndate")]
    public DateTime? Fdreturndate { get; set; }

    [Column("fdfineamount")]
    public decimal? Fdfineamount { get; set; }

    [Column("fdfinepaid")]
    public decimal? Fdfinepaid { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [StringLength(100)]
    [Column("fdissuedby")]
    public string Fdissuedby { get; set; }

}
