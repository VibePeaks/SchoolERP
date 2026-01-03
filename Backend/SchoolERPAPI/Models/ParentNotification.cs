using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
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
