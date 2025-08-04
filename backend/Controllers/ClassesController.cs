using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClassesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/classes
        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            var classes = await _context.Classes.ToListAsync();
            return Ok(classes);
        }

        // POST: api/classes
        [HttpPost]
        public async Task<IActionResult> CreateClass([FromBody] Class classModel)
        {
            _context.Classes.Add(classModel);
            await _context.SaveChangesAsync();
            return Ok(classModel);
        }
    }
}