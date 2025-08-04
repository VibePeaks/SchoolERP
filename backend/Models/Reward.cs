namespace SchoolERP.API.Models
{
    public class Reward
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int PointsRequired { get; set; }
        public string BadgeImage { get; set; }
        public bool IsActive { get; set; } = true;
    }
}