using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class Parent : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        // Relationship to students
        public string RelationshipType { get; set; } // Mother, Father, Guardian, etc.

        // Login credentials (inherited from User, but parents have separate accounts)
        public string Username { get; set; }
        public string PasswordHash { get; set; }

        // Status
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginDate { get; set; }

        // Navigation properties
        [JsonIgnore]
        public ICollection<StudentParent> StudentParents { get; set; }

        [JsonIgnore]
        public ICollection<ParentMessage> SentMessages { get; set; }

        [JsonIgnore]
        public ICollection<ParentNotification> Notifications { get; set; }
    }
}
