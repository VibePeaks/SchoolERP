using System.Collections.Generic;

namespace SchoolERP.API.Models
{
    public class Subject : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int Credits { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Grade> Grades { get; set; }
        public virtual ICollection<Teacher> Teachers { get; set; }
    }
}
