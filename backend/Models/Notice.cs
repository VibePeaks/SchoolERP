namespace SchoolERP.API.Models
{
    public class Notice
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; } // General, Academic, Event, etc.
        public DateTime PostDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string PostedBy { get; set; } // User who posted the notice
        public bool IsImportant { get; set; }
    }
}