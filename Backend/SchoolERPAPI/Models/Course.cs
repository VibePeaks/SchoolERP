using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("Courses")]
    public class Course : BaseEntity
    {
        [Required]
        [StringLength(300)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Subject { get; set; }

        [StringLength(50)]
        public string Grade { get; set; }

        [Required]
        public int InstructorId { get; set; }

        public int? Duration { get; set; } // in hours

        [Required]
        public bool IsPublished { get; set; } = false;

        // Navigation properties
        [ForeignKey("InstructorId")]
        public virtual User Instructor { get; set; }

        public virtual ICollection<CourseMaterial> CourseMaterials { get; set; }
    }
}
