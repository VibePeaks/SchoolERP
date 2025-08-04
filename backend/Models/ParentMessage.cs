namespace SchoolERP.API.Models
{
    public class ParentMessage
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string ParentName { get; set; }
        public string ParentEmail { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public DateTime SentDate { get; set; }
        public bool IsRead { get; set; }
        public string Response { get; set; }
        public DateTime? ResponseDate { get; set; }
    }
}