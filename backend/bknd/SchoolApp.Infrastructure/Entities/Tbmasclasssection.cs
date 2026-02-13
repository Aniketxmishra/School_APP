using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbmasclasssection")]
public class Tbmasclasssection
{
    [Key]
    [Column("fdid")]
    public long Fdid { get; set; }

    [Column("fdclass")]
    public int Fdclass { get; set; }

    [Column("fdsection")]
    public int Fdsection { get; set; }

    [Column("fdacademicyearid")]
    public int Fdacademicyearid { get; set; }

    [StringLength(50)]
    [Column("fdclassrefcode")]
    public string Fdclassrefcode { get; set; }

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

    [Column("fdhdrid")]
    public int? Fdhdrid { get; set; }

}
