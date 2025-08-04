USE SchoolERP;
GO

-- Create Classes table
CREATE TABLE Classes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    Section NVARCHAR(10) NOT NULL,
    AcademicYear INT NOT NULL,
    ClassTeacherId INT,
    RoomNumber INT NOT NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (ClassTeacherId) REFERENCES Teachers(Id)
);
GO

-- Update Students table to reference Classes
ALTER TABLE Students
ADD CONSTRAINT FK_Students_Classes FOREIGN KEY (ClassId) REFERENCES Classes(Id);
GO

-- Create stored procedure for class assignments
CREATE PROCEDURE sp_AssignClassTeacher
    @ClassId INT,
    @TeacherId INT
AS
BEGIN
    UPDATE Classes
    SET ClassTeacherId = @TeacherId
    WHERE Id = @ClassId;
END;
GO