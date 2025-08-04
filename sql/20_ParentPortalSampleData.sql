USE SchoolERP;
GO

-- Insert sample parent messages
INSERT INTO ParentMessages (StudentId, ParentName, ParentEmail, Subject, Message, SentDate, IsRead)
VALUES
(1, 'John Doe Sr.', 'parent1@example.com', 'Leave Application', 'Requesting leave for my child on October 5th', '2023-09-28', 1),
(2, 'Jane Smith', 'parent2@example.com', 'Fee Query', 'Need clarification about the fee structure', '2023-10-01', 0),
(3, 'Michael Johnson', 'parent3@example.com', 'Transport Change', 'Requesting change of bus route', '2023-10-05', 0);
GO

-- Get unread messages
EXEC sp_GetUnreadParentMessages;
GO