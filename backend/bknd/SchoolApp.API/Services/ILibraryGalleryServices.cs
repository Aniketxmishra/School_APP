using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public interface ILibraryService
{
    // Book Management
    Task<List<BookDto>> GetAllBooksAsync();
    Task<List<BookDto>> SearchBooksAsync(string? searchTerm, string? category);
    Task<BookDto?> GetBookByIdAsync(long bookId);
    
    // Book Issue/Return
    Task<bool> IssueBookAsync(IssueBookRequest request, string issuedBy);
    Task<bool> ReturnBookAsync(ReturnBookRequest request);
    Task<List<BookIssueDto>> GetIssuedBooksAsync(long userId, string userType);
    Task<List<BookIssueDto>> GetOverdueBooksAsync();
}

public interface IGalleryService
{
    Task<List<GalleryDto>> GetAllGalleriesAsync(long? classId = null, int? sectionId = null);
    Task<GalleryDto?> GetGalleryByIdAsync(long galleryId);
    Task<List<GalleryMediaDto>> GetGalleryMediaAsync(long galleryId);
    Task<bool> CreateGalleryAsync(CreateGalleryDto galleryDto, string currentUser);
}
