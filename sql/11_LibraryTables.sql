USE SchoolERP;
GO

-- Create Books table
CREATE TABLE Books (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    Author NVARCHAR(100) NOT NULL,
    ISBN NVARCHAR(20) NOT NULL UNIQUE,
    Publisher NVARCHAR(100),
    PublicationYear INT NOT NULL,
    Category NVARCHAR(50),
    TotalCopies INT NOT NULL DEFAULT 1,
    AvailableCopies INT NOT NULL DEFAULT 1
);
GO

-- Create BookIssues table
CREATE TABLE BookIssues (
    Id INT PRIMARY KEY IDENTITY(1,1),
    BookId INT NOT NULL,
    StudentId INT NOT NULL,
    IssueDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    ReturnDate DATE,
    Status NVARCHAR(20) NOT NULL, -- Issued, Returned, Overdue
    FOREIGN KEY (BookId) REFERENCES Books(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
GO

-- Create stored procedure for book issue
CREATE PROCEDURE sp_IssueBook
    @BookId INT,
    @StudentId INT,
    @DueDays INT = 14
AS
BEGIN
    DECLARE @Available INT;
    SELECT @Available = AvailableCopies FROM Books WHERE Id = @BookId;
    
    IF @Available > 0
    BEGIN
        INSERT INTO BookIssues (BookId, StudentId, IssueDate, DueDate, Status)
        VALUES (@BookId, @StudentId, GETDATE(), DATEADD(DAY, @DueDays, GETDATE()), 'Issued');
        
        UPDATE Books SET AvailableCopies = AvailableCopies - 1 WHERE Id = @BookId;
        SELECT 1 AS Success, 'Book issued successfully' AS Message;
    END
    ELSE
        SELECT 0 AS Success, 'No copies available' AS Message;
END;
GO