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
    public class ParentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseService _databaseService;

        public ParentsController(AppDbContext context, IDatabaseService databaseService)
        {
            _context = context;
            _databaseService = databaseService;
        }

        // GET: api/parents/{id}/children
        [HttpGet("{id}/children")]
        public async Task<IActionResult> GetParentChildren(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null)
            {
                return NotFound(new { success = false, message = "Parent not found" });
            }

            var children = parent.StudentParents.Select(sp => new
            {
                sp.Student.Id,
                sp.Student.FirstName,
                sp.Student.LastName,
                sp.Student.RollNumber,
                sp.Student.Class,
                sp.Student.Section,
                sp.Student.Email,
                Relationship = sp.Relationship
            });

            return Ok(new { success = true, data = children });
        }

        // GET: api/parents/{id}/dashboard
        [HttpGet("{id}/dashboard")]
        public async Task<IActionResult> GetParentDashboard(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
                        .ThenInclude(s => s.AttendanceRecords)
                .Include(p => p.StudentParents)
                    .ThenInclude(sp => sp.Student)
                        .ThenInclude(s => s.Grades)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null)
            {
                return NotFound(new { success = false, message = "Parent not found" });
            }

            var children = new List<object>();

            foreach (var studentParent in parent.StudentParents)
            {
                var student = studentParent.Student;

                // Get recent attendance (last 30 days)
                var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
                var recentAttendance = student.AttendanceRecords
                    .Where(ar => ar.Date >= thirtyDaysAgo)
                    .OrderByDescending(ar => ar.Date)
                    .Take(10)
                    .ToList();

                // Get recent grades
                var recentGrades = student.Grades
                    .OrderByDescending(g => g.CreatedAt)
                    .Take(5)
                    .ToList();

                // Calculate attendance percentage
                var attendancePercentage = recentAttendance.Count > 0
                    ? (double)recentAttendance.Count(ar => ar.Status == "present") / recentAttendance.Count * 100
                    : 0;

                // Get pending fees
                var pendingFees = await _context.StudentFees
                    .Where(sf => sf.StudentId == student.Id && sf.Status == "pending")
                    .SumAsync(sf => sf.Amount);

                children.Add(new
                {
                    student.Id,
                    student.FirstName,
                    student.LastName,
                    student.RollNumber,
                    student.Class,
                    student.Section,
                    AttendancePercentage = Math.Round(attendancePercentage, 1),
                    RecentAttendance = recentAttendance.Select(ar => new
                    {
                        ar.Date,
                        ar.Status,
                        ar.Subject,
                        ar.Remarks
                    }),
                    RecentGrades = recentGrades.Select(g => new
                    {
                        g.Id,
                        g.SubjectId,
                        SubjectName = g.Subject?.Name ?? "Unknown",
                        g.ExamType,
                        g.MarksObtained,
                        g.TotalMarks,
                        g.Grade,
                        g.ExamDate
                    }),
                    PendingFees = pendingFees,
                    HomeworkCount = 0, // TODO: Implement homework tracking
                    MessagesCount = await _context.ParentMessages
                        .CountAsync(pm => pm.ParentId == parent.Id && !pm.IsRead)
                });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    parentInfo = new
                    {
                        parent.Id,
                        parent.FirstName,
                        parent.LastName,
                        parent.Email,
                        parent.PhoneNumber
                    },
                    children = children,
                    summary = new
                    {
                        totalChildren = children.Count,
                        totalPendingFees = children.Sum(c => (decimal)((dynamic)c).PendingFees),
                        totalUnreadMessages = children.Sum(c => (int)((dynamic)c).MessagesCount)
                    }
                }
            });
        }

        // GET: api/parents/{id}/attendance
        [HttpGet("{id}/attendance")]
        public async Task<IActionResult> GetParentAttendance(int id, [FromQuery] int? childId)
        {
            var parent = await _context.Parents.FindAsync(id);
            if (parent == null)
            {
                return NotFound(new { success = false, message = "Parent not found" });
            }

            IQueryable<AttendanceRecord> attendanceQuery;

            if (childId.HasValue)
            {
                // Specific child
                attendanceQuery = _context.AttendanceRecords.Where(ar => ar.StudentId == childId.Value);
            }
            else
            {
                // All children of this parent
                var childIds = await _context.StudentParents
                    .Where(sp => sp.ParentId == id)
                    .Select(sp => sp.StudentId)
                    .ToListAsync();

                attendanceQuery = _context.AttendanceRecords.Where(ar => childIds.Contains(ar.StudentId));
            }

            var attendanceRecords = await attendanceQuery
                .Include(ar => ar.Student)
                .OrderByDescending(ar => ar.Date)
                .Take(50) // Limit for performance
                .Select(ar => new
                {
                    ar.Id,
                    ar.Date,
                    ar.Status,
                    ar.Subject,
                    ar.Remarks,
                    ar.MarkedBy,
                    Student = new
                    {
                        ar.Student.Id,
                        ar.Student.FirstName,
                        ar.Student.LastName,
                        ar.Student.Class,
                        ar.Student.Section
                    }
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = attendanceRecords,
                summary = new
                {
                    totalRecords = attendanceRecords.Count,
                    presentCount = attendanceRecords.Count(ar => ar.Status == "present"),
                    absentCount = attendanceRecords.Count(ar => ar.Status == "absent"),
                    lateCount = attendanceRecords.Count(ar => ar.Status == "late")
                }
            });
        }

        // GET: api/parents/{id}/grades
        [HttpGet("{id}/grades")]
        public async Task<IActionResult> GetParentGrades(int id, [FromQuery] int? childId)
        {
            var parent = await _context.Parents.FindAsync(id);
            if (parent == null)
            {
                return NotFound(new { success = false, message = "Parent not found" });
            }

            IQueryable<Grade> gradesQuery;

            if (childId.HasValue)
            {
                // Specific child
                gradesQuery = _context.Grades.Where(g => g.StudentId == childId.Value);
            }
            else
            {
                // All children of this parent
                var childIds = await _context.StudentParents
                    .Where(sp => sp.ParentId == id)
                    .Select(sp => sp.StudentId)
                    .ToListAsync();

                gradesQuery = _context.Grades.Where(g => childIds.Contains(g.StudentId));
            }

            var grades = await gradesQuery
                .Include(g => g.Student)
                .Include(g => g.Subject)
                .OrderByDescending(g => g.CreatedAt)
                .Take(100) // Limit for performance
                .Select(g => new
                {
                    g.Id,
                    g.ExamType,
                    g.MarksObtained,
                    g.TotalMarks,
                    g.Grade,
                    g.Remarks,
                    g.ExamDate,
                    Subject = g.Subject != null ? new { g.Subject.Id, g.Subject.Name } : null,
                    Student = new
                    {
                        g.Student.Id,
                        g.Student.FirstName,
                        g.Student.LastName,
                        g.Student.Class,
                        g.Student.Section
                    }
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = grades,
                summary = new
                {
                    totalGrades = grades.Count,
                    averagePercentage = grades.Count > 0
                        ? Math.Round(grades.Average(g => g.TotalMarks > 0 ? (double)g.MarksObtained / g.TotalMarks * 100 : 0), 2)
                        : 0,
                    gradeDistribution = grades.GroupBy(g => g.Grade)
                        .Select(group => new { Grade = group.Key, Count = group.Count() })
                }
            });
        }

        // GET: api/parents/{id}/fees
        [HttpGet("{id}/fees")]
        public async Task<IActionResult> GetParentFees(int id, [FromQuery] int? childId)
        {
            var parent = await _context.Parents.FindAsync(id);
            if (parent == null)
            {
                return NotFound(new { success = false, message = "Parent not found" });
            }

            IQueryable<StudentFee> feesQuery;

            if (childId.HasValue)
            {
                // Specific child
                feesQuery = _context.StudentFees.Where(sf => sf.StudentId == childId.Value);
            }
            else
            {
                // All children of this parent
                var childIds = await _context.StudentParents
                    .Where(sp => sp.ParentId == id)
                    .Select(sp => sp.StudentId)
                    .ToListAsync();

                feesQuery = _context.StudentFees.Where(sf => childIds.Contains(sf.StudentId));
            }

            var fees = await feesQuery
                .Include(sf => sf.Student)
                .Include(sf => sf.FeeStructure)
                .OrderByDescending(sf => sf.DueDate)
                .Select(sf => new
                {
                    sf.Id,
                    sf.FeeType,
                    sf.Amount,
                    sf.DueDate,
                    sf.PaidDate,
                    sf.Status,
                    sf.Description,
                    Student = new
                    {
                        sf.Student.Id,
                        sf.Student.FirstName,
                        sf.Student.LastName,
                        sf.Student.Class
                    },
                    FeeStructure = sf.FeeStructure != null ? new { sf.FeeStructure.Id, sf.FeeStructure.Name } : null
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = fees,
                summary = new
                {
                    totalFees = fees.Count,
                    totalAmount = fees.Sum(f => f.Amount),
                    paidAmount = fees.Where(f => f.Status == "paid").Sum(f => f.Amount),
                    pendingAmount = fees.Where(f => f.Status == "pending").Sum(f => f.Amount),
                    overdueAmount = fees.Where(f => f.Status == "overdue").Sum(f => f.Amount)
                }
            });
        }

        // GET: api/parents/{id}/messages
        [HttpGet("{id}/messages")]
        public async Task<IActionResult> GetParentMessages(int id, [FromQuery] bool? unreadOnly = false)
        {
            var parent = await _context.Parents.FindAsync(id);
            if (parent == null)
            {
                return NotFound(new { success = false, message = "Parent not found" });
            }

            var query = _context.ParentMessages
                .Where(pm => pm.ParentId == id)
                .Include(pm => pm.Sender)
                .Include(pm => pm.Student)
                .AsQueryable();

            if (unreadOnly == true)
            {
                query = query.Where(pm => !pm.IsRead);
            }

            var messages = await query
                .OrderByDescending(pm => pm.CreatedAt)
                .Take(50) // Limit for performance
                .Select(pm => new
                {
                    pm.Id,
                    pm.Subject,
                    pm.Message,
                    pm.MessageType,
                    pm.IsRead,
                    pm.CreatedAt,
                    Sender = pm.Sender != null ? new
                    {
                        pm.Sender.Id,
                        pm.Sender.FirstName,
                        pm.Sender.LastName,
                        pm.Sender.Role
                    } : null,
                    Student = pm.Student != null ? new
                    {
                        pm.Student.Id,
                        pm.Student.FirstName,
                        pm.Student.LastName,
                        pm.Student.Class
                    } : null
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = messages,
                summary = new
                {
                    totalMessages = messages.Count,
                    unreadCount = messages.Count(m => !m.IsRead),
                    readCount = messages.Count(m => m.IsRead)
                }
            });
        }

        // POST: api/parents/{id}/messages/{messageId}/read
        [HttpPost("{id}/messages/{messageId}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int messageId)
        {
            var message = await _context.ParentMessages
                .FirstOrDefaultAsync(pm => pm.Id == messageId && pm.ParentId == id);

            if (message == null)
            {
                return NotFound(new { success = false, message = "Message not found" });
            }

            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Message marked as read" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to update message", error = ex.Message });
            }
        }
    }
}
