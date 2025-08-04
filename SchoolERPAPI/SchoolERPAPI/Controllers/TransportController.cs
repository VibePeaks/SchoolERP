using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransportController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/transport/routes
        [HttpGet("routes")]
        public async Task<IActionResult> GetTransportRoutes()
        {
            var routes = await _context.TransportRoutes
                .Include(r => r.Bus)
                .ToListAsync();
            return Ok(routes);
        }

        // POST: api/transport/assign
        [HttpPost("assign")]
        public async Task<IActionResult> AssignTransport([FromBody] TransportAssignment assignment)
        {
            _context.TransportAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            return Ok(assignment);
        }
    }
}