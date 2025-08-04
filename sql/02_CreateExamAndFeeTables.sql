USE SchoolERP;
GO

-- Create Exams table
CREATE TABLE Exams (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    AcademicYear NVARCHAR(20) NOT NULL,
    IsActive BIT DEFAULT 1
);
GO

-- Create ExamResults table
CREATE TABLE ExamResults (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    ExamId INT NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    MarksObtained DECIMAL(5,2) NOT NULL,
    MaxMarks DECIMAL(5,2) NOT NULL,
    Grade NVARCHAR(5),
    Remarks NVARCHAR(255),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (ExamId) REFERENCES Exams(Id)
);
GO

-- Create FeeStructure table
CREATE TABLE FeeStructure (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Amount DECIMAL(10,2) NOT NULL,
    Frequency NVARCHAR(20) NOT NULL, -- Monthly, Quarterly, Yearly
    AcademicYear NVARCHAR(20) NOT NULL,
    IsActive BIT DEFAULT 1
);
GO

-- Create StudentFees table
CREATE TABLE StudentFees (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    FeeStructureId INT NOT NULL,
    DueDate DATE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaidAmount DECIMAL(10,2) DEFAULT 0,
    PaymentDate DATE,
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending, Partial, Paid
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (FeeStructureId) REFERENCES FeeStructure(Id)
);
GO