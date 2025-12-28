using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public int TenantId { get; set; } = 1; // Multi-tenant support

        // Subscription properties
        public string SubscriptionPlan { get; set; } = "basic"; // Will be populated from UserSubscription
        public DateTime? SubscriptionEndDate { get; set; }
        public string SubscriptionStatus { get; set; } = "active";

        // Navigation properties
        [JsonIgnore]
        public UserSubscription CurrentSubscription { get; set; }
        [JsonIgnore]
        public Tenant Tenant { get; set; }
        [JsonIgnore]
        public ICollection<UserBranch> UserBranches { get; set; }
    }
}
