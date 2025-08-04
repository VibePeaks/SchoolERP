using Microsoft.AspNetCore.Mvc;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        // GET: api/teachers
        [HttpGet]
        public IActionResult GetTeachers()
        {
            return Ok(new { message = "Teachers endpoint" });
        }
    }
}