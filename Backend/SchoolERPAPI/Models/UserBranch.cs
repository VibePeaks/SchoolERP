using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class UserBranch
    {
        public int UserId { get; set; }
        public int BranchId { get; set; }
        public int TenantId { get; set; } // For composite key and tenant isolation
        public UserRoleInBranch Role { get; set; } = UserRoleInBranch.Staff;
        public bool IsPrimary { get; set; } = true; // User's main branch
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public User User { get; set; }

        [JsonIgnore]
        public Branch Branch { get; set; }

        [JsonIgnore]
        public Tenant Tenant { get; set; }
    }

    public enum UserRoleInBranch
    {
        SuperAdmin,     // Can access all branches
        BranchAdmin,    // Admin of specific branch
        Principal,      // School principal
        VicePrincipal,  // Vice principal
        Teacher,        // Regular teacher
        Staff,          // Support staff
        Student,        // Student access
        Parent          // Parent access
    }
}
