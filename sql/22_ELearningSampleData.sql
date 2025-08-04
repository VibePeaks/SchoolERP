USE SchoolERP;
GO

-- Insert sample courses
INSERT INTO Courses (Title, Description, Subject, ClassId, TeacherId, StartDate, EndDate, IsActive)
VALUES
('Mathematics Basics', 'Fundamental concepts of mathematics', 'Mathematics', 1, 'teacher1', '2023-09-01', '2023-12-15', 1),
('Science Fundamentals', 'Introduction to scientific concepts', 'Science', 1, 'teacher2', '2023-09-01', '2023-12-15', 1),
('Programming 101', 'Introduction to programming', 'Computer Science', 2, 'teacher1', '2023-09-01', '2024-01-15', 1);
GO

-- Insert sample course materials
INSERT INTO CourseMaterials (CourseId, Title, Description, MaterialType, FilePath, UploadDate, IsActive)
VALUES
(1, 'Algebra Basics', 'Introduction to algebraic concepts', 'Document', '/materials/math/algebra.pdf', '2023-09-05', 1),
(1, 'Geometry Video', 'Video lecture on geometry', 'Video', '/materials/math/geometry.mp4', '2023-09-10', 1),
(2, 'Physics Quiz', 'Quiz on basic physics concepts', 'Quiz', '/materials/science/physics-quiz', '2023-09-08', 1);
GO

-- Get active courses
EXEC sp_GetActiveCourses;
GO