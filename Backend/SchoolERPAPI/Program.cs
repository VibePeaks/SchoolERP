using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SchoolERP.API.Data;
using SchoolERP.API.Hubs;
using SchoolERP.API.Middleware;
using SchoolERP.API.Services;
using SchoolERPAPI.Middleware;
using SchoolERPAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => {
            sqlServerOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }));

// Add background services
builder.Services.AddHostedService<ScheduledTasksService>();
builder.Services.AddHostedService(provider =>
    new BackupService(provider, builder.Configuration["Backup:Path"]));

// Add subscription services
builder.Services.AddScoped<StripePaymentService>();

// Add database service for error handling and transactions
builder.Services.AddScoped<IDatabaseService, DatabaseService>();

// Add SignalR for real-time features
builder.Services.AddSignalR();

// Add AI Analytics Service
builder.Services.AddScoped<AIAnalyticsService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "School ERP API", 
        Version = "v1",
        Description = "Comprehensive API for School Management System",
        Contact = new OpenApiContact {
            Name = "Support",
            Email = "support@schoolexample.com"
        }
    });
    
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        { 
            new OpenApiSecurityScheme 
            { 
                Reference = new OpenApiReference 
                { 
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "School ERP API v1");
        c.RoutePrefix = "api-docs";
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Global exception handling middleware (must be first)
app.UseGlobalExceptionHandler();

app.UseMiddleware<TenantMiddleware>(); // Multi-tenant middleware
app.UseMiddleware<AuditLogMiddleware>();
app.MapControllers();
app.MapHub<SubscriptionHub>("/hubs/subscription"); // SignalR hub for real-time features

// Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy" }));

// Add database connection test endpoint
app.MapGet("/api/test-db", async (AppDbContext db) =>
{
    try
    {
        var tenants = await db.Tenants.CountAsync();
        return Results.Ok(new
        {
            status = "Connected",
            tenantCount = tenants,
            server = "Azure SQL Database",
            tier = "Free"
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
