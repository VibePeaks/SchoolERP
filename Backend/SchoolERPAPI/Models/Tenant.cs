using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class Tenant
    {
        public int Id { get; set; }
        public string TenantCode { get; set; } // Unique identifier
        public string Name { get; set; }
        public string? Domain { get; set; } // Custom domain
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public string SubscriptionPlan { get; set; } = "basic"; // Institution-wide plan
        public int MaxUsers { get; set; } = 100;
        public int MaxStorageGB { get; set; } = 10;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? SubscriptionEndDate { get; set; }

        // Navigation properties
        [JsonIgnore]
        public ICollection<User> Users { get; set; }
        [JsonIgnore]
        public ICollection<TenantSetting> Settings { get; set; }
        [JsonIgnore]
        public ICollection<TenantUsage> UsageMetrics { get; set; }
        [JsonIgnore]
        public ICollection<Branch> Branches { get; set; }
    }
}
