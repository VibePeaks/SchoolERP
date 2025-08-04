USE SchoolERP;
GO

-- Insert sample classes
INSERT INTO Classes (Name, Section, AcademicYear, ClassTeacherId, RoomNumber, IsActive)
VALUES
('Grade 1', 'A', 2023, 1, 101, 1),
('Grade 1', 'B', 2023, 2, 102, 1),
('Grade 2', 'A', 2023, NULL, 201, 1);
GO

-- Update sample students with class assignments
UPDATE Students SET ClassId = 1 WHERE Id = 1;
UPDATE Students SET ClassId = 1 WHERE Id = 2;
UPDATE Students SET ClassId = 3 WHERE Id = 3;
GO

-- Assign class teachers
EXEC sp_AssignClassTeacher @ClassId = 1, @TeacherId = 1;
EXEC sp_AssignClassTeacher @ClassId = 2, @TeacherId = 2;
GO