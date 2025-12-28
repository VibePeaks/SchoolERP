using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("Notices")]
    public class Notice : BaseEntity
    {
        [Required]
        [StringLength(300)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; }

        [Required]
        [StringLength(50)]
        public string NoticeType { get; set; } = "general"; // general, academic, event, emergency

        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = "normal"; // low, normal, high, urgent

        [StringLength(50)]
        public string TargetAudience { get; set; } = "all"; // all, students, parents, teachers, staff

        public int? BranchId { get; set; }

        [StringLength(50)]
        public string Class { get; set; } // NULL for all classes

        [Required]
        public int PostedBy { get; set; }

        [Required]
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ExpiryDate { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        [StringLength(1000)]
        public string AttachmentUrls { get; set; } // JSON array

        // Navigation properties
        [ForeignKey("BranchId")]
        public virtual Branch Branch { get; set; }

        [ForeignKey("PostedBy")]
        public virtual User PostedByUser { get; set; }
    }
}
