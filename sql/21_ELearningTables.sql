USE SchoolERP;
GO

-- Create Courses table
CREATE TABLE Courses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    Subject NVARCHAR(50) NOT NULL,
    ClassId INT NOT NULL,
    TeacherId NVARCHAR(50) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (ClassId) REFERENCES Classes(Id)
);
GO

-- Create CourseMaterials table
CREATE TABLE CourseMaterials (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CourseId INT NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    MaterialType NVARCHAR(50) NOT NULL,
    FilePath NVARCHAR(255) NOT NULL,
    UploadDate DATETIME NOT NULL,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (CourseId) REFERENCES Courses(Id)
);
GO

-- Create stored procedure for active courses
CREATE PROCEDURE sp_GetActiveCourses
AS
BEGIN
    SELECT * FROM Courses
    WHERE IsActive = 1 AND EndDate >= GETDATE()
    ORDER BY StartDate;
END;
GO