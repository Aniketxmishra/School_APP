using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasbook")]
public class Tbmasbook
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Required]
    [StringLength(50)]
    [Column("fdbookcode")]
    public string Fdbookcode { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    [Column("fdbooktitle")]
    public string Fdbooktitle { get; set; } = string.Empty;

    [StringLength(255)]
    [Column("fdauthor")]
    public string Fdauthor { get; set; }

    [StringLength(100)]
    [Column("fdpublisher")]
    public string Fdpublisher { get; set; }

    [StringLength(20)]
    [Column("fdisbn")]
    public string Fdisbn { get; set; }

    [StringLength(100)]
    [Column("fdcategory")]
    public string Fdcategory { get; set; }

    [StringLength(100)]
    [Column("fdsubject")]
    public string Fdsubject { get; set; }

    [Column("fdpurchasedate")]
    public DateTime? Fdpurchasedate { get; set; }

    [Column("fdpurchaseprice")]
    public decimal? Fdpurchaseprice { get; set; }

    [Column("fdtotalcopies")]
    public int? Fdtotalcopies { get; set; }

    [Column("fdavailablecopies")]
    public int? Fdavailablecopies { get; set; }

    [StringLength(100)]
    [Column("fdlocation")]
    public string Fdlocation { get; set; }

    [StringLength(9)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdaudituser")]
    public string Fdaudituser { get; set; }

}
