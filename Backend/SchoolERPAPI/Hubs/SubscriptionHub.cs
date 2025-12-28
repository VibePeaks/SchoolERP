using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SchoolERP.API.Data;
using Microsoft.EntityFrameworkCore;
using SchoolERP.API.Models;

namespace SchoolERP.API.Hubs
{
    [Authorize]
    public class SubscriptionHub : Hub
    {
        private readonly AppDbContext _context;

        public SubscriptionHub(AppDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                // Add user to their personal group for targeted notifications
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

                // Add to tenant group for school-wide notifications
                var tenantId = GetCurrentTenantId();
                if (tenantId.HasValue)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, $"tenant_{tenantId}");
                }

                // Notify user of successful connection
                await Clients.Caller.SendAsync("Connected", new
                {
                    Message = "Successfully connected to real-time notifications",
                    Timestamp = DateTime.UtcNow
                });
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");

                var tenantId = GetCurrentTenantId();
                if (tenantId.HasValue)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"tenant_{tenantId}");
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        // Method to subscribe to specific subscription events
        public async Task SubscribeToSubscription(string subscriptionId)
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                // Verify user owns this subscription
                var subscription = await _context.UserSubscriptions
                    .FirstOrDefaultAsync(us => us.Id.ToString() == subscriptionId && us.UserId == userId);

                if (subscription != null)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, $"subscription_{subscriptionId}");
                    await Clients.Caller.SendAsync("Subscribed", new
                    {
                        SubscriptionId = subscriptionId,
                        Message = "Successfully subscribed to subscription updates"
                    });
                }
            }
        }

        // Method to get current subscription status
        public async Task GetSubscriptionStatus()
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                var subscription = await _context.UserSubscriptions
                    .Include(us => us.SubscriptionPlan)
                    .Where(us => us.UserId == userId && us.Status == "active")
                    .OrderByDescending(us => us.CreatedAt)
                    .FirstOrDefaultAsync();

                await Clients.Caller.SendAsync("SubscriptionStatus", new
                {
                    Plan = subscription?.SubscriptionPlan.PlanName ?? "basic",
                    Status = subscription?.Status ?? "active",
                    EndDate = subscription?.EndDate,
                    AutoRenew = subscription?.AutoRenew ?? false
                });
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
                return userId;
            return null;
        }

        private int? GetCurrentTenantId()
        {
            var tenantClaim = Context.User.FindFirst("tenant_id")?.Value;
            if (int.TryParse(tenantClaim, out var tenantId))
                return tenantId;
            return null;
        }
    }

    // Static class for broadcasting subscription events
    public static class SubscriptionHubExtensions
    {
        public static async Task NotifySubscriptionUpdate(this IHubContext<SubscriptionHub> hub, int userId, object data)
        {
            await hub.Clients.Group($"user_{userId}").SendAsync("SubscriptionUpdate", data);
        }

        public static async Task NotifySubscriptionExpiring(this IHubContext<SubscriptionHub> hub, int userId, DateTime expiryDate)
        {
            await hub.Clients.Group($"user_{userId}").SendAsync("SubscriptionExpiring", new
            {
                ExpiryDate = expiryDate,
                DaysRemaining = (expiryDate - DateTime.UtcNow).Days,
                Message = "Your subscription is expiring soon"
            });
        }

        public static async Task NotifyPaymentSuccess(this IHubContext<SubscriptionHub> hub, int userId, decimal amount, string planName)
        {
            await hub.Clients.Group($"user_{userId}").SendAsync("PaymentSuccess", new
            {
                Amount = amount,
                PlanName = planName,
                Timestamp = DateTime.UtcNow,
                Message = $"Payment of ${amount} for {planName} plan was successful"
            });
        }

        public static async Task NotifyTenantUpdate(this IHubContext<SubscriptionHub> hub, int tenantId, object data)
        {
            await hub.Clients.Group($"tenant_{tenantId}").SendAsync("TenantUpdate", data);
        }
    }
}
