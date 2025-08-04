USE SchoolERP;
GO

-- Create Rewards table
CREATE TABLE Rewards (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    PointsRequired INT NOT NULL,
    BadgeImage NVARCHAR(255),
    IsActive BIT DEFAULT 1
);
GO

-- Create StudentAchievements table
CREATE TABLE StudentAchievements (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    RewardId INT NOT NULL,
    AwardDate DATETIME NOT NULL,
    Notes NVARCHAR(255),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (RewardId) REFERENCES Rewards(Id)
);
GO

-- Create stored procedure for awarding achievements
CREATE PROCEDURE sp_AwardAchievement
    @StudentId INT,
    @RewardId INT,
    @Notes NVARCHAR(255) = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM StudentAchievements WHERE StudentId = @StudentId AND RewardId = @RewardId)
    BEGIN
        INSERT INTO StudentAchievements (StudentId, RewardId, AwardDate, Notes)
        VALUES (@StudentId, @RewardId, GETDATE(), @Notes);
        
        SELECT 1 AS Success, 'Achievement awarded successfully' AS Message;
    END
    ELSE
        SELECT 0 AS Success, 'Student already has this achievement' AS Message;
END;
GO