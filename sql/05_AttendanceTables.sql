USE SchoolERP;
GO

-- Create AttendanceRecords table
CREATE TABLE AttendanceRecords (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    ClassId INT NOT NULL,
    Date DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- Present, Absent, Late
    Remarks NVARCHAR(255),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
GO

-- Create stored procedure for bulk attendance
CREATE PROCEDURE sp_MarkBulkAttendance
    @ClassId INT,
    @Date DATE,
    @AttendanceData AttendanceData READONLY
AS
BEGIN
    -- Delete existing attendance for the day
    DELETE FROM AttendanceRecords 
    WHERE ClassId = @ClassId AND Date = @Date;
    
    -- Insert new attendance records
    INSERT INTO AttendanceRecords (StudentId, ClassId, Date, Status, Remarks)
    SELECT StudentId, @ClassId, @Date, Status, Remarks
    FROM @AttendanceData;
END;
GO

-- Create table type for bulk attendance
CREATE TYPE AttendanceData AS TABLE (
    StudentId INT,
    Status NVARCHAR(20),
    Remarks NVARCHAR(255)
);
GO