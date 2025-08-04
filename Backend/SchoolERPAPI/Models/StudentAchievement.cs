namespace SchoolERP.API.Models
{
    public class StudentAchievement
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int RewardId { get; set; }
        public DateTime AwardDate { get; set; }
        public string Notes { get; set; }
        public Reward Reward { get; set; }
    }
}