using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbgallery")]
public class Tbgallery
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Required]
    [StringLength(255)]
    [Column("fdtitle")]
    public string Fdtitle { get; set; } = string.Empty;

    [StringLength(65535)]
    [Column("fddescription")]
    public string Fddescription { get; set; }

    [Column("fddate")]
    public DateTime? Fddate { get; set; }

    [Column("fdclass")]
    public long? Fdclass { get; set; }

    [Column("fdsection")]
    public int? Fdsection { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdgallerydate")]
    public DateTime? Fdgallerydate { get; set; }

}
