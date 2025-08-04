using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using System.Text;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataExportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DataExportController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("students/csv")]
        public async Task<IActionResult> ExportStudentsToCsv()
        {
            var students = await _context.Students.ToListAsync();
            var csv = new StringBuilder();
            csv.AppendLine("Id,FirstName,LastName,Email,ClassId");

            foreach (var student in students)
            {
                csv.AppendLine($"{student.Id},{student.FirstName},{student.LastName},{student.Email},{student.ClassId}");
            }

            return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "students.csv");
        }

        [HttpGet("attendance/csv")]
        public async Task<IActionResult> ExportAttendanceToCsv()
        {
            var records = await _context.AttendanceRecords
                .Include(a => a.Student)
                .ToListAsync();
            
            var csv = new StringBuilder();
            csv.AppendLine("StudentName,Date,Status");

            foreach (var record in records)
            {
                csv.AppendLine($"{record.Student.FirstName} {record.Student.LastName},{record.Date},{record.Status}");
            }

            return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "attendance.csv");
        }
    }
}