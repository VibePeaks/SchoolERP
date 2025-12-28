using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("HostelMaintenances")]
    public class HostelMaintenance : BaseEntity
    {
        [Required]
        public int HostelId { get; set; }

        [StringLength(20)]
        public string RoomNumber { get; set; }

        [Required]
        [StringLength(1000)]
        public string Issue { get; set; }

        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = "medium"; // low, medium, high, urgent

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "reported"; // reported, in_progress, resolved, cancelled

        [Required]
        public int ReportedBy { get; set; }

        [Required]
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;

        public int? AssignedTo { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public decimal? Cost { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        // Navigation properties
        [ForeignKey("HostelId")]
        public virtual Hostel Hostel { get; set; }

        [ForeignKey("ReportedBy")]
        public virtual User ReportedByUser { get; set; }

        [ForeignKey("AssignedTo")]
        public virtual User AssignedToUser { get; set; }
    }
}
