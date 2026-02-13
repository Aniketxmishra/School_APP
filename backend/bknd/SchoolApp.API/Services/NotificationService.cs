using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class NotificationService : INotificationService
{
    private readonly SchoolAppDbContext _context;

    public NotificationService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NotificationDto>> GetNotificationsAsync(long? classId = null, int? sectionId = null)
    {
        var today = DateTime.UtcNow.Date;
        
        var query = _context.Tbtnotification
            .Where(n => n.Fdstatus == "Active" &&
                       (n.Fdstartdate == null || n.Fdstartdate.Value.Date <= today) &&
                       (n.Fdenddate == null || n.Fdenddate.Value.Date >= today));

        // Filter by class/section if provided
        if (classId.HasValue)
        {
            query = query.Where(n => n.Fdclass == null || n.Fdclass == classId);
        }

        if (sectionId.HasValue)
        {
            query = query.Where(n => n.Fdsection == null || n.Fdsection == sectionId);
        }

        query = query.OrderByDescending(n => n.Fdcreatedon);

        return await query.Select(n => new NotificationDto
        {
            Id = n.Fdid,
            Title = n.Fdtitle,
            Message = n.Fdmessage,
            NoteType = n.Fdnotetype,
            ClassId = n.Fdclass,
            SectionId = n.Fdsection,
            StartDate = n.Fdstartdate,
            EndDate = n.Fdenddate,
            ImageUrl = n.Fdimageurl,
            LinkUrl = n.Fdlinkurl,
            Status = n.Fdstatus,
            CreatedOn = n.Fdcreatedon
        }).ToListAsync();
    }

    public async Task<NotificationDto?> GetNotificationByIdAsync(long notificationId)
    {
        var notification = await _context.Tbtnotification.FindAsync(notificationId);
        if (notification == null) return null;

        return new NotificationDto
        {
            Id = notification.Fdid,
            Title = notification.Fdtitle,
            Message = notification.Fdmessage,
            NoteType = notification.Fdnotetype,
            ClassId = notification.Fdclass,
            SectionId = notification.Fdsection,
            StartDate = notification.Fdstartdate,
            EndDate = notification.Fdenddate,
            ImageUrl = notification.Fdimageurl,
            LinkUrl = notification.Fdlinkurl,
            Status = notification.Fdstatus,
            CreatedOn = notification.Fdcreatedon
        };
    }

    public async Task<bool> CreateNotificationAsync(CreateNotificationRequest request, string createdBy)
    {
        var notification = new Tbtnotification
        {
            Fdtitle = request.Title,
            Fdmessage = request.Message,
            Fdnotetype = request.NoteType,
            Fdclass = request.ClassId,
            Fdsection = request.SectionId,
            Fdstartdate = request.StartDate,
            Fdenddate = request.EndDate,
            Fdimageurl = request.ImageUrl,
            Fdlinkurl = request.LinkUrl,
            Fdstatus = "Active",
            Fdcreatedon = DateTime.UtcNow,
            Fdlastupdatedby = createdBy,
            Fdlastupdatedon = DateTime.UtcNow,
            Fdaudituser = createdBy,
            Fdauditdate = DateTime.UtcNow
        };

        await _context.Tbtnotification.AddAsync(notification);
        await _context.SaveChangesAsync();
        return true;
    }
}
