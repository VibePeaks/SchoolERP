using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using SchoolERP.API.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace SchoolERP.API.Middleware
{
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Extract tenant from various sources
            var tenantId = await GetTenantIdAsync(context);

            if (tenantId.HasValue)
            {
                // Set tenant ID in async local storage for DbContext
                TenantContext.SetTenantId(tenantId.Value);

                // Add tenant ID to request context for use in controllers
                context.Items["TenantId"] = tenantId.Value;
            }

            await _next(context);
        }

        private async Task<int?> GetTenantIdAsync(HttpContext context)
        {
            // Priority order for tenant resolution:

            // 1. From JWT token claims
            var tenantClaim = context.User.FindFirst("tenant_id")?.Value;
            if (!string.IsNullOrEmpty(tenantClaim) && int.TryParse(tenantClaim, out var tenantFromToken))
            {
                return tenantFromToken;
            }

            // 2. From subdomain (e.g., school1.yourapp.com -> tenant code "school1")
            var host = context.Request.Host.Host.ToLower();
            if (!string.IsNullOrEmpty(host))
            {
                var subdomain = ExtractSubdomain(host);
                if (!string.IsNullOrEmpty(subdomain))
                {
                    // Resolve subdomain to tenant ID from database
                    var dbContext = context.RequestServices.GetRequiredService<AppDbContext>();

                    // Temporarily disable tenant filtering for tenant lookup
                    TenantContext.SetTenantId(null);

                    try
                    {
                        var tenant = await dbContext.Tenants
                            .FirstOrDefaultAsync(t => t.TenantCode == subdomain && t.IsActive);

                        if (tenant != null)
                        {
                            return tenant.Id;
                        }
                    }
                    finally
                    {
                        // Reset tenant context
                        TenantContext.SetTenantId(null);
                    }
                }
            }

            // 3. From custom header
            var tenantHeader = context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
            if (!string.IsNullOrEmpty(tenantHeader) && int.TryParse(tenantHeader, out var tenantFromHeader))
            {
                return tenantFromHeader;
            }

            // 4. From query parameter
            var tenantQuery = context.Request.Query["tenant_id"].FirstOrDefault();
            if (!string.IsNullOrEmpty(tenantQuery) && int.TryParse(tenantQuery, out var tenantFromQuery))
            {
                return tenantFromQuery;
            }

            // Default to tenant 1 if no tenant specified
            return 1;
        }

        private string ExtractSubdomain(string host)
        {
            // Simple subdomain extraction logic
            // yourapp.com -> no subdomain
            // school1.yourapp.com -> school1

            var parts = host.Split('.');
            if (parts.Length >= 3)
            {
                // Check if it's not www
                if (parts[0] != "www" && parts[0] != "api" && parts[0] != "app")
                {
                    return parts[0];
                }
            }

            return null;
        }
    }

    // Extension method for tenant-aware queries
    public static class TenantExtensions
    {
        public static IQueryable<T> ForTenant<T>(this IQueryable<T> query, int tenantId) where T : class
        {
            // This would be used in repositories to automatically filter by tenant
            // Implementation depends on your entity structure
            return query;
        }
    }

    // Custom DbContext extension for tenant filtering
    public static class DbContextExtensions
    {
        public static int? TenantId { get; set; }

        public static IQueryable<T> FilterByTenant<T>(this DbSet<T> dbSet, int? tenantId = null) where T : class
        {
            tenantId ??= TenantId;
            if (!tenantId.HasValue) return dbSet;

            // Use reflection or dynamic LINQ to filter by TenantId property
            // This is a simplified version - in production you'd want more robust tenant filtering
            return dbSet;
        }
    }
}
