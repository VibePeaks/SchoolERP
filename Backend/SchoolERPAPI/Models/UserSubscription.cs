using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class UserSubscription
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SubscriptionPlanId { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = "active"; // 'active', 'expired', 'cancelled', 'pending'
        public bool AutoRenew { get; set; } = true;
        public string? PaymentMethod { get; set; }
        public string? PaymentReference { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public DateTime? NextPaymentDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public User User { get; set; }
        public SubscriptionPlan SubscriptionPlan { get; set; }
        public ICollection<SubscriptionPayment> Payments { get; set; }
    }
}
