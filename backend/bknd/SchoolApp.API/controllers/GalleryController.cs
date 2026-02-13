using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GalleryController : ControllerBase
{
    private readonly IGalleryService _galleryService;

    public GalleryController(IGalleryService galleryService)
    {
        _galleryService = galleryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGalleries([FromQuery] long? classId, [FromQuery] int? sectionId)
    {
        var galleries = await _galleryService.GetAllGalleriesAsync(classId, sectionId);
        return Ok(galleries);
    }

    [HttpGet("{galleryId}")]
    public async Task<IActionResult> GetGalleryById(long galleryId)
    {
        var gallery = await _galleryService.GetGalleryByIdAsync(galleryId);
        if (gallery == null) return NotFound("Gallery not found");
        return Ok(gallery);
    }

    [HttpGet("{galleryId}/media")]
    public async Task<IActionResult> GetGalleryMedia(long galleryId)
    {
        var media = await _galleryService.GetGalleryMediaAsync(galleryId);
        return Ok(media);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGallery([FromBody] CreateGalleryDto dto)
    {
        var username = User.Identity?.Name ?? "System";
        var result = await _galleryService.CreateGalleryAsync(dto, username);
        
        if (result) return Ok(new { message = "Gallery created successfully" });
        return BadRequest("Failed to create gallery");
    }
}
