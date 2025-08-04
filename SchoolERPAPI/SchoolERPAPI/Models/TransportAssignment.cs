namespace SchoolERP.API.Models
{
    public class TransportAssignment
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int RouteId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}