using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("StudentModeAudit")]
    public class StudentModeAudit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int ParentId { get; set; }

        [Required]
        public int TenantId { get; set; }

        [Required]
        [StringLength(50)]
        public string ActionType { get; set; } // 'LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'LOGOUT', 'PASSKEY_CHANGE'

        [Required]
        public bool Success { get; set; }

        [StringLength(50)]
        public string IpAddress { get; set; }

        [StringLength(500)]
        public string UserAgent { get; set; }

        [StringLength(200)]
        public string DeviceInfo { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; }

        [ForeignKey("ParentId")]
        public virtual Parent Parent { get; set; }

        [ForeignKey("TenantId")]
        public virtual Tenant Tenant { get; set; }
    }
}
