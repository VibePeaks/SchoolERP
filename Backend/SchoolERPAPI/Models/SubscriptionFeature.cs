namespace SchoolERP.API.Models
{
    public class SubscriptionFeature
    {
        public int Id { get; set; }
        public string FeatureName { get; set; } // 'hms', 'elearning', 'library', etc.
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string RequiredPlan { get; set; } // 'basic', 'premium', 'enterprise'
        public bool IsActive { get; set; } = true;
    }
}
