using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class Student : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StudentId { get; set; } // Unique within tenant
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }

        // Branch assignment
        public int BranchId { get; set; }
        public Branch Branch { get; set; }

        // Optional: For students who can attend multiple branches
        public int? HomeBranchId { get; set; }
        public Branch HomeBranch { get; set; }

        // Academic info
        public int? ClassId { get; set; }
        public Class Class { get; set; }
        public string RollNumber { get; set; }
        public DateTime AdmissionDate { get; set; }
        public StudentStatus Status { get; set; } = StudentStatus.Active;

        // Parent/Guardian info
        public string ParentName { get; set; }
        public string ParentPhone { get; set; }
        public string ParentEmail { get; set; }

        // Financial info
        public string FeeStatus { get; set; } // Paid, Pending, Overdue

        // Academic performance
        public decimal? AttendancePercentage { get; set; }
        public decimal? GPA { get; set; }

        // Navigation properties
        [JsonIgnore]
        public ICollection<StudentParent> StudentParents { get; set; }

        [JsonIgnore]
        public ICollection<ExamResult> ExamResults { get; set; }

        [JsonIgnore]
        public ICollection<StudentFee> Fees { get; set; }

        [JsonIgnore]
        public ICollection<AttendanceRecord> AttendanceRecords { get; set; }

        [JsonIgnore]
        public ICollection<AssignmentSubmission> AssignmentSubmissions { get; set; }

        [JsonIgnore]
        public ICollection<StudentProgressReport> ProgressReports { get; set; }
    }

    public enum StudentStatus
    {
        Active,
        Inactive,
        Graduated,
        Transferred,
        Suspended,
        Expelled
    }
}
