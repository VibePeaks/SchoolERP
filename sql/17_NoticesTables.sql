USE SchoolERP;
GO

-- Create Notices table
CREATE TABLE Notices (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    PostDate DATETIME NOT NULL,
    ExpiryDate DATETIME,
    PostedBy NVARCHAR(100) NOT NULL,
    IsImportant BIT DEFAULT 0
);
GO

-- Create stored procedure for active notices
CREATE PROCEDURE sp_GetActiveNotices
AS
BEGIN
    SELECT * FROM Notices
    WHERE ExpiryDate IS NULL OR ExpiryDate >= GETDATE()
    ORDER BY IsImportant DESC, PostDate DESC;
END;
GO