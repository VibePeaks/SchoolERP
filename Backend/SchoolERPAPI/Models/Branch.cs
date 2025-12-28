using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class Branch : BaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; } // Unique within tenant (MAIN, NORTH, SOUTH)
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public BranchType Type { get; set; } = BranchType.Satellite;
        public bool IsActive { get; set; } = true;
        public string Description { get; set; }

        // Navigation properties
        [JsonIgnore]
        public Tenant Tenant { get; set; }

        [JsonIgnore]
        public ICollection<Student> Students { get; set; }

        [JsonIgnore]
        public ICollection<Teacher> Teachers { get; set; }

        [JsonIgnore]
        public ICollection<Class> Classes { get; set; }

        [JsonIgnore]
        public ICollection<UserBranch> UserBranches { get; set; }
    }

    public enum BranchType
    {
        Main,       // Headquarters/Main campus
        Satellite,  // Branch campus
        Campus,     // University campus
        Extension,  // Study center/extension
        Online      // Virtual/online branch
    }
}
