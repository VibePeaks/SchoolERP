namespace SchoolERP.API.Models
{
    public class RoomAllocation
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int HostelId { get; set; }
        public string RoomNumber { get; set; }
        public DateTime AllocationDate { get; set; }
        public DateTime? VacateDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}