using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SchoolERP.API.Data;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubscriptionController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/subscription/plans
        [HttpGet("plans")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSubscriptionPlans()
        {
            var plans = await _context.SubscriptionPlans
                .Where(p => p.IsActive)
                .OrderBy(p => p.Price)
                .ToListAsync();

            return Ok(plans);
        }

        // GET: api/subscription/current
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentSubscription()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var subscription = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .Include(us => us.Payments)
                .Where(us => us.UserId == userId.Value && us.Status == "active")
                .OrderByDescending(us => us.CreatedAt)
                .FirstOrDefaultAsync();

            if (subscription == null)
            {
                return Ok(new { message = "No active subscription found", plan = "basic" });
            }

            return Ok(subscription);
        }

        // POST: api/subscription/subscribe
        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var plan = await _context.SubscriptionPlans
                .FirstOrDefaultAsync(p => p.PlanName == request.PlanName && p.IsActive);

            if (plan == null)
                return BadRequest(new { message = "Invalid subscription plan" });

            // Check if user already has an active subscription
            var existingSubscription = await _context.UserSubscriptions
                .FirstOrDefaultAsync(us => us.UserId == userId.Value && us.Status == "active");

            if (existingSubscription != null)
            {
                // Cancel existing subscription
                existingSubscription.Status = "cancelled";
                existingSubscription.UpdatedAt = DateTime.UtcNow;
            }

            // Create new subscription
            var subscription = new UserSubscription
            {
                UserId = userId.Value,
                SubscriptionPlanId = plan.Id,
                StartDate = DateTime.UtcNow,
                EndDate = request.BillingCycle == "yearly"
                    ? DateTime.UtcNow.AddYears(1)
                    : DateTime.UtcNow.AddMonths(1),
                Status = "active",
                PaymentMethod = request.PaymentMethod,
                PaymentReference = request.PaymentReference,
                LastPaymentDate = DateTime.UtcNow,
                NextPaymentDate = request.BillingCycle == "yearly"
                    ? DateTime.UtcNow.AddYears(1)
                    : DateTime.UtcNow.AddMonths(1)
            };

            _context.UserSubscriptions.Add(subscription);
            await _context.SaveChangesAsync();

            // Create payment record
            var payment = new SubscriptionPayment
            {
                UserSubscriptionId = subscription.Id,
                Amount = plan.Price,
                Currency = "USD",
                PaymentMethod = request.PaymentMethod,
                PaymentReference = request.PaymentReference,
                Status = "completed"
            };

            _context.SubscriptionPayments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription created successfully", subscription });
        }

        // POST: api/subscription/upgrade
        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeSubscription([FromBody] UpgradeRequest request)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var currentSubscription = await _context.UserSubscriptions
                .Include(us => us.SubscriptionPlan)
                .FirstOrDefaultAsync(us => us.UserId == userId.Value && us.Status == "active");

            if (currentSubscription == null)
                return BadRequest(new { message = "No active subscription found" });

            var newPlan = await _context.SubscriptionPlans
                .FirstOrDefaultAsync(p => p.PlanName == request.NewPlanName && p.IsActive);

            if (newPlan == null)
                return BadRequest(new { message = "Invalid subscription plan" });

            // Calculate prorated amount (simplified - full price for upgrade)
            var upgradeAmount = newPlan.Price;

            // Create upgrade payment
            var payment = new SubscriptionPayment
            {
                UserSubscriptionId = currentSubscription.Id,
                Amount = upgradeAmount,
                Currency = "USD",
                PaymentMethod = request.PaymentMethod,
                PaymentReference = request.PaymentReference,
                Status = "completed"
            };

            _context.SubscriptionPayments.Add(payment);

            // Update subscription plan
            currentSubscription.SubscriptionPlanId = newPlan.Id;
            currentSubscription.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription upgraded successfully" });
        }

        // POST: api/subscription/cancel
        [HttpPost("cancel")]
        public async Task<IActionResult> CancelSubscription()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var subscription = await _context.UserSubscriptions
                .FirstOrDefaultAsync(us => us.UserId == userId.Value && us.Status == "active");

            if (subscription == null)
                return BadRequest(new { message = "No active subscription found" });

            subscription.Status = "cancelled";
            subscription.AutoRenew = false;
            subscription.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Subscription cancelled successfully" });
        }

        // GET: api/subscription/features
        [HttpGet("features")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSubscriptionFeatures()
        {
            var features = await _context.SubscriptionFeatures
                .Where(f => f.IsActive)
                .ToListAsync();

            return Ok(features);
        }

        // GET: api/subscription/payments
        [HttpGet("payments")]
        public async Task<IActionResult> GetPaymentHistory()
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var payments = await _context.SubscriptionPayments
                .Include(p => p.UserSubscription)
                    .ThenInclude(us => us.SubscriptionPlan)
                .Where(p => p.UserSubscription.UserId == userId.Value)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(payments);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
                return userId;

            // Try to get from username and lookup user
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(username))
            {
                var user = _context.Users.FirstOrDefault(u => u.Username == username);
                return user?.Id;
            }

            return null;
        }
    }

    // Request DTOs
    public class SubscribeRequest
    {
        public string PlanName { get; set; }
        public string BillingCycle { get; set; } // 'monthly', 'yearly'
        public string PaymentMethod { get; set; }
        public string PaymentReference { get; set; }
    }

    public class UpgradeRequest
    {
        public string NewPlanName { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentReference { get; set; }
    }
}
