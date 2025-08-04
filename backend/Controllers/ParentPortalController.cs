using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParentPortalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ParentPortalController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/parentportal/messages
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.ParentMessages
                .Include(m => m.Student)
                .OrderByDescending(m => m.SentDate)
                .ToListAsync();
            return Ok(messages);
        }

        // POST: api/parentportal/messages
        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] ParentMessage message)
        {
            message.SentDate = DateTime.Now;
            _context.ParentMessages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(message);
        }
    }
}