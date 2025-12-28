using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("CourseMaterials")]
    public class CourseMaterial : BaseEntity
    {
        [Required]
        public int CourseId { get; set; }

        [Required]
        [StringLength(300)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        [StringLength(50)]
        public string MaterialType { get; set; } = "document"; // document, video, quiz, assignment

        [StringLength(500)]
        public string ContentUrl { get; set; }

        [StringLength(2000)]
        public string ContentText { get; set; }

        public int OrderIndex { get; set; } = 0;

        [Required]
        public bool IsRequired { get; set; } = true;

        // Navigation properties
        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; }
    }
}
