USE SchoolERP;
GO

-- Insert sample attendance records
INSERT INTO AttendanceRecords (StudentId, ClassId, Date, Status, Remarks)
VALUES
(1, 1, '2023-10-16', 'Present', NULL),
(2, 1, '2023-10-16', 'Present', NULL),
(3, 2, '2023-10-16', 'Absent', 'Sick'),
(1, 1, '2023-10-17', 'Present', NULL),
(2, 1, '2023-10-17', 'Late', 'Traffic delay'),
(3, 2, '2023-10-17', 'Present', NULL);
GO

-- Example of using the bulk attendance procedure
DECLARE @AttendanceData AS AttendanceData;
INSERT INTO @AttendanceData (StudentId, Status, Remarks)
VALUES 
(1, 'Present', NULL),
(2, 'Absent', 'Family event'),
(3, 'Present', NULL);

EXEC sp_MarkBulkAttendance 
    @ClassId = 1,
    @Date = '2023-10-18',
    @AttendanceData = @AttendanceData;
GO