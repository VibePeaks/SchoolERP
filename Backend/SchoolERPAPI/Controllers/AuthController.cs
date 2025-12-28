using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SchoolERP.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace SchoolERP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // =====================================================
        // SIMPLIFIED SCHOOL SIGNUP (One School = One Tenant)
        // =====================================================

        [HttpPost("signup")]
        [AllowAnonymous]
        public async Task<IActionResult> SimplifiedSignup([FromBody] SignupRequest request)
        {
            // 1. Generate unique tenant code from school name
            var tenantCode = GenerateTenantCode(request.SchoolName);

            // Check if tenant code already exists
            if (await _context.Tenants.AnyAsync(t => t.TenantCode == tenantCode))
            {
                return BadRequest(new { message = "School name already exists. Please choose a different name." });
            }

            // 2. Create tenant (school)
            var tenant = new Tenant
            {
                Name = request.SchoolName,
                TenantCode = tenantCode,
                IsActive = true,
                SubscriptionPlan = request.SelectedPlan ?? "basic",
                MaxUsers = 100, // Default limits
                MaxBranches = 1
            };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            // 3. Create admin user for this school
            var adminUser = new User
            {
                TenantId = tenant.Id,
                FirstName = request.AdminFirstName,
                LastName = request.AdminLastName,
                Email = request.AdminEmail,
                Username = request.AdminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.AdminPassword),
                Role = "admin",
                IsActive = true
            };
            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            // 4. Return success with school info
            return Ok(new
            {
                success = true,
                message = "School created successfully!",
                school = new
                {
                    tenant.Id,
                    tenant.Name,
                    tenant.TenantCode,
                    loginUrl = $"{tenant.TenantCode}.yourapp.com/login"
                },
                admin = new
                {
                    adminUser.Email,
                    adminUser.FirstName,
                    adminUser.LastName
                }
            });
        }

        // =====================================================
        // SIMPLIFIED LOGIN (Role-based within tenant)
        // =====================================================

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Get current tenant from subdomain (simplified approach)
            var currentTenantId = GetCurrentTenantId();

            // Find user within this tenant
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.TenantId == currentTenantId);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new { message = "Account is deactivated" });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Update last login
            user.LastLoginDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new LoginResponse
            {
                Token = token,
                RefreshToken = GenerateRefreshToken(),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    TenantId = user.TenantId,
                    BranchId = user.BranchId
                }
            });
        }

        // =====================================================
        // PARENT LOGIN (Separate from school staff)
        // =====================================================

        [HttpPost("parent/login")]
        [AllowAnonymous]
        public async Task<IActionResult> ParentLogin([FromBody] ParentLoginRequest request)
        {
            // Get current tenant (school) context
            var currentTenantId = GetCurrentTenantId();

            // Find parent within this school
            var parent = await _context.Parents
                .FirstOrDefaultAsync(p => p.Email == request.Email && p.TenantId == currentTenantId);

            if (parent == null || !BCrypt.Net.BCrypt.Verify(request.Password, parent.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            if (!parent.IsActive)
            {
                return Unauthorized(new { message = "Account is deactivated" });
            }

            // Generate JWT token for parent
            var token = GenerateParentJwtToken(parent);

            // Update last login
            parent.LastLoginDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ParentLoginResponse
            {
                Token = token,
                RefreshToken = GenerateRefreshToken(),
                User = new ParentUserDto
                {
                    Id = parent.Id,
                    Email = parent.Email,
                    FirstName = parent.FirstName,
                    LastName = parent.LastName,
                    Role = "parent",
                    TenantId = parent.TenantId
                }
            });
        }

        // =====================================================
        // HELPER METHODS
        // =====================================================

        private string GenerateTenantCode(string schoolName)
        {
            // Convert school name to URL-friendly code
            var code = schoolName.ToLower()
                .Replace(" ", "")
                .Replace("-", "")
                .Replace("_", "")
                .Replace(".", "");

            // Ensure uniqueness by adding numbers if needed
            var baseCode = code;
            var counter = 1;

            while (_context.Tenants.Any(t => t.TenantCode == code))
            {
                code = $"{baseCode}{counter}";
                counter++;
            }

            return code;
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("tenant_id", user.TenantId.ToString()),
                new Claim("user_type", "staff") // admin, teacher, staff
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateParentJwtToken(Parent parent)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, parent.Id.ToString()),
                new Claim(ClaimTypes.Role, "parent"),
                new Claim("user_id", parent.Id.ToString()), // Parent ID for parent-specific endpoints
                new Claim("tenant_id", parent.TenantId.ToString()),
                new Claim("user_type", "parent")
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString();
        }

        private int GetCurrentTenantId()
        {
            // In production, this would get tenant from subdomain
            // For now, return default tenant (1)
            return 1;
        }
    }
}
