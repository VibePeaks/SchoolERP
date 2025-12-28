using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("Books")]
    public class Book : BaseEntity
    {
        [Required]
        [StringLength(300)]
        public string Title { get; set; }

        [Required]
        [StringLength(200)]
        public string Author { get; set; }

        [StringLength(20)]
        public string ISBN { get; set; }

        [StringLength(200)]
        public string Publisher { get; set; }

        public int? PublicationYear { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [Required]
        public int TotalCopies { get; set; } = 1;

        [Required]
        public int AvailableCopies { get; set; } = 1;

        [StringLength(200)]
        public string Location { get; set; } // Shelf location

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties (for future book lending system)
        // public virtual ICollection<BookLending> BookLendings { get; set; }
    }
}
