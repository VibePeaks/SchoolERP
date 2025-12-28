using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace SchoolERPAPI.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var errorId = Guid.NewGuid().ToString();
            var timestamp = DateTime.UtcNow;

            // Log the error with structured logging
            _logger.LogError(exception,
                "Unhandled exception occurred. ErrorId: {ErrorId}, Path: {Path}, Method: {Method}, UserAgent: {UserAgent}, RemoteIP: {RemoteIP}",
                errorId,
                context.Request.Path,
                context.Request.Method,
                context.Request.Headers["User-Agent"].ToString(),
                context.Connection.RemoteIpAddress?.ToString());

            // Determine the appropriate HTTP status code and error type
            var (statusCode, errorType) = GetErrorDetails(exception);

            var errorResponse = new ErrorResponse
            {
                Success = false,
                ErrorId = errorId,
                Timestamp = timestamp,
                Type = errorType,
                Message = GetUserFriendlyMessage(exception, errorType),
                Path = context.Request.Path,
                Method = context.Request.Method,
                Details = GetErrorDetails(exception)
            };

            // Add additional debugging info in development
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                errorResponse.StackTrace = exception.StackTrace;
                errorResponse.InnerException = exception.InnerException?.Message;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });

            await context.Response.WriteAsync(jsonResponse);
        }

        private (HttpStatusCode statusCode, string errorType) GetErrorDetails(Exception exception)
        {
            return exception switch
            {
                ArgumentException => (HttpStatusCode.BadRequest, "VALIDATION_ERROR"),
                InvalidOperationException => (HttpStatusCode.BadRequest, "INVALID_OPERATION"),
                UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "UNAUTHORIZED"),
                KeyNotFoundException => (HttpStatusCode.NotFound, "NOT_FOUND"),
                TimeoutException => (HttpStatusCode.RequestTimeout, "TIMEOUT"),
                Microsoft.EntityFrameworkCore.DbUpdateException => (HttpStatusCode.Conflict, "DATABASE_CONFLICT"),
                Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException => (HttpStatusCode.Conflict, "CONCURRENCY_CONFLICT"),
                _ => (HttpStatusCode.InternalServerError, "INTERNAL_SERVER_ERROR")
            };
        }

        private string GetUserFriendlyMessage(Exception exception, string errorType)
        {
            return errorType switch
            {
                "VALIDATION_ERROR" => "The provided data is invalid. Please check your input and try again.",
                "INVALID_OPERATION" => "The requested operation cannot be performed.",
                "UNAUTHORIZED" => "You are not authorized to perform this action.",
                "NOT_FOUND" => "The requested resource was not found.",
                "TIMEOUT" => "The request timed out. Please try again.",
                "DATABASE_CONFLICT" => "A database conflict occurred. Please try again.",
                "CONCURRENCY_CONFLICT" => "The data was modified by another user. Please refresh and try again.",
                _ => "An unexpected error occurred. Please try again later."
            };
        }

        private object GetErrorDetails(Exception exception)
        {
            // Return sanitized error details
            return new
            {
                ExceptionType = exception.GetType().Name,
                Message = exception.Message,
                // Don't expose sensitive information in production
                Source = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
                    ? exception.Source
                    : null
            };
        }
    }

    public class ErrorResponse
    {
        public bool Success { get; set; }
        public string ErrorId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string Path { get; set; }
        public string Method { get; set; }
        public object Details { get; set; }
        public string StackTrace { get; set; }
        public string InnerException { get; set; }
    }

    // Extension method to add the middleware
    public static class GlobalExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GlobalExceptionHandlerMiddleware>();
        }
    }
}
