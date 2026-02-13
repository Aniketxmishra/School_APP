using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbteacherbankdetails")]
public class Tbteacherbankdetails
{
    [Key]
    [Column("fdbankid")]
    public long Fdbankid { get; set; }

    [Column("fdteacherid")]
    public long Fdteacherid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fdbankname")]
    public string Fdbankname { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    [Column("fdaccountno")]
    public string Fdaccountno { get; set; } = string.Empty;

    [StringLength(15)]
    [Column("fdfsccode")]
    public string Fdfsccode { get; set; }

    [StringLength(255)]
    [Column("fdaccountholdername")]
    public string Fdaccountholdername { get; set; }

    [StringLength(100)]
    [Column("fdbranchname")]
    public string Fdbranchname { get; set; }

    [Column("fdisprimary")]
    public int? Fdisprimary { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

}
