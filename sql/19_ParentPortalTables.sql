USE SchoolERP;
GO

-- Create ParentMessages table
CREATE TABLE ParentMessages (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    ParentName NVARCHAR(100) NOT NULL,
    ParentEmail NVARCHAR(100) NOT NULL,
    Subject NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    SentDate DATETIME NOT NULL,
    IsRead BIT DEFAULT 0,
    Response NVARCHAR(MAX),
    ResponseDate DATETIME,
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
GO

-- Create stored procedure for unread messages
CREATE PROCEDURE sp_GetUnreadParentMessages
AS
BEGIN
    SELECT * FROM ParentMessages
    WHERE IsRead = 0
    ORDER BY SentDate DESC;
END;
GO