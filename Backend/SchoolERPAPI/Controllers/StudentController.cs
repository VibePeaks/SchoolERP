using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERPAPI.Data;
using SchoolERPAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace SchoolERPAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseService _databaseService;

        public StudentController(AppDbContext context, IDatabaseService databaseService)
        {
            _context = context;
            _databaseService = databaseService;
        }

        // GET: api/student
        [HttpGet]
        public async Task<IActionResult> GetStudents([FromQuery] int page = 1, [FromQuery] int limit = 10,
            [FromQuery] string? search = null, [FromQuery] string? className = null)
        {
            var query = _context.Students
                .Include(s => s.Branch)
                .Include(s => s.StudentParents)
                    .ThenInclude(sp => sp.Parent)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(s =>
                    s.FirstName.Contains(search) ||
                    s.LastName.Contains(search) ||
                    s.RollNumber.Contains(search) ||
                    s.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(className))
            {
                query = query.Where(s => s.Class == className);
            }

            var totalCount = await query.CountAsync();
            var students = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(s => new
                {
                    s.Id,
                    s.FirstName,
                    s.LastName,
                    s.RollNumber,
                    s.Email,
                    s.Class,
                    s.Section,
                    s.DateOfBirth,
                    s.Gender,
                    s.Address,
                    s.PhoneNumber,
                    s.IsActive,
                    Branch = s.Branch != null ? new { s.Branch.Id, s.Branch.Name } : null,
                    Parents = s.StudentParents.Select(sp => new
                    {
                        sp.Parent.Id,
                        sp.Parent.FirstName,
                        sp.Parent.LastName,
                        sp.Parent.Email,
                        sp.Parent.PhoneNumber
                    })
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = students,
                pagination = new
                {
                    currentPage = page,
                    totalPages = (int)Math.Ceiling(totalCount / (double)limit),
                    totalItems = totalCount,
                    itemsPerPage = limit
                }
            });
        }

        // GET: api/student/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.Branch)
                .Include(s => s.StudentParents)
                    .ThenInclude(sp => sp.Parent)
                .Include(s => s.AttendanceRecords)
                .Include(s => s.Grades)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    student.Id,
                    student.FirstName,
                    student.LastName,
                    student.RollNumber,
                    student.Email,
                    student.Class,
                    student.Section,
                    student.DateOfBirth,
                    student.Gender,
                    student.Address,
                    student.PhoneNumber,
                    student.IsActive,
                    student.CreatedAt,
                    student.UpdatedAt,
                    Branch = student.Branch != null ? new { student.Branch.Id, student.Branch.Name } : null,
                    Parents = student.StudentParents.Select(sp => new
                    {
                        sp.Parent.Id,
                        sp.Parent.FirstName,
                        sp.Parent.LastName,
                        sp.Parent.Email,
                        sp.Parent.PhoneNumber
                    }),
                    AttendanceSummary = new
                    {
                        TotalDays = student.AttendanceRecords.Count,
                        PresentDays = student.AttendanceRecords.Count(ar => ar.Status == "present"),
                        AbsentDays = student.AttendanceRecords.Count(ar => ar.Status == "absent"),
                        LateDays = student.AttendanceRecords.Count(ar => ar.Status == "late")
                    },
                    RecentGrades = student.Grades.OrderByDescending(g => g.CreatedAt).Take(5)
                }
            });
        }

        // POST: api/student
        [HttpPost]
        [Authorize(Roles = "admin,teacher")]
        public async Task<IActionResult> CreateStudent([FromBody] StudentCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid student data",
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create student
                var student = new Student
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    RollNumber = request.RollNumber,
                    Email = request.Email,
                    Class = request.Class,
                    Section = request.Section,
                    DateOfBirth = request.DateOfBirth,
                    Gender = request.Gender,
                    Address = request.Address,
                    PhoneNumber = request.PhoneNumber,
                    IsActive = true
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                // If parent information provided, create parent relationship
                if (!string.IsNullOrEmpty(request.ParentName) || !string.IsNullOrEmpty(request.ParentEmail))
                {
                    var parent = await _context.Parents.FirstOrDefaultAsync(p => p.Email == request.ParentEmail);

                    if (parent == null && !string.IsNullOrEmpty(request.ParentEmail))
                    {
                        // Create new parent
                        parent = new Parent
                        {
                            FirstName = request.ParentName?.Split(' ').FirstOrDefault() ?? "Parent",
                            LastName = request.ParentName?.Split(' ').LastOrDefault() ?? "",
                            Email = request.ParentEmail,
                            PhoneNumber = request.ParentContact,
                            IsActive = true
                        };
                        _context.Parents.Add(parent);
                        await _context.SaveChangesAsync();
                    }

                    if (parent != null)
                    {
                        // Create student-parent relationship
                        var studentParent = new StudentParent
                        {
                            StudentId = student.Id,
                            ParentId = parent.Id,
                            Relationship = "Parent"
                        };
                        _context.StudentParents.Add(studentParent);
                        await _context.SaveChangesAsync();
                    }
                }

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetStudent), new { id = student.Id },
                    new { success = true, message = "Student created successfully", data = new { student.Id } });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { success = false, message = "Failed to create student", error = ex.Message });
            }
        }

        // PUT: api/student/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin,teacher")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentUpdateRequest request)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            // Update student properties
            if (!string.IsNullOrEmpty(request.FirstName)) student.FirstName = request.FirstName;
            if (!string.IsNullOrEmpty(request.LastName)) student.LastName = request.LastName;
            if (!string.IsNullOrEmpty(request.Email)) student.Email = request.Email;
            if (!string.IsNullOrEmpty(request.Class)) student.Class = request.Class;
            if (!string.IsNullOrEmpty(request.Section)) student.Section = request.Section;
            if (request.DateOfBirth.HasValue) student.DateOfBirth = request.DateOfBirth.Value;
            if (!string.IsNullOrEmpty(request.Address)) student.Address = request.Address;
            if (!string.IsNullOrEmpty(request.PhoneNumber)) student.PhoneNumber = request.PhoneNumber;

            student.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Student updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to update student", error = ex.Message });
            }
        }

        // DELETE: api/student/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            // Soft delete
            student.IsActive = false;
            student.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Student deactivated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to delete student", error = ex.Message });
            }
        }

        // GET: api/student/{id}/attendance
        [HttpGet("{id}/attendance")]
        public async Task<IActionResult> GetStudentAttendance(int id, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            var query = _context.AttendanceRecords.Where(ar => ar.StudentId == id);

            if (startDate.HasValue)
                query = query.Where(ar => ar.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(ar => ar.Date <= endDate.Value);

            var attendanceRecords = await query
                .OrderByDescending(ar => ar.Date)
                .Select(ar => new
                {
                    ar.Id,
                    ar.Date,
                    ar.Status,
                    ar.Subject,
                    ar.Remarks,
                    ar.MarkedBy,
                    ar.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = attendanceRecords,
                summary = new
                {
                    totalDays = attendanceRecords.Count,
                    presentDays = attendanceRecords.Count(ar => ar.Status == "present"),
                    absentDays = attendanceRecords.Count(ar => ar.Status == "absent"),
                    lateDays = attendanceRecords.Count(ar => ar.Status == "late"),
                    attendancePercentage = attendanceRecords.Count > 0
                        ? Math.Round((double)attendanceRecords.Count(ar => ar.Status == "present") / attendanceRecords.Count * 100, 2)
                        : 0
                }
            });
        }

        // GET: api/student/{id}/grades
        [HttpGet("{id}/grades")]
        public async Task<IActionResult> GetStudentGrades(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            var grades = await _context.Grades
                .Where(g => g.StudentId == id)
                .Include(g => g.Subject)
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new
                {
                    g.Id,
                    g.SubjectId,
                    SubjectName = g.Subject != null ? g.Subject.Name : "Unknown",
                    g.ExamType,
                    g.MarksObtained,
                    g.TotalMarks,
                    g.Grade,
                    g.Remarks,
                    g.ExamDate,
                    g.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = grades,
                summary = new
                {
                    totalExams = grades.Count,
                    averagePercentage = grades.Count > 0
                        ? Math.Round(grades.Average(g => g.TotalMarks > 0 ? (double)g.MarksObtained / g.TotalMarks * 100 : 0), 2)
                        : 0,
                    gradeDistribution = grades.GroupBy(g => g.Grade)
                        .Select(group => new { Grade = group.Key, Count = group.Count() })
                }
            });
        }
    }

    // Request/Response Models
    public class StudentCreateRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string RollNumber { get; set; }
        public string Email { get; set; }
        public string Class { get; set; }
        public string Section { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string ParentName { get; set; }
        public string ParentEmail { get; set; }
        public string ParentContact { get; set; }
    }

    public class StudentUpdateRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Class { get; set; }
        public string? Section { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
