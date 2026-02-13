using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolApp.Infrastructure;
using SchoolApp.Infrastructure.Entities;
using System.ComponentModel.DataAnnotations;

namespace SchoolApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RealTeachersController : ControllerBase
    {
        private readonly SchoolAppDbContext _context;
        private readonly ILogger<RealTeachersController> _logger;

        public RealTeachersController(SchoolAppDbContext context, ILogger<RealTeachersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all teachers with pagination from tbmasteacher
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedTeacherResult>> GetTeachers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.TbmasTeachers.AsQueryable();

                // Apply search filter
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(t => 
                        t.FdFirstName.Contains(search) || 
                        (t.FdLastName != null && t.FdLastName.Contains(search)) ||
                        t.FdStaffCode.Contains(search) ||
                        (t.FdEmail != null && t.FdEmail.Contains(search)) ||
                        (t.FdMobile != null && t.FdMobile.Contains(search)));
                }

                // Apply status filter
                if (!string.IsNullOrWhiteSpace(status))
                {
                    query = query.Where(t => t.FdStatus == status);
                }

                var totalCount = await query.CountAsync();
                var teachers = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => new RealTeacherDto
                    {
                        Id = (int)t.FdTeacherId,
                        StaffCode = t.FdStaffCode,
                        FirstName = t.FdFirstName,
                        LastName = t.FdLastName ?? "",
                        FullName = t.FdFullName ?? "",
                        FatherOrHusbandName = t.FdFatherOrHusbandName ?? "",
                        Gender = t.FdGender,
                        DateOfBirth = DateOnly.FromDateTime(t.FdDateOfBirth),
                        BloodGroup = t.FdBloodGroup ?? "",
                        Religion = t.FdReligion ?? "",
                        Category = t.FdCategory ?? "",
                        Mobile = t.FdMobile ?? "",
                        Email = t.FdEmail ?? "",
                        Address = t.FdAddress ?? "",
                        City = t.FdCity ?? "",
                        State = t.FdState ?? "",
                        Pincode = t.FdPincode ?? "",
                        JoiningDate = DateOnly.FromDateTime(t.FdJoiningDate),
                        AadharNo = t.FdAadharNo ?? "",
                        Pan = t.FdPan ?? "",
                        Qualification = t.FdQualification ?? "",
                        Experience = t.FdExperience,
                        ReportsTo = t.FdReportsTo,
                        Status = t.FdStatus,
                        CreatedBy = t.FdCreatedBy ?? "",
                        CreatedOn = t.FdCreatedOn,
                        AuditDate = t.FdAuditDate
                    })
                    .ToListAsync();

                var result = new PagedTeacherResult
                {
                    Data = teachers,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teachers");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get teacher by ID from tbmasteacher
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RealTeacherDto>> GetTeacher(long id)
        {
            try
            {
                var teacher = await _context.TbmasTeachers.FindAsync(id);

                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found" });
                }

                var teacherDto = new RealTeacherDto
                {
                    Id = (int)teacher.FdTeacherId,
                    StaffCode = teacher.FdStaffCode,
                    FirstName = teacher.FdFirstName,
                    LastName = teacher.FdLastName ?? "",
                    FullName = teacher.FdFullName ?? "",
                    FatherOrHusbandName = teacher.FdFatherOrHusbandName ?? "",
                    Gender = teacher.FdGender,
                    DateOfBirth = DateOnly.FromDateTime(teacher.FdDateOfBirth),
                    BloodGroup = teacher.FdBloodGroup ?? "",
                    Religion = teacher.FdReligion ?? "",
                    Category = teacher.FdCategory ?? "",
                    Mobile = teacher.FdMobile ?? "",
                    Email = teacher.FdEmail ?? "",
                    Address = teacher.FdAddress ?? "",
                    City = teacher.FdCity ?? "",
                    State = teacher.FdState ?? "",
                    Pincode = teacher.FdPincode ?? "",
                    JoiningDate = DateOnly.FromDateTime(teacher.FdJoiningDate),
                    AadharNo = teacher.FdAadharNo ?? "",
                    Pan = teacher.FdPan ?? "",
                    Qualification = teacher.FdQualification ?? "",
                    Experience = teacher.FdExperience,
                    ReportsTo = teacher.FdReportsTo,
                    Status = teacher.FdStatus,
                    CreatedBy = teacher.FdCreatedBy ?? "",
                    CreatedOn = teacher.FdCreatedOn,
                    AuditDate = teacher.FdAuditDate
                };

                return Ok(teacherDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teacher with ID {TeacherId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new teacher in tbmasteacher
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RealTeacherDto>> CreateTeacher([FromBody] CreateRealTeacherRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if staff code already exists
                var existingTeacher = await _context.TbmasTeachers
                    .FirstOrDefaultAsync(t => t.FdStaffCode == request.StaffCode);

                if (existingTeacher != null)
                {
                    return Conflict(new { message = "Teacher with this staff code already exists" });
                }

                var teacher = new TbmasTeacherActual
                {
                    FdStaffCode = request.StaffCode.Trim(),
                    FdFirstName = request.FirstName.Trim(),
                    FdLastName = request.LastName?.Trim(),
                    FdFullName = $"{request.FirstName.Trim()} {request.LastName?.Trim() ?? ""}".Trim(),
                    FdFatherOrHusbandName = request.FatherOrHusbandName?.Trim(),
                    FdGender = request.Gender,
                    FdDateOfBirth = request.DateOfBirth.ToDateTime(TimeOnly.MinValue),
                    FdBloodGroup = request.BloodGroup?.Trim(),
                    FdReligion = request.Religion?.Trim(),
                    FdCategory = request.Category?.Trim(),
                    FdMobile = request.Mobile?.Trim(),
                    FdEmail = request.Email?.Trim(),
                    FdAddress = request.Address?.Trim(),
                    FdCity = request.City?.Trim(),
                    FdState = request.State?.Trim(),
                    FdPincode = request.Pincode?.Trim(),
                    FdJoiningDate = request.JoiningDate.ToDateTime(TimeOnly.MinValue),
                    FdAadharNo = request.AadharNo?.Trim(),
                    FdPan = request.Pan?.Trim(),
                    FdQualification = request.Qualification?.Trim(),
                    FdExperience = request.Experience,
                    FdReportsTo = request.ReportsTo,
                    FdStatus = "active",
                    FdCreatedBy = "system", // In production, get from current user
                    FdCreatedOn = DateTime.UtcNow,
                    FdAuditDate = DateTime.UtcNow,
                    FdAuditUser = "system"
                };

                _context.TbmasTeachers.Add(teacher);
                await _context.SaveChangesAsync();

                var teacherDto = new RealTeacherDto
                {
                    Id = (int)teacher.FdTeacherId,
                    StaffCode = teacher.FdStaffCode,
                    FirstName = teacher.FdFirstName,
                    LastName = teacher.FdLastName ?? "",
                    FullName = teacher.FdFullName ?? "",
                    FatherOrHusbandName = teacher.FdFatherOrHusbandName ?? "",
                    Gender = teacher.FdGender,
                    DateOfBirth = DateOnly.FromDateTime(teacher.FdDateOfBirth),
                    BloodGroup = teacher.FdBloodGroup ?? "",
                    Religion = teacher.FdReligion ?? "",
                    Category = teacher.FdCategory ?? "",
                    Mobile = teacher.FdMobile ?? "",
                    Email = teacher.FdEmail ?? "",
                    Address = teacher.FdAddress ?? "",
                    City = teacher.FdCity ?? "",
                    State = teacher.FdState ?? "",
                    Pincode = teacher.FdPincode ?? "",
                    JoiningDate = DateOnly.FromDateTime(teacher.FdJoiningDate),
                    AadharNo = teacher.FdAadharNo ?? "",
                    Pan = teacher.FdPan ?? "",
                    Qualification = teacher.FdQualification ?? "",
                    Experience = teacher.FdExperience,
                    ReportsTo = teacher.FdReportsTo,
                    Status = teacher.FdStatus,
                    CreatedBy = teacher.FdCreatedBy ?? "",
                    CreatedOn = teacher.FdCreatedOn,
                    AuditDate = teacher.FdAuditDate
                };

                _logger.LogInformation("Teacher created with ID {TeacherId}", teacher.FdTeacherId);
                return CreatedAtAction(nameof(GetTeacher), new { id = teacher.FdTeacherId }, teacherDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating teacher");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Update teacher in tbmasteacher
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(long id, [FromBody] UpdateRealTeacherRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var teacher = await _context.TbmasTeachers.FindAsync(id);
                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found" });
                }

                // Check if staff code is being changed and if it already exists
                if (request.StaffCode != teacher.FdStaffCode)
                {
                    var existingTeacher = await _context.TbmasTeachers
                        .FirstOrDefaultAsync(t => t.FdStaffCode == request.StaffCode && t.FdTeacherId != id);

                    if (existingTeacher != null)
                    {
                        return Conflict(new { message = "Teacher with this staff code already exists" });
                    }
                }

                teacher.FdStaffCode = request.StaffCode.Trim();
                teacher.FdFirstName = request.FirstName.Trim();
                teacher.FdLastName = request.LastName?.Trim();
                teacher.FdFullName = $"{request.FirstName.Trim()} {request.LastName?.Trim() ?? ""}".Trim();
                teacher.FdFatherOrHusbandName = request.FatherOrHusbandName?.Trim();
                teacher.FdGender = request.Gender;
                teacher.FdDateOfBirth = request.DateOfBirth.ToDateTime(TimeOnly.MinValue);
                teacher.FdBloodGroup = request.BloodGroup?.Trim();
                teacher.FdReligion = request.Religion?.Trim();
                teacher.FdCategory = request.Category?.Trim();
                teacher.FdMobile = request.Mobile?.Trim();
                teacher.FdEmail = request.Email?.Trim();
                teacher.FdAddress = request.Address?.Trim();
                teacher.FdCity = request.City?.Trim();
                teacher.FdState = request.State?.Trim();
                teacher.FdPincode = request.Pincode?.Trim();
                teacher.FdJoiningDate = request.JoiningDate.ToDateTime(TimeOnly.MinValue);
                teacher.FdAadharNo = request.AadharNo?.Trim();
                teacher.FdPan = request.Pan?.Trim();
                teacher.FdQualification = request.Qualification?.Trim();
                teacher.FdExperience = request.Experience;
                teacher.FdReportsTo = request.ReportsTo;
                teacher.FdAuditDate = DateTime.UtcNow;
                teacher.FdAuditUser = "system"; // In production, get from current user

                await _context.SaveChangesAsync();

                _logger.LogInformation("Teacher updated with ID {TeacherId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating teacher with ID {TeacherId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete teacher from tbmasteacher (with cascade check)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(long id)
        {
            try
            {
                var teacher = await _context.TbmasTeachers.FindAsync(id);
                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found" });
                }

                // Check for related records that might prevent deletion
                var relatedRecordsInfo = new List<string>();

                // Check if teacher has subordinates
                var subordinateCount = await _context.TbmasTeachers
                    .CountAsync(t => t.FdReportsTo == id);
                if (subordinateCount > 0)
                    relatedRecordsInfo.Add($"{subordinateCount} subordinate teachers");

                if (relatedRecordsInfo.Any())
                {
                    return BadRequest(new 
                    { 
                        message = "Cannot delete teacher with related records", 
                        relatedRecords = relatedRecordsInfo 
                    });
                }

                _context.TbmasTeachers.Remove(teacher);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Teacher deleted with ID {TeacherId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting teacher with ID {TeacherId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get teachers by status
        /// </summary>
        [HttpGet("by-status/{status}")]
        public async Task<ActionResult<List<RealTeacherDto>>> GetTeachersByStatus(string status)
        {
            try
            {
                var teachers = await _context.TbmasTeachers
                    .Where(t => t.FdStatus == status)
                    .Select(t => new RealTeacherDto
                    {
                        Id = (int)t.FdTeacherId,
                        StaffCode = t.FdStaffCode,
                        FirstName = t.FdFirstName,
                        LastName = t.FdLastName ?? "",
                        FullName = t.FdFullName ?? "",
                        Gender = t.FdGender,
                        Mobile = t.FdMobile ?? "",
                        Email = t.FdEmail ?? "",
                        JoiningDate = DateOnly.FromDateTime(t.FdJoiningDate),
                        Status = t.FdStatus
                    })
                    .ToListAsync();

                return Ok(teachers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teachers by status {Status}", status);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get teacher hierarchy (who reports to whom)
        /// </summary>
        [HttpGet("hierarchy")]
        public async Task<ActionResult<List<TeacherHierarchyDto>>> GetTeacherHierarchy()
        {
            try
            {
                var teachers = await _context.TbmasTeachers
                    .Include(t => t.ReportsToTeacher)
                    .Where(t => t.FdStatus == "active")
                    .Select(t => new TeacherHierarchyDto
                    {
                        Id = (int)t.FdTeacherId,
                        StaffCode = t.FdStaffCode,
                        FullName = t.FdFullName ?? "",
                        ReportsToId = t.FdReportsTo != null ? (int)t.FdReportsTo : null,
                        ReportsToName = t.ReportsToTeacher != null ? t.ReportsToTeacher.FdFullName : null
                    })
                    .ToListAsync();

                return Ok(teachers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teacher hierarchy");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    // DTOs for Real Teachers (matching actual database structure)
    public class RealTeacherDto
    {
        public int Id { get; set; }
        public string StaffCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string FatherOrHusbandName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public string BloodGroup { get; set; } = string.Empty;
        public string Religion { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public DateOnly JoiningDate { get; set; }
        public string AadharNo { get; set; } = string.Empty;
        public string Pan { get; set; } = string.Empty;
        public string Qualification { get; set; } = string.Empty;
        public int Experience { get; set; }
        public long? ReportsTo { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? CreatedOn { get; set; }
        public DateTime? AuditDate { get; set; }
    }

    public class CreateRealTeacherRequest
    {
        [Required]
        [StringLength(50)]
        public string StaffCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? LastName { get; set; }

        [StringLength(255)]
        public string? FatherOrHusbandName { get; set; }

        [Required]
        public string Gender { get; set; } = string.Empty; // Male, Female, Other

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [StringLength(10)]
        public string? BloodGroup { get; set; }

        [StringLength(50)]
        public string? Religion { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(15)]
        public string? Mobile { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(10)]
        public string? Pincode { get; set; }

        [Required]
        public DateOnly JoiningDate { get; set; }

        [StringLength(12)]
        public string? AadharNo { get; set; }

        [StringLength(10)]
        public string? Pan { get; set; }

        public string? Qualification { get; set; }

        public int Experience { get; set; } = 0;

        public long? ReportsTo { get; set; }
    }

    public class UpdateRealTeacherRequest
    {
        [Required]
        [StringLength(50)]
        public string StaffCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? LastName { get; set; }

        [StringLength(255)]
        public string? FatherOrHusbandName { get; set; }

        [Required]
        public string Gender { get; set; } = string.Empty;

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [StringLength(10)]
        public string? BloodGroup { get; set; }

        [StringLength(50)]
        public string? Religion { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(15)]
        public string? Mobile { get; set; }

        [StringLength(100)]
        [EmailAddress]
        public string? Email { get; set; }

        public string? Address { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }

        [StringLength(10)]
        public string? Pincode { get; set; }

        [Required]
        public DateOnly JoiningDate { get; set; }

        [StringLength(12)]
        public string? AadharNo { get; set; }

        [StringLength(10)]
        public string? Pan { get; set; }

        public string? Qualification { get; set; }

        public int Experience { get; set; } = 0;

        public long? ReportsTo { get; set; }
    }

    public class PagedTeacherResult
    {
        public List<RealTeacherDto> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class TeacherHierarchyDto
    {
        public int Id { get; set; }
        public string StaffCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public int? ReportsToId { get; set; }
        public string? ReportsToName { get; set; }
    }
}
