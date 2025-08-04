USE SchoolERP;
GO

-- Insert sample users
INSERT INTO Users (Username, Email, PasswordHash, Role)
VALUES 
('admin', 'admin@schoolexample.com', 'hashed_password_here', 'Admin'),
('teacher1', 'teacher1@schoolexample.com', 'hashed_password_here', 'Teacher'),
('teacher2', 'teacher2@schoolexample.com', 'hashed_password_here', 'Teacher'),
('student1', 'student1@schoolexample.com', 'hashed_password_here', 'Student'),
('student2', 'student2@schoolexample.com', 'hashed_password_here', 'Student');
GO

-- Insert sample students
INSERT INTO Students (FirstName, LastName, DateOfBirth, Gender, Address, Phone, Email, AdmissionDate, ClassId)
VALUES
('John', 'Doe', '2010-05-15', 'Male', '123 Main St', '555-1234', 'john.doe@example.com', '2023-09-01', 1),
('Jane', 'Smith', '2011-02-20', 'Female', '456 Oak Ave', '555-5678', 'jane.smith@example.com', '2023-09-01', 1),
('Michael', 'Johnson', '2010-11-10', 'Male', '789 Pine Rd', '555-9012', 'michael.j@example.com', '2023-09-01', 2);
GO

-- Insert sample teachers
INSERT INTO Teachers (FirstName, LastName, DateOfBirth, Gender, Address, Phone, Email, Qualification, JoiningDate)
VALUES
('Sarah', 'Williams', '1985-07-22', 'Female', '321 Elm St', '555-3456', 'sarah.w@example.com', 'M.Ed, B.Sc', '2020-08-15'),
('Robert', 'Brown', '1978-03-30', 'Male', '654 Maple Dr', '555-7890', 'robert.b@example.com', 'Ph.D, M.Sc', '2018-06-01');
GO

-- Insert sample exams
INSERT INTO Exams (Name, Description, StartDate, EndDate, AcademicYear, IsActive)
VALUES
('Mid-Term Exam', 'Mid term examination for all classes', '2023-10-15', '2023-10-20', '2023-2024', 1),
('Final Exam', 'Annual final examination', '2024-03-10', '2024-03-20', '2023-2024', 1);
GO

-- Insert sample fee structures
INSERT INTO FeeStructure (Name, Description, Amount, Frequency, AcademicYear, IsActive)
VALUES
('Tuition Fee', 'Monthly tuition fee', 2000.00, 'Monthly', '2023-2024', 1),
('Annual Charges', 'One-time annual charges', 5000.00, 'Yearly', '2023-2024', 1);
GO