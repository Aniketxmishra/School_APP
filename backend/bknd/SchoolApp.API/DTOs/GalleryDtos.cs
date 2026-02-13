namespace SchoolApp.API.DTOs;

public class GalleryDto
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Date { get; set; }
    public long? ClassId { get; set; }
    public int? SectionId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int MediaCount { get; set; } // Count of photos/videos
}

public class GalleryMediaDto
{
    public long Id { get; set; }
    public long GalleryId { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty; // Photo, Video
    public DateTime? CreatedOn { get; set; }
}

public class CreateGalleryDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? Date { get; set; }
    public long? ClassId { get; set; }
    public int? SectionId { get; set; }
    public List<string> MediaUrls { get; set; } = new();
}
