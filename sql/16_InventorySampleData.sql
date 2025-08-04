USE SchoolERP;
GO

-- Insert sample inventory items
INSERT INTO InventoryItems (Name, Category, Quantity, UnitPrice, Location, Supplier, PurchaseDate, Status, Notes)
VALUES
('Projector', 'Equipment', 5, 25000.00, 'Room 101', 'Tech Suppliers Inc.', '2023-01-15', 'New', 'HD Projectors'),
('Whiteboard', 'Furniture', 12, 5000.00, 'Various Classrooms', 'Office Supplies Co.', '2023-02-20', 'New', NULL),
('Notebooks', 'Supplies', 200, 50.00, 'Storage Room', 'Paper Products Ltd.', '2023-08-10', 'New', 'A4 size'),
('Chairs', 'Furniture', 50, 1200.00, 'Storage Room', 'Furniture World', '2023-05-05', 'New', 'Student chairs'),
('Science Kit', 'Equipment', 8, 8000.00, 'Lab 2', 'Science Supplies', '2023-03-18', 'New', 'Grade 9-10');
GO

-- Check low inventory items
EXEC sp_CheckInventoryLevels @Threshold = 10;
GO