using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbtnotification")]
public class Tbtnotification
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Required]
    [StringLength(255)]
    [Column("fdtitle")]
    public string Fdtitle { get; set; } = string.Empty;

    [Required]
    [StringLength(65535)]
    [Column("fdmessage")]
    public string Fdmessage { get; set; } = string.Empty;

    [StringLength(9)]
    [Column("fdnotetype")]
    public string Fdnotetype { get; set; }

    [Column("fdclass")]
    public long? Fdclass { get; set; }

    [Column("fdsection")]
    public int? Fdsection { get; set; }

    [Column("fdstartdate")]
    public DateTime? Fdstartdate { get; set; }

    [Column("fdenddate")]
    public DateTime? Fdenddate { get; set; }

    [StringLength(65535)]
    [Column("fdimageurl")]
    public string Fdimageurl { get; set; }

    [StringLength(65535)]
    [Column("fdlinkurl")]
    public string Fdlinkurl { get; set; }

    [StringLength(9)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [StringLength(100)]
    [Column("fdlastupdatedby")]
    public string Fdlastupdatedby { get; set; }

    [Column("fdlastupdatedon")]
    public DateTime? Fdlastupdatedon { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

}
