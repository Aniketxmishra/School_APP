using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class GalleryService : IGalleryService
{
    private readonly SchoolAppDbContext _context;

    public GalleryService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GalleryDto>> GetAllGalleriesAsync(long? classId = null, int? sectionId = null)
    {
        var query = _context.Tbgallery.Where(g => g.Fdstatus == "Active");

        if (classId.HasValue)
        {
            query = query.Where(g => g.Fdclass == classId);
        }

        if (sectionId.HasValue)
        {
            query = query.Where(g => g.Fdsection == sectionId);
        }

        var galleries = await query.ToListAsync();

        var result = new List<GalleryDto>();
        foreach (var gallery in galleries)
        {
            var mediaCount = await _context.Tbgallerymedia
                .CountAsync(m => m.Fdgalleryid == gallery.Fdid && m.Fdstatus == "Active");

            result.Add(new GalleryDto
            {
                Id = gallery.Fdid,
                Title = gallery.Fdtitle,
                Description = gallery.Fddescription,
                Date = gallery.Fddate,
                ClassId = gallery.Fdclass,
                SectionId = gallery.Fdsection,
                Status = gallery.Fdstatus,
                MediaCount = mediaCount
            });
        }

        return result;
    }

    public async Task<GalleryDto?> GetGalleryByIdAsync(long galleryId)
    {
        var gallery = await _context.Tbgallery.FindAsync(galleryId);
        if (gallery == null) return null;

        var mediaCount = await _context.Tbgallerymedia
            .CountAsync(m => m.Fdgalleryid == galleryId && m.Fdstatus == "Active");

        return new GalleryDto
        {
            Id = gallery.Fdid,
            Title = gallery.Fdtitle,
            Description = gallery.Fddescription,
            Date = gallery.Fddate,
            ClassId = gallery.Fdclass,
            SectionId = gallery.Fdsection,
            Status = gallery.Fdstatus,
            MediaCount = mediaCount
        };
    }

    public async Task<List<GalleryMediaDto>> GetGalleryMediaAsync(long galleryId)
    {
        return await _context.Tbgallerymedia
            .Where(m => m.Fdgalleryid == galleryId && m.Fdstatus == "Active")
            .Select(m => new GalleryMediaDto
            {
                Id = m.Fdid,
                GalleryId = m.Fdgalleryid,
                MediaUrl = m.Fdmediaurl,
                MediaType = m.Fdmediatype,
                CreatedOn = m.Fdcreatedon
            })
            .ToListAsync();
    }

    public async Task<bool> CreateGalleryAsync(CreateGalleryDto galleryDto, string currentUser)
    {
        var gallery = new Tbgallery
        {
            Fdtitle = galleryDto.Title,
            Fddescription = galleryDto.Description,
            Fddate = galleryDto.Date,
            Fdclass = galleryDto.ClassId,
            Fdsection = galleryDto.SectionId,
            Fdstatus = "Active",
            Fdcreatedby = currentUser,
            Fdcreatedon = DateTime.UtcNow,
            Fdgallerydate = galleryDto.Date ?? DateTime.UtcNow
        };

        await _context.Tbgallery.AddAsync(gallery);
        await _context.SaveChangesAsync();

        // Add media items
        foreach (var mediaUrl in galleryDto.MediaUrls)
        {
            var media = new Tbgallerymedia
            {
                Fdgalleryid = gallery.Fdid,
                Fdmediaurl = mediaUrl,
                Fdmediatype = "Photo", // Could be determined from URL extension
                Fdstatus = "Active",
                Fdcreatedby = currentUser,
                Fdcreatedon = DateTime.UtcNow
            };
            await _context.Tbgallerymedia.AddAsync(media);
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
