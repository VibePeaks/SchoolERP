using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = new
            {
                TotalStudents = await _context.Students.CountAsync(),
                TotalTeachers = await _context.Teachers.CountAsync(),
                TotalClasses = await _context.Classes.CountAsync(),
                RecentAttendance = await _context.AttendanceRecords
                    .Where(a => a.Date >= DateTime.Today.AddDays(-7))
                    .GroupBy(a => a.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync(),
                UpcomingEvents = await _context.Notices
                    .Where(n => n.ExpiryDate >= DateTime.Today)
                    .OrderBy(n => n.ExpiryDate)
                    .Take(5)
                    .ToListAsync()
            };

            return Ok(stats);
        }
    }
}