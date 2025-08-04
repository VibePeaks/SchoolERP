using Microsoft.AspNetCore.Http;
using SchoolERP.API.Data;
using SchoolERP.API.Models;
using System;
using System.Threading.Tasks;

namespace SchoolERP.API.Middleware
{
    public class AuditLogMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditLogMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
        {
            // Skip logging for certain requests
            if (context.Request.Path.StartsWithSegments("/swagger") || 
                context.Request.Path.StartsWithSegments("/health"))
            {
                await _next(context);
                return;
            }

            var auditLog = new AuditLog
            {
                UserId = context.User.Identity?.Name ?? "Anonymous",
                Action = $"{context.Request.Method} {context.Request.Path}",
                Entity = context.Request.Path.Value.Split('/')[2],
                Timestamp = DateTime.UtcNow
            };

            try
            {
                await _next(context);
                auditLog.EntityId = context.Response.StatusCode.ToString();
            }
            finally
            {
                await dbContext.AuditLogs.AddAsync(auditLog);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}