USE SchoolERP;
GO

-- Insert sample notices
INSERT INTO Notices (Title, Content, Category, PostDate, ExpiryDate, PostedBy, IsImportant)
VALUES
('School Reopening', 'School will reopen on September 1st after summer break.', 'General', '2023-08-15', '2023-09-01', 'admin', 1),
('PTA Meeting', 'Parent-teacher meeting scheduled for September 10th at 2 PM.', 'Academic', '2023-08-20', '2023-09-10', 'admin', 0),
('Sports Day', 'Annual sports day will be held on October 15th.', 'Event', '2023-09-01', '2023-10-15', 'teacher1', 0),
('Library Closed', 'Library will remain closed on September 5th for maintenance.', 'General', '2023-08-25', '2023-09-05', 'teacher2', 0);
GO

-- Get active notices
EXEC sp_GetActiveNotices;
GO