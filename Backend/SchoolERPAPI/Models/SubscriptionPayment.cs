namespace SchoolERP.API.Models
{
    public class SubscriptionPayment
    {
        public int Id { get; set; }
        public int UserSubscriptionId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string PaymentMethod { get; set; }
        public string PaymentReference { get; set; }
        public string Status { get; set; } // 'completed', 'failed', 'pending', 'refunded'
        public string? FailureReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public UserSubscription UserSubscription { get; set; }
    }
}
