using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class Teacher : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmployeeId { get; set; } // Unique within tenant
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }

        // Branch assignment
        public int BranchId { get; set; }
        public Branch Branch { get; set; }

        // Employment info
        public string Qualification { get; set; }
        public string Specialization { get; set; }
        public DateTime JoinDate { get; set; }
        public decimal Salary { get; set; }
        public TeacherStatus Status { get; set; } = TeacherStatus.Active;

        // Subjects taught
        public string Subjects { get; set; } // Comma-separated or JSON

        // Class assignments
        public int? ClassId { get; set; }
        public Class Class { get; set; }

        // Navigation properties
        [JsonIgnore]
        public ICollection<Class> ClassesTaught { get; set; }

        [JsonIgnore]
        public ICollection<Exam> ExamsCreated { get; set; }

        [JsonIgnore]
        public ICollection<AttendanceRecord> AttendanceRecords { get; set; }

        [JsonIgnore]
        public ICollection<PayrollRecord> PayrollRecords { get; set; }
    }

    public enum TeacherStatus
    {
        Active,
        Inactive,
        OnLeave,
        Retired,
        Terminated
    }
}
