using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbgallerymedia")]
public class Tbgallerymedia
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdgalleryid")]
    public long Fdgalleryid { get; set; }

    [Required]
    [StringLength(65535)]
    [Column("fdmediaurl")]
    public string Fdmediaurl { get; set; } = string.Empty;

    [StringLength(8)]
    [Column("fdmediatype")]
    public string Fdmediatype { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

}
