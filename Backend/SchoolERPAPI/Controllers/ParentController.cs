using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;
using System.Security.Claims;

namespace SchoolERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ParentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ParentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/parent/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            // Get parent's children
            var children = await _context.StudentParents
                .Where(sp => sp.ParentId == parentId.Value)
                .Include(sp => sp.Student)
                .Select(sp => new
                {
                    sp.Student.Id,
                    sp.Student.FirstName,
                    sp.Student.LastName,
                    sp.Student.Class,
                    sp.Student.RollNumber,
                    sp.Student.AttendancePercentage,
                    LatestGrade = _context.Grades
                        .Where(g => g.StudentId == sp.Student.Id)
                        .OrderByDescending(g => g.GradedDate)
                        .Select(g => g.LetterGrade)
                        .FirstOrDefault()
                })
                .ToListAsync();

            // Get recent notifications
            var notifications = await _context.ParentNotifications
                .Where(pn => pn.ParentId == parentId.Value)
                .OrderByDescending(pn => pn.SentDate)
                .Take(5)
                .Select(pn => new
                {
                    pn.Id,
                    pn.Title,
                    pn.Message,
                    pn.NotificationType,
                    pn.IsRead,
                    pn.SentDate
                })
                .ToListAsync();

            // Get recent messages
            var messages = await _context.ParentMessages
                .Where(pm => pm.SenderId == parentId.Value)
                .OrderByDescending(pm => pm.SentDate)
                .Take(3)
                .Select(pm => new
                {
                    pm.Id,
                    pm.Subject,
                    pm.Message,
                    pm.SentDate,
                    pm.IsRead,
                    TeacherName = _context.Users
                        .Where(u => u.Id == pm.ReceiverId)
                        .Select(u => u.FirstName + " " + u.LastName)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(new
            {
                children,
                notifications,
                messages,
                stats = new
                {
                    totalChildren = children.Count,
                    unreadNotifications = notifications.Count(n => !n.IsRead),
                    unreadMessages = messages.Count(m => !m.IsRead)
                }
            });
        }

        // GET: api/parent/children
        [HttpGet("children")]
        public async Task<IActionResult> GetChildren()
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            var children = await _context.StudentParents
                .Where(sp => sp.ParentId == parentId.Value)
                .Include(sp => sp.Student)
                .Select(sp => new
                {
                    sp.Student.Id,
                    sp.Student.FirstName,
                    sp.Student.LastName,
                    sp.Student.StudentId,
                    sp.Student.Class,
                    sp.Student.RollNumber,
                    sp.Student.Email,
                    sp.Student.Phone,
                    sp.Student.AttendancePercentage,
                    sp.Student.FeeStatus,
                    sp.Student.GPA
                })
                .ToListAsync();

            return Ok(children);
        }

        // GET: api/parent/children/{studentId}/grades
        [HttpGet("children/{studentId}/grades")]
        public async Task<IActionResult> GetChildGrades(int studentId)
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            // Verify parent has access to this student
            var hasAccess = await _context.StudentParents
                .AnyAsync(sp => sp.ParentId == parentId.Value && sp.StudentId == studentId);

            if (!hasAccess)
                return Forbid("Access denied to this student's information");

            var grades = await _context.Grades
                .Where(g => g.StudentId == studentId)
                .Include(g => g.Class)
                .OrderByDescending(g => g.GradedDate)
                .Select(g => new
                {
                    g.Id,
                    g.Subject,
                    g.Title,
                    g.Score,
                    g.MaxScore,
                    g.Percentage,
                    g.LetterGrade,
                    g.Comments,
                    g.GradedDate,
                    TeacherName = _context.Users
                        .Where(u => u.Id == g.GradedBy)
                        .Select(u => u.FirstName + " " + u.LastName)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(grades);
        }

        // GET: api/parent/children/{studentId}/attendance
        [HttpGet("children/{studentId}/attendance")]
        public async Task<IActionResult> GetChildAttendance(int studentId)
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            // Verify parent has access to this student
            var hasAccess = await _context.StudentParents
                .AnyAsync(sp => sp.ParentId == parentId.Value && sp.StudentId == studentId);

            if (!hasAccess)
                return Forbid("Access denied to this student's information");

            var attendanceRecords = await _context.AttendanceRecords
                .Where(ar => ar.StudentId == studentId)
                .OrderByDescending(ar => ar.Date)
                .Take(30) // Last 30 days
                .Select(ar => new
                {
                    ar.Id,
                    ar.Date,
                    ar.Status,
                    ar.Remarks
                })
                .ToListAsync();

            var attendanceSummary = new
            {
                totalDays = attendanceRecords.Count,
                presentDays = attendanceRecords.Count(ar => ar.Status == "Present"),
                absentDays = attendanceRecords.Count(ar => ar.Status == "Absent"),
                percentage = attendanceRecords.Count > 0
                    ? (double)attendanceRecords.Count(ar => ar.Status == "Present") / attendanceRecords.Count * 100
                    : 0
            };

            return Ok(new
            {
                summary = attendanceSummary,
                records = attendanceRecords
            });
        }

        // GET: api/parent/children/{studentId}/assignments
        [HttpGet("children/{studentId}/assignments")]
        public async Task<IActionResult> GetChildAssignments(int studentId)
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            // Verify parent has access to this student
            var hasAccess = await _context.StudentParents
                .AnyAsync(sp => sp.ParentId == parentId.Value && sp.StudentId == studentId);

            if (!hasAccess)
                return Forbid("Access denied to this student's information");

            var assignments = await _context.AssignmentSubmissions
                .Where(asub => asub.StudentId == studentId)
                .Include(asub => asub.Assignment)
                .OrderByDescending(asub => asub.Assignment.DueDate)
                .Select(asub => new
                {
                    asub.Id,
                    asub.Assignment.Title,
                    asub.Assignment.Description,
                    asub.Assignment.DueDate,
                    asub.Assignment.Subject,
                    asub.SubmittedAt,
                    asub.PointsEarned,
                    asub.Feedback,
                    asub.Status,
                    TeacherName = _context.Users
                        .Where(u => u.Id == asub.Assignment.TeacherId)
                        .Select(u => u.FirstName + " " + u.LastName)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(assignments);
        }

        // POST: api/parent/messages
        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            // Verify parent has access to this student
            var hasAccess = await _context.StudentParents
                .AnyAsync(sp => sp.ParentId == parentId.Value && sp.StudentId == request.StudentId);

            if (!hasAccess)
                return Forbid("Access denied to send messages for this student");

            var message = new ParentMessage
            {
                SenderId = parentId.Value,
                ReceiverId = request.TeacherId,
                StudentId = request.StudentId,
                Subject = request.Subject,
                Message = request.Message,
                MessageType = request.MessageType ?? "Inquiry"
            };

            _context.ParentMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message.Id, message.SentDate });
        }

        // GET: api/parent/notifications
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications([FromQuery] bool unreadOnly = false)
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            var query = _context.ParentNotifications
                .Where(pn => pn.ParentId == parentId.Value);

            if (unreadOnly)
            {
                query = query.Where(pn => !pn.IsRead);
            }

            var notifications = await query
                .OrderByDescending(pn => pn.SentDate)
                .Select(pn => new
                {
                    pn.Id,
                    pn.Title,
                    pn.Message,
                    pn.NotificationType,
                    pn.IsRead,
                    pn.SentDate,
                    pn.RelatedStudentId,
                    StudentName = pn.RelatedStudentId.HasValue
                        ? _context.Students
                            .Where(s => s.Id == pn.RelatedStudentId.Value)
                            .Select(s => s.FirstName + " " + s.LastName)
                            .FirstOrDefault()
                        : null
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // POST: api/parent/notifications/{id}/read
        [HttpPost("notifications/{id}/read")]
        public async Task<IActionResult> MarkNotificationAsRead(int id)
        {
            var parentId = GetCurrentParentId();
            if (!parentId.HasValue)
                return Unauthorized("Parent authentication required");

            var notification = await _context.ParentNotifications
                .FirstOrDefaultAsync(pn => pn.Id == id && pn.ParentId == parentId.Value);

            if (notification == null)
                return NotFound("Notification not found");

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }

        private int? GetCurrentParentId()
        {
            var userIdClaim = User.FindFirst("user_id")?.Value ??
                             User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdClaim, out var userId))
            {
                // In a real implementation, you'd have a way to get parent ID from user ID
                // For now, assuming parent ID = user ID for simplicity
                return userId;
            }

            return null;
        }
    }

    public class SendMessageRequest
    {
        public int TeacherId { get; set; }
        public int StudentId { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string MessageType { get; set; }
    }
}
