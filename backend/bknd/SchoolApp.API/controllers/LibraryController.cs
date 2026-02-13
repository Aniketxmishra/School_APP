using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolApp.API.DTOs;
using SchoolApp.API.Services;

namespace SchoolApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _libraryService;

    public LibraryController(ILibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    [HttpGet("books")]
    public async Task<IActionResult> GetAllBooks()
    {
        var books = await _libraryService.GetAllBooksAsync();
        return Ok(books);
    }

    [HttpGet("books/search")]
    public async Task<IActionResult> SearchBooks([FromQuery] string? searchTerm, [FromQuery] string? category)
    {
        var books = await _libraryService.SearchBooksAsync(searchTerm, category);
        return Ok(books);
    }

    [HttpGet("books/{bookId}")]
    public async Task<IActionResult> GetBookById(long bookId)
    {
        var book = await _libraryService.GetBookByIdAsync(bookId);
        if (book == null) return NotFound("Book not found");
        return Ok(book);
    }

    [HttpPost("issue")]
    public async Task<IActionResult> IssueBook([FromBody] IssueBookRequest request)
    {
        var username = User.Identity?.Name ?? "System";
        var result = await _libraryService.IssueBookAsync(request, username);
        
        if (result) return Ok(new { message = "Book issued successfully" });
        return BadRequest("Failed to issue book. Book may not be available.");
    }

    [HttpPost("return")]
    public async Task<IActionResult> ReturnBook([FromBody] ReturnBookRequest request)
    {
        var result = await _libraryService.ReturnBookAsync(request);
        
        if (result) return Ok(new { message = "Book returned successfully" });
        return BadRequest("Failed to return book. Issue not found or already returned.");
    }

    [HttpGet("issued/{userId}")]
    public async Task<IActionResult> GetIssuedBooks(long userId, [FromQuery] string userType = "Student")
    {
        var issuedBooks = await _libraryService.GetIssuedBooksAsync(userId, userType);
        return Ok(issuedBooks);
    }

    [HttpGet("overdue")]
    public async Task<IActionResult> GetOverdueBooks()
    {
        var overdueBooks = await _libraryService.GetOverdueBooksAsync();
        return Ok(overdueBooks);
    }
}
