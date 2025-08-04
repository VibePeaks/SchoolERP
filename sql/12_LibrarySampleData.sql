USE SchoolERP;
GO

-- Insert sample books
INSERT INTO Books (Title, Author, ISBN, Publisher, PublicationYear, Category, TotalCopies, AvailableCopies)
VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'MIT Press', 2009, 'Computer Science', 5, 5),
('Clean Code', 'Robert C. Martin', '978-0132350884', 'Prentice Hall', 2008, 'Programming', 3, 3),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 'Addison-Wesley', 1999, 'Programming', 2, 2),
('Database System Concepts', 'Abraham Silberschatz', '978-0078022159', 'McGraw-Hill', 2010, 'Database', 4, 4);
GO

-- Issue some books to students
EXEC sp_IssueBook @BookId = 1, @StudentId = 1;
EXEC sp_IssueBook @BookId = 2, @StudentId = 2;
GO

-- Check current book availability
SELECT b.Title, b.AvailableCopies, 
       (SELECT COUNT(*) FROM BookIssues WHERE BookId = b.Id AND Status = 'Issued') AS CurrentlyIssued
FROM Books b;
GO