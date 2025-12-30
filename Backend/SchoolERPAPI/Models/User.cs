using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; } = "teacher"; // admin, teacher, staff
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginDate { get; set; }
        public int? BranchId { get; set; }
        public string ProfilePicture { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        // Subscription properties (computed)
        public string SubscriptionPlan { get; set; } = "basic"; // Will be populated from UserSubscription
        public DateTime? SubscriptionEndDate { get; set; }
        public string SubscriptionStatus { get; set; } = "active";

        // Navigation properties
        [JsonIgnore]
        public UserSubscription CurrentSubscription { get; set; }
        [JsonIgnore]
        public Tenant Tenant { get; set; }
        [JsonIgnore]
        public Branch Branch { get; set; }
        [JsonIgnore]
        public ICollection<UserBranch> UserBranches { get; set; }
        [JsonIgnore]
        public ICollection<Teacher> TeacherProfiles { get; set; }
        [JsonIgnore]
        public ICollection<AuditLog> AuditLogs { get; set; }
        [JsonIgnore]
        public ICollection<PayrollRecord> PayrollRecords { get; set; }
    }
}
