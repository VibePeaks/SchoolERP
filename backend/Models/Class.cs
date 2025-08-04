namespace SchoolERP.API.Models
{
    public class Class
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Section { get; set; }
        public int AcademicYear { get; set; }
        public int? ClassTeacherId { get; set; } // Foreign key to Teacher
        public int RoomNumber { get; set; }
        public bool IsActive { get; set; } = true;
    }
}