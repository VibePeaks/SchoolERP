using System;

namespace SchoolERP.API.Models
{
    public class Grade : BaseEntity
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public int ClassId { get; set; }
        public int TeacherId { get; set; }
        public string ExamType { get; set; } // "midterm", "final", "assignment", "quiz"
        public int MarksObtained { get; set; }
        public int TotalMarks { get; set; }
        public string GradeLetter { get; set; } // "A+", "A", "B+", "B", "C+", "C", "D", "F"
        public decimal Percentage { get; set; }
        public string Remarks { get; set; }
        public DateTime ExamDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual Student Student { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual Class Class { get; set; }
        public virtual Teacher Teacher { get; set; }
    }
}
