-- Parent Portal and Student Progress Tracking Tables
-- Enables parental login and comprehensive student monitoring

USE SchoolERP;
GO

-- Parent Portal Tables
CREATE TABLE Parents (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(200) NOT NULL UNIQUE,
    Phone NVARCHAR(20),
    Address NVARCHAR(500),
    RelationshipType NVARCHAR(50) DEFAULT 'Parent', -- Mother, Father, Guardian
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    IsActive BIT DEFAULT 1,
    LastLoginDate DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
);
GO

-- Student-Parent relationship table
CREATE TABLE StudentParents (
    StudentId INT NOT NULL,
    ParentId INT NOT NULL,
    TenantId INT NOT NULL,
    IsPrimaryContact BIT DEFAULT 0,
    CanPickup BIT DEFAULT 1,
    EmergencyContact BIT DEFAULT 1,
    LinkedDate DATETIME2 DEFAULT GETUTCDATE(),

    PRIMARY KEY (StudentId, ParentId),
    FOREIGN KEY (StudentId) REFERENCES Students(Id) ON DELETE CASCADE,
    FOREIGN KEY (ParentId) REFERENCES Parents(Id) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
);
GO

-- Parent-Teacher messaging
CREATE TABLE ParentMessages (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    SenderId INT NOT NULL, -- Parent ID
    ReceiverId INT NOT NULL, -- Teacher ID
    StudentId INT NOT NULL,
    Subject NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    SentDate DATETIME2 DEFAULT GETUTCDATE(),
    MessageType NVARCHAR(50) DEFAULT 'Inquiry', -- Inquiry, Concern, Praise

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (SenderId) REFERENCES Parents(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Users(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
GO

-- Parent notifications
CREATE TABLE ParentNotifications (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    ParentId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    NotificationType NVARCHAR(50) DEFAULT 'General', -- Grade, Attendance, Fee, Announcement
    IsRead BIT DEFAULT 0,
    SentDate DATETIME2 DEFAULT GETUTCDATE(),
    RelatedStudentId INT NULL,

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (ParentId) REFERENCES Parents(Id),
    FOREIGN KEY (RelatedStudentId) REFERENCES Students(Id)
);
GO

-- Student Progress Tracking Tables

-- Assignments
CREATE TABLE Assignments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ClassId INT NOT NULL,
    TeacherId INT NOT NULL,
    DueDate DATETIME2 NOT NULL,
    MaxPoints INT NOT NULL,
    Subject NVARCHAR(100),
    AssignmentType NVARCHAR(50) DEFAULT 'Homework', -- Homework, Project, Quiz
    Instructions NVARCHAR(MAX),
    Attachments NVARCHAR(MAX), -- JSON array
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    FOREIGN KEY (TeacherId) REFERENCES Users(Id)
);
GO

-- Assignment submissions
CREATE TABLE AssignmentSubmissions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    AssignmentId INT NOT NULL,
    StudentId INT NOT NULL,
    SubmittedAt DATETIME2 NOT NULL,
    SubmissionText NVARCHAR(MAX),
    Attachments NVARCHAR(MAX), -- JSON array
    PointsEarned INT NULL,
    Feedback NVARCHAR(MAX),
    GradedAt DATETIME2 NULL,
    GradedBy INT NULL, -- Teacher ID
    Status NVARCHAR(20) DEFAULT 'Submitted', -- Draft, Submitted, Late, Graded, Returned
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (GradedBy) REFERENCES Users(Id)
);
GO

-- Grades
CREATE TABLE Grades (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    ClassId INT NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    GradeType NVARCHAR(50) DEFAULT 'Exam', -- Exam, Quiz, Homework, Project
    Title NVARCHAR(200) NOT NULL,
    Score DECIMAL(5,2) NOT NULL,
    MaxScore DECIMAL(5,2) NOT NULL,
    Percentage DECIMAL(5,2) NOT NULL,
    LetterGrade NVARCHAR(5), -- A, B+, B, etc.
    Comments NVARCHAR(MAX),
    GradedDate DATETIME2 NOT NULL,
    GradedBy INT NOT NULL, -- Teacher ID
    IsFinal BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    FOREIGN KEY (GradedBy) REFERENCES Users(Id)
);
GO

-- Progress reports
CREATE TABLE StudentProgressReports (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    ReportPeriod NVARCHAR(50) NOT NULL, -- "Fall 2024", "Q1 2025"
    ReportDate DATETIME2 NOT NULL,
    OverallGrade NVARCHAR(10),
    GPA DECIMAL(3,2),
    AttendanceDays INT DEFAULT 0,
    TotalDays INT DEFAULT 0,
    AttendancePercentage DECIMAL(5,2),
    SubjectGrades NVARCHAR(MAX), -- JSON object
    AcademicComments NVARCHAR(MAX),
    BehavioralComments NVARCHAR(MAX),
    Recommendations NVARCHAR(MAX),
    Achievements NVARCHAR(MAX),
    AreasOfConcern NVARCHAR(MAX),
    PreparedBy INT NOT NULL,
    SharedWithParents DATETIME2 NULL,
    ParentsAcknowledged BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (PreparedBy) REFERENCES Users(Id)
);
GO

-- Student achievements
CREATE TABLE StudentAchievements (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(50) DEFAULT 'Academic', -- Academic, Sports, Arts, Leadership
    AchievementDate DATETIME2 NOT NULL,
    AwardedBy NVARCHAR(200),
    CertificateUrl NVARCHAR(500),
    RecognitionLevel NVARCHAR(50) DEFAULT 'School', -- School, District, State, National
    PointsEarned INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
GO

-- Learning objectives
CREATE TABLE LearningObjectives (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Subject NVARCHAR(100) NOT NULL,
    ClassId INT NOT NULL,
    GradeLevel NVARCHAR(20),
    Category NVARCHAR(20) DEFAULT 'Knowledge', -- Knowledge, Skills, Understanding, Application
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (ClassId) REFERENCES Classes(Id)
);
GO

-- Student learning progress
CREATE TABLE StudentLearningProgress (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    LearningObjectiveId INT NOT NULL,
    Status NVARCHAR(20) DEFAULT 'NotStarted', -- NotStarted, InProgress, Completed, NeedsImprovement, Mastered
    CompletedDate DATETIME2 NULL,
    Notes NVARCHAR(MAX),
    AssessedBy INT NOT NULL,
    AssessmentDate DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (LearningObjectiveId) REFERENCES LearningObjectives(Id),
    FOREIGN KEY (AssessedBy) REFERENCES Users(Id)
);
GO

-- Create indexes for performance
CREATE INDEX IX_Parents_TenantId ON Parents(TenantId);
CREATE INDEX IX_Parents_Email ON Parents(Email);
CREATE INDEX IX_Parents_Username ON Parents(Username);

CREATE INDEX IX_StudentParents_StudentId ON StudentParents(StudentId);
CREATE INDEX IX_StudentParents_ParentId ON StudentParents(ParentId);

CREATE INDEX IX_ParentMessages_SenderId ON ParentMessages(SenderId);
CREATE INDEX IX_ParentMessages_ReceiverId ON ParentMessages(ReceiverId);
CREATE INDEX IX_ParentMessages_StudentId ON ParentMessages(StudentId);

CREATE INDEX IX_ParentNotifications_ParentId ON ParentNotifications(ParentId);
CREATE INDEX IX_ParentNotifications_IsRead ON ParentNotifications(IsRead);

CREATE INDEX IX_Assignments_ClassId ON Assignments(ClassId);
CREATE INDEX IX_Assignments_TeacherId ON Assignments(TeacherId);
CREATE INDEX IX_Assignments_DueDate ON Assignments(DueDate);

CREATE INDEX IX_AssignmentSubmissions_AssignmentId ON AssignmentSubmissions(AssignmentId);
CREATE INDEX IX_AssignmentSubmissions_StudentId ON AssignmentSubmissions(StudentId);

CREATE INDEX IX_Grades_StudentId ON Grades(StudentId);
CREATE INDEX IX_Grades_ClassId ON Grades(ClassId);
CREATE INDEX IX_Grades_GradedBy ON Grades(GradedBy);

CREATE INDEX IX_StudentProgressReports_StudentId ON StudentProgressReports(StudentId);
CREATE INDEX IX_StudentProgressReports_ReportPeriod ON StudentProgressReports(ReportPeriod);

CREATE INDEX IX_StudentAchievements_StudentId ON StudentAchievements(StudentId);
CREATE INDEX IX_StudentAchievements_Category ON StudentAchievements(Category);

CREATE INDEX IX_LearningObjectives_ClassId ON LearningObjectives(ClassId);
CREATE INDEX IX_LearningObjectives_Subject ON LearningObjectives(Subject);

CREATE INDEX IX_StudentLearningProgress_StudentId ON StudentLearningProgress(StudentId);
CREATE INDEX IX_StudentLearningProgress_LearningObjectiveId ON StudentLearningProgress(LearningObjectiveId);
GO

-- Sample data for default tenant
INSERT INTO Parents (TenantId, FirstName, LastName, Email, Phone, RelationshipType, Username, PasswordHash, IsActive)
VALUES
(1, 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+1234567890', 'Mother', 'sarah.johnson', 'hashed_password_1', 1),
(1, 'Michael', 'Rodriguez', 'michael.rodriguez@email.com', '+1234567891', 'Father', 'michael.rodriguez', 'hashed_password_2', 1),
(1, 'Emily', 'Chen', 'emily.chen@email.com', '+1234567892', 'Guardian', 'emily.chen', 'hashed_password_3', 1);
GO

-- Link parents to students (assuming student IDs exist)
INSERT INTO StudentParents (StudentId, ParentId, TenantId, IsPrimaryContact, CanPickup, EmergencyContact)
SELECT TOP 3 s.Id, p.Id, 1, CASE WHEN ROW_NUMBER() OVER (ORDER BY s.Id) = 1 THEN 1 ELSE 0 END, 1, 1
FROM Students s
CROSS JOIN Parents p
WHERE s.TenantId = 1 AND p.TenantId = 1;
GO

PRINT 'Parent Portal and Student Progress Tracking tables created successfully!';
PRINT 'Sample parent accounts created for default tenant.';
GO
