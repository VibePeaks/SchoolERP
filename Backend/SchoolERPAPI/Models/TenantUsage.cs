namespace SchoolERP.API.Models
{
    public class TenantUsage
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string Metric { get; set; } // 'storage_used_gb', 'users_active', 'api_calls', 'files_uploaded', etc.
        public decimal Value { get; set; }
        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Tenant Tenant { get; set; }
    }
}
