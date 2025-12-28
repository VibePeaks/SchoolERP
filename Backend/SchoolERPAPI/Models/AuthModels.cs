using System.ComponentModel.DataAnnotations;

namespace SchoolERP.API.Models
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public int TenantId { get; set; }
        public int? BranchId { get; set; }
    }

    public class ParentLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        // Tenant is determined by subdomain/context, not user input
    }

    public class ParentLoginResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public ParentUserDto User { get; set; }
    }

    public class ParentUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public int TenantId { get; set; }
    }

    public class SignupRequest
    {
        [Required]
        public string SchoolName { get; set; }

        [Required]
        public string SchoolType { get; set; }

        [Required]
        public string AdminFirstName { get; set; }

        [Required]
        public string AdminLastName { get; set; }

        [Required]
        [EmailAddress]
        public string AdminEmail { get; set; }

        [Required]
        public string AdminPassword { get; set; }

        [Required]
        public string SelectedPlan { get; set; }

        public string BillingCycle { get; set; } = "monthly";

        // Address fields
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; } = "United States";
        public string Phone { get; set; }

        // Payment fields
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string Cvv { get; set; }
        public string CardName { get; set; }

        // Agreements
        public bool AgreeTerms { get; set; }
        public bool AgreePrivacy { get; set; }
        public bool SubscribeNewsletter { get; set; } = true;
    }
}
