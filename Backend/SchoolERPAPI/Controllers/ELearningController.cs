using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ELearningController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ELearningController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/elearning/courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses.ToListAsync();
            return Ok(courses);
        }

        // GET: api/elearning/materials/{courseId}
        [HttpGet("materials/{courseId}")]
        public async Task<IActionResult> GetCourseMaterials(int courseId)
        {
            var materials = await _context.CourseMaterials
                .Where(m => m.CourseId == courseId)
                .ToListAsync();
            return Ok(materials);
        }
    }
}