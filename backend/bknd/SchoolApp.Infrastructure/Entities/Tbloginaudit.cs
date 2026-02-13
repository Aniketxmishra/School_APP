using System.ComponentModel.DataAnnotations;

namespace SchoolApp.Infrastructure.Entities;

public class Tbloginaudit
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Fdusername { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string Fdstatus { get; set; } = string.Empty;
    
    public DateTime Fdlogindatetime { get; set; } = DateTime.UtcNow;
    
    [StringLength(50)]
    public string Fdmodulename { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string Fdsubmodulename { get; set; } = string.Empty;
}
