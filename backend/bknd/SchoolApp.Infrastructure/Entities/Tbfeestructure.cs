using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbfeestructure")]
public class Tbfeestructure
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdfeeheadid")]
    public int Fdfeeheadid { get; set; }

    [Column("fdclassid")]
    public long Fdclassid { get; set; }

    [Column("fdsectionid")]
    public int? Fdsectionid { get; set; }

    [Column("fdacademicyearid")]
    public int Fdacademicyearid { get; set; }

    [Column("fdamount")]
    public decimal Fdamount { get; set; }

    [StringLength(9)]
    [Column("fdbillingcycle")]
    public string Fdbillingcycle { get; set; }

    [Column("fdeffectivefrom")]
    public DateTime? Fdeffectivefrom { get; set; }

    [Column("fdeffectiveto")]
    public DateTime? Fdeffectiveto { get; set; }

    [StringLength(8)]
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
