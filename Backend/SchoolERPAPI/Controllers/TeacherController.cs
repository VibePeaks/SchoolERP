using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERPAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERPAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TeacherController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDatabaseService _databaseService;

        public TeacherController(AppDbContext context, IDatabaseService databaseService)
        {
            _context = context;
            _databaseService = databaseService;
        }

        // GET: api/teacher/{teacherId}/classes
        [HttpGet("{teacherId}/classes")]
        public async Task<IActionResult> GetTeacherClasses(int teacherId)
        {
            var teacher = await _context.Teachers
                .Include(t => t.ClassesTaught)
                    .ThenInclude(c => c.AttendanceRecords)
                .Include(t => t.ClassesTaught)
                    .ThenInclude(c => c.Students)
                .FirstOrDefaultAsync(t => t.Id == teacherId);

            if (teacher == null)
            {
                return NotFound(new { success = false, message = "Teacher not found" });
            }

            var classes = teacher.ClassesTaught.Select(c => new
            {
                c.Id,
                c.Name,
                c.Section,
                c.Subject,
                c.ClassTeacherId,
                StudentCount = c.Students.Count,
                TodayAttendance = c.AttendanceRecords
                    .Count(ar => ar.Date.Date == DateTime.UtcNow.Date),
                TotalAttendanceRecords = c.AttendanceRecords.Count,
                AttendanceRate = c.AttendanceRecords.Count > 0
                    ? Math.Round((double)c.AttendanceRecords.Count(ar => ar.Status == "present") / c.AttendanceRecords.Count * 100, 1)
                    : 0
            });

            return Ok(new
            {
                success = true,
                data = classes,
                summary = new
                {
                    totalClasses = classes.Count(),
                    totalStudents = classes.Sum(c => c.StudentCount),
                    averageAttendanceRate = classes.Count() > 0
                        ? Math.Round(classes.Average(c => c.AttendanceRate), 1)
                        : 0
                }
            });
        }

        // GET: api/teacher/classes/{classId}/students
        [HttpGet("classes/{classId}/students")]
        public async Task<IActionResult> GetClassStudents(int classId)
        {
            var classEntity = await _context.Classes
                .Include(c => c.Students)
                    .ThenInclude(s => s.AttendanceRecords.Where(ar => ar.Date.Date == DateTime.UtcNow.Date))
                .FirstOrDefaultAsync(c => c.Id == classId);

            // Get recent grades separately
            var studentIds = classEntity?.Students.Select(s => s.Id).ToList() ?? new List<int>();
            var recentGrades = await _context.Grades
                .Where(g => studentIds.Contains(g.StudentId))
                .Include(g => g.Subject)
                .OrderByDescending(g => g.CreatedAt)
                .Take(10)
                .ToListAsync();

            if (classEntity == null)
            {
                return NotFound(new { success = false, message = "Class not found" });
            }

            var students = classEntity.Students.Select(s => new
            {
                s.Id,
                s.FirstName,
                s.LastName,
                s.RollNumber,
                s.Email,
                TodayAttendance = s.AttendanceRecords.FirstOrDefault() != null ? s.AttendanceRecords.FirstOrDefault().Status : "not_marked",
                AttendancePercentage = s.AttendanceRecords.Count > 0
                    ? Math.Round((double)s.AttendanceRecords.Count(ar => ar.Status == "present") / s.AttendanceRecords.Count * 100, 1)
                    : 0
            });

            return Ok(new
            {
                success = true,
                data = new
                {
                    classInfo = new
                    {
                        classEntity.Id,
                        classEntity.Name,
                        classEntity.Section,
                        classEntity.Subject,
                        classEntity.ClassTeacherId
                    },
                    students = students,
                    summary = new
                    {
                        totalStudents = students.Count(),
                        presentToday = students.Count(s => s.TodayAttendance == "present"),
                        absentToday = students.Count(s => s.TodayAttendance == "absent"),
                        notMarkedToday = students.Count(s => s.TodayAttendance == "not_marked"),
                        averageAttendance = students.Count() > 0
                            ? Math.Round(students.Average(s => s.AttendancePercentage), 1)
                            : 0
                    }
                }
            });
        }

        // GET: api/teacher/classes/{classId}/attendance
        [HttpGet("classes/{classId}/attendance")]
        public async Task<IActionResult> GetClassAttendance(int classId, [FromQuery] DateTime? date = null)
        {
            var targetDate = date ?? DateTime.UtcNow.Date;

            var classEntity = await _context.Classes
                .Include(c => c.AttendanceRecords.Where(ar => ar.Date.Date == targetDate))
                    .ThenInclude(ar => ar.Student)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                return NotFound(new { success = false, message = "Class not found" });
            }

            var attendanceRecords = classEntity.AttendanceRecords
                .OrderBy(ar => ar.Student?.RollNumber ?? "")
                .Select(ar => new
                {
                    ar.Id,
                    ar.Date,
                    ar.Status,
                    ar.Subject,
                    ar.Remarks,
                    ar.MarkedBy,
                    Student = ar.Student != null ? new
                    {
                        ar.Student.Id,
                        ar.Student.FirstName,
                        ar.Student.LastName,
                        ar.Student.RollNumber
                    } : null
                });

            return Ok(new
            {
                success = true,
                data = attendanceRecords,
                date = targetDate,
                summary = new
                {
                    totalStudents = classEntity.Students.Count,
                    markedAttendance = attendanceRecords.Count(),
                    present = attendanceRecords.Count(ar => ar.Status == "present"),
                    absent = attendanceRecords.Count(ar => ar.Status == "absent"),
                    late = attendanceRecords.Count(ar => ar.Status == "late"),
                    attendanceRate = attendanceRecords.Count() > 0
                        ? Math.Round((double)attendanceRecords.Count(ar => ar.Status == "present") / attendanceRecords.Count() * 100, 1)
                        : 0
                }
            });
        }

        // POST: api/teacher/classes/{classId}/attendance
        [HttpPost("classes/{classId}/attendance")]
        [Authorize(Roles = "admin,teacher")]
        public async Task<IActionResult> MarkClassAttendance(int classId, [FromBody] AttendanceMarkRequest request)
        {
            var classEntity = await _context.Classes
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                return NotFound(new { success = false, message = "Class not found" });
            }

            // Validate that all attendance records are for students in this class
            var studentIds = classEntity.Students.Select(s => s.Id).ToHashSet();
            var invalidRecords = request.AttendanceRecords.Where(ar => !studentIds.Contains(ar.StudentId)).ToList();

            if (invalidRecords.Any())
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Some attendance records are for students not in this class",
                    invalidRecords = invalidRecords.Select(ir => ir.StudentId)
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var attendanceRecords = new List<AttendanceRecord>();

                foreach (var record in request.AttendanceRecords)
                {
                    var attendanceRecord = new AttendanceRecord
                    {
                        StudentId = record.StudentId,
                        ClassId = classId,
                        Date = request.Date,
                        Status = record.Status,
                        Subject = request.Subject,
                        Remarks = record.Remarks,
                        MarkedBy = request.TeacherId
                    };

                    attendanceRecords.Add(attendanceRecord);
                    _context.AttendanceRecords.Add(attendanceRecord);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = $"Attendance marked for {attendanceRecords.Count} students",
                    data = new
                    {
                        classId = classId,
                        date = request.Date,
                        markedBy = request.TeacherId,
                        recordsCount = attendanceRecords.Count,
                        summary = new
                        {
                            present = attendanceRecords.Count(ar => ar.Status == "present"),
                            absent = attendanceRecords.Count(ar => ar.Status == "absent"),
                            late = attendanceRecords.Count(ar => ar.Status == "late")
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to mark attendance",
                    error = ex.Message
                });
            }
        }

        // PUT: api/teacher/attendance/{attendanceId}
        [HttpPut("attendance/{attendanceId}")]
        [Authorize(Roles = "admin,teacher")]
        public async Task<IActionResult> UpdateAttendanceRecord(int attendanceId, [FromBody] AttendanceUpdateRequest request)
        {
            var attendanceRecord = await _context.AttendanceRecords.FindAsync(attendanceId);
            if (attendanceRecord == null)
            {
                return NotFound(new { success = false, message = "Attendance record not found" });
            }

            attendanceRecord.Status = request.Status;
            if (!string.IsNullOrEmpty(request.Remarks))
            {
                attendanceRecord.Remarks = request.Remarks;
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Attendance record updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to update attendance record",
                    error = ex.Message
                });
            }
        }

        // GET: api/teacher/classes/{classId}/grades
        [HttpGet("classes/{classId}/grades")]
        public async Task<IActionResult> GetClassGrades(int classId, [FromQuery] string? subjectId = null, [FromQuery] string? examType = null)
        {
            var classEntity = await _context.Classes
                .Include(c => c.Grades.Where(g =>
                    (subjectId == null || g.SubjectId.ToString() == subjectId) &&
                    (examType == null || g.ExamType == examType)))
                    .ThenInclude(g => g.Student)
                .Include(c => c.Grades)
                    .ThenInclude(g => g.Subject)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                return NotFound(new { success = false, message = "Class not found" });
            }

            var grades = classEntity.Grades
                .OrderByDescending(g => g.CreatedAt)
                .Select(g => new
                {
                    g.Id,
                    g.StudentId,
                    g.SubjectId,
                    Student = new
                    {
                        g.Student.Id,
                        g.Student.FirstName,
                        g.Student.LastName,
                        g.Student.RollNumber
                    },
                    Subject = g.Subject != null ? new
                    {
                        g.Subject.Id,
                        g.Subject.Name
                    } : null,
                    g.ExamType,
                    g.MarksObtained,
                    g.TotalMarks,
                    g.GradeLetter,
                    g.Remarks,
                    g.ExamDate,
                    Percentage = g.TotalMarks > 0 ? Math.Round((double)g.MarksObtained / g.TotalMarks * 100, 2) : 0
                });

            return Ok(new
            {
                success = true,
                data = grades,
                summary = new
                {
                    totalGrades = grades.Count(),
                    averagePercentage = grades.Count() > 0
                        ? Math.Round(grades.Average(g => g.Percentage), 2)
                        : 0,
                    gradeDistribution = grades.GroupBy(g => g.GradeLetter)
                        .Select(group => new { Grade = group.Key, Count = group.Count() })
                        .OrderBy(g => g.Grade)
                }
            });
        }

        // POST: api/teacher/classes/{classId}/grades
        [HttpPost("classes/{classId}/grades")]
        [Authorize(Roles = "admin,teacher")]
        public async Task<IActionResult> SubmitClassGrades(int classId, [FromBody] GradesSubmitRequest request)
        {
            var classEntity = await _context.Classes
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                return NotFound(new { success = false, message = "Class not found" });
            }

            // Validate that all grades are for students in this class
            var studentIds = classEntity.Students.Select(s => s.Id).ToHashSet();
            var invalidGrades = request.Grades.Where(g => !studentIds.Contains(g.StudentId)).ToList();

            if (invalidGrades.Any())
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Some grades are for students not in this class",
                    invalidGrades = invalidGrades.Select(ig => ig.StudentId)
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var gradeRecords = new List<Grade>();

                foreach (var gradeData in request.Grades)
                {
                    var grade = new Grade
                    {
                        StudentId = gradeData.StudentId,
                        SubjectId = gradeData.SubjectId,
                        ClassId = classId,
                        ExamType = request.ExamType,
                        MarksObtained = gradeData.MarksObtained,
                        TotalMarks = gradeData.TotalMarks,
                        GradeLetter = CalculateGrade(gradeData.MarksObtained, gradeData.TotalMarks),
                        Remarks = gradeData.Remarks,
                        ExamDate = request.ExamDate,
                        TeacherId = request.TeacherId
                    };

                    gradeRecords.Add(grade);
                    _context.Grades.Add(grade);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = $"Grades submitted for {gradeRecords.Count} students",
                    data = new
                    {
                        classId = classId,
                        examType = request.ExamType,
                        examDate = request.ExamDate,
                        submittedBy = request.TeacherId,
                        gradesCount = gradeRecords.Count,
                        summary = new
                        {
                            averagePercentage = gradeRecords.Count > 0
                                ? Math.Round(gradeRecords.Average(g => g.TotalMarks > 0 ? (double)g.MarksObtained / g.TotalMarks * 100 : 0), 2)
                                : 0,
                            gradeDistribution = gradeRecords.GroupBy(g => g.GradeLetter)
                                .Select(group => new { Grade = group.Key, Count = group.Count() })
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to submit grades",
                    error = ex.Message
                });
            }
        }

        // PUT: api/teacher/grades/{gradeId}
        [HttpPut("grades/{gradeId}")]
        [Authorize(Roles = "admin,teacher")]
        public async Task<IActionResult> UpdateGrade(int gradeId, [FromBody] GradeUpdateRequest request)
        {
            var grade = await _context.Grades.FindAsync(gradeId);
            if (grade == null)
            {
                return NotFound(new { success = false, message = "Grade not found" });
            }

            grade.MarksObtained = request.MarksObtained;
            grade.TotalMarks = request.TotalMarks;
            grade.GradeLetter = CalculateGrade(request.MarksObtained, request.TotalMarks);
            grade.Remarks = request.Remarks;
            grade.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Grade updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to update grade",
                    error = ex.Message
                });
            }
        }

        // Helper method to calculate grade
        private string CalculateGrade(int marksObtained, int totalMarks)
        {
            if (totalMarks == 0) return "N/A";

            var percentage = (double)marksObtained / totalMarks * 100;

            if (percentage >= 90) return "A+";
            if (percentage >= 80) return "A";
            if (percentage >= 70) return "B+";
            if (percentage >= 60) return "B";
            if (percentage >= 50) return "C+";
            if (percentage >= 40) return "C";
            return "F";
        }
    }

    // Request/Response Models
    public class AttendanceMarkRequest
    {
        public int ClassId { get; set; }
        public DateTime Date { get; set; }
        public string Subject { get; set; }
        public int TeacherId { get; set; }
        public List<AttendanceRecordRequest> AttendanceRecords { get; set; } = new List<AttendanceRecordRequest>();
    }

    public class AttendanceRecordRequest
    {
        public int StudentId { get; set; }
        public string Status { get; set; } // "present", "absent", "late"
        public string? Remarks { get; set; }
    }

    public class AttendanceUpdateRequest
    {
        public string Status { get; set; }
        public string? Remarks { get; set; }
    }

    public class GradesSubmitRequest
    {
        public int ClassId { get; set; }
        public int SubjectId { get; set; }
        public string ExamType { get; set; }
        public DateTime ExamDate { get; set; }
        public int TeacherId { get; set; }
        public List<GradeRecordRequest> Grades { get; set; } = new List<GradeRecordRequest>();
    }

    public class GradeRecordRequest
    {
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public int MarksObtained { get; set; }
        public int TotalMarks { get; set; }
        public string? Remarks { get; set; }
    }

    public class GradeUpdateRequest
    {
        public int MarksObtained { get; set; }
        public int TotalMarks { get; set; }
        public string? Remarks { get; set; }
    }
}
