using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("Hostels")]
    public class Hostel : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        public int? WardenId { get; set; }

        [Required]
        public int TotalRooms { get; set; }

        public int OccupiedRooms { get; set; } = 0;

        [StringLength(1000)]
        public string Facilities { get; set; } // JSON array

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties
        [ForeignKey("WardenId")]
        public virtual User Warden { get; set; }

        public virtual ICollection<RoomAllocation> RoomAllocations { get; set; }

        public virtual ICollection<HostelMaintenance> MaintenanceRecords { get; set; }
    }
}
