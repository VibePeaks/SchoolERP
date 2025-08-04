USE SchoolERP;
GO

-- Insert sample rewards
INSERT INTO Rewards (Name, Description, PointsRequired, BadgeImage, IsActive)
VALUES
('Perfect Attendance', 'Awarded for perfect attendance in a month', 100, '/badges/attendance.png', 1),
('Academic Excellence', 'Awarded for top grades in class', 200, '/badges/academic.png', 1),
('Sports Champion', 'Awarded for sports achievements', 150, '/badges/sports.png', 1);
GO

-- Award some achievements to students
EXEC sp_AwardAchievement @StudentId = 1, @RewardId = 1, @Notes = 'Perfect attendance in September';
EXEC sp_AwardAchievement @StudentId = 2, @RewardId = 2, @Notes = 'Top scorer in Math';
GO

-- View student achievements
SELECT s.FirstName, s.LastName, r.Name AS Achievement, sa.AwardDate
FROM StudentAchievements sa
JOIN Students s ON sa.StudentId = s.Id
JOIN Rewards r ON sa.RewardId = r.Id;
GO