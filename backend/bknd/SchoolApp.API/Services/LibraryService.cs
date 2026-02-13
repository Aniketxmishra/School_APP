using Microsoft.EntityFrameworkCore;
using SchoolApp.API.DTOs;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;

namespace SchoolApp.API.Services;

public class LibraryService : ILibraryService
{
    private readonly SchoolAppDbContext _context;

    public LibraryService(SchoolAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookDto>> GetAllBooksAsync()
    {
        return await _context.Tbmasbook
            .Where(b => b.Fdstatus == "Active")
            .Select(b => new BookDto
            {
                Id = b.Fdid,
                BookCode = b.Fdbookcode,
                Title = b.Fdbooktitle,
                Author = b.Fdauthor,
                Publisher = b.Fdpublisher,
                ISBN = b.Fdisbn,
                Category = b.Fdcategory,
                Subject = b.Fdsubject,
                TotalCopies = b.Fdtotalcopies,
                AvailableCopies = b.Fdavailablecopies,
                Location = b.Fdlocation,
                Status = b.Fdstatus
            })
            .ToListAsync();
    }

    public async Task<List<BookDto>> SearchBooksAsync(string? searchTerm, string? category)
    {
        var query = _context.Tbmasbook.Where(b => b.Fdstatus == "Active");

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(b =>
                b.Fdbooktitle.Contains(searchTerm) ||
                b.Fdauthor.Contains(searchTerm) ||
                b.Fdisbn.Contains(searchTerm));
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Fdcategory == category);
        }

        return await query.Select(b => new BookDto
        {
            Id = b.Fdid,
            BookCode = b.Fdbookcode,
            Title = b.Fdbooktitle,
            Author = b.Fdauthor,
            Publisher = b.Fdpublisher,
            ISBN = b.Fdisbn,
            Category = b.Fdcategory,
            Subject = b.Fdsubject,
            TotalCopies = b.Fdtotalcopies,
            AvailableCopies = b.Fdavailablecopies,
            Location = b.Fdlocation,
            Status = b.Fdstatus
        }).ToListAsync();
    }

    public async Task<BookDto?> GetBookByIdAsync(long bookId)
    {
        var book = await _context.Tbmasbook.FindAsync(bookId);
        if (book == null) return null;

        return new BookDto
        {
            Id = book.Fdid,
            BookCode = book.Fdbookcode,
            Title = book.Fdbooktitle,
            Author = book.Fdauthor,
            Publisher = book.Fdpublisher,
            ISBN = book.Fdisbn,
            Category = book.Fdcategory,
            Subject = book.Fdsubject,
            TotalCopies = book.Fdtotalcopies,
            AvailableCopies = book.Fdavailablecopies,
            Location = book.Fdlocation,
            Status = book.Fdstatus
        };
    }

    public async Task<bool> IssueBookAsync(IssueBookRequest request, string issuedBy)
    {
        // Check if book is available
        var book = await _context.Tbmasbook.FindAsync(request.BookId);
        if (book == null || book.Fdavailablecopies <= 0) return false;

        var issue = new Tbbookissue
        {
            Fdbookid = request.BookId,
            Fdissuedto = request.UserId,
            Fdissueeid = request.UserType,
            Fdissuedate = DateTime.UtcNow,
            Fdduedate = request.DueDate,
            Fdstatus = "Issued",
            Fdissuedby = issuedBy,
            Fdauditdate = DateTime.UtcNow,
            Fdaudituser = issuedBy
        };

        await _context.Tbbookissue.AddAsync(issue);
        
        // Decrease available copies
        book.Fdavailablecopies = (book.Fdavailablecopies ?? 0) - 1;
        _context.Tbmasbook.Update(book);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReturnBookAsync(ReturnBookRequest request)
    {
        var issue = await _context.Tbbookissue.FindAsync(request.IssueId);
        if (issue == null || issue.Fdreturndate != null) return false;

        issue.Fdreturndate = DateTime.UtcNow;
        issue.Fdfinepaid = request.FinePaid;
        issue.Fdstatus = "Returned";

        // Increase available copies
        var book = await _context.Tbmasbook.FindAsync(issue.Fdbookid);
        if (book != null)
        {
            book.Fdavailablecopies = (book.Fdavailablecopies ?? 0) + 1;
            _context.Tbmasbook.Update(book);
        }

        _context.Tbbookissue.Update(issue);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<BookIssueDto>> GetIssuedBooksAsync(long userId, string userType)
    {
        var query = from i in _context.Tbbookissue
                    join b in _context.Tbmasbook on i.Fdbookid equals b.Fdid
                    where i.Fdissuedto == userId && i.Fdissueeid == userType && i.Fdstatus == "Issued"
                    select new BookIssueDto
                    {
                        Id = i.Fdid,
                        BookId = i.Fdbookid,
                        BookTitle = b.Fdbooktitle,
                        IssuedTo = i.Fdissuedto,
                        IssuedToName = "", // Would need to join with Student/Teacher table
                        IssueEId = i.Fdissueeid,
                        IssueDate = i.Fdissuedate,
                        DueDate = i.Fdduedate,
                        ReturnDate = i.Fdreturndate,
                        FineAmount = i.Fdfineamount,
                        FinePaid = i.Fdfinepaid,
                        Status = i.Fdstatus
                    };

        return await query.ToListAsync();
    }

    public async Task<List<BookIssueDto>> GetOverdueBooksAsync()
    {
        var today = DateTime.UtcNow.Date;
        var query = from i in _context.Tbbookissue
                    join b in _context.Tbmasbook on i.Fdbookid equals b.Fdid
                    where i.Fdstatus == "Issued" && i.Fdduedate.Date < today
                    select new BookIssueDto
                    {
                        Id = i.Fdid,
                        BookId = i.Fdbookid,
                        BookTitle = b.Fdbooktitle,
                        IssuedTo = i.Fdissuedto,
                        IssueEId = i.Fdissueeid,
                        IssueDate = i.Fdissuedate,
                        DueDate = i.Fdduedate,
                        ReturnDate = i.Fdreturndate,
                        FineAmount = i.Fdfineamount,
                        FinePaid = i.Fdfinepaid,
                        Status = "Overdue"
                    };

        return await query.ToListAsync();
    }
}
