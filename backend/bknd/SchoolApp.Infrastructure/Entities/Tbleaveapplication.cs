using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbleaveapplication")]
public class Tbleaveapplication
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Required]
    [StringLength(7)]
    [Column("fdusertype")]
    public string Fdusertype { get; set; } = string.Empty;

    [Column("fduserid")]
    public long Fduserid { get; set; }

    [StringLength(50)]
    [Column("fdusercode")]
    public string Fdusercode { get; set; }

    [StringLength(255)]
    [Column("fdusername")]
    public string Fdusername { get; set; }

    [Column("fdleavestartdate")]
    public DateTime Fdleavestartdate { get; set; }

    [Column("fdleaveenddate")]
    public DateTime Fdleaveenddate { get; set; }

    [Column("fdduration")]
    public int? Fdduration { get; set; }

    [Column("fdleavetypeid")]
    public int Fdleavetypeid { get; set; }

    [Required]
    [StringLength(65535)]
    [Column("fdreason")]
    public string Fdreason { get; set; } = string.Empty;

    [StringLength(9)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(50)]
    [Column("fdapprovercode")]
    public string Fdapprovercode { get; set; }

    [StringLength(100)]
    [Column("fdapprovedby")]
    public string Fdapprovedby { get; set; }

    [Column("fdapprovedate")]
    public DateTime? Fdapprovedate { get; set; }

    [StringLength(65535)]
    [Column("fdcomments")]
    public string Fdcomments { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

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
