USE SchoolERP;
GO

-- Create InventoryItems table
CREATE TABLE InventoryItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(10,2),
    Location NVARCHAR(100),
    Supplier NVARCHAR(100),
    PurchaseDate DATE,
    Status NVARCHAR(50),
    Notes NVARCHAR(500)
);
GO

-- Create stored procedure for inventory check
CREATE PROCEDURE sp_CheckInventoryLevels
    @Threshold INT = 5
AS
BEGIN
    SELECT Name, Quantity, Location
    FROM InventoryItems
    WHERE Quantity <= @Threshold
    ORDER BY Quantity ASC;
END;
GO