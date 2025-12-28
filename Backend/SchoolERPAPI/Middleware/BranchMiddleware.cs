using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using SchoolERP.API.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace SchoolERP.API.Middleware
{
    public class BranchMiddleware
    {
        private readonly RequestDelegate _next;

        public BranchMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var tenantId = (int?)context.Items["TenantId"];
            var user = context.User;

            if (tenantId.HasValue && user.Identity.IsAuthenticated)
            {
                var userIdClaim = user.FindFirst("user_id")?.Value ??
                                 user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (int.TryParse(userIdClaim, out var userId))
                {
                    await SetBranchContext(context, tenantId.Value, userId);
                }
            }

            await _next(context);
        }

        private async Task SetBranchContext(HttpContext context, int tenantId, int userId)
        {
            using var db = context.RequestServices.GetRequiredService<AppDbContext>();

            // Find user's primary branch assignment
            var userBranch = await db.UserBranches
                .Include(ub => ub.Branch)
                .FirstOrDefaultAsync(ub =>
                    ub.UserId == userId &&
                    ub.TenantId == tenantId &&
                    ub.IsPrimary);

            if (userBranch != null)
            {
                // Set branch context
                context.Items["BranchId"] = userBranch.BranchId;
                context.Items["BranchCode"] = userBranch.Branch.Code;
                context.Items["BranchName"] = userBranch.Branch.Name;
                context.Items["UserBranchRole"] = userBranch.Role.ToString();

                // Store the full UserBranch object for complex logic
                context.Items["UserBranch"] = userBranch;
            }
            else
            {
                // User has no branch assignment - this might be an admin or super user
                // They can still access data but may need to specify branches explicitly
                context.Items["BranchId"] = null;
                context.Items["UserBranchRole"] = "Unassigned";
            }
        }
    }
}
