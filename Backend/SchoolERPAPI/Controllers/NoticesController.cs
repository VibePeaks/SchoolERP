using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NoticesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/notices
        [HttpGet]
        public async Task<IActionResult> GetNotices()
        {
            var notices = await _context.Notices
                .OrderByDescending(n => n.PostedAt)
                .ToListAsync();
            return Ok(notices);
        }

        // POST: api/notices
        [HttpPost]
        public async Task<IActionResult> PostNotice([FromBody] Notice notice)
        {
            notice.PostedAt = DateTime.Now;
            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();
            return Ok(notice);
        }
    }
}
