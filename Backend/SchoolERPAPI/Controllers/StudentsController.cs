using Microsoft.AspNetCore.Mvc;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        // GET: api/students
        [HttpGet]
        public IActionResult GetStudents()
        {
            return Ok(new { message = "Students endpoint" });
        }
    }
}