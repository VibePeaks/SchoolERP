using System;
using System.Collections.Generic;

namespace SchoolERP.API.Models
{
    public class StudentFee : BaseEntity
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int? FeeStructureId { get; set; }
        public string FeeType { get; set; } // "tuition", "transport", "exam", "hostel", etc.
        public decimal Amount { get; set; }
        public decimal PaidAmount { get; set; } = 0;
        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string Status { get; set; } = "pending"; // "pending", "paid", "overdue", "partial"
        public string Description { get; set; }
        public string AcademicYear { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual Student Student { get; set; }
        public virtual FeeStructure FeeStructure { get; set; }
        public virtual ICollection<FeePayment> Payments { get; set; }
    }
}
