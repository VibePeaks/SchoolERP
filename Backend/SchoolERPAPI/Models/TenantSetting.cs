namespace SchoolERP.API.Models
{
    public class TenantSetting
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public string SettingKey { get; set; } // e.g., 'theme_color', 'features_enabled'
        public string SettingValue { get; set; } // JSON string for complex values
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Tenant Tenant { get; set; }
    }
}
