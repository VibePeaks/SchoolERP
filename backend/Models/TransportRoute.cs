namespace SchoolERP.API.Models
{
    public class TransportRoute
    {
        public int Id { get; set; }
        public string RouteName { get; set; }
        public string StartPoint { get; set; }
        public string EndPoint { get; set; }
        public string Stops { get; set; } // JSON array of stops
        public int BusId { get; set; }
        public decimal MonthlyFee { get; set; }
        public bool IsActive { get; set; } = true;
    }
}