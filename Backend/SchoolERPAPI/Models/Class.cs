using System.Collections.Generic;

namespace SchoolERP.API.Models
{
    public class Class : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Section { get; set; }
        public string Subject { get; set; }
        public int AcademicYear { get; set; }
        public int? ClassTeacherId { get; set; } // Foreign key to Teacher
        public int RoomNumber { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Teacher ClassTeacher { get; set; }
        public virtual ICollection<Student> Students { get; set; }
        public virtual ICollection<AttendanceRecord> AttendanceRecords { get; set; }
        public virtual ICollection<Grade> Grades { get; set; }
        public virtual ICollection<FeeStructure> FeeStructures { get; set; }
    }
}
