using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstudentaddress")]
public class Tbstudentaddress
{
    [Key]
    [Column("fdaddressid")]
    public long Fdaddressid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Required]
    [StringLength(65535)]
    [Column("fdaddressline")]
    public string Fdaddressline { get; set; } = string.Empty;

    [StringLength(100)]
    [Column("fdcity")]
    public string Fdcity { get; set; }

    [StringLength(100)]
    [Column("fdstate")]
    public string Fdstate { get; set; }

    [StringLength(100)]
    [Column("fdcountry")]
    public string Fdcountry { get; set; }

    [StringLength(10)]
    [Column("fdpincode")]
    public string Fdpincode { get; set; }

    [StringLength(14)]
    [Column("fdaddresstype")]
    public string Fdaddresstype { get; set; }

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

}
