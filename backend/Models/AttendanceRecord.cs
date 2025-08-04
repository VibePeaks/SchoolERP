namespace SchoolERP.API.Models
{
    public class AttendanceRecord
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int ClassId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } // Present, Absent, Late, etc.
        public string? Remarks { get; set; }
    }
}