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

    public class StudentParent
    {
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public int TenantId { get; set; }
        public bool IsPrimaryContact { get; set; } = false;
        public bool CanPickup { get; set; } = true;
        public bool EmergencyContact { get; set; } = true;
        public DateTime LinkedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public Student Student { get; set; }

        [JsonIgnore]
        public Parent Parent { get; set; }

        [JsonIgnore]
        public Tenant Tenant { get; set; }
    }

    public class ParentMessage : BaseEntity
    {
        public int SenderId { get; set; } // Parent ID
        public int ReceiverId { get; set; } // Teacher ID
        public int StudentId { get; set; } // Related student
        public string Subject { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime SentDate { get; set; } = DateTime.UtcNow;
        public string MessageType { get; set; } // Inquiry, Concern, Praise, etc.

        // Navigation properties
        [JsonIgnore]
        public Parent Sender { get; set; }

        [JsonIgnore]
        public Teacher Receiver { get; set; }

        [JsonIgnore]
        public Student Student { get; set; }
    }

    public class ParentNotification : BaseEntity
    {
        public int ParentId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string NotificationType { get; set; } // Grade, Attendance, Fee, Announcement
        public bool IsRead { get; set; } = false;
        public DateTime SentDate { get; set; } = DateTime.UtcNow;
        public int? RelatedStudentId { get; set; }

        // Navigation properties
        [JsonIgnore]
        public Parent Parent { get; set; }

        [JsonIgnore]
        public Student RelatedStudent { get; set; }
    }
}
