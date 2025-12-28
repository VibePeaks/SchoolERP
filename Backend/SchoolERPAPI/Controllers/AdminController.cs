using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SchoolERP.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/subscriptions
        [HttpGet("subscriptions")]
        public async Task<IActionResult> GetAllSubscriptions()
        {
            var subscriptions = await _context.UserSubscriptions
                .Include(us => us.User)
                .Include(us => us.SubscriptionPlan)
                .Include(us => us.Payments)
                .OrderByDescending(us => us.CreatedAt)
                .ToListAsync();

            return Ok(subscriptions);
        }

        // GET: api/admin/subscriptions/{id}
        [HttpGet("subscriptions/{id}")]
        public async Task<IActionResult> GetSubscription(int id)
        {
            var subscription = await _context.UserSubscriptions
                .Include(us => us.User)
                .Include(us => us.SubscriptionPlan)
                .Include(us => us.Payments)
                .FirstOrDefaultAsync(us => us.Id == id);

            if (subscription == null)
                return NotFound();

            return Ok(subscription);
        }

        // PUT: api/admin/subscriptions/{id}/status
        [HttpPut("subscriptions/{id}/status")]
        public async Task<IActionResult> UpdateSubscriptionStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var subscription = await _context.UserSubscriptions.FindAsync(id);
            if (subscription == null)
                return NotFound();

            subscription.Status = request.Status;
            subscription.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription status updated successfully" });
        }

        // POST: api/admin/subscriptions/{userId}/force-renewal
        [HttpPost("subscriptions/{userId}/force-renewal")]
        public async Task<IActionResult> ForceSubscriptionRenewal(int userId)
        {
            var subscription = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .FirstOrDefaultAsync(us => us.UserId == userId && us.Status == "active");

            if (subscription == null)
                return BadRequest(new { message = "No active subscription found for this user" });

            // Extend subscription by the billing cycle
            var extension = subscription.SubscriptionPlan.BillingCycle == "yearly"
                ? TimeSpan.FromDays(365)
                : TimeSpan.FromDays(30);

            subscription.EndDate = subscription.EndDate?.Add(extension) ?? DateTime.UtcNow.Add(extension);
            subscription.LastPaymentDate = DateTime.UtcNow;
            subscription.NextPaymentDate = subscription.EndDate;
            subscription.UpdatedAt = DateTime.UtcNow;

            // Create payment record
            var payment = new SubscriptionPayment
            {
                UserSubscriptionId = subscription.Id,
                Amount = subscription.SubscriptionPlan.Price,
                Currency = "USD",
                PaymentMethod = "admin",
                PaymentReference = $"ADMIN_RENEWAL_{DateTime.UtcNow:yyyyMMddHHmmss}",
                Status = "completed"
            };

            _context.SubscriptionPayments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription renewed successfully" });
        }

        // GET: api/admin/analytics/subscriptions
        [HttpGet("analytics/subscriptions")]
        public async Task<IActionResult> GetSubscriptionAnalytics()
        {
            var totalSubscriptions = await _context.UserSubscriptions.CountAsync();
            var activeSubscriptions = await _context.UserSubscriptions
                .CountAsync(us => us.Status == "active");
            var expiredSubscriptions = await _context.UserSubscriptions
                .CountAsync(us => us.Status == "expired");
            var cancelledSubscriptions = await _context.UserSubscriptions
                .CountAsync(us => us.Status == "cancelled");

            var totalRevenue = await _context.SubscriptionPayments
                .Where(p => p.Status == "completed")
                .SumAsync(p => p.Amount);

            var monthlyRevenue = await _context.SubscriptionPayments
                .Where(p => p.Status == "completed" &&
                           p.PaymentDate >= DateTime.UtcNow.AddMonths(-1))
                .SumAsync(p => p.Amount);

            var planDistribution = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .Where(us => us.Status == "active")
                .GroupBy(us => us.SubscriptionPlan.PlanName)
                .Select(g => new
                {
                    PlanName = g.Key,
                    Count = g.Count(),
                    Revenue = g.Sum(us => us.SubscriptionPlan.Price)
                })
                .ToListAsync();

            return Ok(new
            {
                totalSubscriptions,
                activeSubscriptions,
                expiredSubscriptions,
                cancelledSubscriptions,
                totalRevenue,
                monthlyRevenue,
                planDistribution
            });
        }

        // POST: api/admin/subscription-plans
        [HttpPost("subscription-plans")]
        public async Task<IActionResult> CreateSubscriptionPlan([FromBody] SubscriptionPlan plan)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            plan.CreatedAt = DateTime.UtcNow;
            plan.UpdatedAt = DateTime.UtcNow;

            _context.SubscriptionPlans.Add(plan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubscriptionPlan), new { id = plan.Id }, plan);
        }

        // PUT: api/admin/subscription-plans/{id}
        [HttpPut("subscription-plans/{id}")]
        public async Task<IActionResult> UpdateSubscriptionPlan(int id, [FromBody] SubscriptionPlan plan)
        {
            if (id != plan.Id)
                return BadRequest();

            var existingPlan = await _context.SubscriptionPlans.FindAsync(id);
            if (existingPlan == null)
                return NotFound();

            existingPlan.PlanName = plan.PlanName;
            existingPlan.DisplayName = plan.DisplayName;
            existingPlan.Description = plan.Description;
            existingPlan.Price = plan.Price;
            existingPlan.BillingCycle = plan.BillingCycle;
            existingPlan.Features = plan.Features;
            existingPlan.IsActive = plan.IsActive;
            existingPlan.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(existingPlan);
        }

        // GET: api/admin/subscription-plans/{id}
        [HttpGet("subscription-plans/{id}")]
        public async Task<IActionResult> GetSubscriptionPlan(int id)
        {
            var plan = await _context.SubscriptionPlans.FindAsync(id);
            if (plan == null)
                return NotFound();

            return Ok(plan);
        }

        // DELETE: api/admin/subscription-plans/{id}
        [HttpDelete("subscription-plans/{id}")]
        public async Task<IActionResult> DeleteSubscriptionPlan(int id)
        {
            var plan = await _context.SubscriptionPlans.FindAsync(id);
            if (plan == null)
                return NotFound();

            // Check if plan is being used
            var isUsed = await _context.UserSubscriptions
                .AnyAsync(us => us.SubscriptionPlanId == id);

            if (isUsed)
            {
                return BadRequest(new { message = "Cannot delete plan that is currently in use" });
            }

            _context.SubscriptionPlans.Remove(plan);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription plan deleted successfully" });
        }

        // GET: api/admin/payments
        [HttpGet("payments")]
        public async Task<IActionResult> GetAllPayments([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var payments = await _context.SubscriptionPayments
                .Include(p => p.UserSubscription)
                    .ThenInclude(us => us.User)
                .Include(p => p.UserSubscription.SubscriptionPlan)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalCount = await _context.SubscriptionPayments.CountAsync();

            return Ok(new
            {
                payments,
                pagination = new
                {
                    page,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                }
            });
        }

        // GET: api/admin/users/{userId}/subscription
        [HttpGet("users/{userId}/subscription")]
        public async Task<IActionResult> GetUserSubscription(int userId)
        {
            var subscription = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .Include(us => us.Payments)
                .FirstOrDefaultAsync(us => us.UserId == userId && us.Status == "active");

            if (subscription == null)
            {
                return Ok(new { message = "User has no active subscription", plan = "basic" });
            }

            return Ok(subscription);
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; }
    }
}
