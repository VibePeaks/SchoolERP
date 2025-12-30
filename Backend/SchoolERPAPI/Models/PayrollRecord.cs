using System.Text.Json.Serialization;

namespace SchoolERP.API.Models
{
    public class PayrollRecord : BaseEntity
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; } // Teacher or staff ID
        public string EmployeeType { get; set; } // Teacher, Staff, etc.
        public decimal BasicSalary { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; }
        public string Remarks { get; set; }

        // Navigation properties
        [JsonIgnore]
        public User Employee { get; set; }
    }
}
