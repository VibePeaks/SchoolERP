using Microsoft.AspNetCore.Mvc;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeesController : ControllerBase
    {
        // GET: api/fees
        [HttpGet]
        public IActionResult GetFees()
        {
            return Ok(new { message = "Fees endpoint" });
        }

        // GET: api/fees/receipts
        [HttpGet("receipts")]
        public IActionResult GetReceipts()
        {
            return Ok(new { message = "Fee receipts endpoint" });
        }
    }
}