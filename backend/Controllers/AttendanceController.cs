using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/attendance/class/{classId}/date/{date}
        [HttpGet("class/{classId}/date/{date}")]
        public async Task<IActionResult> GetClassAttendance(int classId, DateTime date)
        {
            var attendance = await _context.AttendanceRecords
                .Where(a => a.ClassId == classId && a.Date == date.Date)
                .ToListAsync();
            return Ok(attendance);
        }

        // POST: api/attendance
        [HttpPost]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceRecord record)
        {
            _context.AttendanceRecords.Add(record);
            await _context.SaveChangesAsync();
            return Ok(record);
        }
    }
}