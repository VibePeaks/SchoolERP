using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("RoomAllocations")]
    public class RoomAllocation : BaseEntity
    {
        [Required]
        public int StudentId { get; set; }

        [Required]
        public int HostelId { get; set; }

        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        public DateTime? CheckOutDate { get; set; }

        public decimal MonthlyRent { get; set; }

        public decimal SecurityDeposit { get; set; }

        [StringLength(1000)]
        public string Facilities { get; set; } // JSON array

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; }

        [ForeignKey("HostelId")]
        public virtual Hostel Hostel { get; set; }
    }
}
