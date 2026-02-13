using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Infrastructure.Entities;

[Table("tbstudentmedicaldetails")]
public class Tbstudentmedicaldetails
{
    [Key]
    [Column("fdmedicalid")]
    public long Fdmedicalid { get; set; }

    [Column("fdstudentid")]
    public long Fdstudentid { get; set; }

    [StringLength(10)]
    [Column("fdbloodgroup")]
    public string Fdbloodgroup { get; set; }

    [StringLength(100)]
    [Column("fdmedicaltype")]
    public string Fdmedicaltype { get; set; }

    [StringLength(8)]
    [Column("fdseverity")]
    public string Fdseverity { get; set; }

    [StringLength(65535)]
    [Column("fddocumentpath")]
    public string Fddocumentpath { get; set; }

    [StringLength(65535)]
    [Column("fdremarks")]
    public string Fdremarks { get; set; }

    [StringLength(8)]
    [Column("fdstatus")]
    public string Fdstatus { get; set; }

    [Column("fdauditdate")]
    public DateTime? Fdauditdate { get; set; }

    [StringLength(100)]
    [Column("fdcreatedby")]
    public string Fdcreatedby { get; set; }

    [Column("fdcreatedon")]
    public DateTime? Fdcreatedon { get; set; }

}
