using System.Collections.Generic;

namespace SchoolERP.API.Models
{
    public class FeeStructure : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string FeeType { get; set; } // "tuition", "transport", "exam", "hostel", etc.
        public decimal Amount { get; set; }
        public string Frequency { get; set; } // "monthly", "quarterly", "yearly", "one-time"
        public string AcademicYear { get; set; }
        public int? ClassId { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Class Class { get; set; }
        public virtual ICollection<StudentFee> StudentFees { get; set; }
    }
}
