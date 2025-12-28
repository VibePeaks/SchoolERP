using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("ExamResults")]
    public class ExamResult : BaseEntity
    {
        [Required]
        public int ExamId { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public decimal MarksObtained { get; set; }

        public decimal TotalMarks { get; set; }

        public decimal Percentage { get; set; }

        [StringLength(10)]
        public string Grade { get; set; } // A, B+, B, C+, C, D, F

        [StringLength(500)]
        public string Remarks { get; set; }

        public DateTime? GradedDate { get; set; }

        public int? GradedBy { get; set; } // Teacher ID

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Graded, Published

        // Navigation properties
        [ForeignKey("ExamId")]
        public virtual Exam Exam { get; set; }

        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; }

        [ForeignKey("GradedBy")]
        public virtual User GradedByUser { get; set; }
    }
}
