using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("InventoryItems")]
    public class InventoryItem : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [Required]
        public int Quantity { get; set; } = 0;

        public int MinQuantity { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = "pieces"; // pieces, kg, liters, etc.

        public decimal? UnitPrice { get; set; }

        [StringLength(200)]
        public string Location { get; set; }

        [StringLength(200)]
        public string Supplier { get; set; }

        public DateTime? LastRestocked { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
    }
}
