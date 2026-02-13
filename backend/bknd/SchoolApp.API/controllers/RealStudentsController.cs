using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace SchoolApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RealStudentsController : ControllerBase
    {
        private readonly SchoolAppDbContext _context;
        private readonly ILogger<RealStudentsController> _logger;

        public RealStudentsController(SchoolAppDbContext context, ILogger<RealStudentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all students with pagination from tbmasstudent
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedStudentResult>> GetStudents(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            try
            {
                var query = _context.TbmasStudents.AsQueryable();

                // Apply search filter
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(s => 
                        s.FdStudentName.Contains(search) || 
                        s.FdEnrollmentNo.Contains(search) ||
                        (s.FdMotherName != null && s.FdMotherName.Contains(search)) ||
                        (s.FdGuardianName != null && s.FdGuardianName.Contains(search)));
                }

                var totalCount = await query.CountAsync();
                var students = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(s => new RealStudentDto
                    {
                        Id = (int)s.FdStudentId,
                        EnrollmentNo = s.FdEnrollmentNo,
                        StudentName = s.FdStudentName,
                        Gender = s.FdGender,
                        DateOfBirth = DateOnly.FromDateTime(s.FdDateOfBirth),
                        Religion = s.FdReligion ?? "",
                        Address = s.FdAddress ?? "",
                        City = s.FdCity ?? "",
                        State = s.FdState ?? "",
                        Pincode = s.FdPincode ?? "",
                        JoiningDate = DateOnly.FromDateTime(s.FdJoiningDate),
                        MotherName = s.FdMotherName ?? "",
                        GuardianName = s.FdGuardianName ?? "",
                        GuardianType = s.FdGuardianType ?? "",
                        Status = s.FdStatus,
                        AuditDate = s.FdAuditDate
                    })
                    .ToListAsync();

                var result = new PagedStudentResult
                {
                    Data = students,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving students");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student by ID from tbmasstudent
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RealStudentDto>> GetStudent(long id)
        {
            try
            {
                var student = await _context.TbmasStudents.FindAsync(id);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                var studentDto = new RealStudentDto
                {
                    Id = (int)student.FdStudentId,
                    EnrollmentNo = student.FdEnrollmentNo,
                    StudentName = student.FdStudentName,
                    Gender = student.FdGender,
                    DateOfBirth = DateOnly.FromDateTime(student.FdDateOfBirth),
                    Religion = student.FdReligion ?? "",
                    Address = student.FdAddress ?? "",
                    City = student.FdCity ?? "",
                    State = student.FdState ?? "",
                    Pincode = student.FdPincode ?? "",
                    JoiningDate = DateOnly.FromDateTime(student.FdJoiningDate),
                    MotherName = student.FdMotherName ?? "",
                    GuardianName = student.FdGuardianName ?? "",
                    GuardianType = student.FdGuardianType ?? "",
                    Status = student.FdStatus,
                    AuditDate = student.FdAuditDate
                };

                return Ok(studentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving student with ID {StudentId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new student in tbmasstudent
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RealStudentDto>> CreateStudent([FromBody] CreateRealStudentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if enrollment number already exists
                var existingStudent = await _context.TbmasStudents
                    .FirstOrDefaultAsync(s => s.FdEnrollmentNo == request.EnrollmentNo);

                if (existingStudent != null)
                {
                    return Conflict(new { message = "Student with this enrollment number already exists" });
                }

                var student = new TbmasStudentActual
                {
                    FdEnrollmentNo = request.EnrollmentNo.Trim(),
                    FdStudentName = request.StudentName.Trim(),
                    FdGender = request.Gender,
                    FdDateOfBirth = request.DateOfBirth.ToDateTime(TimeOnly.MinValue),
                    FdReligion = request.Religion?.Trim(),
                    FdAddress = request.Address?.Trim(),
                    FdCity = request.City?.Trim(),
                    FdState = request.State?.Trim(),
                    FdPincode = request.Pincode?.Trim(),
                    FdJoiningDate = request.JoiningDate.ToDateTime(TimeOnly.MinValue),
                    FdMotherName = request.MotherName?.Trim(),
                    FdGuardianName = request.GuardianName?.Trim(),
                    FdGuardianType = request.GuardianType,
                    FdStatus = "active",
                    FdAuditDate = DateTime.UtcNow,
                    FdAuditUser = "system" // In production, get from current user
                };

                _context.TbmasStudents.Add(student);
                await _context.SaveChangesAsync();

                var studentDto = new RealStudentDto
                {
                    Id = (int)student.FdStudentId,
                    EnrollmentNo = student.FdEnrollmentNo,
                    StudentName = student.FdStudentName,
                    Gender = student.FdGender,
                    DateOfBirth = DateOnly.FromDateTime(student.FdDateOfBirth),
                    Religion = student.FdReligion ?? "",
                    Address = student.FdAddress ?? "",
                    City = student.FdCity ?? "",
                    State = student.FdState ?? "",
                    Pincode = student.FdPincode ?? "",
                    JoiningDate = DateOnly.FromDateTime(student.FdJoiningDate),
                    MotherName = student.FdMotherName ?? "",
                    GuardianName = student.FdGuardianName ?? "",
                    GuardianType = student.FdGuardianType ?? "",
                    Status = student.FdStatus,
                    AuditDate = student.FdAuditDate
                };

                _logger.LogInformation("Student created with ID {StudentId}", student.FdStudentId);
                return CreatedAtAction(nameof(GetStudent), new { id = student.FdStudentId }, studentDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating student");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Update student in tbmasstudent
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(long id, [FromBody] UpdateRealStudentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var student = await _context.TbmasStudents.FindAsync(id);
                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                // Check if enrollment number is being changed and if it already exists
                if (request.EnrollmentNo != student.FdEnrollmentNo)
                {
                    var existingStudent = await _context.TbmasStudents
                        .FirstOrDefaultAsync(s => s.FdEnrollmentNo == request.EnrollmentNo && s.FdStudentId != id);

                    if (existingStudent != null)
                    {
                        return Conflict(new { message = "Student with this enrollment number already exists" });
                    }
                }

                student.FdEnrollmentNo = request.EnrollmentNo.Trim();
                student.FdStudentName = request.StudentName.Trim();
                student.FdGender = request.Gender;
                student.FdDateOfBirth = request.DateOfBirth.ToDateTime(TimeOnly.MinValue);
                student.FdReligion = request.Religion?.Trim();
                student.FdAddress = request.Address?.Trim();
                student.FdCity = request.City?.Trim();
                student.FdState = request.State?.Trim();
                student.FdPincode = request.Pincode?.Trim();
                student.FdJoiningDate = request.JoiningDate.ToDateTime(TimeOnly.MinValue);
                student.FdMotherName = request.MotherName?.Trim();
                student.FdGuardianName = request.GuardianName?.Trim();
                student.FdGuardianType = request.GuardianType;
                student.FdModifiedDate = DateTime.UtcNow;
                student.FdModifiedBy = "system"; // In production, get from current user

                await _context.SaveChangesAsync();

                _logger.LogInformation("Student updated with ID {StudentId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating student with ID {StudentId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete student from tbmasstudent (with cascade check)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(long id)
        {
            try
            {
                var student = await _context.TbmasStudents.FindAsync(id);
                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                // Check for related records that might prevent deletion
                // In a real scenario, you'd check all related tables
                var relatedRecordsInfo = new List<string>();

                // Example: Check attendance records (you can add more checks)
                // var attendanceCount = await _context.StudentAttendance
                //     .CountAsync(a => a.StudentId == id);
                // if (attendanceCount > 0)
                //     relatedRecordsInfo.Add($"{attendanceCount} attendance records");

                if (relatedRecordsInfo.Any())
                {
                    return BadRequest(new 
                    { 
                        message = "Cannot delete student with related records", 
                        relatedRecords = relatedRecordsInfo 
                    });
                }

                _context.TbmasStudents.Remove(student);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Student deleted with ID {StudentId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting student with ID {StudentId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    // DTOs for Real Students (matching actual database structure)
    public class RealStudentDto
    {
        public int Id { get; set; }
        public string EnrollmentNo { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string Religion { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public DateOnly JoiningDate { get; set; }
        public string MotherName { get; set; } = string.Empty;
        public string GuardianName { get; set; } = string.Empty;
        public string GuardianType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? AuditDate { get; set; }
    }

    public class CreateRealStudentRequest
    {
        [Required]
        [StringLength(50)]
        public string EnrollmentNo { get; set; } = string.Empty;

        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string StudentName { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = string.Empty; // Male, Female, Other

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [StringLength(50)]
        public string? Religion { get; set; }

        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(10)]
        public string? Pincode { get; set; }

        [Required]
        public DateOnly JoiningDate { get; set; }

        [StringLength(255)]
        public string? MotherName { get; set; }

        [StringLength(255)]
        public string? GuardianName { get; set; }

        public string? GuardianType { get; set; } // Father, Mother, Guardian, Other
    }

    public class UpdateRealStudentRequest
    {
        [Required]
        [StringLength(50)]
        public string EnrollmentNo { get; set; } = string.Empty;

        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string StudentName { get; set; } = string.Empty;

        [Required]
        public string Gender { get; set; } = string.Empty;

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [StringLength(50)]
        public string? Religion { get; set; }

        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(10)]
        public string? Pincode { get; set; }

        [Required]
        public DateOnly JoiningDate { get; set; }

        [StringLength(255)]
        public string? MotherName { get; set; }

        [StringLength(255)]
        public string? GuardianName { get; set; }

        public string? GuardianType { get; set; }
    }

    public class PagedStudentResult
    {
        public List<RealStudentDto> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
