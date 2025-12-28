using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("AuditLogs")]
    public class AuditLog : BaseEntityWithoutTenant
    {
        [Required]
        public int? UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; }

        [Required]
        [StringLength(100)]
        public string EntityType { get; set; }

        public int? EntityId { get; set; }

        [StringLength(1000)]
        public string OldValues { get; set; }

        [StringLength(1000)]
        public string NewValues { get; set; }

        [StringLength(45)]
        public string IpAddress { get; set; }

        [StringLength(500)]
        public string UserAgent { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
