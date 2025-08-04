namespace SchoolERP.API.Models
{
    public class HostelMaintenance
    {
        public int Id { get; set; }
        public int HostelId { get; set; }
        public string IssueType { get; set; }
        public string Description { get; set; }
        public DateTime ReportedDate { get; set; }
        public DateTime? ResolvedDate { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed
    }
}