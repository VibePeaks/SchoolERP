using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
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
}
