using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbfeepayment")]
public class Tbfeepayment
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [Column("fdfeeheadid")]
    public int Fdfeeheadid { get; set; }

    [Column("fdamountpaid")]
    public decimal Fdamountpaid { get; set; }

    [Column("fdpaymentdate")]
    public DateTime Fdpaymentdate { get; set; }

    [Required]
    [StringLength(6)]
    [Column("fdpaymentmode")]
    public string Fdpaymentmode { get; set; } = string.Empty;

    [StringLength(100)]
    [Column("fdtransactionref")]
    public string Fdtransactionref { get; set; }

    [StringLength(50)]
    [Column("fdreceiptno")]
    public string Fdreceiptno { get; set; }

    [StringLength(9)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

}
