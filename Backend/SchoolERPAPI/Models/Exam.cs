using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("Exams")]
    public class Exam : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public int ClassId { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int TeacherId { get; set; }

        [Required]
        public DateTime ExamDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public int TotalMarks { get; set; }

        [Required]
        [StringLength(50)]
        public string ExamType { get; set; } // "Mid-term", "Final", "Quiz", "Assignment"

        [StringLength(50)]
        public string Status { get; set; } = "Scheduled"; // "Scheduled", "InProgress", "Completed", "Cancelled"

        [StringLength(500)]
        public string Instructions { get; set; }

        public decimal PassingMarks { get; set; }

        // Navigation properties
        [ForeignKey("ClassId")]
        public virtual Class Class { get; set; }

        [ForeignKey("SubjectId")]
        public virtual Subject Subject { get; set; }

        [ForeignKey("TeacherId")]
        public virtual User Teacher { get; set; }

        public virtual ICollection<ExamResult> ExamResults { get; set; }
    }
}
