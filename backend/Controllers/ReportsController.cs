using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("attendance/{classId}")]
        public async Task<IActionResult> GetAttendanceReport(int classId)
        {
            var report = await _context.AttendanceRecords
                .Where(a => a.ClassId == classId)
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(report);
        }

        [HttpGet("fees/{studentId}")]
        public async Task<IActionResult> GetFeeReport(int studentId)
        {
            var report = await _context.StudentFees
                .Where(f => f.StudentId == studentId)
                .GroupBy(f => f.Status)
                .Select(g => new { Status = g.Key, Total = g.Sum(f => f.Amount) })
                .ToListAsync();

            return Ok(report);
        }
    }
}