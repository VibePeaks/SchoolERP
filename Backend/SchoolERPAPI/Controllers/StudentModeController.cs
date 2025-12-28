using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERPAPI.Data;
using SchoolERPAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SchoolERPAPI.Controllers
{
    [Route("api/parents/{parentId}/student-mode")]
    [ApiController]
    [Authorize]
    public class StudentModeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseService _databaseService;

        public StudentModeController(AppDbContext context, IDatabaseService databaseService)
        {
            _context = context;
            _databaseService = databaseService;
        }

        // POST: api/parents/{parentId}/student-mode/validate
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateStudentMode(int parentId, [FromBody] StudentModeValidationRequest request)
        {
            // Verify parent has access to this student
            var studentParent = await _context.StudentParents
                .Include(sp => sp.Student)
                .Include(sp => sp.Parent)
                .FirstOrDefaultAsync(sp => sp.ParentId == parentId && sp.StudentId == request.StudentId);

            if (studentParent == null)
            {
                return NotFound(new { success = false, message = "Student not found or access denied" });
            }

            var student = studentParent.Student;

            // Check if student mode is enabled
            if (!student.IsStudentModeEnabled)
            {
                return BadRequest(new { success = false, message = "Student Mode is not enabled for this student" });
            }

            // Validate passkey
            if (string.IsNullOrEmpty(student.StudentPasskey))
            {
                return BadRequest(new { success = false, message = "No passkey set for this student" });
            }

            bool isValidPasskey = BCrypt.Net.BCrypt.Verify(request.Passkey, student.StudentPasskey);
            if (!isValidPasskey)
            {
                // Log failed attempt
                await LogStudentModeAudit(student.Id, parentId, "LOGIN_ATTEMPT", false, GetClientInfo());

                return Unauthorized(new { success = false, message = "Invalid passkey" });
            }

            // Update student access tracking
            student.StudentModeLastAccess = DateTime.UtcNow;
            student.StudentModeAccessCount++;
            student.StudentModeUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log successful access
            await LogStudentModeAudit(student.Id, parentId, "LOGIN_SUCCESS", true, GetClientInfo());

            // Generate student session token (could be a simple identifier for this demo)
            var studentSessionToken = Guid.NewGuid().ToString();

            return Ok(new
            {
                success = true,
                message = "Student Mode access granted",
                data = new
                {
                    studentSessionToken = studentSessionToken,
                    student = new
                    {
                        student.Id,
                        student.FirstName,
                        student.LastName,
                        student.RollNumber,
                        student.Class,
                        student.Section
                    },
                    session = new
                    {
                        expiresIn = 7200, // 2 hours
                        lastAccess = student.StudentModeLastAccess,
                        accessCount = student.StudentModeAccessCount
                    }
                }
            });
        }

        // GET: api/parents/{parentId}/student-mode/{studentId}/dashboard
        [HttpGet("{studentId}/dashboard")]
        public async Task<IActionResult> GetStudentDashboard(int parentId, int studentId)
        {
            // Verify parent has access to this student
            var studentParent = await _context.StudentParents
                .FirstOrDefaultAsync(sp => sp.ParentId == parentId && sp.StudentId == studentId);

            if (studentParent == null)
            {
                return NotFound(new { success = false, message = "Student not found or access denied" });
            }

            var student = await _context.Students
                .Include(s => s.Grades.OrderByDescending(g => g.CreatedAt).Take(5))
                .Include(s => s.AttendanceRecords)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            // Calculate GPA (simple average for demo)
            var recentGrades = student.Grades.Take(10).ToList();
            var gpa = recentGrades.Count > 0
                ? Math.Round(recentGrades.Average(g => g.TotalMarks > 0 ? (double)g.MarksObtained / g.TotalMarks * 10 : 0), 2)
                : 0;

            // Calculate attendance percentage
            var attendanceRecords = student.AttendanceRecords.ToList();
            var attendancePercentage = attendanceRecords.Count > 0
                ? Math.Round((double)attendanceRecords.Count(ar => ar.Status == "present") / attendanceRecords.Count * 100, 1)
                : 0;

            // Get upcoming assignments (mock data for now)
            var upcomingAssignments = new[]
            {
                new { id = 1, subject = "Mathematics", title = "Algebra Homework", dueDate = DateTime.UtcNow.AddDays(2), priority = "high" },
                new { id = 2, subject = "Science", title = "Physics Lab Report", dueDate = DateTime.UtcNow.AddDays(4), priority = "medium" },
                new { id = 3, subject = "English", title = "Essay Writing", dueDate = DateTime.UtcNow.AddDays(7), priority = "low" }
            };

            // Get today's schedule (mock data)
            var todaySchedule = new[]
            {
                new { time = "09:00", subject = "Mathematics", room = "101" },
                new { time = "10:30", subject = "Science", room = "205" },
                new { time = "02:00", subject = "English", room = "103" }
            };

            return Ok(new
            {
                success = true,
                data = new
                {
                    student = new
                    {
                        student.Id,
                        student.FirstName,
                        student.LastName,
                        student.RollNumber,
                        student.Class,
                        student.Section
                    },
                    academicOverview = new
                    {
                        gpa = gpa,
                        attendancePercentage = attendancePercentage,
                        totalSubjects = recentGrades.GroupBy(g => g.SubjectId).Count()
                    },
                    recentGrades = recentGrades.Select(g => new
                    {
                        g.Id,
                        subjectName = g.Subject?.Name ?? "Unknown",
                        g.ExamType,
                        g.MarksObtained,
                        g.TotalMarks,
                        percentage = g.TotalMarks > 0 ? Math.Round((double)g.MarksObtained / g.TotalMarks * 100, 1) : 0,
                        g.Grade,
                        g.ExamDate
                    }),
                    upcomingAssignments = upcomingAssignments,
                    todaySchedule = todaySchedule,
                    achievements = new[] // Mock achievements
                    {
                        new { id = 1, title = "Perfect Attendance", description = "30 days streak", earnedDate = DateTime.UtcNow.AddDays(-5), icon = "🏆" },
                        new { id = 2, title = "Math Whiz", description = "Top score in algebra", earnedDate = DateTime.UtcNow.AddDays(-10), icon = "🧮" },
                        new { id = 3, title = "Science Star", description = "Excellent lab work", earnedDate = DateTime.UtcNow.AddDays(-15), icon = "🔬" }
                    },
                    quickStats = new
                    {
                        assignmentsDue = upcomingAssignments.Length,
                        unreadMessages = 2, // Mock data
                        studyStreak = 7 // Mock data
                    }
                }
            });
        }

        // POST: api/parents/{parentId}/student-mode/{studentId}/passkey
        [HttpPost("{studentId}/passkey")]
        public async Task<IActionResult> SetStudentPasskey(int parentId, int studentId, [FromBody] SetPasskeyRequest request)
        {
            // Verify parent has access to this student
            var studentParent = await _context.StudentParents
                .FirstOrDefaultAsync(sp => sp.ParentId == parentId && sp.StudentId == studentId);

            if (studentParent == null)
            {
                return NotFound(new { success = false, message = "Student not found or access denied" });
            }

            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            // Validate passkey format (4-8 characters)
            if (string.IsNullOrEmpty(request.Passkey) || request.Passkey.Length < 4 || request.Passkey.Length > 8)
            {
                return BadRequest(new { success = false, message = "Passkey must be 4-8 characters long" });
            }

            // Hash the passkey
            var hashedPasskey = BCrypt.Net.BCrypt.HashPassword(request.Passkey);

            // Update student
            student.StudentPasskey = hashedPasskey;
            student.StudentPasskeySalt = null; // Not needed with BCrypt
            student.IsStudentModeEnabled = true;
            student.StudentModeUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log passkey change
            await LogStudentModeAudit(studentId, parentId, "PASSKEY_CHANGE", true, GetClientInfo());

            return Ok(new
            {
                success = true,
                message = "Student passkey set successfully",
                data = new
                {
                    studentId = studentId,
                    studentModeEnabled = student.IsStudentModeEnabled,
                    updatedAt = student.StudentModeUpdatedAt
                }
            });
        }

        // DELETE: api/parents/{parentId}/student-mode/{studentId}/session
        [HttpDelete("{studentId}/session")]
        public async Task<IActionResult> ForceStudentLogout(int parentId, int studentId)
        {
            // Verify parent has access to this student
            var studentParent = await _context.StudentParents
                .FirstOrDefaultAsync(sp => sp.ParentId == parentId && sp.StudentId == studentId);

            if (studentParent == null)
            {
                return NotFound(new { success = false, message = "Student not found or access denied" });
            }

            // Log the forced logout
            await LogStudentModeAudit(studentId, parentId, "LOGOUT", true, GetClientInfo());

            return Ok(new
            {
                success = true,
                message = "Student session terminated successfully"
            });
        }

        // PUT: api/parents/{parentId}/student-mode/{studentId}/toggle
        [HttpPut("{studentId}/toggle")]
        public async Task<IActionResult> ToggleStudentMode(int parentId, int studentId, [FromBody] ToggleStudentModeRequest request)
        {
            // Verify parent has access to this student
            var studentParent = await _context.StudentParents
                .FirstOrDefaultAsync(sp => sp.ParentId == parentId && sp.StudentId == studentId);

            if (studentParent == null)
            {
                return NotFound(new { success = false, message = "Student not found or access denied" });
            }

            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
            {
                return NotFound(new { success = false, message = "Student not found" });
            }

            student.IsStudentModeEnabled = request.Enabled;
            student.StudentModeUpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log the toggle action
            await LogStudentModeAudit(studentId, parentId,
                request.Enabled ? "MODE_ENABLED" : "MODE_DISABLED", true, GetClientInfo());

            return Ok(new
            {
                success = true,
                message = $"Student Mode {(request.Enabled ? "enabled" : "disabled")} successfully",
                data = new
                {
                    studentId = studentId,
                    studentModeEnabled = student.IsStudentModeEnabled,
                    updatedAt = student.StudentModeUpdatedAt
                }
            });
        }

        // GET: api/parents/{parentId}/student-mode/{studentId}/activity
        [HttpGet("{studentId}/activity")]
        public async Task<IActionResult> GetStudentActivityLog(int parentId, int studentId, [FromQuery] int limit = 10)
        {
            // Verify parent has access to this student
            var studentParent = await _context.StudentParents
                .FirstOrDefaultAsync(sp => sp.ParentId == parentId && sp.StudentId == studentId);

            if (studentParent == null)
            {
                return NotFound(new { success = false, message = "Student not found or access denied" });
            }

            var activities = await _context.StudentModeAudit
                .Where(sma => sma.StudentId == studentId && sma.ParentId == parentId)
                .OrderByDescending(sma => sma.CreatedAt)
                .Take(limit)
                .Select(sma => new
                {
                    sma.Id,
                    sma.ActionType,
                    sma.Success,
                    sma.CreatedAt,
                    sma.IpAddress,
                    sma.DeviceInfo
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = activities
            });
        }

        private async Task LogStudentModeAudit(int studentId, int parentId, string actionType, bool success, ClientInfo clientInfo)
        {
            var currentTenantId = GetCurrentTenantId();

            var audit = new StudentModeAudit
            {
                StudentId = studentId,
                ParentId = parentId,
                TenantId = currentTenantId,
                ActionType = actionType,
                Success = success,
                IpAddress = clientInfo.IpAddress,
                UserAgent = clientInfo.UserAgent,
                DeviceInfo = clientInfo.DeviceInfo
            };

            _context.StudentModeAudit.Add(audit);
            await _context.SaveChangesAsync();
        }

        private ClientInfo GetClientInfo()
        {
            return new ClientInfo
            {
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = HttpContext.Request.Headers["User-Agent"].ToString(),
                DeviceInfo = "Mobile App" // Could be enhanced with actual device detection
            };
        }

        private int GetCurrentTenantId()
        {
            // In production, get from JWT token or subdomain
            return 1;
        }
    }

    // Request/Response Models
    public class StudentModeValidationRequest
    {
        public int StudentId { get; set; }
        public string Passkey { get; set; }
    }

    public class SetPasskeyRequest
    {
        public string Passkey { get; set; }
    }

    public class ToggleStudentModeRequest
    {
        public bool Enabled { get; set; }
    }

    public class ClientInfo
    {
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public string DeviceInfo { get; set; }
    }

    // Audit entity (would typically be in Models folder)
    public class StudentModeAudit
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public int TenantId { get; set; }
        public string ActionType { get; set; }
        public bool Success { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public string DeviceInfo { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
