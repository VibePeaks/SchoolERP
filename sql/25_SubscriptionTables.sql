-- Subscription Management Tables
-- Run this after all other table creation scripts

USE SchoolERP;
GO

-- Create SubscriptionPlans table
CREATE TABLE SubscriptionPlans (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PlanName NVARCHAR(50) NOT NULL UNIQUE, -- 'basic', 'premium', 'enterprise'
    DisplayName NVARCHAR(100) NOT NULL, -- 'Basic Plan', 'Premium Plan', 'Enterprise Plan'
    Description NVARCHAR(500),
    Price DECIMAL(10,2) NOT NULL,
    BillingCycle NVARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    Features NVARCHAR(MAX), -- JSON array of features
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
GO

-- Create UserSubscriptions table
CREATE TABLE UserSubscriptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    SubscriptionPlanId INT NOT NULL,
    StartDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    EndDate DATETIME2 NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'cancelled', 'pending'
    AutoRenew BIT DEFAULT 1,
    PaymentMethod NVARCHAR(50), -- 'stripe', 'paypal', etc.
    PaymentReference NVARCHAR(255), -- Transaction ID from payment provider
    LastPaymentDate DATETIME2 NULL,
    NextPaymentDate DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (SubscriptionPlanId) REFERENCES SubscriptionPlans(Id)
);
GO

-- Create SubscriptionPayments table
CREATE TABLE SubscriptionPayments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserSubscriptionId INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'USD',
    PaymentDate DATETIME2 DEFAULT GETUTCDATE(),
    PaymentMethod NVARCHAR(50),
    PaymentReference NVARCHAR(255) NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- 'completed', 'failed', 'pending', 'refunded'
    FailureReason NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserSubscriptionId) REFERENCES UserSubscriptions(Id)
);
GO

-- Create SubscriptionFeatures table for granular feature access
CREATE TABLE SubscriptionFeatures (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FeatureName NVARCHAR(100) NOT NULL UNIQUE, -- 'hms', 'elearning', 'library', etc.
    DisplayName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    RequiredPlan NVARCHAR(50) NOT NULL, -- 'basic', 'premium', 'enterprise'
    IsActive BIT DEFAULT 1
);
GO

-- Create indexes for performance
CREATE INDEX IX_UserSubscriptions_UserId ON UserSubscriptions(UserId);
CREATE INDEX IX_UserSubscriptions_Status ON UserSubscriptions(Status);
CREATE INDEX IX_UserSubscriptions_EndDate ON UserSubscriptions(EndDate);
CREATE INDEX IX_SubscriptionPayments_UserSubscriptionId ON SubscriptionPayments(UserSubscriptionId);
CREATE INDEX IX_SubscriptionPayments_PaymentReference ON SubscriptionPayments(PaymentReference);
GO

-- Insert default subscription plans
INSERT INTO SubscriptionPlans (PlanName, DisplayName, Description, Price, BillingCycle, Features, IsActive) VALUES
('basic', 'Basic Plan', 'Core school management features', 29.99, 'monthly',
'["dashboard","students","teachers","classes","attendance","fees","exams","notices","transport","inventory","parent-portal","hr-payroll","settings"]', 1),

('premium', 'Premium Plan', 'Advanced features including digital learning', 79.99, 'monthly',
'["dashboard","students","teachers","classes","attendance","fees","exams","notices","transport","inventory","parent-portal","hr-payroll","settings","library","e-learning"]', 1),

('enterprise', 'Enterprise Plan', 'Complete school management solution', 149.99, 'monthly',
'["dashboard","students","teachers","classes","attendance","fees","exams","notices","transport","inventory","parent-portal","hr-payroll","settings","library","e-learning","hostel","advanced-reports","api-access"]', 1);
GO

-- Insert subscription features
INSERT INTO SubscriptionFeatures (FeatureName, DisplayName, Description, RequiredPlan, IsActive) VALUES
('dashboard', 'Dashboard', 'Main dashboard and analytics', 'basic', 1),
('students', 'Student Management', 'Student records and management', 'basic', 1),
('teachers', 'Teacher Management', 'Teacher records and management', 'basic', 1),
('classes', 'Class Management', 'Class and section management', 'basic', 1),
('attendance', 'Attendance Tracking', 'Student and staff attendance', 'basic', 1),
('fees', 'Fee Management', 'Fee collection and management', 'basic', 1),
('exams', 'Exam Management', 'Exam scheduling and results', 'basic', 1),
('notices', 'Notice Board', 'School announcements and notices', 'basic', 1),
('transport', 'Transport Management', 'School transport services', 'basic', 1),
('inventory', 'Inventory Management', 'School inventory tracking', 'basic', 1),
('parent-portal', 'Parent Portal', 'Parent communication platform', 'basic', 1),
('hr-payroll', 'HR & Payroll', 'Staff management and payroll', 'basic', 1),
('settings', 'System Settings', 'System configuration', 'basic', 1),
('library', 'Library Management', 'Digital library system', 'premium', 1),
('e-learning', 'E-Learning Platform', 'Online learning management', 'premium', 1),
('hostel', 'Hostel Management', 'Student hostel services', 'enterprise', 1),
('advanced-reports', 'Advanced Reports', 'Detailed analytics and reporting', 'enterprise', 1),
('api-access', 'API Access', 'Third-party integrations', 'enterprise', 1);
GO
