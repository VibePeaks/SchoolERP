using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using FluentValidation;
using SchoolERP.API.Models;

namespace SchoolERP.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddRateLimiting(this IServiceCollection services)
        {
            services.AddRateLimiter(options => 
            {
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: context.User.Identity?.Name ?? context.Request.Headers.Host.ToString(),
                        factory: partition => new FixedWindowRateLimiterOptions
                        {
                            AutoReplenishment = true,
                            PermitLimit = 100,
                            Window = TimeSpan.FromMinutes(1)
                        }));
                
                options.RejectionStatusCode = 429;
            });
        }

        public static void AddValidators(this IServiceCollection services)
        {
            services.AddScoped<IValidator<Student>, StudentValidator>();
            services.AddScoped<IValidator<Teacher>, TeacherValidator>();
            services.AddScoped<IValidator<ParentMessage>, ParentMessageValidator>();
            // Add other validators
        }
    }
}