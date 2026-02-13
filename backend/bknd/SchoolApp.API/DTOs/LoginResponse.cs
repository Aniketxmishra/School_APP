namespace SchoolApp.API.DTOs;

public class LoginResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public string? Token { get; set; }
    public object? UserInfo { get; set; }

    public LoginResponse(bool success, string? message, string? token, object? userInfo)
    {
        Success = success;
        Message = message;
        Token = token;
        UserInfo = userInfo;
    }
}
