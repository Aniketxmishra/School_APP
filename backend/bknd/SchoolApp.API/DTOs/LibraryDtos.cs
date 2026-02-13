namespace SchoolApp.API.DTOs;

public class BookDto
{
    public long Id { get; set; }
    public string BookCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Author { get; set; }
    public string? Publisher { get; set; }
    public string? ISBN { get; set; }
    public string? Category { get; set; }
    public string? Subject { get; set; }
    public int? TotalCopies { get; set; }
    public int? AvailableCopies { get; set; }
    public string? Location { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class BookIssueDto
{
    public long Id { get; set; }
    public long BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public long IssuedTo { get; set; }
    public string IssuedToName { get; set; } = string.Empty;
    public string IssueEId { get; set; } = string.Empty; // Student or Staff
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public decimal? FineAmount { get; set; }
    public decimal? FinePaid { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class IssueBookRequest
{
    public long BookId { get; set; }
    public long UserId { get; set; }
    public string UserType { get; set; } = string.Empty; // Student/Teacher
    public DateTime DueDate { get; set; }
}

public class ReturnBookRequest
{
    public long IssueId { get; set; }
    public decimal? FinePaid { get; set; }
}
