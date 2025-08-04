namespace SchoolERP.API.Models
{
    public class InventoryItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; } // Equipment, Furniture, Supplies, etc.
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string Location { get; set; }
        public string Supplier { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string Status { get; set; } // New, Used, Damaged, etc.
        public string Notes { get; set; }
    }
}