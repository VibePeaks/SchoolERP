namespace SchoolERP.API.Models
{
    public class AttendanceRecord
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } // Present, Absent, Late, etc.
        public string? Subject { get; set; }
        public string? Remarks { get; set; }
        public int? MarkedBy { get; set; } // Teacher ID who marked attendance

        // Navigation properties
        public virtual Student Student { get; set; }
        public virtual Class Class { get; set; }
    }
}
