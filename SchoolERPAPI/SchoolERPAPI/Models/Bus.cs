namespace SchoolERP.API.Models
{
    public class Bus
    {
        public int Id { get; set; }
        public string RegistrationNumber { get; set; }
        public string BusType { get; set; }
        public int Capacity { get; set; }
        public string DriverName { get; set; }
        public string DriverContact { get; set; }
        public bool IsActive { get; set; } = true;
    }
}