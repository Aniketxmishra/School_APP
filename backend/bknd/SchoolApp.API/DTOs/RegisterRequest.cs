namespace SchoolApp.API.DTOs;

public class RegisterRequest
{
    public string UserId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? GroupId { get; set; }
}
