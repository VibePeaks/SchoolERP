-- =====================================================
-- School ERP SaaS - Complete Database Schema
-- =====================================================
-- This script creates all tables in the correct order
-- with proper relationships, indexes, and constraints

USE SchoolERP;
GO

-- =====================================================
-- 1. MULTI-TENANT ARCHITECTURE
-- =====================================================

-- Tenants (Schools)
CREATE TABLE Tenants (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantCode NVARCHAR(50) NOT NULL UNIQUE, -- For subdomain routing
    Name NVARCHAR(200) NOT NULL,
    Domain NVARCHAR(100) NULL, -- Custom domain
    Description NVARCHAR(MAX),
    LogoUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    SubscriptionPlan NVARCHAR(50) DEFAULT 'basic',
    SubscriptionEndDate DATETIME2 NULL,
    MaxUsers INT DEFAULT 100,
    MaxBranches INT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    INDEX IX_Tenants_TenantCode (TenantCode),
    INDEX IX_Tenants_IsActive (IsActive)
);
GO

-- Tenant Settings
CREATE TABLE TenantSettings (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    SettingKey NVARCHAR(100) NOT NULL,
    SettingValue NVARCHAR(MAX),
    SettingType NVARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    IsSystem BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE,
    UNIQUE(TenantId, SettingKey),
    INDEX IX_TenantSettings_TenantId (TenantId),
    INDEX IX_TenantSettings_Key (SettingKey)
);
GO

-- Tenant Usage Tracking
CREATE TABLE TenantUsage (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    MetricName NVARCHAR(100) NOT NULL, -- students_count, teachers_count, storage_used
    MetricValue DECIMAL(18,2) NOT NULL,
    RecordedAt DATETIME2 DEFAULT GETUTCDATE(),
    Period NVARCHAR(20) DEFAULT 'monthly', -- daily, weekly, monthly

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id) ON DELETE CASCADE,
    INDEX IX_TenantUsage_TenantId (TenantId),
    INDEX IX_TenantUsage_Metric (MetricName, RecordedAt)
);
GO

-- =====================================================
-- 2. SUBSCRIPTION MANAGEMENT
-- =====================================================

-- Subscription Plans
CREATE TABLE SubscriptionPlans (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PlanName NVARCHAR(50) NOT NULL UNIQUE,
    DisplayName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    PriceMonthly DECIMAL(10,2) NOT NULL,
    PriceYearly DECIMAL(10,2) NOT NULL,
    MaxUsers INT NOT NULL,
    MaxBranches INT NOT NULL,
    MaxStudents INT NOT NULL,
    Features NVARCHAR(MAX), -- JSON array of features
    IsActive BIT DEFAULT 1,
    SortOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    INDEX IX_SubscriptionPlans_IsActive (IsActive)
);
GO

-- Subscription Features
CREATE TABLE SubscriptionFeatures (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PlanId INT NOT NULL,
    FeatureName NVARCHAR(100) NOT NULL,
    FeatureValue NVARCHAR(500),
    FeatureType NVARCHAR(50) DEFAULT 'boolean', -- boolean, number, text
    IsEnabled BIT DEFAULT 1,

    FOREIGN KEY (PlanId) REFERENCES SubscriptionPlans(Id) ON DELETE CASCADE,
    INDEX IX_SubscriptionFeatures_PlanId (PlanId)
);
GO

-- User Subscriptions
CREATE TABLE UserSubscriptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    SubscriptionPlanId INT NOT NULL,
    Status NVARCHAR(20) DEFAULT 'active', -- active, cancelled, expired, suspended
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    AutoRenew BIT DEFAULT 1,
    PaymentMethod NVARCHAR(50), -- stripe, paypal, bank_transfer
    BillingCycle NVARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
    Amount DECIMAL(10,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'USD',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (SubscriptionPlanId) REFERENCES SubscriptionPlans(Id),
    INDEX IX_UserSubscriptions_TenantId (TenantId),
    INDEX IX_UserSubscriptions_Status (Status),
    INDEX IX_UserSubscriptions_EndDate (EndDate)
);
GO

-- Subscription Payments
CREATE TABLE SubscriptionPayments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    SubscriptionId INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'USD',
    PaymentMethod NVARCHAR(50) NOT NULL,
    TransactionId NVARCHAR(200),
    PaymentStatus NVARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded
    PaymentDate DATETIME2 NOT NULL,
    InvoiceUrl NVARCHAR(500),
    Notes NVARCHAR(MAX),

    FOREIGN KEY (SubscriptionId) REFERENCES UserSubscriptions(Id),
    INDEX IX_SubscriptionPayments_SubscriptionId (SubscriptionId),
    INDEX IX_SubscriptionPayments_Status (PaymentStatus)
);
GO

-- =====================================================
-- 3. USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Base Entity for all tenant-aware tables
-- Note: This is implemented as a base class in C#, not a table

-- Users (Admin, Teachers, Staff)
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Username NVARCHAR(100) NOT NULL,
    Email NVARCHAR(200) NOT NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20),
    Role NVARCHAR(20) DEFAULT 'teacher', -- admin, teacher, staff
    IsActive BIT DEFAULT 1,
    LastLoginDate DATETIME2 NULL,
    BranchId INT NULL,
    ProfilePicture NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    UNIQUE(TenantId, Email),
    UNIQUE(TenantId, Username),
    INDEX IX_Users_TenantId (TenantId),
    INDEX IX_Users_Email (Email),
    INDEX IX_Users_Role (Role),
    INDEX IX_Users_IsActive (IsActive)
);
GO

-- =====================================================
-- 4. BRANCH MANAGEMENT
-- =====================================================

-- Branches (School campuses/locations)
CREATE TABLE Branches (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL,
    Address NVARCHAR(500),
    Phone NVARCHAR(20),
    Email NVARCHAR(200),
    PrincipalId INT NULL, -- Branch principal
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (PrincipalId) REFERENCES Users(Id),
    UNIQUE(TenantId, Code),
    INDEX IX_Branches_TenantId (TenantId),
    INDEX IX_Branches_IsActive (IsActive)
);
GO

-- User-Branch Relationships (Multi-branch support)
CREATE TABLE UserBranches (
    UserId INT NOT NULL,
    BranchId INT NOT NULL,
    TenantId INT NOT NULL,
    Role NVARCHAR(50) DEFAULT 'staff', -- principal, teacher, admin, staff
    IsPrimary BIT DEFAULT 0,
    AssignedAt DATETIME2 DEFAULT GETUTCDATE(),

    PRIMARY KEY (UserId, BranchId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (BranchId) REFERENCES Branches(Id) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_UserBranches_UserId (UserId),
    INDEX IX_UserBranches_BranchId (BranchId)
);
GO

-- =====================================================
-- 5. STUDENT MANAGEMENT
-- =====================================================

-- Students
CREATE TABLE Students (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    StudentId NVARCHAR(50) NOT NULL, -- Unique within tenant
    Email NVARCHAR(200),
    Phone NVARCHAR(20),
    DateOfBirth DATETIME2,
    Gender NVARCHAR(20),
    Address NVARCHAR(500),
    BranchId INT NOT NULL,
    HomeBranchId INT NULL,
    Class NVARCHAR(50), -- Grade 10, Class A, etc.
    RollNumber NVARCHAR(20),
    AdmissionDate DATETIME2 NOT NULL,
    Status NVARCHAR(20) DEFAULT 'active', -- active, inactive, graduated, transferred
    ParentName NVARCHAR(200),
    ParentPhone NVARCHAR(20),
    ParentEmail NVARCHAR(200),
    FeeStatus NVARCHAR(20) DEFAULT 'pending', -- paid, pending, overdue
    AttendancePercentage DECIMAL(5,2),
    GPA DECIMAL(3,2),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BranchId) REFERENCES Branches(Id),
    UNIQUE(TenantId, StudentId),
    INDEX IX_Students_TenantId (TenantId),
    INDEX IX_Students_BranchId (BranchId),
    INDEX IX_Students_Class (Class),
    INDEX IX_Students_Status (Status)
);
GO

-- =====================================================
-- 6. PARENT PORTAL
-- =====================================================

-- Parents
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

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_Parents_TenantId (TenantId),
    INDEX IX_Parents_Email (Email),
    INDEX IX_Parents_Username (Username)
);
GO

-- Student-Parent Relationships
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

-- Parent-Teacher Messages
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
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    INDEX IX_ParentMessages_SenderId (SenderId),
    INDEX IX_ParentMessages_ReceiverId (ReceiverId),
    INDEX IX_ParentMessages_StudentId (StudentId)
);
GO

-- Parent Notifications
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
    FOREIGN KEY (RelatedStudentId) REFERENCES Students(Id),
    INDEX IX_ParentNotifications_ParentId (ParentId),
    INDEX IX_ParentNotifications_IsRead (IsRead)
);
GO

-- =====================================================
-- 7. ACADEMIC MANAGEMENT
-- =====================================================

-- Classes
CREATE TABLE Classes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    BranchId INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Grade NVARCHAR(50) NOT NULL, -- Grade 1, Grade 2, etc.
    Section NVARCHAR(10) DEFAULT 'A', -- A, B, C, etc.
    AcademicYear NVARCHAR(20) NOT NULL, -- 2024-2025
    ClassTeacherId INT NULL,
    MaxStudents INT DEFAULT 40,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BranchId) REFERENCES Branches(Id),
    FOREIGN KEY (ClassTeacherId) REFERENCES Users(Id),
    UNIQUE(TenantId, BranchId, Name, AcademicYear),
    INDEX IX_Classes_TenantId (TenantId),
    INDEX IX_Classes_BranchId (BranchId)
);
GO

-- Teachers (extended profile)
CREATE TABLE Teachers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    TenantId INT NOT NULL,
    BranchId INT NOT NULL,
    EmployeeId NVARCHAR(50) NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    Qualification NVARCHAR(200),
    ExperienceYears INT,
    DateOfJoining DATETIME2,
    Salary DECIMAL(10,2),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BranchId) REFERENCES Branches(Id),
    UNIQUE(TenantId, EmployeeId),
    INDEX IX_Teachers_UserId (UserId),
    INDEX IX_Teachers_TenantId (TenantId)
);
GO

-- Subjects
CREATE TABLE Subjects (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(50), -- Science, Mathematics, Language, etc.
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    UNIQUE(TenantId, Code),
    INDEX IX_Subjects_TenantId (TenantId)
);
GO

-- =====================================================
-- 8. STUDENT PROGRESS TRACKING
-- =====================================================

-- Assignments
CREATE TABLE Assignments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ClassId INT NOT NULL,
    TeacherId INT NOT NULL,
    Subject NVARCHAR(100),
    DueDate DATETIME2 NOT NULL,
    MaxPoints INT NOT NULL,
    AssignmentType NVARCHAR(50) DEFAULT 'Homework', -- Homework, Project, Quiz
    Instructions NVARCHAR(MAX),
    Attachments NVARCHAR(MAX), -- JSON array
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy NVARCHAR(100),
    UpdatedBy NVARCHAR(100),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    FOREIGN KEY (TeacherId) REFERENCES Users(Id),
    INDEX IX_Assignments_ClassId (ClassId),
    INDEX IX_Assignments_TeacherId (TeacherId),
    INDEX IX_Assignments_DueDate (DueDate)
);
GO

-- Assignment Submissions
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
    FOREIGN KEY (GradedBy) REFERENCES Users(Id),
    INDEX IX_AssignmentSubmissions_AssignmentId (AssignmentId),
    INDEX IX_AssignmentSubmissions_StudentId (StudentId)
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
    FOREIGN KEY (GradedBy) REFERENCES Users(Id),
    INDEX IX_Grades_StudentId (StudentId),
    INDEX IX_Grades_ClassId (ClassId),
    INDEX IX_Grades_GradedBy (GradedBy)
);
GO

-- Progress Reports
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
    FOREIGN KEY (PreparedBy) REFERENCES Users(Id),
    INDEX IX_StudentProgressReports_StudentId (StudentId),
    INDEX IX_StudentProgressReports_ReportPeriod (ReportPeriod)
);
GO

-- Student Achievements
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
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    INDEX IX_StudentAchievements_StudentId (StudentId),
    INDEX IX_StudentAchievements_Category (Category)
);
GO

-- Learning Objectives
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
    FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    INDEX IX_LearningObjectives_ClassId (ClassId),
    INDEX IX_LearningObjectives_Subject (Subject)
);
GO

-- Student Learning Progress
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
    FOREIGN KEY (AssessedBy) REFERENCES Users(Id),
    INDEX IX_StudentLearningProgress_StudentId (StudentId),
    INDEX IX_StudentLearningProgress_LearningObjectiveId (LearningObjectiveId)
);
GO

-- =====================================================
-- 9. ATTENDANCE MANAGEMENT
-- =====================================================

-- Attendance Records
CREATE TABLE AttendanceRecords (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    ClassId INT NOT NULL,
    Date DATETIME2 NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- Present, Absent, Late, Excused
    CheckInTime DATETIME2 NULL,
    CheckOutTime DATETIME2 NULL,
    Remarks NVARCHAR(MAX),
    MarkedBy INT NOT NULL, -- Teacher/Admin ID
    MarkedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    FOREIGN KEY (MarkedBy) REFERENCES Users(Id),
    UNIQUE(TenantId, StudentId, Date),
    INDEX IX_AttendanceRecords_StudentId (StudentId),
    INDEX IX_AttendanceRecords_ClassId (ClassId),
    INDEX IX_AttendanceRecords_Date (Date),
    INDEX IX_AttendanceRecords_Status (Status)
);
GO

-- =====================================================
-- 10. FINANCIAL MANAGEMENT
-- =====================================================

-- Fee Structures
CREATE TABLE FeeStructures (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    AcademicYear NVARCHAR(20) NOT NULL,
    Grade NVARCHAR(50), -- Specific grade or NULL for all
    Amount DECIMAL(10,2) NOT NULL,
    Frequency NVARCHAR(20) DEFAULT 'monthly', -- monthly, quarterly, yearly, one-time
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_FeeStructures_TenantId (TenantId),
    INDEX IX_FeeStructures_AcademicYear (AcademicYear)
);
GO

-- Student Fees
CREATE TABLE StudentFees (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    FeeStructureId INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    DueDate DATETIME2 NOT NULL,
    PaidAmount DECIMAL(10,2) DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, waived
    PaymentDate DATETIME2 NULL,
    TransactionId NVARCHAR(200),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (FeeStructureId) REFERENCES FeeStructures(Id),
    INDEX IX_StudentFees_StudentId (StudentId),
    INDEX IX_StudentFees_Status (Status),
    INDEX IX_StudentFees_DueDate (DueDate)
);
GO

-- Payroll Records
CREATE TABLE PayrollRecords (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    UserId INT NOT NULL, -- Employee ID
    PayPeriod NVARCHAR(50) NOT NULL, -- "January 2024", "2024-01"
    BasicSalary DECIMAL(10,2) NOT NULL,
    Allowances DECIMAL(10,2) DEFAULT 0,
    Deductions DECIMAL(10,2) DEFAULT 0,
    NetSalary DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME2 NULL,
    Status NVARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
    ProcessedBy INT NULL,
    ProcessedAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ProcessedBy) REFERENCES Users(Id),
    INDEX IX_PayrollRecords_UserId (UserId),
    INDEX IX_PayrollRecords_PayPeriod (PayPeriod),
    INDEX IX_PayrollRecords_Status (Status)
);
GO

-- =====================================================
-- 11. LIBRARY MANAGEMENT
-- =====================================================

-- Books
CREATE TABLE Books (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Author NVARCHAR(200) NOT NULL,
    ISBN NVARCHAR(20),
    Publisher NVARCHAR(200),
    PublicationYear INT,
    Category NVARCHAR(100),
    TotalCopies INT DEFAULT 1,
    AvailableCopies INT DEFAULT 1,
    Location NVARCHAR(100), -- Shelf location
    Description NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_Books_TenantId (TenantId),
    INDEX IX_Books_Category (Category),
    INDEX IX_Books_ISBN (ISBN)
);
GO

-- =====================================================
-- 12. HOSTEL MANAGEMENT
-- =====================================================

-- Hostels
CREATE TABLE Hostels (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Address NVARCHAR(500),
    WardenId INT NULL, -- Hostel warden
    TotalRooms INT NOT NULL,
    OccupiedRooms INT DEFAULT 0,
    Facilities NVARCHAR(MAX), -- JSON array
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (WardenId) REFERENCES Users(Id),
    INDEX IX_Hostels_TenantId (TenantId)
);
GO

-- Room Allocations
CREATE TABLE RoomAllocations (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    HostelId INT NOT NULL,
    RoomNumber NVARCHAR(20) NOT NULL,
    CheckInDate DATETIME2 NOT NULL,
    CheckOutDate DATETIME2 NULL,
    MonthlyRent DECIMAL(8,2),
    SecurityDeposit DECIMAL(8,2),
    Facilities NVARCHAR(MAX), -- JSON array
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (HostelId) REFERENCES Hostels(Id),
    UNIQUE(TenantId, StudentId, IsActive), -- One active allocation per student
    INDEX IX_RoomAllocations_StudentId (StudentId),
    INDEX IX_RoomAllocations_HostelId (HostelId)
);
GO

-- Hostel Maintenance
CREATE TABLE HostelMaintenance (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    HostelId INT NOT NULL,
    RoomNumber NVARCHAR(20),
    Issue NVARCHAR(MAX) NOT NULL,
    Priority NVARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    Status NVARCHAR(20) DEFAULT 'reported', -- reported, in_progress, resolved, cancelled
    ReportedBy INT NOT NULL,
    ReportedAt DATETIME2 DEFAULT GETUTCDATE(),
    AssignedTo INT NULL,
    ResolvedAt DATETIME2 NULL,
    Cost DECIMAL(8,2) NULL,
    Notes NVARCHAR(MAX),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (HostelId) REFERENCES Hostels(Id),
    FOREIGN KEY (ReportedBy) REFERENCES Users(Id),
    FOREIGN KEY (AssignedTo) REFERENCES Users(Id),
    INDEX IX_HostelMaintenance_HostelId (HostelId),
    INDEX IX_HostelMaintenance_Status (Status),
    INDEX IX_HostelMaintenance_Priority (Priority)
);
GO

-- =====================================================
-- 13. TRANSPORT MANAGEMENT
-- =====================================================

-- Transport Routes
CREATE TABLE TransportRoutes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    RouteName NVARCHAR(200) NOT NULL,
    RouteNumber NVARCHAR(50),
    StartPoint NVARCHAR(200) NOT NULL,
    EndPoint NVARCHAR(200) NOT NULL,
    Distance DECIMAL(6,2), -- in kilometers
    EstimatedTime INT, -- in minutes
    Fare DECIMAL(6,2),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_TransportRoutes_TenantId (TenantId)
);
GO

-- Buses
CREATE TABLE Buses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    RegistrationNumber NVARCHAR(50) NOT NULL,
    BusNumber NVARCHAR(20),
    Capacity INT NOT NULL,
    DriverId INT NULL,
    RouteId INT NULL,
    Model NVARCHAR(100),
    Year INT,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (DriverId) REFERENCES Users(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    UNIQUE(TenantId, RegistrationNumber),
    INDEX IX_Buses_TenantId (TenantId),
    INDEX IX_Buses_RouteId (RouteId)
);
GO

-- Transport Assignments
CREATE TABLE TransportAssignments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    StudentId INT NOT NULL,
    RouteId INT NOT NULL,
    BusId INT NULL,
    PickupPoint NVARCHAR(200),
    DropPoint NVARCHAR(200),
    Fare DECIMAL(6,2),
    IsActive BIT DEFAULT 1,
    AssignedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    UNIQUE(TenantId, StudentId, IsActive),
    INDEX IX_TransportAssignments_StudentId (StudentId),
    INDEX IX_TransportAssignments_RouteId (RouteId)
);
GO

-- =====================================================
-- 14. INVENTORY MANAGEMENT
-- =====================================================

-- Inventory Items
CREATE TABLE InventoryItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Category NVARCHAR(100),
    Quantity INT NOT NULL DEFAULT 0,
    MinQuantity INT DEFAULT 0,
    Unit NVARCHAR(20) DEFAULT 'pieces', -- pieces, kg, liters, etc.
    UnitPrice DECIMAL(8,2),
    Location NVARCHAR(200),
    Supplier NVARCHAR(200),
    LastRestocked DATETIME2 NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_InventoryItems_TenantId (TenantId),
    INDEX IX_InventoryItems_Category (Category)
);
GO

-- =====================================================
-- 15. COMMUNICATION & ANNOUNCEMENTS
-- =====================================================

-- Notices/Announcements
CREATE TABLE Notices (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    NoticeType NVARCHAR(50) DEFAULT 'general', -- general, academic, event, emergency
    Priority NVARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    TargetAudience NVARCHAR(50) DEFAULT 'all', -- all, students, parents, teachers, staff
    BranchId INT NULL, -- NULL for all branches
    Class NVARCHAR(50) NULL, -- NULL for all classes
    PostedBy INT NOT NULL,
    PostedAt DATETIME2 DEFAULT GETUTCDATE(),
    ExpiryDate DATETIME2 NULL,
    IsActive BIT DEFAULT 1,
    AttachmentUrls NVARCHAR(MAX), -- JSON array

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BranchId) REFERENCES Branches(Id),
    FOREIGN KEY (PostedBy) REFERENCES Users(Id),
    INDEX IX_Notices_TenantId (TenantId),
    INDEX IX_Notices_Type (NoticeType),
    INDEX IX_Notices_Priority (Priority),
    INDEX IX_Notices_PostedAt (PostedAt)
);
GO

-- =====================================================
-- 16. E-LEARNING MODULES
-- =====================================================

-- Courses
CREATE TABLE Courses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    Subject NVARCHAR(100),
    Grade NVARCHAR(50),
    InstructorId INT NOT NULL,
    Duration INT, -- in hours
    IsPublished BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (InstructorId) REFERENCES Users(Id),
    INDEX IX_Courses_TenantId (TenantId),
    INDEX IX_Courses_Subject (Subject)
);
GO

-- Course Materials
CREATE TABLE CourseMaterials (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CourseId INT NOT NULL,
    TenantId INT NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX),
    MaterialType NVARCHAR(50) DEFAULT 'document', -- document, video, quiz, assignment
    ContentUrl NVARCHAR(500),
    ContentText NVARCHAR(MAX),
    OrderIndex INT DEFAULT 0,
    IsRequired BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_CourseMaterials_CourseId (CourseId)
);
GO

-- =====================================================
-- 17. GAMIFICATION & REWARDS
-- =====================================================

-- Rewards/Badges
CREATE TABLE Rewards (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Icon NVARCHAR(100),
    PointsRequired INT NOT NULL,
    RewardType NVARCHAR(50) DEFAULT 'badge', -- badge, certificate, privilege
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    INDEX IX_Rewards_TenantId (TenantId)
);
GO

-- =====================================================
-- 18. AUDIT LOGGING
-- =====================================================

-- Audit Logs
CREATE TABLE AuditLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    UserId INT NULL,
    Action NVARCHAR(100) NOT NULL,
    EntityType NVARCHAR(100) NOT NULL,
    EntityId INT NULL,
    OldValues NVARCHAR(MAX),
    NewValues NVARCHAR(MAX),
    IPAddress NVARCHAR(45),
    UserAgent NVARCHAR(MAX),
    Timestamp DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    INDEX IX_AuditLogs_TenantId (TenantId),
    INDEX IX_AuditLogs_UserId (UserId),
    INDEX IX_AuditLogs_Action (Action),
    INDEX IX_AuditLogs_Timestamp (Timestamp)
);
GO

-- =====================================================
-- 19. BUS TRACKING SYSTEM
-- =====================================================

-- Bus Locations (Real-time GPS tracking)
CREATE TABLE BusLocations (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    BusId INT NOT NULL,
    Latitude DECIMAL(10,8) NOT NULL,
    Longitude DECIMAL(11,8) NOT NULL,
    Speed DECIMAL(5,2) NULL,
    Heading DECIMAL(5,2) NULL,
    Accuracy DECIMAL(6,2) NULL,
    LocationSource NVARCHAR(20) DEFAULT 'GPS',
    Timestamp DATETIME2 NOT NULL,
    IsActive BIT DEFAULT 1,
    RouteId INT NULL,
    CurrentStop NVARCHAR(200) NULL,
    NextStop NVARCHAR(200) NULL,
    EstimatedArrival DATETIME2 NULL,
    Status NVARCHAR(20) DEFAULT 'Inactive',
    IsEmergency BIT DEFAULT 0,
    EmergencyMessage NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    INDEX IX_BusLocations_BusId (BusId),
    INDEX IX_BusLocations_TenantId (TenantId),
    INDEX IX_BusLocations_Timestamp (Timestamp),
    INDEX IX_BusLocations_Status (Status)
);
GO

-- Bus Trips
CREATE TABLE BusTrips (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    BusId INT NOT NULL,
    RouteId INT NOT NULL,
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2 NULL,
    Status NVARCHAR(20) DEFAULT 'Scheduled',
    DriverId INT NOT NULL,
    DistanceTravelled DECIMAL(8,2) DEFAULT 0,
    StudentsPickedUp INT DEFAULT 0,
    StudentsDroppedOff INT DEFAULT 0,
    ActualDuration TIME NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    FOREIGN KEY (DriverId) REFERENCES Users(Id),
    INDEX IX_BusTrips_BusId (BusId),
    INDEX IX_BusTrips_RouteId (RouteId),
    INDEX IX_BusTrips_StartTime (StartTime),
    INDEX IX_BusTrips_Status (Status)
);
GO

-- Bus Stop Logs
CREATE TABLE BusStopLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    TripId INT NOT NULL,
    StopName NVARCHAR(200) NOT NULL,
    ScheduledArrival DATETIME2 NOT NULL,
    ActualArrival DATETIME2 NULL,
    DepartureTime DATETIME2 NULL,
    StudentsPickedUp INT DEFAULT 0,
    StudentsDroppedOff INT DEFAULT 0,
    Remarks NVARCHAR(MAX) NULL,
    Latitude DECIMAL(10,8) NOT NULL,
    Longitude DECIMAL(11,8) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (TripId) REFERENCES BusTrips(Id),
    INDEX IX_BusStopLogs_TripId (TripId),
    INDEX IX_BusStopLogs_ScheduledArrival (ScheduledArrival)
);
GO

-- Bus Alerts
CREATE TABLE BusAlerts (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    BusId INT NOT NULL,
    Type NVARCHAR(20) DEFAULT 'Safety',
    Severity NVARCHAR(20) DEFAULT 'Medium',
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Timestamp DATETIME2 NOT NULL,
    IsResolved BIT DEFAULT 0,
    ResolvedAt DATETIME2 NULL,
    ResolvedBy NVARCHAR(100) NULL,
    Latitude DECIMAL(10,8) NULL,
    Longitude DECIMAL(11,8) NULL,
    StudentId INT NULL,
    TripId INT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (TripId) REFERENCES BusTrips(Id),
    INDEX IX_BusAlerts_BusId (BusId),
    INDEX IX_BusAlerts_Type (Type),
    INDEX IX_BusAlerts_Severity (Severity),
    INDEX IX_BusAlerts_Timestamp (Timestamp),
    INDEX IX_BusAlerts_IsResolved (IsResolved)
);
GO

-- Bus Geofences
CREATE TABLE BusGeofences (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Type NVARCHAR(20) DEFAULT 'School',
    Coordinates NVARCHAR(MAX) NULL,
    CenterLatitude DECIMAL(10,8) NOT NULL,
    CenterLongitude DECIMAL(11,8) NOT NULL,
    Radius DECIMAL(8,2) NOT NULL,
    IsActive BIT DEFAULT 1,
    BusId INT NULL,
    RouteId INT NULL,
    EntryAction NVARCHAR(100) DEFAULT 'Notify',
    ExitAction NVARCHAR(100) DEFAULT 'Log',
    StayAction NVARCHAR(100) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    INDEX IX_BusGeofences_TenantId (TenantId),
    INDEX IX_BusGeofences_Type (Type),
    INDEX IX_BusGeofences_IsActive (IsActive)
);
GO

-- Bus Maintenance
CREATE TABLE BusMaintenances (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    BusId INT NOT NULL,
    Type NVARCHAR(30) DEFAULT 'Routine',
    Description NVARCHAR(MAX) NOT NULL,
    ScheduledDate DATETIME2 NOT NULL,
    CompletedDate DATETIME2 NULL,
    Status NVARCHAR(20) DEFAULT 'Scheduled',
    Cost DECIMAL(8,2) DEFAULT 0,
    PerformedBy NVARCHAR(100) NULL,
    Notes NVARCHAR(MAX) NULL,
    OdometerBefore DECIMAL(8,2) DEFAULT 0,
    OdometerAfter DECIMAL(8,2) DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    INDEX IX_BusMaintenances_BusId (BusId),
    INDEX IX_BusMaintenances_Status (Status),
    INDEX IX_BusMaintenances_ScheduledDate (ScheduledDate)
);
GO

-- Bus Route Stops
CREATE TABLE BusRouteStops (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    RouteId INT NOT NULL,
    StopName NVARCHAR(200) NOT NULL,
    Latitude DECIMAL(10,8) NOT NULL,
    Longitude DECIMAL(11,8) NOT NULL,
    OrderIndex INT NOT NULL,
    ScheduledArrival TIME NOT NULL,
    ScheduledDeparture TIME NOT NULL,
    EstimatedDuration INT DEFAULT 0,
    StudentsPickup INT DEFAULT 0,
    StudentsDropoff INT DEFAULT 0,
    Facilities NVARCHAR(MAX) NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (RouteId) REFERENCES TransportRoutes(Id),
    UNIQUE(TenantId, RouteId, OrderIndex),
    INDEX IX_BusRouteStops_RouteId (RouteId),
    INDEX IX_BusRouteStops_OrderIndex (OrderIndex)
);
GO

-- Parent Bus Tracking Preferences
CREATE TABLE ParentBusTracking (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TenantId INT NOT NULL,
    ParentId INT NOT NULL,
    StudentId INT NOT NULL,
    BusId INT NOT NULL,
    TrackLocation BIT DEFAULT 1,
    NotifyArrival BIT DEFAULT 1,
    NotifyDeparture BIT DEFAULT 1,
    NotifyDelays BIT DEFAULT 1,
    NotifyEmergencies BIT DEFAULT 1,
    SafeZones NVARCHAR(MAX) NULL,
    EmergencyContacts NVARCHAR(MAX) NULL,
    AllowRealTimeTracking BIT DEFAULT 1,
    LastAccess DATETIME2 DEFAULT GETUTCDATE(),
    AccessCount INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (ParentId) REFERENCES Parents(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id),
    UNIQUE(TenantId, ParentId, StudentId),
    INDEX IX_ParentBusTracking_ParentId (ParentId),
    INDEX IX_ParentBusTracking_StudentId (StudentId),
    INDEX IX_ParentBusTracking_BusId (BusId)
);
GO

-- =====================================================
-- DEFAULT DATA INSERTION
-- =====================================================

-- Insert default tenant
INSERT INTO Tenants (TenantCode, Name, Description, IsActive, MaxUsers, MaxBranches)
VALUES ('default', 'Default School', 'Default tenant for development', 1, 1000, 5);
GO

-- Insert default subscription plans
INSERT INTO SubscriptionPlans (PlanName, DisplayName, Description, PriceMonthly, PriceYearly, MaxUsers, MaxBranches, MaxStudents, Features, IsActive, SortOrder)
VALUES
('basic', 'Basic', 'Essential features for small schools', 29.99, 299.99, 50, 1, 500,
 '["Student Management","Teacher Management","Basic Reporting","Email Support"]', 1, 1),
('premium', 'Premium', 'Advanced features for growing schools', 79.99, 799.99, 200, 3, 2000,
 '["Everything in Basic","Advanced Analytics","Parent Portal","Library Module","E-Learning","Priority Support"]', 1, 2),
('enterprise', 'Enterprise', 'Full-featured solution for large institutions', 149.99, 1499.99, 1000, 10, -1,
 '["Everything in Premium","Custom Integrations","White-labeling","Dedicated Support","API Access"]', 1, 3);
GO

-- Insert default admin user (password: Admin123!)
INSERT INTO Users (TenantId, Username, Email, PasswordHash, FirstName, LastName, Role, IsActive)
VALUES (1, 'admin', 'admin@school.com', '$2a$11$example.hash.for.demo.purposes.only', 'System', 'Administrator', 'admin', 1);
GO

PRINT 'School ERP SaaS Database Schema Created Successfully!';
PRINT 'Default tenant and admin user created.';
PRINT 'All tables, relationships, and indexes are now in place.';
GO
