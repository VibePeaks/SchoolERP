using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class StudentParent : BaseEntity
    {
        public int StudentId { get; set; }
        public int ParentId { get; set; }
        public string RelationshipType { get; set; } = "Parent"; // Mother, Father, Guardian
        public bool IsPrimaryContact { get; set; } = true;
        public bool CanPickup { get; set; } = true;
        public bool EmergencyContact { get; set; } = true;

        // Navigation properties
        [JsonIgnore]
        public Student Student { get; set; }
        [JsonIgnore]
        public Parent Parent { get; set; }
        [JsonIgnore]
        public Tenant Tenant { get; set; }
    }
}
