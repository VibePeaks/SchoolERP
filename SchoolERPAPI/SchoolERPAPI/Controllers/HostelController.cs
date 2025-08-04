using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    public class HostelController : BaseApiController
    {
        private readonly AppDbContext _context;

        public HostelController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Hostel>>> GetHostels()
        {
            return HandleResult(await _context.Hostels.ToListAsync());
        }

        [HttpPost("allocate")]
        public async Task<ActionResult<RoomAllocation>> AllocateRoom([FromBody] RoomAllocation allocation)
        {
            _context.RoomAllocations.Add(allocation);
            var result = await _context.SaveChangesAsync() > 0;
            return result ? HandleResult(allocation) : BadRequest("Failed to allocate room");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Hostel>> GetHostel(int id)
        {
            return HandleResult(await _context.Hostels.FindAsync(id));
        }
    }
}