using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbteacherdocuments")]
public class Tbteacherdocuments
{
    [Key]
    [Column("fddocumentid")]
    public long Fddocumentid { get; set; }

    [Column("fdteacherid")]
    public long Fdteacherid { get; set; }

    [Required]
    [StringLength(100)]
    [Column("fddocumenttype")]
    public string Fddocumenttype { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("fddocumentname")]
    public string Fddocumentname { get; set; }

    [StringLength(65535)]
    [Column("fddocumentpath")]
    public string Fddocumentpath { get; set; }

    [Column("fduploaddate")]
    public DateTime? Fduploaddate { get; set; }

    [StringLength(1)]
    [Column("fdverified")]
    public string Fdverified { get; set; }

    [StringLength(100)]
    [Column("fdverifiedby")]
    public string Fdverifiedby { get; set; }

    [Column("fdverifieddate")]
    public DateTime? Fdverifieddate { get; set; }

    [StringLength(65535)]
    [Column("fdremarks")]
    public string Fdremarks { get; set; }

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
