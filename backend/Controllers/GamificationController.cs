using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Data;
using SchoolERP.API.Models;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GamificationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/gamification/achievements/{studentId}
        [HttpGet("achievements/{studentId}")]
        public async Task<IActionResult> GetStudentAchievements(int studentId)
        {
            var achievements = await _context.StudentAchievements
                .Where(a => a.StudentId == studentId)
                .Include(a => a.Reward)
                .ToListAsync();
            return Ok(achievements);
        }

        // POST: api/gamification/rewards
        [HttpPost("rewards")]
        public async Task<IActionResult> AddReward([FromBody] Reward reward)
        {
            _context.Rewards.Add(reward);
            await _context.SaveChangesAsync();
            return Ok(reward);
        }
    }
}