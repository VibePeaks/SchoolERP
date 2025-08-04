using Microsoft.AspNetCore.Mvc;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamsController : ControllerBase
    {
        // GET: api/exams
        [HttpGet]
        public IActionResult GetExams()
        {
            return Ok(new { message = "Exams endpoint" });
        }

        // GET: api/exams/results
        [HttpGet("results")]
        public IActionResult GetExamResults()
        {
            return Ok(new { message = "Exam results endpoint" });
        }
    }
}