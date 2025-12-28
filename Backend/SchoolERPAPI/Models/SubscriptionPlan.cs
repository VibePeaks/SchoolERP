using System.Text.Json;

namespace SchoolERP.API.Models
{
    public class SubscriptionPlan
    {
        public int Id { get; set; }
        public string PlanName { get; set; } // 'basic', 'premium', 'enterprise'
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string BillingCycle { get; set; } // 'monthly', 'yearly'
        public string Features { get; set; } // JSON array
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Helper property to deserialize features
        public List<string> FeatureList => JsonSerializer.Deserialize<List<string>>(Features ?? "[]");
    }
}
