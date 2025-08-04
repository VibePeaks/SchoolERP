using Microsoft.AspNetCore.Mvc;

namespace SchoolERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected ActionResult<T> HandleResult<T>(T result)
        {
            if (result == null) return NotFound();
            return Ok(result);
        }

        protected ActionResult<T> HandlePagedResult<T>(PagedResult<T> result)
        {
            if (result == null || result.Items.Count == 0) return NotFound();
            return Ok(result);
        }
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}