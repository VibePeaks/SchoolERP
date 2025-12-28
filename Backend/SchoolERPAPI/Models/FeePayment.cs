using System;

namespace SchoolERP.API.Models
{
    public class FeePayment : BaseEntity
    {
        public int Id { get; set; }
        public int StudentFeeId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } // "cash", "card", "online", "bank_transfer"
        public string TransactionId { get; set; }
        public string PaymentReference { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Remarks { get; set; }
        public string Status { get; set; } = "completed"; // "pending", "completed", "failed", "refunded"

        // Navigation properties
        public virtual StudentFee StudentFee { get; set; }
    }
}
