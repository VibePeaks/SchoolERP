namespace SchoolERP.API.Models
{
    public class Hostel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public string WardenName { get; set; }
        public string ContactNumber { get; set; }
        public bool IsActive { get; set; } = true;
    }
}