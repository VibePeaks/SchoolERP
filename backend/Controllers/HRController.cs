using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HRController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HRController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/hr/payroll
        [HttpGet("payroll")]
        public async Task<IActionResult> GetPayrollRecords()
        {
            var payroll = await _context.PayrollRecords
                .Include(p => p.Employee)
                .ToListAsync();
            return Ok(payroll);
        }

        // POST: api/hr/payroll
        [HttpPost("payroll")]
        public async Task<IActionResult> CreatePayrollRecord([FromBody] PayrollRecord record)
        {
            _context.PayrollRecords.Add(record);
            await _context.SaveChangesAsync();
            return Ok(record);
        }
    }
}