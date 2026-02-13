using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstudentcontact")]
public class Tbstudentcontact
{
    [Key]
    [Column("fdcontactid")]
    public long Fdcontactid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Required]
    [StringLength(9)]
    [Column("fdcontacttype")]
    public string Fdcontacttype { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    [Column("fdcontactvalue")]
    public string Fdcontactvalue { get; set; } = string.Empty;

    [Column("fdprimary")]
    public int? Fdprimary { get; set; }

    [Column("fdeffectivefrom")]
    public DateTime? Fdeffectivefrom { get; set; }

    [Column("fdeffectiveto")]
    public DateTime? Fdeffectiveto { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [Column("fdnotification")]
    public int? Fdnotification { get; set; }

}
