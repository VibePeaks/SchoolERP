using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolERP.API.Models
{
    [Table("Rewards")]
    public class Reward : BaseEntity
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(100)]
        public string Icon { get; set; }

        [Required]
        public int PointsRequired { get; set; }

        [Required]
        [StringLength(50)]
        public string RewardType { get; set; } = "badge"; // badge, certificate, privilege

        [Required]
        public bool IsActive { get; set; } = true;

        // Navigation properties (for future student achievements)
        // public virtual ICollection<StudentAchievement> StudentAchievements { get; set; }
    }
}
