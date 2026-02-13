using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbhomeworksubmission")]
public class Tbhomeworksubmission
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdhomeworkid")]
    public long Fdhomeworkid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [StringLength(65535)]
    [Column("fdsubmissiontext")]
    public string Fdsubmissiontext { get; set; }

    [StringLength(65535)]
    [Column("fdattachmentpath")]
    public string Fdattachmentpath { get; set; }

    [Column("fdsubmitteddate")]
    public DateTime? Fdsubmitteddate { get; set; }

    [Column("fdmarksobtained")]
    public decimal? Fdmarksobtained { get; set; }

    [StringLength(65535)]
    [Column("fdteacherfeedback")]
    public string Fdteacherfeedback { get; set; }

    [Column("fdcheckeddate")]
    public DateTime? Fdcheckeddate { get; set; }

    [StringLength(100)]
    [Column("fdcheckedby")]
    public string Fdcheckedby { get; set; }

    [StringLength(9)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

}
